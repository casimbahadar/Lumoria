/* =============================================================================
 * variant-llm.js — Route 1 bespoke-prose layer (TODO #12)
 *
 * Optionally upgrades a variant's flavour text (desc / lore / behaviour) from the
 * on-device clause generator (VariantContent, the always-on fallback) to bespoke
 * prose written by Claude, via a Firebase Function that keeps the API key
 * server-side. Results are cached by variant signature and persisted in the save,
 * so each unique variant is written at most once, ever.
 *
 * FULLY REVERSIBLE / FAILSAFE:
 *  - ENABLED = false  -> never calls out; everything uses the C generator.
 *  - offline / error / disabled / no cache -> C generator.
 *  - Flip ENABLED off any time: cached entries are kept, new ones use C.
 *
 * Activation checklist (when you want bespoke prose):
 *  1. Create a Firebase project on the Blaze plan; deploy functions/ (see
 *     functions/index.js) and set the ANTHROPIC_API_KEY secret.
 *  2. Set FUNCTION_URL below to the deployed callable/HTTPS endpoint.
 *  3. Set ENABLED = true. Pick MODEL for your cost/quality tradeoff.
 * ===========================================================================*/
(function (global) {
  'use strict';

  const VariantLLM = {
    ENABLED: false,                 // <-- master switch (off until Firebase is live)
    MODEL: 'claude-haiku-4-5',      // cost lever: haiku (cheap) vs sonnet (richer)
    FUNCTION_URL: '',               // <-- deployed Firebase Function endpoint
    TIMEOUT_MS: 8000,

    _cache: Object.create(null),    // signature -> {desc, lore, behaviour}

    sig(v) {
      return (global.VariantContent && VariantContent.variantSignature)
        ? VariantContent.variantSignature(v) : JSON.stringify(v && v.variantTypes);
    },

    // Load persisted bespoke entries into the in-memory cache (call once after load).
    hydrate(store) {
      if (store && typeof store === 'object') Object.assign(this._cache, store);
    },
    // The object to persist in the save (keep it small — only what was actually written).
    serialize() { return this._cache; },

    // Synchronous render path (team detail / tracker): cached bespoke text if we
    // have it, otherwise the deterministic C generator. NEVER blocks or throws.
    getContent(def, v) {
      if (!v || !v.variant) return null;
      const cached = this._cache[this.sig(v)];
      if (cached) return cached;
      return global.VariantContent ? VariantContent.generate(def, v) : null;
    },

    // Async upgrade, called on CATCH. Warms + persists the bespoke entry if enabled;
    // otherwise no-op (render keeps using C). Resolves to the content actually stored.
    async warm(def, v, onPersist) {
      if (!v || !v.variant) return null;
      const key = this.sig(v);
      if (this._cache[key]) return this._cache[key];
      if (!this.ENABLED || !this.FUNCTION_URL) return null; // stays on C fallback
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), this.TIMEOUT_MS);
        const res = await fetch(this.FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify({
            model: this.MODEL,
            species: { id: def.id, name: def.name, types: def.types, lore: def.lore, desc: def.desc },
            variant: { types: v.variantTypes, base: v.variantBase, immune: v.variantImmune,
                       profile: global.VariantContent ? VariantContent.statProfile(def, v.variantBase) : null }
          })
        });
        clearTimeout(t);
        if (!res.ok) throw new Error('LLM ' + res.status);
        const data = await res.json();
        if (data && data.lore) {
          const entry = { desc: data.desc, lore: data.lore, behaviour: data.behaviour, source: 'llm' };
          this._cache[key] = entry;
          if (typeof onPersist === 'function') onPersist(key, entry);
          return entry;
        }
      } catch (e) {
        if (typeof console !== 'undefined') console.warn('[variant-llm] falling back to C:', e.message);
      }
      return null; // C fallback remains in effect
    }
  };

  global.VariantLLM = VariantLLM;
  if (typeof module !== 'undefined' && module.exports) module.exports = VariantLLM;
})(typeof window !== 'undefined' ? window : globalThis);
