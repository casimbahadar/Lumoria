/* =============================================================================
 * Firebase Function — bespoke variant prose via Claude (TODO #12, Route 1)
 *
 * Keeps ANTHROPIC_API_KEY server-side. The client (js/variant-llm.js) POSTs the
 * species + rolled variant attributes; this returns { desc, lore, behaviour }.
 *
 * Deploy:
 *   cd functions && npm install
 *   firebase functions:secrets:set ANTHROPIC_API_KEY   # paste your key
 *   firebase deploy --only functions
 * Then set FUNCTION_URL + ENABLED=true in js/variant-llm.js.
 *
 * Cost control: short max_tokens, prompt caching on the static system block
 * (cuts repeat input cost ~90%), model chosen by the client (haiku vs sonnet).
 * ===========================================================================*/
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const Anthropic = require('@anthropic-ai/sdk');

const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');

const ALLOWED_MODELS = { 'claude-haiku-4-5': 1, 'claude-sonnet-4-6': 1 };

// Static instruction block — marked for prompt caching so it is billed cheaply
// on repeat calls. Encodes the quality bar agreed during design.
const SYSTEM = `You write a single creature's "variant" dex entry for the monster-collecting game Lumoria.
A variant is a Rift-distorted version of a base species: it keeps the species' core identity but is reshaped by a new elemental typing, a drifted stat profile, and an elemental immunity.
Write in-world, coherent, evocative prose — never a template, never a bland list. Transform the SPECIES' OWN described features (use its lore/desc) according to the variant's typing, stat shape, and immunity. Give the immunity a diegetic explanation. Let the stat profile imply the creature's fighting temperament.
Return STRICT JSON only, no markdown, with exactly:
{"desc": "<=140 chars, one sentence", "lore": "70-120 words, 3-4 sentences", "behaviour": "one sentence on how it fights"}`;

function buildUserPrompt(species, variant) {
  const t = (variant.types || []).join('/');
  const p = variant.profile || {};
  return `BASE SPECIES: ${species.name} (${(species.types || []).join('/')}).
Species desc: ${species.desc || '—'}
Species lore: ${species.lore || '—'}

THIS VARIANT:
- New typing: ${t}
- Immune to: ${variant.immune || 'none'}
- Stat profile: ${p.label || 'even'} build, ${p.heft || 'comparable'} than the base (top stat ${p.top || '?'}, weakest ${p.low || '?'}).

Write its variant entry as strict JSON.`;
}

exports.variantProse = onRequest(
  { secrets: [ANTHROPIC_API_KEY], cors: true, region: 'us-central1', maxInstances: 10 },
  async (req, res) => {
    if (req.method !== 'POST') { res.status(405).send('POST only'); return; }
    try {
      const { model, species, variant } = req.body || {};
      if (!species || !variant) { res.status(400).json({ error: 'missing species/variant' }); return; }
      const useModel = ALLOWED_MODELS[model] ? model : 'claude-haiku-4-5';

      const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY.value() });
      const msg = await client.messages.create({
        model: useModel,
        max_tokens: 400,
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: buildUserPrompt(species, variant) }]
      });

      const text = (msg.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
      let parsed;
      try { parsed = JSON.parse(text); }
      catch { const m = text.match(/\{[\s\S]*\}/); parsed = m ? JSON.parse(m[0]) : null; }
      if (!parsed || !parsed.lore) { res.status(502).json({ error: 'bad model output' }); return; }

      res.set('Cache-Control', 'no-store');
      res.json({ desc: parsed.desc || '', lore: parsed.lore, behaviour: parsed.behaviour || '' });
    } catch (e) {
      console.error('variantProse error', e);
      res.status(500).json({ error: 'generation failed' });
    }
  }
);
