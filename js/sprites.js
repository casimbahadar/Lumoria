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

function lightenHex(hex, amount) {
  const num = parseInt(hex.replace("#",""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function seededRand(id, salt) {
  const x = Math.sin(id * 9301 + salt * 49297 + 233) * 4096;
  return x - Math.floor(x);
}

// Draw a single eye: white sclera, colored iris, black pupil, white shine
function drawEye(cx, cy, er, irisColor, olf) {
  return [
    `<circle cx="${cx}" cy="${cy}" r="${er}" fill="#fff" stroke="${olf}" stroke-width="0.8"/>`,
    `<circle cx="${cx+er*0.1}" cy="${cy+er*0.08}" r="${er*0.62}" fill="${irisColor}" opacity="0.9"/>`,
    `<circle cx="${cx+er*0.06}" cy="${cy+er*0.04}" r="${er*0.36}" fill="#0a0a0a"/>`,
    `<circle cx="${cx-er*0.18}" cy="${cy-er*0.22}" r="${er*0.2}" fill="#fff" opacity="0.92"/>`
  ].join("");
}

// Draw pointed ear: base left, tip, base right
function drawEar(px, py, tipX, tipY, w, col, olf, sw) {
  return `<path d="M ${px-w} ${py} L ${tipX} ${tipY} L ${px+w} ${py}" fill="${col}" stroke="${olf}" stroke-width="${sw}" stroke-linejoin="round"/>`;
}

// ---- Archetype 0: Quadruped (wolf/fox/cat style, facing right) ----
function drawQuadruped(id, theme, size, gradId) {
  const parts = [];
  const olf = theme.outline, col = theme.body, mark = theme.mark, acc = theme.accent;
  const s = size;
  const gf = `url(#${gradId})`;

  // Tail (draw first, behind body)
  const tailStyle = id % 3;
  const tailX = s * 0.75, tailY = s * 0.48;
  if (tailStyle === 0) {
    // Curled upward bezier tail
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.94} ${tailY - s*0.06} ${s*0.90} ${tailY - s*0.22} Q ${s*0.84} ${tailY - s*0.36} ${s*0.72} ${tailY - s*0.20}" fill="none" stroke="${olf}" stroke-width="8" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.94} ${tailY - s*0.06} ${s*0.90} ${tailY - s*0.22} Q ${s*0.84} ${tailY - s*0.36} ${s*0.72} ${tailY - s*0.20}" fill="none" stroke="${col}" stroke-width="5.5" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.92} ${tailY - s*0.06} ${s*0.89} ${tailY - s*0.22}" fill="none" stroke="${theme.light}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`);
  } else if (tailStyle === 1) {
    // Spiky triangle tail
    parts.push(`<path d="M ${tailX} ${tailY} L ${s*0.92} ${tailY + s*0.07} L ${s*0.98} ${tailY - s*0.06} L ${s*0.9} ${tailY - s*0.14}" fill="${col}" stroke="${olf}" stroke-width="1.5" stroke-linejoin="round"/>`);
  } else {
    // Bushy 3-stroke tail
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.92} ${tailY + s*0.04} ${s*0.90} ${tailY - s*0.08} Q ${s*0.88} ${tailY - s*0.20} ${s*0.94} ${tailY - s*0.26}" fill="none" stroke="${olf}" stroke-width="9" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.92} ${tailY + s*0.04} ${s*0.90} ${tailY - s*0.08} Q ${s*0.88} ${tailY - s*0.20} ${s*0.94} ${tailY - s*0.26}" fill="none" stroke="${col}" stroke-width="6.5" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${tailX + s*0.03} ${tailY - s*0.02} Q ${s*0.95} ${tailY - s*0.01} ${s*0.93} ${tailY - s*0.12}" fill="none" stroke="${theme.light}" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>`);
    parts.push(`<path d="M ${tailX - s*0.03} ${tailY + s*0.02} Q ${s*0.88} ${tailY + s*0.07} ${s*0.87} ${tailY - s*0.04}" fill="none" stroke="${mark}" stroke-width="1.8" stroke-linecap="round" opacity="0.45"/>`);
  }

  // Back legs (ellipses)
  const legY = s * 0.58, legH = s * 0.23, legW = s * 0.10;
  const pawRx = legW * 0.80, pawRy = legW * 0.38;
  // Back-right leg
  parts.push(`<ellipse cx="${s*0.700}" cy="${legY + legH*0.5}" rx="${legW*0.5}" ry="${legH*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);
  parts.push(`<ellipse cx="${s*0.700}" cy="${legY + legH}" rx="${pawRx}" ry="${pawRy}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  // Back-left leg
  parts.push(`<ellipse cx="${s*0.610}" cy="${legY + legH*0.5}" rx="${legW*0.5}" ry="${legH*0.5}" fill="${gf}" stroke="${olf}" stroke-width="1.5"/>`);
  parts.push(`<ellipse cx="${s*0.610}" cy="${legY + legH}" rx="${pawRx}" ry="${pawRy}" fill="${gf}" stroke="${olf}" stroke-width="1.2"/>`);

  // Body (horizontal oval with gradient)
  const bodyX = s * 0.565, bodyY = s * 0.52;
  const bRx = s * 0.285, bRy = s * 0.185;
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY}" rx="${bRx}" ry="${bRy}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);

  // Front legs
  // Front-right leg (farther, draw behind)
  parts.push(`<ellipse cx="${s*0.410}" cy="${legY + legH*0.5}" rx="${legW*0.5}" ry="${legH*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);
  parts.push(`<ellipse cx="${s*0.410}" cy="${legY + legH}" rx="${pawRx}" ry="${pawRy}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  // Front-left leg (nearer)
  parts.push(`<ellipse cx="${s*0.310}" cy="${legY + legH*0.5}" rx="${legW*0.5}" ry="${legH*0.5}" fill="${gf}" stroke="${olf}" stroke-width="1.5"/>`);
  parts.push(`<ellipse cx="${s*0.310}" cy="${legY + legH}" rx="${pawRx}" ry="${pawRy}" fill="${gf}" stroke="${olf}" stroke-width="1.2"/>`);

  // Neck bezier curve connecting head to body
  const neckX1 = s * 0.295, neckY1 = bodyY - bRy * 0.6;
  const neckX2 = s * 0.355, neckY2 = s * 0.38;
  parts.push(`<path d="M ${neckX1} ${neckY1} Q ${s*0.25} ${s*0.42} ${s*0.24} ${s*0.36} Q ${s*0.24} ${s*0.22} ${s*0.38} ${s*0.32} L ${neckX2} ${neckY2} Z" fill="${gf}" stroke="${olf}" stroke-width="1.5"/>`);

  // Head (large circle, ~44% of height radius = 0.22)
  const headX = s * 0.295, headY = s * 0.295;
  const headR = s * 0.22;
  parts.push(`<circle cx="${headX}" cy="${headY}" r="${headR}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);

  // Ears (variation by id%3)
  const earStyle = id % 3;
  if (earStyle === 0) {
    // Pointed triangular ears
    parts.push(drawEar(headX - headR*0.36, headY - headR*0.82, headX - headR*0.46, headY - headR*1.38, headR*0.26, col, olf, 2));
    parts.push(`<path d="M ${headX - headR*0.52} ${headY - headR*0.90} L ${headX - headR*0.48} ${headY - headR*1.28} L ${headX - headR*0.32} ${headY - headR*0.88}" fill="${mark}" opacity="0.75" stroke="none"/>`);
    parts.push(drawEar(headX + headR*0.08, headY - headR*0.82, headX + headR*0.04, headY - headR*1.38, headR*0.26, col, olf, 2));
    parts.push(`<path d="M ${headX - headR*0.06} ${headY - headR*0.90} L ${headX + headR*0.02} ${headY - headR*1.28} L ${headX + headR*0.20} ${headY - headR*0.88}" fill="${mark}" opacity="0.75" stroke="none"/>`);
  } else if (earStyle === 1) {
    // Round ears
    parts.push(`<circle cx="${headX - headR*0.5}" cy="${headY - headR*0.88}" r="${headR*0.28}" fill="${col}" stroke="${olf}" stroke-width="2"/>`);
    parts.push(`<circle cx="${headX - headR*0.5}" cy="${headY - headR*0.88}" r="${headR*0.16}" fill="${mark}" opacity="0.8"/>`);
    parts.push(`<circle cx="${headX + headR*0.12}" cy="${headY - headR*0.88}" r="${headR*0.28}" fill="${col}" stroke="${olf}" stroke-width="2"/>`);
    parts.push(`<circle cx="${headX + headR*0.12}" cy="${headY - headR*0.88}" r="${headR*0.16}" fill="${mark}" opacity="0.8"/>`);
  } else {
    // Floppy droopy ears
    parts.push(`<path d="M ${headX - headR*0.62} ${headY - headR*0.6} Q ${headX - headR*0.9} ${headY - headR*0.3} ${headX - headR*0.85} ${headY + headR*0.42}" fill="none" stroke="${olf}" stroke-width="8" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${headX - headR*0.62} ${headY - headR*0.6} Q ${headX - headR*0.9} ${headY - headR*0.3} ${headX - headR*0.85} ${headY + headR*0.42}" fill="none" stroke="${col}" stroke-width="5.5" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${headX + headR*0.22} ${headY - headR*0.7} Q ${headX + headR*0.52} ${headY - headR*0.4} ${headX + headR*0.45} ${headY + headR*0.28}" fill="none" stroke="${olf}" stroke-width="7" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${headX + headR*0.22} ${headY - headR*0.7} Q ${headX + headR*0.52} ${headY - headR*0.4} ${headX + headR*0.45} ${headY + headR*0.28}" fill="none" stroke="${col}" stroke-width="4.5" stroke-linecap="round"/>`);
    // Inner ear color
    parts.push(`<path d="M ${headX - headR*0.62} ${headY - headR*0.4} Q ${headX - headR*0.82} ${headY - headR*0.1} ${headX - headR*0.78} ${headY + headR*0.30}" fill="none" stroke="${mark}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`);
  }

  // Muzzle
  const muzzleX = headX + headR * 0.42, muzzleY = headY + headR * 0.30;
  parts.push(`<ellipse cx="${muzzleX}" cy="${muzzleY}" rx="${headR*0.44}" ry="${headR*0.32}" fill="${theme.light}" stroke="${olf}" stroke-width="1.5" opacity="0.9"/>`);
  // Nose
  parts.push(`<ellipse cx="${muzzleX + headR*0.10}" cy="${muzzleY - headR*0.07}" rx="${headR*0.14}" ry="${headR*0.10}" fill="${olf}"/>`);
  // Mouth variation by id%3
  const mStyle = id % 3;
  if (mStyle === 0) {
    parts.push(`<path d="M ${muzzleX - headR*0.22} ${muzzleY + headR*0.10} Q ${muzzleX} ${muzzleY + headR*0.24} ${muzzleX + headR*0.22} ${muzzleY + headR*0.10}" fill="none" stroke="${olf}" stroke-width="1.5" stroke-linecap="round"/>`);
  } else if (mStyle === 1) {
    parts.push(`<path d="M ${muzzleX - headR*0.22} ${muzzleY + headR*0.08} Q ${muzzleX} ${muzzleY + headR*0.28} ${muzzleX + headR*0.22} ${muzzleY + headR*0.08}" fill="${olf}"/>`);
    parts.push(`<rect x="${muzzleX - headR*0.13}" y="${muzzleY + headR*0.08}" width="${headR*0.12}" height="${headR*0.11}" fill="#fff"/>`);
    parts.push(`<rect x="${muzzleX + headR*0.02}" y="${muzzleY + headR*0.08}" width="${headR*0.12}" height="${headR*0.11}" fill="#fff"/>`);
  } else {
    parts.push(`<path d="M ${muzzleX - headR*0.18} ${muzzleY + headR*0.18} Q ${muzzleX} ${muzzleY + headR*0.06} ${muzzleX + headR*0.18} ${muzzleY + headR*0.18}" fill="none" stroke="${olf}" stroke-width="1.5" stroke-linecap="round"/>`);
  }

  // Eyes (two eyes side by side, forward-facing head)
  const eyeY = headY - headR * 0.08;
  const eyeLX = headX - headR * 0.28, eyeRX = headX + headR * 0.12;
  const eyeR = headR * 0.24;
  parts.push(drawEye(eyeLX, eyeY, eyeR, acc, olf));
  parts.push(drawEye(eyeRX, eyeY, eyeR, acc, olf));

  return parts;
}

// ---- Archetype 1: Bipedal (facing forward) ----
function drawBipedal(id, theme, size, gradId) {
  const parts = [];
  const olf = theme.outline, col = theme.body, mark = theme.mark, acc = theme.accent;
  const s = size;
  const gf = `url(#${gradId})`;

  // Legs (stubby, slightly angled outward)
  const legW = s * 0.10, legH = s * 0.20;
  const legTopY = s * 0.62;
  // Left leg
  parts.push(`<ellipse cx="${s*0.355}" cy="${legTopY + legH*0.5}" rx="${legW*0.5}" ry="${legH*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.8" transform="rotate(-6,${s*0.355},${legTopY})"/>`);
  parts.push(`<ellipse cx="${s*0.340}" cy="${legTopY + legH}" rx="${legW*0.80}" ry="${legW*0.36}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  // Right leg
  parts.push(`<ellipse cx="${s*0.645}" cy="${legTopY + legH*0.5}" rx="${legW*0.5}" ry="${legH*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.8" transform="rotate(6,${s*0.645},${legTopY})"/>`);
  parts.push(`<ellipse cx="${s*0.660}" cy="${legTopY + legH}" rx="${legW*0.80}" ry="${legW*0.36}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);

  // Arms (short rotated ellipses angled outward)
  const armCY = s * 0.54;
  parts.push(`<ellipse cx="${s*0.235}" cy="${armCY}" rx="${s*0.065}" ry="${s*0.115}" fill="${gf}" stroke="${olf}" stroke-width="1.8" transform="rotate(-24,${s*0.235},${armCY})"/>`);
  parts.push(`<ellipse cx="${s*0.765}" cy="${armCY}" rx="${s*0.065}" ry="${s*0.115}" fill="${gf}" stroke="${olf}" stroke-width="1.8" transform="rotate(24,${s*0.765},${armCY})"/>`);

  // Pear-shaped torso (bezier path, wider at bottom)
  const torsoX = s * 0.5, torsoY = s * 0.56;
  parts.push(`<path d="M ${torsoX - s*0.14} ${torsoY - s*0.17} Q ${torsoX - s*0.22} ${torsoY + s*0.04} ${torsoX - s*0.18} ${torsoY + s*0.17} Q ${torsoX - s*0.08} ${torsoY + s*0.24} ${torsoX} ${torsoY + s*0.24} Q ${torsoX + s*0.08} ${torsoY + s*0.24} ${torsoX + s*0.18} ${torsoY + s*0.17} Q ${torsoX + s*0.22} ${torsoY + s*0.04} ${torsoX + s*0.14} ${torsoY - s*0.17} Q ${torsoX + s*0.08} ${torsoY - s*0.20} ${torsoX} ${torsoY - s*0.20} Q ${torsoX - s*0.08} ${torsoY - s*0.20} ${torsoX - s*0.14} ${torsoY - s*0.17} Z" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);
  // Belly sheen
  parts.push(`<ellipse cx="${torsoX}" cy="${torsoY + s*0.06}" rx="${s*0.10}" ry="${s*0.14}" fill="${theme.light}" opacity="0.28"/>`);

  // Neck
  parts.push(`<rect x="${torsoX - s*0.05}" y="${torsoY - s*0.26}" width="${s*0.10}" height="${s*0.10}" rx="${s*0.04}" fill="${gf}" stroke="${olf}" stroke-width="1.2"/>`);

  // Head shape variation by id%3
  const headX = s * 0.50, headY = s * 0.285;
  const headR = s * 0.22;
  const headShape = id % 3;
  if (headShape === 0) {
    parts.push(`<circle cx="${headX}" cy="${headY}" r="${headR}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);
  } else if (headShape === 1) {
    parts.push(`<rect x="${headX - headR*0.92}" y="${headY - headR*0.88}" width="${headR*1.84}" height="${headR*1.76}" rx="${headR*0.38}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);
  } else {
    parts.push(`<ellipse cx="${headX}" cy="${headY}" rx="${headR*1.18}" ry="${headR*0.88}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);
  }

  // Ear/feature variation by id%4
  const featStyle = id % 4;
  if (featStyle === 0) {
    // Pointed ears
    parts.push(drawEar(headX - headR*0.55, headY - headR*0.78, headX - headR*0.65, headY - headR*1.36, headR*0.22, col, olf, 2));
    parts.push(drawEar(headX + headR*0.55, headY - headR*0.78, headX + headR*0.65, headY - headR*1.36, headR*0.22, col, olf, 2));
  } else if (featStyle === 1) {
    // Round ears with inner mark
    parts.push(`<circle cx="${headX - headR*0.72}" cy="${headY - headR*0.82}" r="${headR*0.28}" fill="${col}" stroke="${olf}" stroke-width="2"/>`);
    parts.push(`<circle cx="${headX - headR*0.72}" cy="${headY - headR*0.82}" r="${headR*0.16}" fill="${mark}" opacity="0.85"/>`);
    parts.push(`<circle cx="${headX + headR*0.72}" cy="${headY - headR*0.82}" r="${headR*0.28}" fill="${col}" stroke="${olf}" stroke-width="2"/>`);
    parts.push(`<circle cx="${headX + headR*0.72}" cy="${headY - headR*0.82}" r="${headR*0.16}" fill="${mark}" opacity="0.85"/>`);
  } else if (featStyle === 2) {
    // Small horns in accent color
    parts.push(`<path d="M ${headX - headR*0.42} ${headY - headR*0.88} L ${headX - headR*0.52} ${headY - headR*1.28} L ${headX - headR*0.24} ${headY - headR*0.84}" fill="${acc}" stroke="${olf}" stroke-width="1.5" stroke-linejoin="round"/>`);
    parts.push(`<path d="M ${headX + headR*0.42} ${headY - headR*0.88} L ${headX + headR*0.52} ${headY - headR*1.28} L ${headX + headR*0.24} ${headY - headR*0.84}" fill="${acc}" stroke="${olf}" stroke-width="1.5" stroke-linejoin="round"/>`);
  } else {
    // Fin/crest
    parts.push(`<path d="M ${headX - headR*0.3} ${headY - headR*0.95} Q ${headX} ${headY - headR*1.5} ${headX + headR*0.3} ${headY - headR*0.95}" fill="${acc}" stroke="${olf}" stroke-width="1.8" opacity="0.9"/>`);
    parts.push(`<path d="M ${headX - headR*0.15} ${headY - headR*0.98} Q ${headX} ${headY - headR*1.30} ${headX + headR*0.15} ${headY - headR*0.98}" fill="${mark}" opacity="0.5"/>`);
  }

  // Eyes (large, centered)
  const eyeY = headY - headR * 0.04;
  const eyeOff = headR * 0.40;
  const eyeR = headR * 0.29;
  parts.push(drawEye(headX - eyeOff, eyeY, eyeR, acc, olf));
  parts.push(drawEye(headX + eyeOff, eyeY, eyeR, acc, olf));

  // Mouth variation by id%3
  const mY = headY + headR * 0.46;
  const mStyle = id % 3;
  if (mStyle === 0) {
    parts.push(`<path d="M ${headX - headR*0.32} ${mY} Q ${headX} ${mY + headR*0.28} ${headX + headR*0.32} ${mY}" fill="none" stroke="${olf}" stroke-width="2" stroke-linecap="round"/>`);
  } else if (mStyle === 1) {
    parts.push(`<path d="M ${headX - headR*0.36} ${mY} Q ${headX} ${mY + headR*0.34} ${headX + headR*0.36} ${mY}" fill="${olf}"/>`);
    parts.push(`<rect x="${headX - headR*0.22}" y="${mY}" width="${headR*0.16}" height="${headR*0.14}" fill="#fff"/>`);
    parts.push(`<rect x="${headX + headR*0.06}" y="${mY}" width="${headR*0.16}" height="${headR*0.14}" fill="#fff"/>`);
  } else {
    parts.push(`<path d="M ${headX - headR*0.28} ${mY + headR*0.18} Q ${headX} ${mY + headR*0.02} ${headX + headR*0.28} ${mY + headR*0.18}" fill="none" stroke="${olf}" stroke-width="2" stroke-linecap="round"/>`);
  }

  return parts;
}

// ---- Archetype 2: Avian (bird) ----
function drawAvian(id, theme, size, gradId) {
  const parts = [];
  const olf = theme.outline, col = theme.body, mark = theme.mark, acc = theme.accent;
  const s = size;
  const gf = `url(#${gradId})`;

  // Wing flap position by id%3
  const wPos = id % 3; // 0=up, 1=mid, 2=down
  const wLift = wPos === 0 ? -0.14 : wPos === 1 ? 0 : 0.10;

  // Left wing (bezier, wide)
  parts.push(`<path d="M ${s*0.36} ${s*0.50} Q ${s*0.18} ${s*(0.36 + wLift)} ${s*0.06} ${s*(0.50 + wLift*0.5)} Q ${s*0.16} ${s*0.54} ${s*0.34} ${s*0.60}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);
  // Wing feather detail lines
  parts.push(`<path d="M ${s*0.33} ${s*0.52} Q ${s*0.20} ${s*(0.47 + wLift)} ${s*0.10} ${s*(0.54 + wLift*0.4)}" fill="none" stroke="${mark}" stroke-width="1.8" opacity="0.55"/>`);
  parts.push(`<path d="M ${s*0.32} ${s*0.56} Q ${s*0.22} ${s*(0.53 + wLift*0.5)} ${s*0.14} ${s*(0.59 + wLift*0.3)}" fill="none" stroke="${mark}" stroke-width="1.2" opacity="0.42"/>`);
  parts.push(`<path d="M ${s*0.31} ${s*0.585} Q ${s*0.24} ${s*(0.58 + wLift*0.3)} ${s*0.18} ${s*(0.625 + wLift*0.2)}" fill="none" stroke="${mark}" stroke-width="0.9" opacity="0.30"/>`);

  // Right wing (bezier, wide)
  parts.push(`<path d="M ${s*0.64} ${s*0.50} Q ${s*0.82} ${s*(0.36 + wLift)} ${s*0.94} ${s*(0.50 + wLift*0.5)} Q ${s*0.84} ${s*0.54} ${s*0.66} ${s*0.60}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);
  parts.push(`<path d="M ${s*0.67} ${s*0.52} Q ${s*0.80} ${s*(0.47 + wLift)} ${s*0.90} ${s*(0.54 + wLift*0.4)}" fill="none" stroke="${mark}" stroke-width="1.8" opacity="0.55"/>`);
  parts.push(`<path d="M ${s*0.68} ${s*0.56} Q ${s*0.78} ${s*(0.53 + wLift*0.5)} ${s*0.86} ${s*(0.59 + wLift*0.3)}" fill="none" stroke="${mark}" stroke-width="1.2" opacity="0.42"/>`);
  parts.push(`<path d="M ${s*0.69} ${s*0.585} Q ${s*0.76} ${s*(0.58 + wLift*0.3)} ${s*0.82} ${s*(0.625 + wLift*0.2)}" fill="none" stroke="${mark}" stroke-width="0.9" opacity="0.30"/>`);

  // Body (small egg-shaped)
  const bodyX = s * 0.5, bodyY = s * 0.56;
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY}" rx="${s*0.16}" ry="${s*0.19}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);
  // Belly
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY + s*0.05}" rx="${s*0.09}" ry="${s*0.11}" fill="${theme.light}" opacity="0.30"/>`);

  // Neck
  parts.push(`<rect x="${bodyX - s*0.055}" y="${bodyY - s*0.23}" width="${s*0.11}" height="${s*0.10}" rx="${s*0.04}" fill="${gf}" stroke="${olf}" stroke-width="1.2"/>`);

  // Head (round, smaller than bipedal)
  const headX = s * 0.5, headY = s * 0.295;
  const headR = s * 0.20;
  parts.push(`<circle cx="${headX}" cy="${headY}" r="${headR}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);

  // Crest/plume variation by id%3
  const crestStyle = id % 3;
  if (crestStyle === 0) {
    // 3 tall crest feathers
    for (let i = 0; i < 3; i++) {
      const cx = headX - headR*0.3 + i * headR*0.30;
      const h = headR * (1.2 - i * 0.15);
      parts.push(`<path d="M ${cx - headR*0.08} ${headY - headR*0.88} Q ${cx} ${headY - headR*0.88 - h} ${cx + headR*0.08} ${headY - headR*0.88}" fill="${acc}" stroke="${olf}" stroke-width="1.2"/>`);
    }
  } else if (crestStyle === 1) {
    // Single swept-back crest
    parts.push(`<path d="M ${headX - headR*0.15} ${headY - headR*0.84} Q ${headX + headR*0.6} ${headY - headR*1.6} ${headX + headR*0.9} ${headY - headR*0.5} Q ${headX + headR*0.4} ${headY - headR*0.6} ${headX + headR*0.1} ${headY - headR*0.86}" fill="${acc}" stroke="${olf}" stroke-width="1.5"/>`);
  } else {
    // Spiky head feathers (multiple small spikes)
    for (let i = 0; i < 4; i++) {
      const cx = headX - headR*0.45 + i * headR*0.30;
      const h = headR * (0.8 + seededRand(id + i, 99) * 0.6);
      parts.push(`<path d="M ${cx - headR*0.10} ${headY - headR*0.82} L ${cx} ${headY - headR*0.82 - h} L ${cx + headR*0.10} ${headY - headR*0.82}" fill="${acc}" stroke="${olf}" stroke-width="1.2" stroke-linejoin="round"/>`);
    }
  }

  // Beak (id%2 variation)
  if (id % 2 === 0) {
    // Hooked raptor beak
    parts.push(`<path d="M ${headX - headR*0.18} ${headY + headR*0.28} L ${headX + headR*0.88} ${headY + headR*0.08} Q ${headX + headR*0.84} ${headY + headR*0.42} ${headX + headR*0.52} ${headY + headR*0.50}" fill="${mark}" stroke="${olf}" stroke-width="1.5"/>`);
  } else {
    // Straight pointed beak
    parts.push(`<path d="M ${headX - headR*0.15} ${headY + headR*0.24} L ${headX + headR*1.02} ${headY + headR*0.32} L ${headX - headR*0.15} ${headY + headR*0.50}" fill="${mark}" stroke="${olf}" stroke-width="1.5"/>`);
  }

  // Eyes (two, slightly offset for bird-like look)
  const eyeR = headR * 0.24;
  const eyeLX = headX - headR * 0.38, eyeRX = headX + headR * 0.14;
  const eyeY = headY - headR * 0.10;
  parts.push(drawEye(eyeLX, eyeY, eyeR, acc, olf));
  parts.push(drawEye(eyeRX, eyeY, eyeR, acc, olf));

  // Talon feet (3-line fork shape)
  const fY = bodyY + s * 0.20;
  const fX1 = bodyX - s * 0.09, fX2 = bodyX + s * 0.09;
  for (const fx of [fX1, fX2]) {
    parts.push(`<path d="M ${fx} ${fY} L ${fx - s*0.10} ${fY + s*0.10} M ${fx} ${fY} L ${fx} ${fY + s*0.12} M ${fx} ${fY} L ${fx + s*0.10} ${fY + s*0.10}" stroke="${olf}" stroke-width="2.8" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${fx} ${fY} L ${fx - s*0.10} ${fY + s*0.10} M ${fx} ${fY} L ${fx} ${fY + s*0.12} M ${fx} ${fY} L ${fx + s*0.10} ${fY + s*0.10}" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>`);
  }

  return parts;
}

// ---- Archetype 3: Serpentine (snake/dragon) ----
function drawSerpentine(id, theme, size, gradId) {
  const parts = [];
  const olf = theme.outline, col = theme.body, mark = theme.mark, acc = theme.accent;
  const s = size;

  const variant = id % 2;
  if (variant === 0) {
    // S-curve body
    parts.push(`<path d="M ${s*0.62} ${s*0.82} Q ${s*0.80} ${s*0.70} ${s*0.70} ${s*0.54} Q ${s*0.54} ${s*0.38} ${s*0.60} ${s*0.20}" fill="none" stroke="${olf}" stroke-width="24" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${s*0.62} ${s*0.82} Q ${s*0.80} ${s*0.70} ${s*0.70} ${s*0.54} Q ${s*0.54} ${s*0.38} ${s*0.60} ${s*0.20}" fill="none" stroke="${col}" stroke-width="20" stroke-linecap="round"/>`);
    // Belly stripe (lighter)
    parts.push(`<path d="M ${s*0.60} ${s*0.82} Q ${s*0.76} ${s*0.70} ${s*0.68} ${s*0.54} Q ${s*0.54} ${s*0.40} ${s*0.58} ${s*0.20}" fill="none" stroke="${theme.light}" stroke-width="8" stroke-linecap="round" opacity="0.42"/>`);
    // Tail tip
    parts.push(`<path d="M ${s*0.62} ${s*0.82} L ${s*0.56} ${s*0.91}" fill="none" stroke="${olf}" stroke-width="14" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${s*0.62} ${s*0.82} L ${s*0.56} ${s*0.91}" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round"/>`);
    // Head
    const hx = s * 0.58, hy = s * 0.165;
    // Wedge/oval head
    parts.push(`<path d="M ${hx - s*0.14} ${hy + s*0.08} Q ${hx - s*0.17} ${hy - s*0.06} ${hx} ${hy - s*0.12} Q ${hx + s*0.17} ${hy - s*0.06} ${hx + s*0.14} ${hy + s*0.08} Q ${hx} ${hy + s*0.14} ${hx - s*0.14} ${hy + s*0.08} Z" fill="${col}" stroke="${olf}" stroke-width="2.5"/>`);
    // Head sheen
    parts.push(`<ellipse cx="${hx - s*0.04}" cy="${hy - s*0.02}" rx="${s*0.08}" ry="${s*0.06}" fill="${theme.light}" opacity="0.30"/>`);
    // Eyes
    const eyeR = s * 0.042;
    parts.push(drawEye(hx - s*0.07, hy, eyeR, acc, olf));
    parts.push(drawEye(hx + s*0.05, hy, eyeR, acc, olf));
    // Forked tongue
    parts.push(`<path d="M ${hx + s*0.14} ${hy + s*0.04} L ${hx + s*0.22} ${hy + s*0.02} M ${hx + s*0.22} ${hy + s*0.02} L ${hx + s*0.27} ${hy - s*0.02} M ${hx + s*0.22} ${hy + s*0.02} L ${hx + s*0.27} ${hy + s*0.06}" stroke="#cc1111" stroke-width="2" stroke-linecap="round"/>`);
  } else {
    // Coiled body
    parts.push(`<path d="M ${s*0.5} ${s*0.79} Q ${s*0.82} ${s*0.79} ${s*0.82} ${s*0.50} Q ${s*0.82} ${s*0.24} ${s*0.5} ${s*0.24} Q ${s*0.24} ${s*0.24} ${s*0.24} ${s*0.48}" fill="none" stroke="${olf}" stroke-width="26" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${s*0.5} ${s*0.79} Q ${s*0.82} ${s*0.79} ${s*0.82} ${s*0.50} Q ${s*0.82} ${s*0.24} ${s*0.5} ${s*0.24} Q ${s*0.24} ${s*0.24} ${s*0.24} ${s*0.48}" fill="none" stroke="${col}" stroke-width="22" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${s*0.5} ${s*0.79} Q ${s*0.78} ${s*0.79} ${s*0.78} ${s*0.50} Q ${s*0.78} ${s*0.28} ${s*0.5} ${s*0.28}" fill="none" stroke="${theme.light}" stroke-width="9" stroke-linecap="round" opacity="0.40"/>`);
    // Head at open end
    const hx = s * 0.235, hy = s * 0.43;
    parts.push(`<path d="M ${hx - s*0.14} ${hy + s*0.08} Q ${hx - s*0.17} ${hy - s*0.06} ${hx} ${hy - s*0.12} Q ${hx + s*0.17} ${hy - s*0.06} ${hx + s*0.14} ${hy + s*0.08} Q ${hx} ${hy + s*0.14} ${hx - s*0.14} ${hy + s*0.08} Z" fill="${col}" stroke="${olf}" stroke-width="2.5"/>`);
    parts.push(`<ellipse cx="${hx - s*0.02}" cy="${hy - s*0.02}" rx="${s*0.08}" ry="${s*0.05}" fill="${theme.light}" opacity="0.28"/>`);
    const eyeR = s * 0.040;
    parts.push(drawEye(hx - s*0.06, hy - s*0.02, eyeR, acc, olf));
    parts.push(drawEye(hx + s*0.06, hy - s*0.02, eyeR, acc, olf));
    // Forked tongue
    parts.push(`<path d="M ${hx - s*0.15} ${hy + s*0.02} L ${hx - s*0.23} ${hy} M ${hx - s*0.23} ${hy} L ${hx - s*0.29} ${hy - s*0.04} M ${hx - s*0.23} ${hy} L ${hx - s*0.29} ${hy + s*0.04}" stroke="#cc1111" stroke-width="2" stroke-linecap="round"/>`);
  }

  return parts;
}

// ---- Archetype 4: Croucher (frog/toad) ----
function drawCroucher(id, theme, size, gradId) {
  const parts = [];
  const olf = theme.outline, col = theme.body, mark = theme.mark, acc = theme.accent;
  const s = size;
  const gf = `url(#${gradId})`;

  // Wide splayed hind legs (thick bezier curves)
  // Left hind leg
  parts.push(`<path d="M ${s*0.30} ${s*0.60} Q ${s*0.13} ${s*0.68} ${s*0.08} ${s*0.82}" fill="none" stroke="${olf}" stroke-width="15" stroke-linecap="round"/>`);
  parts.push(`<path d="M ${s*0.30} ${s*0.60} Q ${s*0.13} ${s*0.68} ${s*0.08} ${s*0.82}" fill="none" stroke="${gf}" stroke-width="12" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="${s*0.07}" cy="${s*0.83}" rx="${s*0.10}" ry="${s*0.045}" fill="${gf}" stroke="${olf}" stroke-width="1.5"/>`);
  // Right hind leg
  parts.push(`<path d="M ${s*0.70} ${s*0.60} Q ${s*0.87} ${s*0.68} ${s*0.92} ${s*0.82}" fill="none" stroke="${olf}" stroke-width="15" stroke-linecap="round"/>`);
  parts.push(`<path d="M ${s*0.70} ${s*0.60} Q ${s*0.87} ${s*0.68} ${s*0.92} ${s*0.82}" fill="none" stroke="${gf}" stroke-width="12" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="${s*0.93}" cy="${s*0.83}" rx="${s*0.10}" ry="${s*0.045}" fill="${gf}" stroke="${olf}" stroke-width="1.5"/>`);

  // Shorter front arms
  parts.push(`<path d="M ${s*0.36} ${s*0.62} Q ${s*0.24} ${s*0.70} ${s*0.22} ${s*0.76}" fill="none" stroke="${olf}" stroke-width="11" stroke-linecap="round"/>`);
  parts.push(`<path d="M ${s*0.36} ${s*0.62} Q ${s*0.24} ${s*0.70} ${s*0.22} ${s*0.76}" fill="none" stroke="${gf}" stroke-width="8.5" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="${s*0.21}" cy="${s*0.77}" rx="${s*0.075}" ry="${s*0.036}" fill="${gf}" stroke="${olf}" stroke-width="1.2"/>`);
  parts.push(`<path d="M ${s*0.64} ${s*0.62} Q ${s*0.76} ${s*0.70} ${s*0.78} ${s*0.76}" fill="none" stroke="${olf}" stroke-width="11" stroke-linecap="round"/>`);
  parts.push(`<path d="M ${s*0.64} ${s*0.62} Q ${s*0.76} ${s*0.70} ${s*0.78} ${s*0.76}" fill="none" stroke="${gf}" stroke-width="8.5" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="${s*0.79}" cy="${s*0.77}" rx="${s*0.075}" ry="${s*0.036}" fill="${gf}" stroke="${olf}" stroke-width="1.2"/>`);

  // Wide low oval body
  const bodyX = s * 0.5, bodyY = s * 0.60;
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY}" rx="${s*0.30}" ry="${s*0.17}" fill="${gf}" stroke="${olf}" stroke-width="2.5"/>`);
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY + s*0.04}" rx="${s*0.20}" ry="${s*0.10}" fill="${theme.light}" opacity="0.30"/>`);

  // Very wide head
  const headX = s * 0.50, headY = s * 0.38;
  parts.push(`<ellipse cx="${headX}" cy="${headY}" rx="${s*0.32}" ry="${s*0.21}" fill="${gf}" stroke="${olf}" stroke-width="2.8"/>`);

  // Head marking variations by id%3
  const markStyle = id % 3;
  if (markStyle === 0) {
    // Spots
    for (let i = 0; i < 3; i++) {
      const sx = headX - s*0.14 + i * s*0.14;
      const sy = headY + s*0.04;
      const sr = s * (0.022 + seededRand(id, i+55) * 0.022);
      parts.push(`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${mark}" opacity="0.50"/>`);
    }
  } else if (markStyle === 1) {
    // Dorsal stripe
    parts.push(`<path d="M ${headX} ${headY - s*0.18} Q ${headX} ${headY + s*0.04} ${headX} ${headY + s*0.19}" fill="none" stroke="${mark}" stroke-width="3" opacity="0.48"/>`);
  } else {
    // Ridge line
    parts.push(`<path d="M ${headX - s*0.22} ${headY - s*0.02} Q ${headX} ${headY - s*0.10} ${headX + s*0.22} ${headY - s*0.02}" fill="none" stroke="${mark}" stroke-width="2.5" opacity="0.46"/>`);
  }

  // Bulging eyes on TOP of head (eye socket + iris)
  const eyeOff = s * 0.175;
  const eyeTopY = headY - s * 0.115;
  const eyeSocketR = s * 0.085;
  const eyeIrisR = s * 0.066;
  for (const exo of [-eyeOff, eyeOff]) {
    // Eye socket (body color outline)
    parts.push(`<circle cx="${headX + exo}" cy="${eyeTopY}" r="${eyeSocketR}" fill="${col}" stroke="${olf}" stroke-width="2"/>`);
    // Full iris eye
    parts.push(drawEye(headX + exo, eyeTopY, eyeIrisR, acc, olf));
  }

  // Wide mouth variation by id%3
  const mY = headY + s * 0.10;
  const mStyle = id % 3;
  if (mStyle === 0) {
    parts.push(`<path d="M ${headX - s*0.22} ${mY} Q ${headX} ${mY + s*0.10} ${headX + s*0.22} ${mY}" fill="none" stroke="${olf}" stroke-width="2.8" stroke-linecap="round"/>`);
  } else if (mStyle === 1) {
    parts.push(`<path d="M ${headX - s*0.22} ${mY} Q ${headX} ${mY + s*0.12} ${headX + s*0.22} ${mY}" fill="${olf}"/>`);
    parts.push(`<path d="M ${headX - s*0.19} ${mY} Q ${headX} ${mY + s*0.05} ${headX + s*0.19} ${mY}" fill="#660000"/>`);
  } else {
    parts.push(`<path d="M ${headX - s*0.18} ${mY + s*0.06} Q ${headX} ${mY} ${headX + s*0.18} ${mY + s*0.06}" fill="none" stroke="${olf}" stroke-width="2.5" stroke-linecap="round"/>`);
  }

  return parts;
}

// ---- Type-specific decorations layered OVER the creature ----
function typeDecorations(primaryType, id, theme, size) {
  const parts = [];
  const col = theme.accent, olf = theme.outline, mark = theme.mark;
  const s = size;
  const cx = s * 0.5, topY = s * 0.06;

  if (primaryType === "Fire") {
    // 3 floating ember/flame shapes above creature
    const flameData = [
      [cx - s*0.16, topY + s*0.04, s*0.07],
      [cx,          topY,           s*0.09],
      [cx + s*0.16, topY + s*0.04, s*0.07]
    ];
    for (const [fx, fy, fr] of flameData) {
      parts.push(`<path d="M ${fx} ${fy + fr} Q ${fx - fr*0.7} ${fy + fr*0.3} ${fx} ${fy - fr} Q ${fx + fr*0.7} ${fy + fr*0.3} ${fx} ${fy + fr} Z" fill="${col}" opacity="0.90"/>`);
      parts.push(`<path d="M ${fx} ${fy + fr*0.5} Q ${fx - fr*0.35} ${fy + fr*0.1} ${fx} ${fy - fr*0.5} Q ${fx + fr*0.35} ${fy + fr*0.1} ${fx} ${fy + fr*0.5} Z" fill="${mark}" opacity="0.7"/>`);
    }
  } else if (primaryType === "Water") {
    // 3 water drop shapes
    const dropPos = [[cx - s*0.18, topY + s*0.06], [cx + s*0.02, topY], [cx + s*0.20, topY + s*0.08]];
    for (const [dx, dy] of dropPos) {
      const dr = s * 0.055;
      parts.push(`<path d="M ${dx} ${dy - dr*1.4} Q ${dx - dr} ${dy} ${dx} ${dy + dr} Q ${dx + dr} ${dy} ${dx} ${dy - dr*1.4} Z" fill="${col}" opacity="0.85"/>`);
      parts.push(`<ellipse cx="${dx - dr*0.25}" cy="${dy - dr*0.4}" rx="${dr*0.20}" ry="${dr*0.30}" fill="#fff" opacity="0.45"/>`);
    }
  } else if (primaryType === "Electric") {
    // Jagged lightning spark lines
    parts.push(`<polyline points="${cx - s*0.20},${topY + s*0.12} ${cx - s*0.10},${topY + s*0.02} ${cx - s*0.06},${topY + s*0.10} ${cx + s*0.02},${topY - s*0.02}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>`);
    parts.push(`<polyline points="${cx + s*0.08},${topY + s*0.12} ${cx + s*0.16},${topY + s*0.02} ${cx + s*0.12},${topY + s*0.10} ${cx + s*0.22},${topY - s*0.02}" fill="none" stroke="${mark}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" opacity="0.85"/>`);
    parts.push(`<polyline points="${cx - s*0.04},${topY + s*0.08} ${cx + s*0.04},${topY - s*0.04} ${cx + s*0.08},${topY + s*0.06}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity="0.75"/>`);
  } else if (primaryType === "Ice") {
    // 3 floating crystal spike shapes
    const crystalPos = [[cx - s*0.18, topY + s*0.06], [cx, topY], [cx + s*0.18, topY + s*0.06]];
    for (const [icx, icy] of crystalPos) {
      const ch = s * 0.10;
      parts.push(`<path d="M ${icx} ${icy - ch} L ${icx + ch*0.35} ${icy} L ${icx} ${icy + ch*0.7} L ${icx - ch*0.35} ${icy} Z" fill="${col}" stroke="${mark}" stroke-width="1" opacity="0.88"/>`);
      parts.push(`<path d="M ${icx - ch*0.1} ${icy - ch*0.6} L ${icx + ch*0.1} ${icy}" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.55"/>`);
    }
  } else if (primaryType === "Dark") {
    // 3 wispy shadow tendrils
    const tPos = [[cx - s*0.18, s*0.28], [cx, s*0.18], [cx + s*0.18, s*0.28]];
    for (const [tx, ty] of tPos) {
      parts.push(`<path d="M ${tx} ${ty} Q ${tx + s*0.04} ${ty - s*0.10} ${tx + s*0.02} ${ty - s*0.20} Q ${tx - s*0.04} ${ty - s*0.26} ${tx} ${ty - s*0.30}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" opacity="0.75"/>`);
      parts.push(`<path d="M ${tx - s*0.04} ${ty} Q ${tx} ${ty - s*0.08} ${tx - s*0.02} ${ty - s*0.18}" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round" opacity="0.45"/>`);
    }
  } else if (primaryType === "Fairy") {
    // 5 sparkle star shapes (4-pointed stars)
    const starPos = [
      [cx - s*0.22, s*0.18], [cx + s*0.22, s*0.15],
      [cx - s*0.10, topY + s*0.02], [cx + s*0.12, topY + s*0.04],
      [cx, s*0.14]
    ];
    for (const [sx, sy] of starPos) {
      const sr = s * 0.050;
      parts.push(`<path d="M ${sx} ${sy - sr} L ${sx + sr*0.25} ${sy - sr*0.25} L ${sx + sr} ${sy} L ${sx + sr*0.25} ${sy + sr*0.25} L ${sx} ${sy + sr} L ${sx - sr*0.25} ${sy + sr*0.25} L ${sx - sr} ${sy} L ${sx - sr*0.25} ${sy - sr*0.25} Z" fill="${col}" opacity="0.88"/>`);
      parts.push(`<circle cx="${sx}" cy="${sy}" r="${sr*0.28}" fill="#fff" opacity="0.70"/>`);
    }
  } else if (primaryType === "Dragon") {
    // 2 glowing ring ellipses around creature
    parts.push(`<ellipse cx="${cx}" cy="${s*0.50}" rx="${s*0.40}" ry="${s*0.18}" fill="none" stroke="${col}" stroke-width="3" opacity="0.40"/>`);
    parts.push(`<ellipse cx="${cx}" cy="${s*0.50}" rx="${s*0.30}" ry="${s*0.12}" fill="none" stroke="${mark}" stroke-width="1.8" opacity="0.30"/>`);
  } else if (primaryType === "Psychic") {
    // 3 orbiting circle dots
    const orbitR = s * 0.32;
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const ox = cx + Math.cos(angle) * orbitR * 0.85;
      const oy = s*0.46 + Math.sin(angle) * orbitR * 0.46;
      parts.push(`<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="${s*0.040}" fill="${col}" opacity="0.80"/>`);
      parts.push(`<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="${s*0.022}" fill="#fff" opacity="0.55"/>`);
    }
  } else if (primaryType === "Grass") {
    // 3 small leaf shapes
    const leafPos = [[cx - s*0.20, topY + s*0.04], [cx + s*0.04, topY], [cx + s*0.20, topY + s*0.06]];
    for (const [lx, ly] of leafPos) {
      parts.push(`<path d="M ${lx} ${ly + s*0.08} Q ${lx - s*0.06} ${ly - s*0.06} ${lx} ${ly - s*0.08} Q ${lx + s*0.06} ${ly - s*0.06} ${lx} ${ly + s*0.08} Z" fill="${col}" stroke="${olf}" stroke-width="0.8" opacity="0.88"/>`);
      parts.push(`<path d="M ${lx} ${ly - s*0.08} L ${lx} ${ly + s*0.08}" fill="none" stroke="${mark}" stroke-width="0.8" opacity="0.55"/>`);
    }
  } else if (primaryType === "Ground") {
    // Small pebble/dust shapes
    const pebPos = [[cx - s*0.26, s*0.74], [cx - s*0.10, s*0.78], [cx + s*0.14, s*0.76], [cx + s*0.26, s*0.72]];
    for (const [px, py] of pebPos) {
      const pr = s * (0.018 + seededRand(id, px) * 0.022);
      parts.push(`<ellipse cx="${px}" cy="${py}" rx="${pr*1.5}" ry="${pr}" fill="${col}" opacity="0.72"/>`);
    }
  } else if (primaryType === "Rock") {
    // Angular rock chip shapes
    const rockPos = [[cx - s*0.24, s*0.72], [cx + s*0.20, s*0.70], [cx + s*0.08, s*0.78]];
    for (const [rx, ry] of rockPos) {
      const rr = s * 0.036;
      parts.push(`<polygon points="${rx},${ry - rr} ${rx + rr*1.2},${ry - rr*0.3} ${rx + rr*0.8},${ry + rr} ${rx - rr*0.4},${ry + rr*0.6} ${rx - rr*1.1},${ry}" fill="${col}" opacity="0.78"/>`);
    }
  } else if (primaryType === "Bug") {
    // Antennae (2 lines with bulb tips from head area)
    parts.push(`<path d="M ${cx - s*0.10} ${s*0.15} Q ${cx - s*0.22} ${s*0.04} ${cx - s*0.26} ${topY - s*0.02}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/>`);
    parts.push(`<circle cx="${cx - s*0.26}" cy="${topY - s*0.02}" r="${s*0.038}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
    parts.push(`<path d="M ${cx + s*0.10} ${s*0.15} Q ${cx + s*0.22} ${s*0.04} ${cx + s*0.26} ${topY - s*0.02}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/>`);
    parts.push(`<circle cx="${cx + s*0.26}" cy="${topY - s*0.02}" r="${s*0.038}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  } else if (primaryType === "Steel") {
    // 3 metallic gleam lines
    const gleamPos = [[cx - s*0.18, s*0.22], [cx + s*0.06, s*0.16], [cx + s*0.24, s*0.25]];
    for (const [gx, gy] of gleamPos) {
      const gl = s * 0.09;
      parts.push(`<line x1="${gx - gl*0.5}" y1="${gy}" x2="${gx + gl*0.5}" y2="${gy}" stroke="${col}" stroke-width="2.5" stroke-linecap="round" opacity="0.80"/>`);
      parts.push(`<line x1="${gx}" y1="${gy - gl*0.5}" x2="${gx}" y2="${gy + gl*0.5}" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.60"/>`);
    }
  } else if (primaryType === "Poison") {
    // 3 bubble circles
    const bubPos = [[cx - s*0.20, s*0.18], [cx + s*0.16, s*0.14], [cx - s*0.04, topY + s*0.02]];
    for (const [bx, by] of bubPos) {
      const br = s * 0.055;
      parts.push(`<circle cx="${bx}" cy="${by}" r="${br}" fill="none" stroke="${col}" stroke-width="2" opacity="0.80"/>`);
      parts.push(`<circle cx="${bx - br*0.30}" cy="${by - br*0.35}" r="${br*0.22}" fill="#fff" opacity="0.42"/>`);
    }
  } else if (primaryType === "Wind") {
    // 2 curved swirl paths
    parts.push(`<path d="M ${cx - s*0.24} ${s*0.22} Q ${cx - s*0.10} ${s*0.08} ${cx + s*0.04} ${s*0.16} Q ${cx + s*0.16} ${s*0.24} ${cx + s*0.08} ${s*0.34}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" opacity="0.78"/>`);
    parts.push(`<path d="M ${cx - s*0.10} ${s*0.16} Q ${cx + s*0.02} ${s*0.06} ${cx + s*0.16} ${s*0.12} Q ${cx + s*0.26} ${s*0.18} ${cx + s*0.22} ${s*0.28}" fill="none" stroke="${mark}" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>`);
  }
  // Normal: nothing extra

  return parts;
}

// ---- Body markings (stripes, spots, diamond patterns) ----
function bodyMarkings(primaryType, id, theme, size) {
  const parts = [];
  const mark = theme.mark;
  const s = size;
  const cx = s * 0.5;
  const markType = id % 4;

  if (markType === 0) {
    // Horizontal stripes on torso
    parts.push(`<path d="M ${cx - s*0.12} ${s*0.46} Q ${cx} ${s*0.48} ${cx + s*0.12} ${s*0.46}" fill="none" stroke="${mark}" stroke-width="2.5" opacity="0.48"/>`);
    parts.push(`<path d="M ${cx - s*0.15} ${s*0.52} Q ${cx} ${s*0.54} ${cx + s*0.15} ${s*0.52}" fill="none" stroke="${mark}" stroke-width="2.2" opacity="0.42"/>`);
  } else if (markType === 1) {
    // Spots
    for (let i = 0; i < 4; i++) {
      const sx = s * (0.34 + seededRand(id, i + 70) * 0.32);
      const sy = s * (0.40 + seededRand(id, i + 80) * 0.22);
      parts.push(`<circle cx="${sx}" cy="${sy}" r="${2.5 + seededRand(id, i + 90) * 4}" fill="${mark}" opacity="0.46"/>`);
    }
  } else if (markType === 2) {
    // Diamond chevrons
    for (let i = 0; i < 2; i++) {
      const dx = cx - 9 + i * 18;
      const dy = s * 0.51;
      parts.push(`<polygon points="${dx},${dy - 7} ${dx + 6},${dy} ${dx},${dy + 7} ${dx - 6},${dy}" fill="${mark}" opacity="0.46"/>`);
    }
  }
  // markType === 3: no extra markings

  return parts;
}

// ---- Background subtle pattern ----
function bgPattern(theme, id, size) {
  const parts = [];
  const s = size;
  const patType = id % 4;

  if (patType === 0) {
    for (let i = 0; i < 3; i++) {
      const r = 9 + i * 11 + Math.floor(seededRand(id, i + 10) * 6);
      const pcx = s * (0.28 + seededRand(id, i + 20) * 0.44);
      const pcy = s * (0.28 + seededRand(id, i + 30) * 0.44);
      parts.push(`<circle cx="${pcx.toFixed(1)}" cy="${pcy.toFixed(1)}" r="${r}" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.09"/>`);
    }
  } else if (patType === 1) {
    const s2 = seededRand(id, 1);
    for (let i = -1; i < 5; i++) {
      const offset = i * 14 + Math.floor(s2 * 8);
      parts.push(`<line x1="${offset}" y1="0" x2="${offset + s}" y2="${s}" stroke="${theme.accent}" stroke-width="1" opacity="0.07"/>`);
    }
  } else if (patType === 2) {
    for (let i = 0; i < 4; i++) {
      const bx = (i % 2) * s * 0.5 + s * 0.25;
      const by = Math.floor(i / 2) * s * 0.5 + s * 0.25;
      parts.push(`<polygon points="${bx},${by - 10} ${bx + 10},${by} ${bx},${by + 10} ${bx - 10},${by}" fill="${theme.accent}" opacity="0.06"/>`);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const hx = s * (0.15 + seededRand(id, i + 40) * 0.7);
      const hy = s * (0.15 + seededRand(id, i + 50) * 0.7);
      const hr = 5 + seededRand(id, i + 60) * 8;
      parts.push(`<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="${hr.toFixed(1)}" fill="${theme.accent}" opacity="0.07"/>`);
    }
  }
  return parts;
}

// ---- Legendary sparkle dots ----
function legendarySparkles(monster, theme, size) {
  const parts = [];
  const s = size;
  const n = 5 + (monster.id % 4);
  for (let i = 0; i < n; i++) {
    const sx = s * (0.08 + seededRand(monster.id, i + 200) * 0.84);
    const sy = s * (0.08 + seededRand(monster.id, i + 210) * 0.84);
    const sr = s * (0.018 + seededRand(monster.id, i + 220) * 0.022);
    parts.push(`<path d="M ${sx} ${sy - sr} L ${sx + sr*0.24} ${sy - sr*0.24} L ${sx + sr} ${sy} L ${sx + sr*0.24} ${sy + sr*0.24} L ${sx} ${sy + sr} L ${sx - sr*0.24} ${sy + sr*0.24} L ${sx - sr} ${sy} L ${sx - sr*0.24} ${sy - sr*0.24} Z" fill="${theme.accent}" opacity="0.85"/>`);
    parts.push(`<circle cx="${sx}" cy="${sy}" r="${sr*0.28}" fill="#fff" opacity="0.70"/>`);
  }
  return parts;
}

// ---- Rarity badge ----
function rarityBadge(monster, size) {
  const parts = [];
  if (monster.rarity === "rare") {
    parts.push(`<circle cx="${size - 10}" cy="10" r="6" fill="#ffd700" opacity="0.85"/>`);
    parts.push(`<text x="${size - 10}" y="14" font-size="8" text-anchor="middle" fill="#000">R</text>`);
  }
  return parts;
}

// ---- Monster ID label ----
function idLabel(monster, size, theme) {
  return [`<text x="5" y="${size - 4}" font-size="7" fill="${theme.accent}" opacity="0.6" font-family="monospace">#${String(monster.id).padStart(3, "0")}</text>`];
}

// ============================================================
// Main entry: generate full SVG for a monster
// ============================================================
function getMonsterSVG(monster, size = 80) {
  if (!monster) return "";
  const primaryType = monster.types[0];
  const theme = SPRITE_TYPE_THEMES[primaryType] || SPRITE_TYPE_THEMES.Normal;

  const id = monster.id;
  const bgGradId = `bg_${id}`;
  const bodyGradId = `bd_${id}`;
  const shadowId = `sh_${id}`;

  // Darken body color for gradient bottom
  function darkenHex(hex, amount) {
    const num = parseInt(hex.replace("#",""), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  const parts = [];

  // ---- SVG defs: gradients + drop shadow filter ----
  parts.push(`<defs>
    <radialGradient id="${bgGradId}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${theme.bg2}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </radialGradient>
    <linearGradient id="${bodyGradId}" x1="20%" y1="10%" x2="80%" y2="95%">
      <stop offset="0%" stop-color="${theme.light}"/>
      <stop offset="48%" stop-color="${theme.body}"/>
      <stop offset="100%" stop-color="${darkenHex(theme.body, 38)}"/>
    </linearGradient>
    <filter id="${shadowId}" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5" flood-color="#000" flood-opacity="0.45"/>
    </filter>
  </defs>`);

  // Background
  parts.push(`<rect width="${size}" height="${size}" rx="10" fill="url(#${bgGradId})"/>`);

  // Subtle background pattern
  parts.push(...bgPattern(theme, id, size));

  // Soft glow around creature area
  parts.push(`<circle cx="${size * 0.5}" cy="${size * 0.52}" r="${size * 0.36}" fill="${theme.glow}" opacity="0.07"/>`);

  // ---- Creature group with drop shadow ----
  parts.push(`<g filter="url(#${shadowId})">`);

  // Draw creature based on archetype (id % 5)
  const archetype = id % 5;
  let creatureParts = [];
  if (archetype === 0) {
    creatureParts = drawQuadruped(id, theme, size, bodyGradId);
  } else if (archetype === 1) {
    creatureParts = drawBipedal(id, theme, size, bodyGradId);
  } else if (archetype === 2) {
    creatureParts = drawAvian(id, theme, size, bodyGradId);
  } else if (archetype === 3) {
    creatureParts = drawSerpentine(id, theme, size, bodyGradId);
  } else {
    creatureParts = drawCroucher(id, theme, size, bodyGradId);
  }
  parts.push(...creatureParts);
  parts.push(`</g>`);

  // Body markings overlay
  parts.push(...bodyMarkings(primaryType, id, theme, size));

  // Type-specific decorations (layered OVER the creature)
  parts.push(...typeDecorations(primaryType, id, theme, size));

  // Legendary sparkles
  if (monster.rarity === "legendary") {
    parts.push(...legendarySparkles(monster, theme, size));
  }

  // Secondary type badge (bottom-right)
  const secType = monster.types[1];
  if (secType) {
    const secTheme = SPRITE_TYPE_THEMES[secType] || SPRITE_TYPE_THEMES.Normal;
    parts.push(`<circle cx="${size - 10}" cy="${size - 10}" r="7" fill="${secTheme.accent}" opacity="0.85"/>`);
  }

  // Rarity sparkle badge
  parts.push(...rarityBadge(monster, size));

  // ID label
  parts.push(...idLabel(monster, size, theme));

  // Border
  parts.push(`<rect width="${size}" height="${size}" rx="10" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.4"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${parts.join("")}</svg>`;
}

// Get sprite as data URL for use in img src
function getMonsterSpriteURL(monster, size = 80) {
  const svg = getMonsterSVG(monster, size);
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// Render a monster sprite into a DOM element
function renderMonsterSprite(container, monster, size = 80) {
  if (!container || !monster) return;
  const img = document.createElement("img");
  img.src = getMonsterSpriteURL(monster, size);
  img.width = size;
  img.height = size;
  img.alt = monster.name;
  img.style.imageRendering = "auto";
  container.innerHTML = "";
  container.appendChild(img);
}
