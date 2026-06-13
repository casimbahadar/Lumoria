// ============================================================
// LUMORIA - Monster SVG Sprite Generator v3 (Chibi Pokemon Edition)
// Polished creature sprites with gradients, drop shadows, chibi
// proportions, colorful eyes, organic bezier shapes.
// ============================================================

const SPRITE_TYPE_THEMES = {
  Fire:     { bg1:"#3d1200", bg2:"#7a2a00", accent:"#ff6b35", glow:"#ff4500", body:"#c84010", light:"#ff9060", mark:"#ffcc44", outline:"#5a1200" },
  Water:    { bg1:"#001a3d", bg2:"#003080", accent:"#4da6ff", glow:"#00bfff", body:"#1864b8", light:"#6aadff", mark:"#88ccff", outline:"#001840" },
  Grass:    { bg1:"#0a2a0a", bg2:"#1a5c1a", accent:"#4caf50", glow:"#66bb6a", body:"#267826", light:"#55bb55", mark:"#90ee60", outline:"#082808" },
  Electric: { bg1:"#2a2200", bg2:"#5c4d00", accent:"#ffd700", glow:"#ffff00", body:"#c8a000", light:"#ffe033", mark:"#fffaaa", outline:"#3c3000" },
  Ground:   { bg1:"#2a1a00", bg2:"#5c3d00", accent:"#c8a045", glow:"#daa520", body:"#8a6010", light:"#c09040", mark:"#e8c870", outline:"#3c2400" },
  Wind:     { bg1:"#001a2a", bg2:"#003d5c", accent:"#7ec8e3", glow:"#b0e0e6", body:"#3a8aa8", light:"#70c0d8", mark:"#b8eeff", outline:"#002030" },
  Ice:      { bg1:"#001f2a", bg2:"#003d52", accent:"#96d5d5", glow:"#e0ffff", body:"#48a8be", light:"#80d0e0", mark:"#d8ffff", outline:"#002030" },
  Dark:     { bg1:"#0a0014", bg2:"#1e0033", accent:"#9b59b6", glow:"#6a0dad", body:"#481068", light:"#7a3a90", mark:"#bb88ee", outline:"#0a0018" },
  Fairy:    { bg1:"#2a001a", bg2:"#5c0038", accent:"#ff69b4", glow:"#ffb6c1", body:"#d03880", light:"#f060a0", mark:"#ffaadd", outline:"#3e0020" },
  Steel:    { bg1:"#1a1a1a", bg2:"#3d3d3d", accent:"#9e9e9e", glow:"#c0c0c0", body:"#5e6e7e", light:"#9ab0c0", mark:"#c8d8e8", outline:"#181818" },
  Poison:   { bg1:"#1a0033", bg2:"#38006b", accent:"#ab47bc", glow:"#ce93d8", body:"#6a1090", light:"#9a40b8", mark:"#cc66dd", outline:"#200040" },
  Psychic:  { bg1:"#2a0014", bg2:"#5c002a", accent:"#ff4081", glow:"#f48fb1", body:"#b00840", light:"#e04070", mark:"#ff88bb", outline:"#380010" },
  Dragon:   { bg1:"#0f0038", bg2:"#1e006b", accent:"#7038f8", glow:"#bb86fc", body:"#3810b0", light:"#6840d8", mark:"#9870ff", outline:"#080020" },
  Normal:   { bg1:"#1a1a14", bg2:"#3d3d2a", accent:"#a8a878", glow:"#c8c8a0", body:"#686850", light:"#9a9878", mark:"#c8c8a0", outline:"#1a1a10" },
  Rock:     { bg1:"#1a1400", bg2:"#3d2e00", accent:"#b8a038", glow:"#d4af37", body:"#806018", light:"#b09040", mark:"#d0b050", outline:"#281c00" },
  Bug:      { bg1:"#141a00", bg2:"#2e3d00", accent:"#a8b820", glow:"#c6ce50", body:"#587000", light:"#88a820", mark:"#c0d830", outline:"#1e2800" }
};

// Draw a single eye: white sclera, colored iris, black pupil, white shine
function drawEye(cx, cy, er, irisColor, olf) {
  return [
    `<circle cx="${cx}" cy="${cy}" r="${er}" fill="#fff" stroke="${olf}" stroke-width="0.8"/>`,
    `<circle cx="${cx+er*0.1}" cy="${cy+er*0.08}" r="${er*0.62}" fill="${irisColor}" opacity="0.9"/>`,
    `<circle cx="${cx+er*0.06}" cy="${cy+er*0.04}" r="${er*0.36}" fill="#0a0a0a"/>`,
    `<circle cx="${cx-er*0.18}" cy="${cy-er*0.22}" r="${er*0.2}" fill="#fff" opacity="0.92"/>`
  ].join("");
}

// Get sprite as data URL for use in img src
// ============================================================
// REAL SPRITE OVERRIDE — drop-in raster art (replaces the procedural SVG + emoji)
// Drop files at  assets/sprites/<id>.png   (monsters, id 1-500)
//           and  assets/trainers/<key>.png (trainers: rex, marina, aria, umbra_shade, ...)
// then list them in the matching manifest.json (or just run
//   python3 scripts/build_sprite_manifest.py
// ). Anything not listed transparently falls back to the procedural SVG, so the
// game keeps working while the folders fill up — replace sprites incrementally.
// ============================================================
const MONSTER_SPRITES = new Set();
const TRAINER_SPRITES = new Set();
function _loadSpriteManifest(url, set) {
  try {
    fetch(url, { cache: "no-cache" })
      .then(r => (r.ok ? r.json() : []))
      .then(arr => { if (Array.isArray(arr)) arr.forEach(k => set.add(String(k))); })
      .catch(() => {});
  } catch (e) { /* file:// or offline — stay on the procedural fallback */ }
}
function loadSpriteManifests() {
  _loadSpriteManifest("assets/sprites/manifest.json", MONSTER_SPRITES);
  _loadSpriteManifest("assets/trainers/manifest.json", TRAINER_SPRITES);
}
loadSpriteManifests();

// Returns the raster sprite PNG path if one exists, else null.
// There is no procedural fallback — callers render the monster's emoji when null.
function getMonsterSpriteURL(monster) {
  const id = monster && (monster.id != null ? monster.id : monster.monsterId);
  if (id != null && MONSTER_SPRITES.has(String(id))) return `assets/sprites/${id}.png`;
  return null;
}

// ============================================================
// GYM BADGE SVG GENERATOR
// Detailed metallic Pokemon-style gym badges
// ============================================================

function generateBadgeSVG(leaderId, earned, size = 28) {
  const vb = 64; // viewBox size
  const grayFilter = earned ? "" : `<filter id="gray-${leaderId}"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="0.4" intercept="0.15"/><feFuncG type="linear" slope="0.4" intercept="0.15"/><feFuncB type="linear" slope="0.4" intercept="0.15"/></feComponentTransfer></filter>`;
  const filterAttr = earned ? "" : ` filter="url(#gray-${leaderId})"`;

  const badges = {
    // ---- FOUNDATION BADGE (Normal) - Sturdy octagonal shield with bricks ----
    rex() {
      const c1 = "#b8a878", c2 = "#d4c898", c3 = "#9a8860", cEdge = "#6a5830", cShine = "#f0e8d0";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-rex" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
          <linearGradient id="sh-rex" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${cShine}" stop-opacity="0.6"/><stop offset="50%" stop-color="${cShine}" stop-opacity="0.0"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <polygon points="20,4 44,4 58,18 58,46 44,60 20,60 6,46 6,18" fill="url(#bg-rex)" stroke="${cEdge}" stroke-width="2.5"/>
          <polygon points="20,4 44,4 58,18 58,46 44,60 20,60 6,46 6,18" fill="url(#sh-rex)"/>
          <rect x="15" y="18" width="14" height="8" rx="1" fill="${c1}" stroke="${cEdge}" stroke-width="1"/>
          <rect x="35" y="18" width="14" height="8" rx="1" fill="${c1}" stroke="${cEdge}" stroke-width="1"/>
          <rect x="24" y="28" width="16" height="8" rx="1" fill="${c1}" stroke="${cEdge}" stroke-width="1"/>
          <rect x="15" y="38" width="14" height="8" rx="1" fill="${c1}" stroke="${cEdge}" stroke-width="1"/>
          <rect x="35" y="38" width="14" height="8" rx="1" fill="${c1}" stroke="${cEdge}" stroke-width="1"/>
          <polygon points="32,10 38,16 26,16" fill="${cShine}" opacity="0.5"/>
        </g>`;
    },

    // ---- WAVE BADGE (Water) - Teardrop with flowing waves ----
    marina() {
      const c1 = "#1864b8", c2 = "#4da6ff", c3 = "#0a3870", cShine = "#b0dcff";
      return `
        <defs>${grayFilter}
          <radialGradient id="bg-marina" cx="0.5" cy="0.4"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></radialGradient>
          <linearGradient id="sh-marina" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${cShine}" stop-opacity="0.5"/><stop offset="40%" stop-color="${cShine}" stop-opacity="0.0"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <path d="M32,4 C32,4 56,28 56,40 C56,52 45,60 32,60 C19,60 8,52 8,40 C8,28 32,4 32,4Z" fill="url(#bg-marina)" stroke="${c3}" stroke-width="2.5"/>
          <path d="M32,4 C32,4 56,28 56,40 C56,52 45,60 32,60 C19,60 8,52 8,40 C8,28 32,4 32,4Z" fill="url(#sh-marina)"/>
          <path d="M12,38 Q20,32 28,38 Q36,44 44,38 Q50,34 52,36" fill="none" stroke="${cShine}" stroke-width="2" opacity="0.7"/>
          <path d="M14,46 Q22,40 30,46 Q38,52 46,46 Q50,43 52,44" fill="none" stroke="${cShine}" stroke-width="1.8" opacity="0.5"/>
          <ellipse cx="28" cy="22" rx="6" ry="3" fill="${cShine}" opacity="0.35"/>
        </g>`;
    },

    // ---- FORGE BADGE (Fire) - Flame shape with inner fire ----
    pyros() {
      const c1 = "#c84010", c2 = "#ff6b35", c3 = "#7a2000", cInner = "#ffd700", cShine = "#fff4cc";
      return `
        <defs>${grayFilter}
          <radialGradient id="bg-pyros" cx="0.5" cy="0.6"><stop offset="0%" stop-color="${cInner}"/><stop offset="50%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></radialGradient>
          <linearGradient id="sh-pyros" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${cShine}" stop-opacity="0.5"/><stop offset="50%" stop-color="${cShine}" stop-opacity="0.0"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <path d="M32,2 C38,14 52,20 50,36 C49,44 46,50 42,54 C40,56 36,60 32,60 C28,60 24,56 22,54 C18,50 15,44 14,36 C12,20 26,14 32,2Z" fill="url(#bg-pyros)" stroke="${c3}" stroke-width="2.5"/>
          <path d="M32,2 C38,14 52,20 50,36 C49,44 46,50 42,54 C40,56 36,60 32,60 C28,60 24,56 22,54 C18,50 15,44 14,36 C12,20 26,14 32,2Z" fill="url(#sh-pyros)"/>
          <path d="M32,22 C36,30 42,32 40,40 C39,46 36,50 32,50 C28,50 25,46 24,40 C22,32 28,30 32,22Z" fill="${cInner}" opacity="0.8" stroke="${c2}" stroke-width="1"/>
          <ellipse cx="30" cy="14" rx="4" ry="3" fill="${cShine}" opacity="0.3"/>
        </g>`;
    },

    // ---- CURRENT BADGE (Electric) - Lightning bolt ----
    zara() {
      const c1 = "#c8a000", c2 = "#ffd700", c3 = "#8a6800", cShine = "#fffde0", cEdge = "#705000";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-zara" x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0%" stop-color="${cShine}"/><stop offset="50%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></linearGradient>
          <linearGradient id="sh-zara" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0.5"/><stop offset="40%" stop-color="#fff" stop-opacity="0.0"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <polygon points="38,2 18,30 30,30 22,62 48,28 34,28" fill="url(#bg-zara)" stroke="${cEdge}" stroke-width="2.5" stroke-linejoin="round"/>
          <polygon points="38,2 18,30 30,30 22,62 48,28 34,28" fill="url(#sh-zara)"/>
          <polygon points="36,10 26,28 32,28 28,48 42,28 36,28" fill="${cShine}" opacity="0.25"/>
        </g>`;
    },

    // ---- FROST BADGE (Ice) - Six-pointed star with hexagon ----
    glacier() {
      const c1 = "#48a8be", c2 = "#96d5d5", c3 = "#206878", cShine = "#e8ffff", cCenter = "#d0f4f4";
      return `
        <defs>${grayFilter}
          <radialGradient id="bg-glacier" cx="0.5" cy="0.5"><stop offset="0%" stop-color="${cCenter}"/><stop offset="60%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></radialGradient>
          <linearGradient id="sh-glacier" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${cShine}" stop-opacity="0.6"/><stop offset="45%" stop-color="${cShine}" stop-opacity="0.0"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <polygon points="32,2 42,17 58,17 48,32 58,47 42,47 32,62 22,47 6,47 16,32 6,17 22,17" fill="url(#bg-glacier)" stroke="${c3}" stroke-width="2"/>
          <polygon points="32,2 42,17 58,17 48,32 58,47 42,47 32,62 22,47 6,47 16,32 6,17 22,17" fill="url(#sh-glacier)"/>
          <polygon points="32,18 40,25 40,39 32,46 24,39 24,25" fill="${cCenter}" stroke="${c3}" stroke-width="1.2" opacity="0.6"/>
          <line x1="32" y1="18" x2="32" y2="46" stroke="${cShine}" stroke-width="0.8" opacity="0.5"/>
          <line x1="24" y1="25" x2="40" y2="39" stroke="${cShine}" stroke-width="0.8" opacity="0.5"/>
          <line x1="40" y1="25" x2="24" y2="39" stroke="${cShine}" stroke-width="0.8" opacity="0.5"/>
        </g>`;
    },

    // ---- DUSK BADGE (Dark) - Crescent moon with stars ----
    nyx() {
      const c1 = "#481068", c2 = "#7a3a90", c3 = "#280848", cShine = "#e0b0ff", cStar = "#cc88ff";
      return `
        <defs>${grayFilter}
          <radialGradient id="bg-nyx" cx="0.4" cy="0.4"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></radialGradient>
          <linearGradient id="sh-nyx" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${cShine}" stop-opacity="0.4"/><stop offset="40%" stop-color="${cShine}" stop-opacity="0.0"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <circle cx="32" cy="32" r="28" fill="url(#bg-nyx)" stroke="${c3}" stroke-width="2.5"/>
          <circle cx="32" cy="32" r="28" fill="url(#sh-nyx)"/>
          <circle cx="40" cy="28" r="20" fill="${c3}"/>
          <path d="M18,12 L20,18 L14,18Z" fill="${cStar}"/>
          <path d="M14,42 L16,47 L11,47Z" fill="${cStar}" opacity="0.7"/>
          <path d="M24,50 L25.5,54 L21.5,54Z" fill="${cStar}" opacity="0.5"/>
          <circle cx="10" cy="30" r="1.2" fill="${cShine}" opacity="0.8"/>
          <circle cx="20" cy="56" r="1" fill="${cShine}" opacity="0.6"/>
          <ellipse cx="22" cy="22" rx="5" ry="3" fill="${cShine}" opacity="0.15" transform="rotate(-20,22,22)"/>
        </g>`;
    },

    // ---- FORESIGHT BADGE (Psychic) - All-seeing eye ----
    oracle() {
      const c1 = "#b00840", c2 = "#ff4081", c3 = "#700028", cIris = "#ff80ab", cPupil = "#1a0008", cShine = "#ffd0e0";
      return `
        <defs>${grayFilter}
          <radialGradient id="bg-oracle" cx="0.5" cy="0.5"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></radialGradient>
          <radialGradient id="iris-oracle" cx="0.45" cy="0.45"><stop offset="0%" stop-color="${cShine}"/><stop offset="40%" stop-color="${cIris}"/><stop offset="100%" stop-color="${c2}"/></radialGradient>
          <linearGradient id="sh-oracle" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${cShine}" stop-opacity="0.4"/><stop offset="35%" stop-color="${cShine}" stop-opacity="0.0"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <path d="M2,32 Q32,4 62,32 Q32,60 2,32Z" fill="url(#bg-oracle)" stroke="${c3}" stroke-width="2.5"/>
          <path d="M2,32 Q32,4 62,32 Q32,60 2,32Z" fill="url(#sh-oracle)"/>
          <circle cx="32" cy="32" r="14" fill="url(#iris-oracle)" stroke="${c3}" stroke-width="1.5"/>
          <circle cx="32" cy="32" r="7" fill="${cPupil}"/>
          <circle cx="28" cy="28" r="3" fill="#fff" opacity="0.8"/>
          <circle cx="35" cy="34" r="1.5" fill="#fff" opacity="0.4"/>
          <path d="M10,32 Q32,18 54,32" fill="none" stroke="${cShine}" stroke-width="0.8" opacity="0.3"/>
        </g>`;
    },

    // ---- WYRM BADGE (Dragon) - Dragon fang/claw with scale pattern ----
    drake() {
      const c1 = "#3810b0", c2 = "#7038f8", c3 = "#1a0060", cShine = "#c8a8ff", cScale = "#5020d0";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-drake" x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></linearGradient>
          <linearGradient id="sh-drake" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${cShine}" stop-opacity="0.5"/><stop offset="40%" stop-color="${cShine}" stop-opacity="0.0"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <path d="M32,2 C22,2 10,10 8,24 C6,38 14,52 24,58 C28,60 32,62 32,62 C32,62 36,60 40,58 C50,52 58,38 56,24 C54,10 42,2 32,2Z" fill="url(#bg-drake)" stroke="${c3}" stroke-width="2.5"/>
          <path d="M32,2 C22,2 10,10 8,24 C6,38 14,52 24,58 C28,60 32,62 32,62 C32,62 36,60 40,58 C50,52 58,38 56,24 C54,10 42,2 32,2Z" fill="url(#sh-drake)"/>
          <path d="M20,18 L32,8 L44,18Z" fill="${cShine}" opacity="0.25"/>
          <path d="M16,28 Q24,24 32,28 Q40,24 48,28" fill="none" stroke="${cScale}" stroke-width="1.5" opacity="0.6"/>
          <path d="M14,36 Q24,32 32,36 Q40,32 50,36" fill="none" stroke="${cScale}" stroke-width="1.5" opacity="0.5"/>
          <path d="M16,44 Q24,40 32,44 Q40,40 48,44" fill="none" stroke="${cScale}" stroke-width="1.5" opacity="0.4"/>
          <path d="M32,18 L28,30 L32,28 L36,30Z" fill="${cShine}" opacity="0.5"/>
          <circle cx="26" cy="22" r="2.5" fill="#fff" opacity="0.15"/>
        </g>`;
    },
    // ---- CANOPY BADGE (Grass) - Leaf-shaped badge ----
    thorne() {
      const c1 = "#2d8a4e", c2 = "#4aba6a", c3 = "#1a6638", cEdge = "#0d4420", cShine = "#90e8a0";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-thorne" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <path d="M32,4 C16,4 4,20 4,36 C4,52 18,60 32,60 C46,60 60,52 60,36 C60,20 48,4 32,4Z" fill="url(#bg-thorne)" stroke="${cEdge}" stroke-width="2.5"/>
          <path d="M32,12 L32,50" stroke="${cShine}" stroke-width="2" opacity="0.5"/>
          <path d="M20,24 L32,20 L44,24" fill="none" stroke="${cShine}" stroke-width="1.5" opacity="0.4"/>
          <path d="M18,34 L32,30 L46,34" fill="none" stroke="${cShine}" stroke-width="1.5" opacity="0.3"/>
          <path d="M20,44 L32,40 L44,44" fill="none" stroke="${cShine}" stroke-width="1.5" opacity="0.3"/>
          <circle cx="32" cy="32" r="6" fill="${cShine}" opacity="0.3"/>
        </g>`;
    },
    // ---- VENOM BADGE (Poison) - Skull-like hexagonal badge ----
    viper() {
      const c1 = "#8b45a6", c2 = "#a855c8", c3 = "#6a2d8a", cEdge = "#4a1a6a", cShine = "#d4a0f0";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-viper" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="url(#bg-viper)" stroke="${cEdge}" stroke-width="2.5"/>
          <circle cx="24" cy="28" r="5" fill="${cShine}" opacity="0.4"/>
          <circle cx="40" cy="28" r="5" fill="${cShine}" opacity="0.4"/>
          <path d="M26,42 L30,38 L34,38 L38,42" fill="none" stroke="${cShine}" stroke-width="2" opacity="0.5"/>
          <circle cx="32" cy="20" r="3" fill="${cShine}" opacity="0.2"/>
        </g>`;
    },
    // ---- TECTONIC BADGE (Ground) - Mountain/triangle badge ----
    atlas() {
      const c1 = "#8b6d3a", c2 = "#c49a52", c3 = "#6a4d2a", cEdge = "#4a3010", cShine = "#e8d4a0";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-atlas" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <polygon points="32,4 60,56 4,56" fill="url(#bg-atlas)" stroke="${cEdge}" stroke-width="2.5"/>
          <polygon points="32,16 48,48 16,48" fill="none" stroke="${cShine}" stroke-width="1.5" opacity="0.3"/>
          <line x1="32" y1="4" x2="32" y2="56" stroke="${cShine}" stroke-width="1" opacity="0.2"/>
          <circle cx="32" cy="36" r="5" fill="${cShine}" opacity="0.3"/>
        </g>`;
    },
    // ---- CHITIN BADGE (Bug) - Beetle/wing badge ----
    mantis() {
      const c1 = "#5a8a28", c2 = "#7ab838", c3 = "#3a6a18", cEdge = "#224a08", cShine = "#c8f080";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-mantis" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <ellipse cx="32" cy="32" rx="26" ry="28" fill="url(#bg-mantis)" stroke="${cEdge}" stroke-width="2.5"/>
          <path d="M32,8 C20,16 14,28 16,42 L32,36Z" fill="${cShine}" opacity="0.2"/>
          <path d="M32,8 C44,16 50,28 48,42 L32,36Z" fill="${cShine}" opacity="0.15"/>
          <ellipse cx="32" cy="32" rx="8" ry="10" fill="${cShine}" opacity="0.3"/>
          <line x1="24" y1="20" x2="40" y2="20" stroke="${cShine}" stroke-width="1.5" opacity="0.3"/>
        </g>`;
    },
    // ---- TEMPEST BADGE (Wind) - Swirl/cyclone badge ----
    zephyra() {
      const c1 = "#5898c8", c2 = "#78b8e8", c3 = "#3878a8", cEdge = "#1a5888", cShine = "#c0e8ff";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-zephyra" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <circle cx="32" cy="32" r="28" fill="url(#bg-zephyra)" stroke="${cEdge}" stroke-width="2.5"/>
          <path d="M32,12 C44,12 50,20 48,28 C46,36 38,36 32,32" fill="none" stroke="${cShine}" stroke-width="2.5" opacity="0.5"/>
          <path d="M32,52 C20,52 14,44 16,36 C18,28 26,28 32,32" fill="none" stroke="${cShine}" stroke-width="2.5" opacity="0.4"/>
          <circle cx="32" cy="32" r="5" fill="${cShine}" opacity="0.4"/>
        </g>`;
    },
    // ---- ALLOY BADGE (Steel) - Gear/cog badge ----
    ferro() {
      const c1 = "#788898", c2 = "#a0b0c0", c3 = "#586878", cEdge = "#384858", cShine = "#d0e0f0";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-ferro" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <polygon points="32,4 44,10 56,20 60,32 56,44 44,54 32,60 20,54 8,44 4,32 8,20 20,10" fill="url(#bg-ferro)" stroke="${cEdge}" stroke-width="2.5"/>
          <circle cx="32" cy="32" r="12" fill="none" stroke="${cShine}" stroke-width="2" opacity="0.4"/>
          <circle cx="32" cy="32" r="5" fill="${cShine}" opacity="0.3"/>
          <line x1="32" y1="4" x2="32" y2="20" stroke="${cShine}" stroke-width="2" opacity="0.3"/>
          <line x1="32" y1="44" x2="32" y2="60" stroke="${cShine}" stroke-width="2" opacity="0.3"/>
          <line x1="4" y1="32" x2="20" y2="32" stroke="${cShine}" stroke-width="2" opacity="0.3"/>
          <line x1="44" y1="32" x2="60" y2="32" stroke="${cShine}" stroke-width="2" opacity="0.3"/>
        </g>`;
    },
    // ---- GEODE BADGE (Rock) - Crystal/gem badge ----
    boulder() {
      const c1 = "#8a7050", c2 = "#b89868", c3 = "#6a5038", cEdge = "#4a3020", cShine = "#e0c8a0";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-boulder" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <polygon points="32,4 52,14 60,36 48,58 16,58 4,36 12,14" fill="url(#bg-boulder)" stroke="${cEdge}" stroke-width="2.5"/>
          <polygon points="32,14 42,22 46,36 38,48 26,48 18,36 22,22" fill="${cShine}" opacity="0.2"/>
          <polygon points="32,24 36,30 34,38 28,38 26,30" fill="${cShine}" opacity="0.3"/>
          <circle cx="30" cy="20" r="2" fill="#fff" opacity="0.2"/>
        </g>`;
    },
    // ---- AURORA BADGE (Fairy) - Star/sparkle badge ----
    seraphina() {
      const c1 = "#d86098", c2 = "#f080b8", c3 = "#b84078", cEdge = "#882858", cShine = "#ffc0e0";
      return `
        <defs>${grayFilter}
          <linearGradient id="bg-seraph" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient>
        </defs>
        <g${filterAttr}>
          <polygon points="32,2 38,22 60,22 42,36 48,58 32,44 16,58 22,36 4,22 26,22" fill="url(#bg-seraph)" stroke="${cEdge}" stroke-width="2"/>
          <polygon points="32,12 35,24 46,24 37,32 40,44 32,36 24,44 27,32 18,24 29,24" fill="${cShine}" opacity="0.3"/>
          <circle cx="32" cy="28" r="4" fill="${cShine}" opacity="0.4"/>
          <circle cx="26" cy="20" r="1.5" fill="#fff" opacity="0.3"/>
        </g>`;
    }
  };

  const drawBadge = badges[leaderId];
  if (!drawBadge) return "";
  const inner = drawBadge();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb} ${vb}" width="${size}" height="${size}">${inner}</svg>`;
}

// Render a monster sprite into a DOM element: the raster PNG if one exists,
// otherwise the monster's emoji (no procedural fallback).
function renderMonsterSprite(container, monster, size = 80) {
  if (!container || !monster) return;
  container.innerHTML = "";
  const url = getMonsterSpriteURL(monster);
  if (url) {
    const img = document.createElement("img");
    img.src = url;
    img.width = size;
    img.height = size;
    img.alt = monster.name;
    img.style.imageRendering = "pixelated";  // raster sprites render crisp
    container.appendChild(img);
  } else {
    container.textContent = monster.emoji || "❓";
    container.style.fontSize = Math.round(size * 0.8) + "px";
  }
}

// ============================================================
// TRAINER SVG SPRITE GENERATOR
// Chibi-style trainer portraits for gym leaders, rival, etc.
// ============================================================

const TRAINER_STYLES = {
  // Hair styles (SVG path data relative to head center)
  hair: [
    // 0: Spiky
    (cx, cy, r, col) => `<path d="M${cx-r},${cy} Q${cx-r},${cy-r*1.6} ${cx-r*0.3},${cy-r*1.8} L${cx},${cy-r*1.4} L${cx+r*0.3},${cy-r*1.8} Q${cx+r},${cy-r*1.6} ${cx+r},${cy}" fill="${col}"/>`,
    // 1: Long flowing
    (cx, cy, r, col) => `<path d="M${cx-r},${cy} Q${cx-r*1.1},${cy-r*1.4} ${cx},${cy-r*1.3} Q${cx+r*1.1},${cy-r*1.4} ${cx+r},${cy} L${cx+r*0.9},${cy+r*1.2} Q${cx},${cy+r*0.5} ${cx-r*0.9},${cy+r*1.2} Z" fill="${col}"/>`,
    // 2: Short crop
    (cx, cy, r, col) => `<path d="M${cx-r},${cy-r*0.2} Q${cx-r*0.9},${cy-r*1.4} ${cx},${cy-r*1.2} Q${cx+r*0.9},${cy-r*1.4} ${cx+r},${cy-r*0.2}" fill="${col}" stroke="${col}" stroke-width="1"/>`,
    // 3: Ponytail
    (cx, cy, r, col) => `<path d="M${cx-r},${cy} Q${cx-r},${cy-r*1.5} ${cx},${cy-r*1.3} Q${cx+r},${cy-r*1.5} ${cx+r},${cy}" fill="${col}"/>
      <path d="M${cx+r*0.5},${cy-r*1.1} Q${cx+r*1.4},${cy-r*0.6} ${cx+r*1.2},${cy+r*0.8}" fill="none" stroke="${col}" stroke-width="${r*0.4}" stroke-linecap="round"/>`,
    // 4: Mohawk
    (cx, cy, r, col) => `<path d="M${cx-r*0.8},${cy} Q${cx-r*0.3},${cy-r*1.2} ${cx},${cy-r*2} Q${cx+r*0.3},${cy-r*1.2} ${cx+r*0.8},${cy}" fill="${col}"/>`
  ],
  // Skin tones
  skin: ["#ffe0bd", "#f5c7a1", "#d4a373", "#c68642", "#8d5524", "#f0d5b8"],
  // Eye colors
  eyes: ["#2196f3", "#4caf50", "#9c27b0", "#f44336", "#ff9800", "#607d8b", "#e91e63"]
};

function getTrainerSVG(leaderId, leaderData, size = 80) {
  const type = leaderData?.type || "Normal";
  const theme = SPRITE_TYPE_THEMES[type] || SPRITE_TYPE_THEMES.Normal;

  // Use leaderId as seed for consistent randomization
  let seed = 0;
  for (let i = 0; i < leaderId.length; i++) seed += leaderId.charCodeAt(i) * (i + 1);

  const hairIdx = seed % TRAINER_STYLES.hair.length;
  const skinIdx = seed % TRAINER_STYLES.skin.length;
  const eyeIdx = (seed * 3 + 7) % TRAINER_STYLES.eyes.length;
  const skinColor = TRAINER_STYLES.skin[skinIdx];
  const hairColor = theme.accent;
  const eyeColor = TRAINER_STYLES.eyes[eyeIdx];
  const outfitColor = theme.body;
  const outfitLight = theme.light;
  const outfitAccent = theme.accent;

  const s = size;
  const cx = s * 0.5;
  const headR = s * 0.18;
  const headY = s * 0.3;

  const parts = [];

  // Background
  parts.push(`<defs>
    <radialGradient id="tbg_${leaderId}" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${theme.bg2}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </radialGradient>
    <filter id="tsh_${leaderId}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>`);
  parts.push(`<rect width="${s}" height="${s}" rx="10" fill="url(#tbg_${leaderId})"/>`);

  // Body group with shadow
  parts.push(`<g filter="url(#tsh_${leaderId})">`);

  // Body/outfit - torso
  const bodyTop = headY + headR * 0.8;
  const bodyBot = s * 0.82;
  const shoulderW = s * 0.22;
  parts.push(`<path d="M${cx-shoulderW},${bodyTop+s*0.08} Q${cx},${bodyTop-s*0.02} ${cx+shoulderW},${bodyTop+s*0.08} L${cx+shoulderW*0.9},${bodyBot} L${cx-shoulderW*0.9},${bodyBot} Z" fill="${outfitColor}" stroke="${theme.outline}" stroke-width="1.2"/>`);

  // Outfit collar/detail
  parts.push(`<path d="M${cx-s*0.06},${bodyTop+s*0.04} L${cx},${bodyTop+s*0.12} L${cx+s*0.06},${bodyTop+s*0.04}" fill="none" stroke="${outfitAccent}" stroke-width="1.5"/>`);

  // Belt/sash
  const beltY = bodyTop + (bodyBot - bodyTop) * 0.55;
  parts.push(`<rect x="${cx-shoulderW*0.9}" y="${beltY}" width="${shoulderW*1.8}" height="${s*0.04}" rx="1" fill="${outfitAccent}" opacity="0.8"/>`);

  // Arms
  parts.push(`<path d="M${cx-shoulderW},${bodyTop+s*0.1} Q${cx-shoulderW*1.5},${bodyTop+s*0.25} ${cx-shoulderW*1.2},${bodyBot*0.7}" fill="${outfitColor}" stroke="${theme.outline}" stroke-width="1"/>`);
  parts.push(`<path d="M${cx+shoulderW},${bodyTop+s*0.1} Q${cx+shoulderW*1.5},${bodyTop+s*0.25} ${cx+shoulderW*1.2},${bodyBot*0.7}" fill="${outfitColor}" stroke="${theme.outline}" stroke-width="1"/>`);

  // Hands
  parts.push(`<circle cx="${cx-shoulderW*1.2}" cy="${bodyBot*0.7}" r="${s*0.03}" fill="${skinColor}"/>`);
  parts.push(`<circle cx="${cx+shoulderW*1.2}" cy="${bodyBot*0.7}" r="${s*0.03}" fill="${skinColor}"/>`);

  // Legs (just below torso)
  parts.push(`<rect x="${cx-s*0.08}" y="${bodyBot}" width="${s*0.06}" height="${s*0.12}" rx="2" fill="${theme.outline}" opacity="0.7"/>`);
  parts.push(`<rect x="${cx+s*0.02}" y="${bodyBot}" width="${s*0.06}" height="${s*0.12}" rx="2" fill="${theme.outline}" opacity="0.7"/>`);

  // Head (skin)
  parts.push(`<circle cx="${cx}" cy="${headY}" r="${headR}" fill="${skinColor}" stroke="${theme.outline}" stroke-width="1"/>`);

  // Hair
  const drawHair = TRAINER_STYLES.hair[hairIdx];
  parts.push(drawHair(cx, headY, headR, hairColor));

  // Eyes
  const eyeR = headR * 0.22;
  const eyeY = headY + headR * 0.05;
  parts.push(drawEye(cx - headR * 0.35, eyeY, eyeR, eyeColor, theme.outline));
  parts.push(drawEye(cx + headR * 0.35, eyeY, eyeR, eyeColor, theme.outline));

  // Mouth
  parts.push(`<path d="M${cx-headR*0.2},${headY+headR*0.45} Q${cx},${headY+headR*0.6} ${cx+headR*0.2},${headY+headR*0.45}" fill="none" stroke="#333" stroke-width="0.8"/>`);

  // Type emblem on chest
  const emblems = {
    Fire: "🔥", Water: "💧", Grass: "🍃", Electric: "⚡", Ground: "🏔️",
    Wind: "🌪️", Ice: "❄️", Dark: "🌑", Fairy: "✨", Steel: "⚙️",
    Poison: "☠️", Psychic: "🔮", Dragon: "🐉", Normal: "⭐", Rock: "🪨", Bug: "🦗",
    Mixed: "👑"
  };
  const emblem = emblems[type] || "⭐";
  const emblemY = bodyTop + (bodyBot - bodyTop) * 0.25;
  parts.push(`<text x="${cx}" y="${emblemY}" text-anchor="middle" font-size="${s*0.08}" dominant-baseline="central">${emblem}</text>`);

  parts.push(`</g>`);

  // Glow effect
  parts.push(`<circle cx="${cx}" cy="${s*0.45}" r="${s*0.35}" fill="${theme.glow}" opacity="0.06"/>`);

  // Border
  parts.push(`<rect width="${s}" height="${s}" rx="10" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.4"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${parts.join("")}</svg>`;
}

function getTrainerSpriteURL(leaderId, leaderData, size = 80) {
  if (leaderId != null && TRAINER_SPRITES.has(String(leaderId))) return `assets/trainers/${leaderId}.png`;
  const svg = getTrainerSVG(leaderId, leaderData, size);
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
