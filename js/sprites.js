// ============================================================
// LUMORIA - Monster SVG Sprite Generator v2 (Creature Edition)
// Monsters are drawn as actual creatures: quadrupeds, bipeds,
// avians, serpents, and crouchers — with heads, limbs, markings.
// ============================================================

const SPRITE_TYPE_THEMES = {
  Fire:     { bg1:'#3d1200', bg2:'#7a2a00', accent:'#ff6b35', glow:'#ff4500', body:'#c84010', mark:'#ffcc44', outline:'#5a1200' },
  Water:    { bg1:'#001a3d', bg2:'#003080', accent:'#4da6ff', glow:'#00bfff', body:'#1864b8', mark:'#88ccff', outline:'#001840' },
  Grass:    { bg1:'#0a2a0a', bg2:'#1a5c1a', accent:'#4caf50', glow:'#66bb6a', body:'#267826', mark:'#90ee60', outline:'#082808' },
  Electric: { bg1:'#2a2200', bg2:'#5c4d00', accent:'#ffd700', glow:'#ffff00', body:'#c8a000', mark:'#fffaaa', outline:'#3c3000' },
  Ground:   { bg1:'#2a1a00', bg2:'#5c3d00', accent:'#c8a045', glow:'#daa520', body:'#8a6010', mark:'#e8c870', outline:'#3c2400' },
  Wind:     { bg1:'#001a2a', bg2:'#003d5c', accent:'#7ec8e3', glow:'#b0e0e6', body:'#3a8aa8', mark:'#b8eeff', outline:'#002030' },
  Ice:      { bg1:'#001f2a', bg2:'#003d52', accent:'#96d5d5', glow:'#e0ffff', body:'#48a8be', mark:'#d8ffff', outline:'#002030' },
  Dark:     { bg1:'#0a0014', bg2:'#1e0033', accent:'#9b59b6', glow:'#6a0dad', body:'#481068', mark:'#bb88ee', outline:'#0a0018' },
  Fairy:    { bg1:'#2a001a', bg2:'#5c0038', accent:'#ff69b4', glow:'#ffb6c1', body:'#d03880', mark:'#ffaadd', outline:'#3e0020' },
  Steel:    { bg1:'#1a1a1a', bg2:'#3d3d3d', accent:'#9e9e9e', glow:'#c0c0c0', body:'#5e6e7e', mark:'#c8d8e8', outline:'#181818' },
  Poison:   { bg1:'#1a0033', bg2:'#38006b', accent:'#ab47bc', glow:'#ce93d8', body:'#6a1090', mark:'#cc66dd', outline:'#200040' },
  Psychic:  { bg1:'#2a0014', bg2:'#5c002a', accent:'#ff4081', glow:'#f48fb1', body:'#b00840', mark:'#ff88bb', outline:'#380010' },
  Dragon:   { bg1:'#0f0038', bg2:'#1e006b', accent:'#7038f8', glow:'#bb86fc', body:'#3810b0', mark:'#9870ff', outline:'#080020' },
  Normal:   { bg1:'#1a1a14', bg2:'#3d3d2a', accent:'#a8a878', glow:'#c8c8a0', body:'#686850', mark:'#c8c8a0', outline:'#1a1a10' },
  Rock:     { bg1:'#1a1400', bg2:'#3d2e00', accent:'#b8a038', glow:'#d4af37', body:'#806018', mark:'#d0b050', outline:'#281c00' },
  Bug:      { bg1:'#141a00', bg2:'#2e3d00', accent:'#a8b820', glow:'#c6ce50', body:'#587000', mark:'#c0d830', outline:'#1e2800' }
};

function lightenHex(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function seededRand(id, salt) {
  const x = Math.sin(id * 9301 + salt * 49297 + 233) * 4096;
  return x - Math.floor(x);
}

// ---- Archetype 0: Quadruped (dog/cat/wolf/lizard) ----
function drawQuadruped(id, theme, size) {
  const parts = [];
  const olf = theme.outline, col = theme.body, mark = theme.mark;
  const s = size;

  // Tail (draw behind body)
  const tailStyle = id % 3;
  const tailX = s * 0.76, tailY = s * 0.5;
  if (tailStyle === 0) {
    // Curled up tail
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.92} ${tailY - s*0.08} ${s*0.88} ${tailY - s*0.2} Q ${s*0.82} ${tailY - s*0.32} ${s*0.72} ${tailY - s*0.18}" fill="none" stroke="${olf}" stroke-width="7" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.92} ${tailY - s*0.08} ${s*0.88} ${tailY - s*0.2} Q ${s*0.82} ${tailY - s*0.32} ${s*0.72} ${tailY - s*0.18}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`);
  } else if (tailStyle === 1) {
    // Spiky tail
    parts.push(`<path d="M ${tailX} ${tailY} L ${s*0.9} ${tailY + s*0.06} L ${s*0.96} ${tailY - s*0.04} L ${s*0.9} ${tailY - s*0.12}" fill="${col}" stroke="${olf}" stroke-width="1.5" stroke-linejoin="round"/>`);
  } else {
    // Wavy tail
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.9} ${tailY + s*0.06} ${s*0.88} ${tailY - s*0.06} Q ${s*0.86} ${tailY - s*0.18} ${s*0.92} ${tailY - s*0.24}" fill="none" stroke="${olf}" stroke-width="7" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${tailX} ${tailY} Q ${s*0.9} ${tailY + s*0.06} ${s*0.88} ${tailY - s*0.06} Q ${s*0.86} ${tailY - s*0.18} ${s*0.92} ${tailY - s*0.24}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`);
  }

  // Back legs
  const legY = s * 0.6;
  const legH = s * 0.24, legW = s * 0.09;
  // Back-left leg
  parts.push(`<rect x="${s*0.56}" y="${legY}" width="${legW}" height="${legH}" rx="${legW*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);
  parts.push(`<ellipse cx="${s*0.56 + legW*0.5}" cy="${legY + legH}" rx="${legW*0.75}" ry="${legW*0.4}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  // Back-right leg
  parts.push(`<rect x="${s*0.68}" y="${legY}" width="${legW}" height="${legH}" rx="${legW*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);
  parts.push(`<ellipse cx="${s*0.68 + legW*0.5}" cy="${legY + legH}" rx="${legW*0.75}" ry="${legW*0.4}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);

  // Body (horizontal oval)
  const bodyX = s * 0.5, bodyY = s * 0.52;
  const bRx = s * 0.3, bRy = s * 0.18;
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY}" rx="${bRx}" ry="${bRy}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
  // Belly highlight
  parts.push(`<ellipse cx="${bodyX + s*0.04}" cy="${bodyY + bRy*0.3}" rx="${bRx*0.55}" ry="${bRy*0.5}" fill="${lightenHex(col, 55)}" opacity="0.3"/>`);

  // Front legs
  // Front-left
  parts.push(`<rect x="${s*0.22}" y="${legY}" width="${legW}" height="${legH}" rx="${legW*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);
  parts.push(`<ellipse cx="${s*0.22 + legW*0.5}" cy="${legY + legH}" rx="${legW*0.75}" ry="${legW*0.4}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  // Front-right
  parts.push(`<rect x="${s*0.34}" y="${legY}" width="${legW}" height="${legH}" rx="${legW*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);
  parts.push(`<ellipse cx="${s*0.34 + legW*0.5}" cy="${legY + legH}" rx="${legW*0.75}" ry="${legW*0.4}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);

  // Neck connecting body to head
  parts.push(`<path d="M ${s*0.24} ${bodyY + bRy*0.4} L ${s*0.22} ${s*0.36} L ${s*0.38} ${s*0.35} L ${s*0.38} ${bodyY - bRy*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);

  // Head (circle, forward-leaning position)
  const headX = s * 0.27, headY = s * 0.29;
  const headR = s * 0.235;
  parts.push(`<circle cx="${headX}" cy="${headY}" r="${headR}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
  parts.push(`<ellipse cx="${headX - headR*0.12}" cy="${headY - headR*0.18}" rx="${headR*0.52}" ry="${headR*0.4}" fill="${lightenHex(col, 50)}" opacity="0.28"/>`);

  // Muzzle
  const muzzleX = headX + headR * 0.35, muzzleY = headY + headR * 0.32;
  parts.push(`<ellipse cx="${muzzleX}" cy="${muzzleY}" rx="${headR*0.45}" ry="${headR*0.3}" fill="${lightenHex(col, 38)}" stroke="${olf}" stroke-width="1.5"/>`);
  // Nose
  parts.push(`<ellipse cx="${muzzleX + headR*0.1}" cy="${muzzleY - headR*0.06}" rx="3" ry="2" fill="${olf}"/>`);

  // Mouth
  const mStyle = id % 3;
  if (mStyle === 0) {
    parts.push(`<path d="M ${muzzleX - headR*0.25} ${muzzleY + headR*0.12} Q ${muzzleX} ${muzzleY + headR*0.25} ${muzzleX + headR*0.25} ${muzzleY + headR*0.12}" fill="none" stroke="${olf}" stroke-width="1.5" stroke-linecap="round"/>`);
  } else if (mStyle === 1) {
    parts.push(`<path d="M ${muzzleX - headR*0.25} ${muzzleY + headR*0.1} Q ${muzzleX} ${muzzleY + headR*0.3} ${muzzleX + headR*0.25} ${muzzleY + headR*0.1}" fill="${olf}"/>`);
    parts.push(`<rect x="${muzzleX - headR*0.15}" y="${muzzleY + headR*0.1}" width="${headR*0.14}" height="${headR*0.12}" fill="#fff"/>`);
    parts.push(`<rect x="${muzzleX + headR*0.02}" y="${muzzleY + headR*0.1}" width="${headR*0.14}" height="${headR*0.12}" fill="#fff"/>`);
  } else {
    parts.push(`<path d="M ${muzzleX - headR*0.2} ${muzzleY + headR*0.2} Q ${muzzleX} ${muzzleY + headR*0.08} ${muzzleX + headR*0.2} ${muzzleY + headR*0.2}" fill="none" stroke="${olf}" stroke-width="1.5" stroke-linecap="round"/>`);
  }

  // Eyes (forward-looking, two visible)
  const eyeY = headY - headR * 0.1;
  const eyeLX = headX - headR * 0.3, eyeRX = headX + headR * 0.08;
  const eyeR = headR * 0.22;
  for (const ex of [eyeLX, eyeRX]) {
    parts.push(`<circle cx="${ex}" cy="${eyeY}" r="${eyeR}" fill="#fff"/>`);
    parts.push(`<circle cx="${ex + eyeR*0.22}" cy="${eyeY + eyeR*0.1}" r="${eyeR*0.6}" fill="#111"/>`);
    parts.push(`<circle cx="${ex - eyeR*0.08}" cy="${eyeY - eyeR*0.22}" r="${eyeR*0.24}" fill="#fff" opacity="0.9"/>`);
  }

  return parts;
}

// ---- Archetype 1: Bipedal (standing creature) ----
function drawBipedal(id, theme, size) {
  const parts = [];
  const olf = theme.outline, col = theme.body;
  const s = size;

  // Legs (behind body)
  const legW = s * 0.11, legH = s * 0.24;
  const legTopY = s * 0.6;
  // Left leg
  parts.push(`<rect x="${s*0.29}" y="${legTopY}" width="${legW}" height="${legH}" rx="${legW*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.8"/>`);
  parts.push(`<ellipse cx="${s*0.29 + legW*0.5}" cy="${legTopY + legH}" rx="${legW*0.8}" ry="${legW*0.35}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  // Right leg
  parts.push(`<rect x="${s*0.6}" y="${legTopY}" width="${legW}" height="${legH}" rx="${legW*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.8"/>`);
  parts.push(`<ellipse cx="${s*0.6 + legW*0.5}" cy="${legTopY + legH}" rx="${legW*0.8}" ry="${legW*0.35}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);

  // Arms
  const armY = s * 0.5;
  const armW = s * 0.09, armH = s * 0.16;
  // Left arm (angled out)
  parts.push(`<rect x="${s*0.17}" y="${armY}" width="${armW}" height="${armH}" rx="${armW*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.8" transform="rotate(-20,${s*0.17 + armW*0.5},${armY})"/>`);
  // Right arm (angled out)
  parts.push(`<rect x="${s*0.74}" y="${armY}" width="${armW}" height="${armH}" rx="${armW*0.5}" fill="${col}" stroke="${olf}" stroke-width="1.8" transform="rotate(20,${s*0.74 + armW*0.5},${armY})"/>`);

  // Body / torso (oval)
  const bodyX = s * 0.5, bodyY = s * 0.52;
  const bRx = s * 0.19, bRy = s * 0.2;
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY}" rx="${bRx}" ry="${bRy}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY + bRy*0.28}" rx="${bRx*0.62}" ry="${bRy*0.52}" fill="${lightenHex(col, 55)}" opacity="0.3"/>`);

  // Neck
  parts.push(`<rect x="${bodyX - 7}" y="${bodyY - bRy - 7}" width="14" height="11" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);

  // Head (circle)
  const headX = s * 0.5, headY = s * 0.28;
  const headR = s * 0.235;
  parts.push(`<circle cx="${headX}" cy="${headY}" r="${headR}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
  parts.push(`<ellipse cx="${headX - headR*0.18}" cy="${headY - headR*0.2}" rx="${headR*0.55}" ry="${headR*0.42}" fill="${lightenHex(col, 55)}" opacity="0.26"/>`);

  // Eyes (centered, large and expressive)
  const eyeY = headY - headR * 0.06;
  const eyeOff = headR * 0.38;
  const eyeR = headR * 0.25;
  for (const exo of [-eyeOff, eyeOff]) {
    parts.push(`<circle cx="${headX + exo}" cy="${eyeY}" r="${eyeR}" fill="#fff"/>`);
    parts.push(`<circle cx="${headX + exo + eyeR*0.24}" cy="${eyeY + eyeR*0.12}" r="${eyeR*0.58}" fill="#111"/>`);
    parts.push(`<circle cx="${headX + exo - eyeR*0.08}" cy="${eyeY - eyeR*0.24}" r="${eyeR*0.24}" fill="#fff" opacity="0.9"/>`);
  }

  // Mouth
  const mY = headY + headR * 0.44;
  const mStyle = id % 3;
  if (mStyle === 0) {
    parts.push(`<path d="M ${headX - 7} ${mY} Q ${headX} ${mY + 6} ${headX + 7} ${mY}" fill="none" stroke="${olf}" stroke-width="2" stroke-linecap="round"/>`);
  } else if (mStyle === 1) {
    parts.push(`<path d="M ${headX - 8} ${mY} Q ${headX} ${mY + 8} ${headX + 8} ${mY}" fill="${olf}"/>`);
    parts.push(`<rect x="${headX - 5}" y="${mY}" width="4" height="3.5" fill="#fff"/>`);
    parts.push(`<rect x="${headX + 1}" y="${mY}" width="4" height="3.5" fill="#fff"/>`);
  } else {
    parts.push(`<path d="M ${headX - 6} ${mY + 4} Q ${headX} ${mY - 1} ${headX + 6} ${mY + 4}" fill="none" stroke="${olf}" stroke-width="2" stroke-linecap="round"/>`);
  }

  return parts;
}

// ---- Archetype 2: Avian (bird/flying creature) ----
function drawAvian(id, theme, size) {
  const parts = [];
  const olf = theme.outline, col = theme.body, mark = theme.mark;
  const s = size;

  // Wing flap position
  const wPos = id % 3; // 0=up, 1=mid, 2=down
  const wLift = wPos === 0 ? -0.12 : wPos === 1 ? 0 : 0.08;

  // Left wing
  parts.push(`<path d="M ${s*0.38} ${s*0.47} Q ${s*0.2} ${s*(0.38 + wLift)} ${s*0.08} ${s*(0.52 + wLift*0.5)} Q ${s*0.2} ${s*0.52} ${s*0.36} ${s*0.58}" fill="${col}" stroke="${olf}" stroke-width="2.5"/>`);
  // Wing feather detail
  parts.push(`<path d="M ${s*0.35} ${s*0.5} Q ${s*0.22} ${s*(0.47 + wLift)} ${s*0.12} ${s*(0.56 + wLift*0.4)}" fill="none" stroke="${mark}" stroke-width="1.5" opacity="0.55"/>`);
  parts.push(`<path d="M ${s*0.34} ${s*0.54} Q ${s*0.24} ${s*(0.52 + wLift*0.5)} ${s*0.15} ${s*(0.59 + wLift*0.3)}" fill="none" stroke="${mark}" stroke-width="1" opacity="0.4"/>`);

  // Right wing
  parts.push(`<path d="M ${s*0.62} ${s*0.47} Q ${s*0.8} ${s*(0.38 + wLift)} ${s*0.92} ${s*(0.52 + wLift*0.5)} Q ${s*0.8} ${s*0.52} ${s*0.64} ${s*0.58}" fill="${col}" stroke="${olf}" stroke-width="2.5"/>`);
  parts.push(`<path d="M ${s*0.65} ${s*0.5} Q ${s*0.78} ${s*(0.47 + wLift)} ${s*0.88} ${s*(0.56 + wLift*0.4)}" fill="none" stroke="${mark}" stroke-width="1.5" opacity="0.55"/>`);
  parts.push(`<path d="M ${s*0.66} ${s*0.54} Q ${s*0.76} ${s*(0.52 + wLift*0.5)} ${s*0.85} ${s*(0.59 + wLift*0.3)}" fill="none" stroke="${mark}" stroke-width="1" opacity="0.4"/>`);

  // Body (egg-shaped)
  const bodyX = s * 0.5, bodyY = s * 0.53;
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY}" rx="${s*0.17}" ry="${s*0.2}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY + s*0.04}" rx="${s*0.1}" ry="${s*0.12}" fill="${lightenHex(col, 55)}" opacity="0.3"/>`);

  // Neck
  parts.push(`<rect x="${bodyX - 7}" y="${bodyY - s*0.22}" width="14" height="12" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);

  // Head
  const headX = s * 0.5, headY = s * 0.28;
  const headR = s * 0.215;
  parts.push(`<circle cx="${headX}" cy="${headY}" r="${headR}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
  parts.push(`<ellipse cx="${headX - headR*0.15}" cy="${headY - headR*0.2}" rx="${headR*0.5}" ry="${headR*0.38}" fill="${lightenHex(col, 55)}" opacity="0.24"/>`);

  // Beak
  if (id % 2 === 0) {
    // Downward-curving beak (raptor style)
    parts.push(`<path d="M ${headX - 5} ${headY + headR*0.3} L ${headX + headR*0.9} ${headY + headR*0.1} L ${headX + headR*0.6} ${headY + headR*0.5}" fill="${mark}" stroke="${olf}" stroke-width="1.5"/>`);
  } else {
    // Straight pointed beak
    parts.push(`<path d="M ${headX - 4} ${headY + headR*0.25} L ${headX + headR} ${headY + headR*0.35} L ${headX - 4} ${headY + headR*0.5}" fill="${mark}" stroke="${olf}" stroke-width="1.5"/>`);
  }

  // Eyes
  const eyeY = headY - headR * 0.08;
  const eyeR = headR * 0.23;
  const eyeLX = headX - headR * 0.34, eyeRX = headX + headR * 0.12;
  for (const ex of [eyeLX, eyeRX]) {
    parts.push(`<circle cx="${ex}" cy="${eyeY}" r="${eyeR}" fill="#fff"/>`);
    parts.push(`<circle cx="${ex + eyeR*0.24}" cy="${eyeY + eyeR*0.1}" r="${eyeR*0.6}" fill="#111"/>`);
    parts.push(`<circle cx="${ex - eyeR*0.08}" cy="${eyeY - eyeR*0.25}" r="${eyeR*0.26}" fill="#fff" opacity="0.9"/>`);
  }

  // Talons / feet
  const fY = bodyY + s * 0.22;
  const fX1 = bodyX - s * 0.08, fX2 = bodyX + s * 0.08;
  for (const fx of [fX1, fX2]) {
    parts.push(`<path d="M ${fx} ${fY} L ${fx - 8} ${fY + 8} M ${fx} ${fY} L ${fx} ${fY + 10} M ${fx} ${fY} L ${fx + 8} ${fY + 8}" stroke="${olf}" stroke-width="2.5" stroke-linecap="round"/>`);
  }

  return parts;
}

// ---- Archetype 3: Serpentine (snake/worm/eel) ----
function drawSerpentine(id, theme, size) {
  const parts = [];
  const olf = theme.outline, col = theme.body;
  const s = size;

  const curvetype = id % 2;
  if (curvetype === 0) {
    // S-curve shape
    // Outline pass (darker, slightly thicker)
    parts.push(`<path d="M ${s*0.62} ${s*0.8} Q ${s*0.78} ${s*0.68} ${s*0.68} ${s*0.54} Q ${s*0.52} ${s*0.38} ${s*0.58} ${s*0.22}" fill="none" stroke="${olf}" stroke-width="22" stroke-linecap="round"/>`);
    // Color pass
    parts.push(`<path d="M ${s*0.62} ${s*0.8} Q ${s*0.78} ${s*0.68} ${s*0.68} ${s*0.54} Q ${s*0.52} ${s*0.38} ${s*0.58} ${s*0.22}" fill="none" stroke="${col}" stroke-width="18" stroke-linecap="round"/>`);
    // Belly stripe (lighter)
    parts.push(`<path d="M ${s*0.62} ${s*0.8} Q ${s*0.74} ${s*0.68} ${s*0.66} ${s*0.54} Q ${s*0.52} ${s*0.38} ${s*0.56} ${s*0.22}" fill="none" stroke="${lightenHex(col, 65)}" stroke-width="7" stroke-linecap="round" opacity="0.4"/>`);
    // Tail tip
    parts.push(`<path d="M ${s*0.62} ${s*0.8} L ${s*0.56} ${s*0.88}" fill="none" stroke="${olf}" stroke-width="12" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${s*0.62} ${s*0.8} L ${s*0.56} ${s*0.88}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round"/>`);
    // Head
    const hx = s * 0.58, hy = s * 0.18;
    parts.push(`<circle cx="${hx}" cy="${hy}" r="${s*0.17}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
    parts.push(`<ellipse cx="${hx - s*0.04}" cy="${hy - s*0.04}" rx="${s*0.09}" ry="${s*0.07}" fill="${lightenHex(col, 55)}" opacity="0.28"/>`);
    // Eyes
    const eyeR = s * 0.038;
    parts.push(`<circle cx="${hx - s*0.06}" cy="${hy - s*0.02}" r="${eyeR}" fill="#fff"/>`);
    parts.push(`<circle cx="${hx + s*0.04}" cy="${hy - s*0.02}" r="${eyeR}" fill="#fff"/>`);
    parts.push(`<ellipse cx="${hx - s*0.055}" cy="${hy - s*0.018}" rx="${eyeR*0.5}" ry="${eyeR*0.75}" fill="#111"/>`);
    parts.push(`<ellipse cx="${hx + s*0.045}" cy="${hy - s*0.018}" rx="${eyeR*0.5}" ry="${eyeR*0.75}" fill="#111"/>`);
    parts.push(`<circle cx="${hx - s*0.068}" cy="${hy - s*0.04}" r="${eyeR*0.28}" fill="#fff" opacity="0.9"/>`);
    parts.push(`<circle cx="${hx + s*0.028}" cy="${hy - s*0.04}" r="${eyeR*0.28}" fill="#fff" opacity="0.9"/>`);
    // Forked tongue
    parts.push(`<path d="M ${hx + s*0.14} ${hy + s*0.06} L ${hx + s*0.2} ${hy + s*0.04} M ${hx + s*0.2} ${hy + s*0.04} L ${hx + s*0.24} ${hy + s*0.01} M ${hx + s*0.2} ${hy + s*0.04} L ${hx + s*0.24} ${hy + s*0.08}" stroke="#cc1111" stroke-width="1.8" stroke-linecap="round"/>`);
  } else {
    // Coiled shape
    parts.push(`<path d="M ${s*0.5} ${s*0.76} Q ${s*0.8} ${s*0.76} ${s*0.8} ${s*0.5} Q ${s*0.8} ${s*0.26} ${s*0.5} ${s*0.26} Q ${s*0.26} ${s*0.26} ${s*0.26} ${s*0.48}" fill="none" stroke="${olf}" stroke-width="24" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${s*0.5} ${s*0.76} Q ${s*0.8} ${s*0.76} ${s*0.8} ${s*0.5} Q ${s*0.8} ${s*0.26} ${s*0.5} ${s*0.26} Q ${s*0.26} ${s*0.26} ${s*0.26} ${s*0.48}" fill="none" stroke="${col}" stroke-width="20" stroke-linecap="round"/>`);
    parts.push(`<path d="M ${s*0.5} ${s*0.76} Q ${s*0.76} ${s*0.76} ${s*0.76} ${s*0.5} Q ${s*0.76} ${s*0.3} ${s*0.5} ${s*0.3}" fill="none" stroke="${lightenHex(col, 65)}" stroke-width="8" stroke-linecap="round" opacity="0.38"/>`);
    // Head at open end
    const hx = s * 0.26, hy = s * 0.42;
    parts.push(`<circle cx="${hx}" cy="${hy}" r="${s*0.16}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
    parts.push(`<ellipse cx="${hx - s*0.03}" cy="${hy - s*0.04}" rx="${s*0.08}" ry="${s*0.06}" fill="${lightenHex(col, 55)}" opacity="0.26"/>`);
    const eyeR = s * 0.036;
    parts.push(`<circle cx="${hx - s*0.04}" cy="${hy - s*0.04}" r="${eyeR}" fill="#fff"/>`);
    parts.push(`<circle cx="${hx + s*0.06}" cy="${hy - s*0.04}" r="${eyeR}" fill="#fff"/>`);
    parts.push(`<ellipse cx="${hx - s*0.035}" cy="${hy - s*0.038}" rx="${eyeR*0.5}" ry="${eyeR*0.75}" fill="#111"/>`);
    parts.push(`<ellipse cx="${hx + s*0.065}" cy="${hy - s*0.038}" rx="${eyeR*0.5}" ry="${eyeR*0.75}" fill="#111"/>`);
    parts.push(`<circle cx="${hx - s*0.055}" cy="${hy - s*0.056}" r="${eyeR*0.26}" fill="#fff" opacity="0.9"/>`);
    parts.push(`<circle cx="${hx + s*0.046}" cy="${hy - s*0.056}" r="${eyeR*0.26}" fill="#fff" opacity="0.9"/>`);
    // Forked tongue
    parts.push(`<path d="M ${hx - s*0.14} ${hy + s*0.02} L ${hx - s*0.2} ${hy} M ${hx - s*0.2} ${hy} L ${hx - s*0.25} ${hy - s*0.04} M ${hx - s*0.2} ${hy} L ${hx - s*0.25} ${hy + s*0.04}" stroke="#cc1111" stroke-width="1.8" stroke-linecap="round"/>`);
  }

  return parts;
}

// ---- Archetype 4: Croucher (frog/toad/crab wide stance) ----
function drawCroucher(id, theme, size) {
  const parts = [];
  const olf = theme.outline, col = theme.body;
  const s = size;

  // Wide splayed hind legs
  const legY = s * 0.58;
  // Hind-left leg
  parts.push(`<path d="M ${s*0.3} ${legY} Q ${s*0.14} ${legY + s*0.1} ${s*0.1} ${legY + s*0.22}" fill="none" stroke="${olf}" stroke-width="13" stroke-linecap="round"/>`);
  parts.push(`<path d="M ${s*0.3} ${legY} Q ${s*0.14} ${legY + s*0.1} ${s*0.1} ${legY + s*0.22}" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="${s*0.09}" cy="${legY + s*0.23}" rx="${s*0.09}" ry="${s*0.04}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);
  // Hind-right leg
  parts.push(`<path d="M ${s*0.7} ${legY} Q ${s*0.86} ${legY + s*0.1} ${s*0.9} ${legY + s*0.22}" fill="none" stroke="${olf}" stroke-width="13" stroke-linecap="round"/>`);
  parts.push(`<path d="M ${s*0.7} ${legY} Q ${s*0.86} ${legY + s*0.1} ${s*0.9} ${legY + s*0.22}" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="${s*0.91}" cy="${legY + s*0.23}" rx="${s*0.09}" ry="${s*0.04}" fill="${col}" stroke="${olf}" stroke-width="1.5"/>`);

  // Stubby front legs
  // Front-left
  parts.push(`<path d="M ${s*0.36} ${legY + s*0.04} Q ${s*0.26} ${legY + s*0.14} ${s*0.24} ${legY + s*0.2}" fill="none" stroke="${olf}" stroke-width="10" stroke-linecap="round"/>`);
  parts.push(`<path d="M ${s*0.36} ${legY + s*0.04} Q ${s*0.26} ${legY + s*0.14} ${s*0.24} ${legY + s*0.2}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="${s*0.24}" cy="${legY + s*0.22}" rx="${s*0.07}" ry="${s*0.035}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  // Front-right
  parts.push(`<path d="M ${s*0.64} ${legY + s*0.04} Q ${s*0.74} ${legY + s*0.14} ${s*0.76} ${legY + s*0.2}" fill="none" stroke="${olf}" stroke-width="10" stroke-linecap="round"/>`);
  parts.push(`<path d="M ${s*0.64} ${legY + s*0.04} Q ${s*0.74} ${legY + s*0.14} ${s*0.76} ${legY + s*0.2}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round"/>`);
  parts.push(`<ellipse cx="${s*0.76}" cy="${legY + s*0.22}" rx="${s*0.07}" ry="${s*0.035}" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);

  // Body (low, wide)
  const bodyX = s * 0.5, bodyY = s * 0.52;
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY}" rx="${s*0.32}" ry="${s*0.19}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
  parts.push(`<ellipse cx="${bodyX}" cy="${bodyY + s*0.04}" rx="${s*0.22}" ry="${s*0.12}" fill="${lightenHex(col, 55)}" opacity="0.32"/>`);

  // Head (large, wide)
  const headX = s * 0.5, headY = s * 0.31;
  parts.push(`<ellipse cx="${headX}" cy="${headY}" rx="${s*0.28}" ry="${s*0.19}" fill="${col}" stroke="${olf}" stroke-width="3"/>`);
  parts.push(`<ellipse cx="${headX}" cy="${headY - s*0.04}" rx="${s*0.16}" ry="${s*0.1}" fill="${lightenHex(col, 55)}" opacity="0.26"/>`);

  // Eyes (bulging, on top of head)
  const eyeOff = s * 0.17;
  const eyeTopY = headY - s * 0.1;
  const eyeR = s * 0.08;
  for (const exo of [-eyeOff, eyeOff]) {
    parts.push(`<circle cx="${headX + exo}" cy="${eyeTopY}" r="${eyeR}" fill="${col}" stroke="${olf}" stroke-width="2"/>`);
    parts.push(`<circle cx="${headX + exo}" cy="${eyeTopY}" r="${eyeR * 0.72}" fill="#fff"/>`);
    parts.push(`<circle cx="${headX + exo + eyeR*0.22}" cy="${eyeTopY + eyeR*0.1}" r="${eyeR * 0.4}" fill="#111"/>`);
    parts.push(`<circle cx="${headX + exo - eyeR*0.12}" cy="${eyeTopY - eyeR*0.26}" r="${eyeR * 0.2}" fill="#fff" opacity="0.9"/>`);
  }

  // Wide mouth
  const mY = headY + s * 0.08;
  const mStyle = id % 3;
  if (mStyle === 0) {
    parts.push(`<path d="M ${headX - s*0.2} ${mY} Q ${headX} ${mY + s*0.08} ${headX + s*0.2} ${mY}" fill="none" stroke="${olf}" stroke-width="2.5" stroke-linecap="round"/>`);
  } else if (mStyle === 1) {
    parts.push(`<path d="M ${headX - s*0.2} ${mY} Q ${headX} ${mY + s*0.1} ${headX + s*0.2} ${mY}" fill="${olf}"/>`);
    parts.push(`<path d="M ${headX - s*0.17} ${mY} Q ${headX} ${mY + s*0.04} ${headX + s*0.17} ${mY}" fill="#660000"/>`);
  } else {
    parts.push(`<path d="M ${headX - s*0.16} ${mY + s*0.04} Q ${headX} ${mY} ${headX + s*0.16} ${mY + s*0.04}" fill="none" stroke="${olf}" stroke-width="2.2" stroke-linecap="round"/>`);
  }

  return parts;
}

// ---- Type-specific decorations (horns, ears, fins, etc.) ----
function typeDecorations(primaryType, id, theme, size) {
  const parts = [];
  const col = theme.accent, olf = theme.outline, mark = theme.mark;
  const s = size;
  // Head center (approximate, works for all archetypes)
  const cx = s * 0.5, headTopY = s * 0.1;

  if (primaryType === 'Fire') {
    // Flame wisps
    parts.push(`<path d="M ${cx - 14} ${headTopY + 4} Q ${cx - 20} ${headTopY - 10} ${cx - 12} ${headTopY - 5}" fill="${col}" opacity="0.9"/>`);
    parts.push(`<path d="M ${cx} ${headTopY + 2} Q ${cx - 3} ${headTopY - 14} ${cx + 5} ${headTopY - 8}" fill="${lightenHex(col, 40)}" opacity="0.9"/>`);
    parts.push(`<path d="M ${cx + 14} ${headTopY + 4} Q ${cx + 20} ${headTopY - 10} ${cx + 12} ${headTopY - 5}" fill="${col}" opacity="0.9"/>`);
  } else if (primaryType === 'Water') {
    // Fin crest
    parts.push(`<path d="M ${cx - 10} ${headTopY + 6} Q ${cx} ${headTopY - 8} ${cx + 10} ${headTopY + 6}" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.85"/>`);
    parts.push(`<path d="M ${cx - 6} ${headTopY + 8} Q ${cx} ${headTopY} ${cx + 6} ${headTopY + 8}" fill="${mark}" opacity="0.5"/>`);
  } else if (primaryType === 'Electric') {
    // Lightning bolt ears
    parts.push(`<polygon points="${cx-22},${headTopY+10} ${cx-14},${headTopY-4} ${cx-10},${headTopY+5} ${cx-5},${headTopY-9}" fill="${col}" opacity="0.95"/>`);
    parts.push(`<polygon points="${cx+22},${headTopY+10} ${cx+14},${headTopY-4} ${cx+10},${headTopY+5} ${cx+5},${headTopY-9}" fill="${col}" opacity="0.95"/>`);
  } else if (primaryType === 'Ice') {
    // Ice crystal spikes
    parts.push(`<polygon points="${cx-10},${headTopY+6} ${cx-14},${headTopY-8} ${cx-5},${headTopY+4}" fill="${col}" opacity="0.85"/>`);
    parts.push(`<polygon points="${cx},${headTopY+5} ${cx},${headTopY-10} ${cx+6},${headTopY+3}" fill="${lightenHex(col, 30)}" opacity="0.85"/>`);
    parts.push(`<polygon points="${cx+10},${headTopY+6} ${cx+14},${headTopY-8} ${cx+5},${headTopY+4}" fill="${col}" opacity="0.85"/>`);
  } else if (primaryType === 'Dark') {
    // Curved dark horns
    parts.push(`<path d="M ${cx - 16} ${headTopY + 8} Q ${cx - 24} ${headTopY - 8} ${cx - 14} ${headTopY - 4}" fill="${col}" stroke="${olf}" stroke-width="1" opacity="0.85"/>`);
    parts.push(`<path d="M ${cx + 16} ${headTopY + 8} Q ${cx + 24} ${headTopY - 8} ${cx + 14} ${headTopY - 4}" fill="${col}" stroke="${olf}" stroke-width="1" opacity="0.85"/>`);
    parts.push(`<circle cx="${cx}" cy="${s*0.32}" r="${s*0.26}" fill="none" stroke="${col}" stroke-width="2.5" opacity="0.14"/>`);
  } else if (primaryType === 'Grass') {
    // Leaf ears
    parts.push(`<ellipse cx="${cx - 18}" cy="${headTopY + 2}" rx="6" ry="12" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.85" transform="rotate(-25,${cx-18},${headTopY+2})"/>`);
    parts.push(`<ellipse cx="${cx + 18}" cy="${headTopY + 2}" rx="6" ry="12" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.85" transform="rotate(25,${cx+18},${headTopY+2})"/>`);
  } else if (primaryType === 'Dragon') {
    // Swept-back dragon horns
    parts.push(`<polygon points="${cx-8},${headTopY+8} ${cx-18},${headTopY-10} ${cx-4},${headTopY+2}" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.95"/>`);
    parts.push(`<polygon points="${cx+8},${headTopY+8} ${cx+18},${headTopY-10} ${cx+4},${headTopY+2}" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.95"/>`);
    parts.push(`<polygon points="${cx},${headTopY+6} ${cx+5},${headTopY-6} ${cx+10},${headTopY+4}" fill="${lightenHex(col, 30)}" opacity="0.8"/>`);
  } else if (primaryType === 'Fairy') {
    // Glowing star crown
    for (let i = 0; i < 3; i++) {
      const sx = cx - 18 + i * 18;
      const sy = headTopY - 2 + (i % 2) * 5;
      parts.push(`<circle cx="${sx}" cy="${sy}" r="5" fill="${col}" opacity="0.85"/>`);
      parts.push(`<circle cx="${sx}" cy="${sy}" r="3" fill="#fff" opacity="0.6"/>`);
    }
  } else if (primaryType === 'Psychic') {
    // Psychic halo rings
    parts.push(`<ellipse cx="${cx}" cy="${headTopY - 2}" rx="20" ry="5" fill="none" stroke="${col}" stroke-width="2.5" opacity="0.65"/>`);
    parts.push(`<ellipse cx="${cx}" cy="${headTopY - 2}" rx="14" ry="3.5" fill="none" stroke="${mark}" stroke-width="1.5" opacity="0.45"/>`);
  } else if (primaryType === 'Steel') {
    // Metal riveted bolts
    parts.push(`<rect x="${cx - 24}" y="${headTopY + 4}" width="9" height="12" rx="2" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.85"/>`);
    parts.push(`<rect x="${cx + 15}" y="${headTopY + 4}" width="9" height="12" rx="2" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.85"/>`);
  } else if (primaryType === 'Poison') {
    // Poison orb trio
    parts.push(`<circle cx="${cx - 18}" cy="${headTopY + 6}" r="6" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx + 18}" cy="${headTopY + 6}" r="6" fill="${col}" stroke="${olf}" stroke-width="1.5" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx}" cy="${headTopY - 4}" r="5" fill="${lightenHex(col, 40)}" stroke="${olf}" stroke-width="1.5" opacity="0.75"/>`);
  } else if (primaryType === 'Bug') {
    // Antennae with bulb tips
    parts.push(`<line x1="${cx - 8}" y1="${headTopY + 8}" x2="${cx - 18}" y2="${headTopY - 8}" stroke="${col}" stroke-width="2.5"/>`);
    parts.push(`<circle cx="${cx - 18}" cy="${headTopY - 8}" r="4" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
    parts.push(`<line x1="${cx + 8}" y1="${headTopY + 8}" x2="${cx + 18}" y2="${headTopY - 8}" stroke="${col}" stroke-width="2.5"/>`);
    parts.push(`<circle cx="${cx + 18}" cy="${headTopY - 8}" r="4" fill="${col}" stroke="${olf}" stroke-width="1.2"/>`);
  } else if (primaryType === 'Ground') {
    // Rocky brow plates
    parts.push(`<polygon points="${cx-20},${headTopY+10} ${cx-12},${headTopY-4} ${cx-6},${headTopY+8}" fill="${col}" opacity="0.8"/>`);
    parts.push(`<polygon points="${cx+20},${headTopY+10} ${cx+12},${headTopY-4} ${cx+6},${headTopY+8}" fill="${col}" opacity="0.8"/>`);
  } else if (primaryType === 'Wind') {
    // Wind swirl crest
    parts.push(`<path d="M ${cx - 20} ${headTopY + 8} Q ${cx - 8} ${headTopY - 10} ${cx} ${headTopY - 4} Q ${cx + 8} ${headTopY + 2} ${cx + 20} ${headTopY - 8}" fill="none" stroke="${col}" stroke-width="2.5" opacity="0.8"/>`);
    parts.push(`<path d="M ${cx - 16} ${headTopY + 10} Q ${cx - 6} ${headTopY - 6} ${cx + 2} ${headTopY} Q ${cx + 8} ${headTopY + 4} ${cx + 16} ${headTopY - 4}" fill="none" stroke="${mark}" stroke-width="1.5" opacity="0.5"/>`);
  } else if (primaryType === 'Normal') {
    // Round animal ears
    parts.push(`<circle cx="${cx - 18}" cy="${headTopY + 4}" r="8" fill="${col}" stroke="${olf}" stroke-width="1.8" opacity="0.9"/>`);
    parts.push(`<circle cx="${cx + 18}" cy="${headTopY + 4}" r="8" fill="${col}" stroke="${olf}" stroke-width="1.8" opacity="0.9"/>`);
    parts.push(`<circle cx="${cx - 18}" cy="${headTopY + 4}" r="5" fill="${mark}" opacity="0.6"/>`);
    parts.push(`<circle cx="${cx + 18}" cy="${headTopY + 4}" r="5" fill="${mark}" opacity="0.6"/>`);
  } else if (primaryType === 'Rock') {
    // Craggy boulder brow
    parts.push(`<path d="M ${cx - 22} ${headTopY + 10} Q ${cx - 14} ${headTopY - 6} ${cx - 6} ${headTopY + 8}" fill="${col}" opacity="0.82"/>`);
    parts.push(`<path d="M ${cx + 22} ${headTopY + 10} Q ${cx + 14} ${headTopY - 6} ${cx + 6} ${headTopY + 8}" fill="${col}" opacity="0.82"/>`);
  }

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
    parts.push(`<path d="M ${cx - s*0.11} ${s*0.44} Q ${cx} ${s*0.46} ${cx + s*0.11} ${s*0.44}" fill="none" stroke="${mark}" stroke-width="2.2" opacity="0.38"/>`);
    parts.push(`<path d="M ${cx - s*0.14} ${s*0.51} Q ${cx} ${s*0.53} ${cx + s*0.14} ${s*0.51}" fill="none" stroke="${mark}" stroke-width="2.2" opacity="0.35"/>`);
  } else if (markType === 1) {
    // Spots
    for (let i = 0; i < 4; i++) {
      const sx = s * (0.35 + seededRand(id, i + 70) * 0.3);
      const sy = s * (0.4 + seededRand(id, i + 80) * 0.2);
      parts.push(`<circle cx="${sx}" cy="${sy}" r="${2 + seededRand(id, i + 90) * 3.5}" fill="${mark}" opacity="0.32"/>`);
    }
  } else if (markType === 2) {
    // Diamond chevrons
    for (let i = 0; i < 2; i++) {
      const dx = cx - 8 + i * 16;
      const dy = s * 0.5;
      parts.push(`<polygon points="${dx},${dy - 6} ${dx + 5},${dy} ${dx},${dy + 6} ${dx - 5},${dy}" fill="${mark}" opacity="0.32"/>`);
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
      const cx = s * (0.28 + seededRand(id, i + 20) * 0.44);
      const cy = s * (0.28 + seededRand(id, i + 30) * 0.44);
      parts.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.09"/>`);
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

// ---- Rarity badge ----
function rarityBadge(monster, size) {
  const parts = [];
  if (monster.rarity === 'legendary') {
    parts.push(`<text x="${size - 10}" y="14" font-size="10" text-anchor="middle">⭐</text>`);
  } else if (monster.rarity === 'rare') {
    parts.push(`<circle cx="${size - 10}" cy="10" r="6" fill="#ffd700" opacity="0.85"/>`);
    parts.push(`<text x="${size - 10}" y="14" font-size="8" text-anchor="middle" fill="#000">R</text>`);
  }
  return parts;
}

// ---- Monster ID label ----
function idLabel(monster, size, theme) {
  return [`<text x="5" y="${size - 4}" font-size="7" fill="${theme.accent}" opacity="0.6" font-family="monospace">#${String(monster.id).padStart(3, '0')}</text>`];
}

// ============================================================
// Main entry: generate full SVG for a monster
// ============================================================
function getMonsterSVG(monster, size = 80) {
  if (!monster) return '';
  const primaryType = monster.types[0];
  const theme = SPRITE_TYPE_THEMES[primaryType] || SPRITE_TYPE_THEMES.Normal;
  const id = monster.id;

  const parts = [];
  const bgGradId = `bg_${id}`;
  const bdGradId = `bd_${id}`;
  const shadowId  = `sh_${id}`;
  const lightCol  = lightenHex(theme.body, 68);
  const deepCol   = lightenHex(theme.outline, 32);

  // Defs: background radial + body linear gradient + drop-shadow filter
  parts.push(`<defs>
    <radialGradient id="${bgGradId}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${theme.bg2}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </radialGradient>
    <linearGradient id="${bdGradId}" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%"   stop-color="${lightCol}"/>
      <stop offset="52%"  stop-color="${theme.body}"/>
      <stop offset="100%" stop-color="${deepCol}"/>
    </linearGradient>
    <filter id="${shadowId}" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5"
        flood-color="${theme.outline}" flood-opacity="0.55"/>
    </filter>
  </defs>`);

  parts.push(`<rect width="${size}" height="${size}" rx="10" fill="url(#${bgGradId})"/>`);

  // Background pattern
  parts.push(...bgPattern(theme, id, size));

  // Type glow (stronger for legendary)
  const glowOp = monster.rarity === 'legendary' ? 0.18 : 0.11;
  parts.push(`<ellipse cx="${size*0.5}" cy="${size*0.53}" rx="${size*0.4}" ry="${size*0.35}" fill="${theme.glow}" opacity="${glowOp}"/>`);

  // Legendary: outer aura ring
  if (monster.rarity === 'legendary') {
    parts.push(`<ellipse cx="${size*0.5}" cy="${size*0.53}" rx="${size*0.46}" ry="${size*0.42}" fill="none" stroke="${theme.accent}" stroke-width="2" opacity="0.28"/>`);
    parts.push(`<ellipse cx="${size*0.5}" cy="${size*0.53}" rx="${size*0.48}" ry="${size*0.44}" fill="none" stroke="${lightCol}" stroke-width="1" opacity="0.18"/>`);
  }

  // Draw creature, then apply gradient + shadow upgrades via string replace
  const creatureParts = [];
  const archetype = id % 5;
  if (archetype === 0)      creatureParts.push(...drawQuadruped(id, theme, size));
  else if (archetype === 1) creatureParts.push(...drawBipedal(id, theme, size));
  else if (archetype === 2) creatureParts.push(...drawAvian(id, theme, size));
  else if (archetype === 3) creatureParts.push(...drawSerpentine(id, theme, size));
  else                      creatureParts.push(...drawCroucher(id, theme, size));

  // Upgrade flat body fills → gradient, flat irises → themed color
  let creatureSVG = creatureParts.join('');
  creatureSVG = creatureSVG.split(`fill="${theme.body}"`).join(`fill="url(#${bdGradId})"`);
  creatureSVG = creatureSVG.split('fill="#111"').join(`fill="${theme.accent}"`);

  parts.push(`<g filter="url(#${shadowId})">${creatureSVG}</g>`);

  // Body markings overlay
  parts.push(...bodyMarkings(primaryType, id, theme, size));

  // Type-specific decorations
  parts.push(...typeDecorations(primaryType, id, theme, size));

  // Legendary sparkles scattered around
  if (monster.rarity === 'legendary') {
    for (let i = 0; i < 8; i++) {
      const sx = size * (0.08 + seededRand(id, i * 3)     * 0.84);
      const sy = size * (0.06 + seededRand(id, i * 3 + 1) * 0.88);
      const sr = 1.4 + seededRand(id, i * 3 + 2) * 2.2;
      parts.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${sr.toFixed(1)}" fill="${theme.accent}" opacity="0.75"/>`);
      parts.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(sr*0.45).toFixed(1)}" fill="#fff" opacity="0.85"/>`);
    }
  }

  // Secondary type badge (bottom-right)
  const secType = monster.types[1];
  if (secType) {
    const secTheme = SPRITE_TYPE_THEMES[secType] || SPRITE_TYPE_THEMES.Normal;
    parts.push(`<circle cx="${size - 10}" cy="${size - 10}" r="7" fill="${secTheme.accent}" opacity="0.9" stroke="${secTheme.outline}" stroke-width="1"/>`);
  }

  // Rarity badge
  parts.push(...rarityBadge(monster, size));

  // ID label
  parts.push(...idLabel(monster, size, theme));

  // Border
  parts.push(`<rect width="${size}" height="${size}" rx="10" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.45"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${parts.join('')}</svg>`;
}

// Get sprite as data URL for use in img src
function getMonsterSpriteURL(monster, size = 80) {
  const svg = getMonsterSVG(monster, size);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Render a monster sprite into a DOM element
function renderMonsterSprite(container, monster, size = 80) {
  if (!container || !monster) return;
  const img = document.createElement('img');
  img.src = getMonsterSpriteURL(monster, size);
  img.width = size;
  img.height = size;
  img.alt = monster.name;
  img.style.imageRendering = 'auto';
  container.innerHTML = '';
  container.appendChild(img);
}
