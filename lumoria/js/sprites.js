// ============================================================
// LUMORIA - Monster SVG Sprite Generator
// Each monster gets a unique illustrated card based on type+ID
// ============================================================

const SPRITE_TYPE_THEMES = {
  Fire:     { bg1:'#3d1200', bg2:'#7a2a00', accent:'#ff6b35', glow:'#ff4500', symbol:'🔥' },
  Water:    { bg1:'#001a3d', bg2:'#003080', accent:'#4da6ff', glow:'#00bfff', symbol:'💧' },
  Grass:    { bg1:'#0a2a0a', bg2:'#1a5c1a', accent:'#4caf50', glow:'#66bb6a', symbol:'🌿' },
  Electric: { bg1:'#2a2200', bg2:'#5c4d00', accent:'#ffd700', glow:'#ffff00', symbol:'⚡' },
  Ground:   { bg1:'#2a1a00', bg2:'#5c3d00', accent:'#c8a045', glow:'#daa520', symbol:'🪨' },
  Wind:     { bg1:'#001a2a', bg2:'#003d5c', accent:'#7ec8e3', glow:'#b0e0e6', symbol:'🌬️' },
  Ice:      { bg1:'#001f2a', bg2:'#003d52', accent:'#96d5d5', glow:'#e0ffff', symbol:'❄️' },
  Dark:     { bg1:'#0a0014', bg2:'#1e0033', accent:'#9b59b6', glow:'#6a0dad', symbol:'🌑' },
  Fairy:    { bg1:'#2a001a', bg2:'#5c0038', accent:'#ff69b4', glow:'#ffb6c1', symbol:'✨' },
  Steel:    { bg1:'#1a1a1a', bg2:'#3d3d3d', accent:'#9e9e9e', glow:'#c0c0c0', symbol:'⚙️' },
  Poison:   { bg1:'#1a0033', bg2:'#38006b', accent:'#ab47bc', glow:'#ce93d8', symbol:'☠️' },
  Psychic:  { bg1:'#2a0014', bg2:'#5c002a', accent:'#ff4081', glow:'#f48fb1', symbol:'🔮' },
  Dragon:   { bg1:'#0f0038', bg2:'#1e006b', accent:'#7038f8', glow:'#bb86fc', symbol:'🐉' },
  Normal:   { bg1:'#1a1a14', bg2:'#3d3d2a', accent:'#a8a878', glow:'#c8c8a0', symbol:'⭐' },
  Rock:     { bg1:'#1a1400', bg2:'#3d2e00', accent:'#b8a038', glow:'#d4af37', symbol:'💎' },
  Bug:      { bg1:'#141a00', bg2:'#2e3d00', accent:'#a8b820', glow:'#c6ce50', symbol:'🦋' }
};

// Lighten a hex color by amount (0-100)
function lightenHex(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// Seeded pseudo-random using monster ID
function seededRand(id, salt) {
  const x = Math.sin(id * 9301 + salt * 49297 + 233) * 4096;
  return x - Math.floor(x);
}

// Generate the background pattern SVG elements
function bgPattern(theme, id, size) {
  const parts = [];
  const s = seededRand(id, 1);
  const patType = id % 4;

  if (patType === 0) {
    // Radial circles
    for (let i = 0; i < 3; i++) {
      const r = 8 + i * 12 + Math.floor(seededRand(id, i+10) * 6);
      const cx = size * (0.3 + seededRand(id, i+20) * 0.4);
      const cy = size * (0.3 + seededRand(id, i+30) * 0.4);
      parts.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.15"/>`);
    }
  } else if (patType === 1) {
    // Diagonal lines
    for (let i = -1; i < 5; i++) {
      const offset = i * 14 + Math.floor(s * 8);
      parts.push(`<line x1="${offset}" y1="0" x2="${offset + size}" y2="${size}" stroke="${theme.accent}" stroke-width="1" opacity="0.12"/>`);
    }
  } else if (patType === 2) {
    // Diamond grid
    for (let i = 0; i < 4; i++) {
      const bx = (i % 2) * size * 0.5 + size * 0.25;
      const by = Math.floor(i / 2) * size * 0.5 + size * 0.25;
      parts.push(`<polygon points="${bx},${by-10} ${bx+10},${by} ${bx},${by+10} ${bx-10},${by}" fill="${theme.accent}" opacity="0.08"/>`);
    }
  } else {
    // Hexagonal spots
    for (let i = 0; i < 5; i++) {
      const hx = size * (0.15 + seededRand(id, i+40) * 0.7);
      const hy = size * (0.15 + seededRand(id, i+50) * 0.7);
      const hr = 5 + seededRand(id, i+60) * 8;
      parts.push(`<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="${hr.toFixed(1)}" fill="${theme.accent}" opacity="0.1"/>`);
    }
  }
  return parts;
}

// Body shape variants
function monsterBody(id, cx, cy, size, theme) {
  const parts = [];
  const gradId = `grad_${id}`;
  const bodyType = id % 8;
  const bodySize = 22 + (id % 8);
  const light = lightenHex(theme.accent, 60);

  parts.push(`<defs>
    <radialGradient id="${gradId}" cx="38%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${light}" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </radialGradient>
  </defs>`);

  const stroke = theme.bg2;
  const fill = `url(#${gradId})`;

  if (bodyType <= 1) {
    // Circle
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${bodySize}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`);
  } else if (bodyType === 2) {
    // Tall oval
    parts.push(`<ellipse cx="${cx}" cy="${cy}" rx="${bodySize * 0.82}" ry="${bodySize}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`);
  } else if (bodyType === 3) {
    // Wide oval
    parts.push(`<ellipse cx="${cx}" cy="${cy}" rx="${bodySize}" ry="${bodySize * 0.82}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`);
  } else if (bodyType === 4) {
    // Rounded square
    const b = bodySize * 0.85;
    parts.push(`<rect x="${cx-b}" y="${cy-b}" width="${b*2}" height="${b*2}" rx="${b*0.4}" ry="${b*0.4}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`);
  } else if (bodyType === 5) {
    // Diamond
    parts.push(`<polygon points="${cx},${cy-bodySize} ${cx+bodySize*0.9},${cy} ${cx},${cy+bodySize*0.85} ${cx-bodySize*0.9},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`);
  } else if (bodyType === 6) {
    // Hexagon
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${(cx + bodySize * Math.cos(angle)).toFixed(1)},${(cy + bodySize * Math.sin(angle)).toFixed(1)}`);
    }
    parts.push(`<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`);
  } else {
    // Teardrop / egg shape
    const bh = bodySize * 1.1;
    const bw = bodySize * 0.85;
    parts.push(`<ellipse cx="${cx}" cy="${cy + bodySize * 0.08}" rx="${bw}" ry="${bh * 0.92}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`);
  }

  // Belly patch
  if (id % 3 !== 2) {
    const bellyLight = lightenHex(theme.accent, 80);
    parts.push(`<ellipse cx="${cx + bodySize * 0.05}" cy="${cy + bodySize * 0.25}" rx="${bodySize * 0.45}" ry="${bodySize * 0.35}" fill="${bellyLight}" opacity="0.22"/>`);
  }

  return parts;
}

// Eye styles
function monsterEyes(id, cx, cy, bodySize, primaryType) {
  const parts = [];
  const eyeStyle = id % 5;
  const eyeOffset = bodySize * 0.28;
  const eyeY = cy - bodySize * 0.1;
  const eyeColor = primaryType === 'Dark' ? '#cc44ff' :
                   primaryType === 'Fire' ? '#ffcc00' :
                   primaryType === 'Ice'  ? '#00ffff' :
                   primaryType === 'Psychic' ? '#ff44aa' :
                   primaryType === 'Electric' ? '#fff700' : '#ffffff';
  const pupilColor = '#000000';

  if (eyeStyle === 0) {
    // Round eyes
    parts.push(`<circle cx="${cx - eyeOffset}" cy="${eyeY}" r="4.5" fill="${eyeColor}"/>`);
    parts.push(`<circle cx="${cx + eyeOffset}" cy="${eyeY}" r="4.5" fill="${eyeColor}"/>`);
    parts.push(`<circle cx="${cx - eyeOffset + 1.5}" cy="${eyeY + 1}" r="2.5" fill="${pupilColor}"/>`);
    parts.push(`<circle cx="${cx + eyeOffset + 1.5}" cy="${eyeY + 1}" r="2.5" fill="${pupilColor}"/>`);
    parts.push(`<circle cx="${cx - eyeOffset + 0.8}" cy="${eyeY - 0.5}" r="1" fill="#ffffff" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx + eyeOffset + 0.8}" cy="${eyeY - 0.5}" r="1" fill="#ffffff" opacity="0.8"/>`);
  } else if (eyeStyle === 1) {
    // Oval eyes
    parts.push(`<ellipse cx="${cx - eyeOffset}" cy="${eyeY}" rx="5" ry="3.5" fill="${eyeColor}"/>`);
    parts.push(`<ellipse cx="${cx + eyeOffset}" cy="${eyeY}" rx="5" ry="3.5" fill="${eyeColor}"/>`);
    parts.push(`<ellipse cx="${cx - eyeOffset + 1}" cy="${eyeY + 0.5}" rx="2.5" ry="2" fill="${pupilColor}"/>`);
    parts.push(`<ellipse cx="${cx + eyeOffset + 1}" cy="${eyeY + 0.5}" rx="2.5" ry="2" fill="${pupilColor}"/>`);
    parts.push(`<circle cx="${cx - eyeOffset + 0.5}" cy="${eyeY - 0.5}" r="1" fill="#ffffff" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx + eyeOffset + 0.5}" cy="${eyeY - 0.5}" r="1" fill="#ffffff" opacity="0.8"/>`);
  } else if (eyeStyle === 2) {
    // Slit/cat eyes
    parts.push(`<ellipse cx="${cx - eyeOffset}" cy="${eyeY}" rx="4.5" ry="3.5" fill="${eyeColor}"/>`);
    parts.push(`<ellipse cx="${cx + eyeOffset}" cy="${eyeY}" rx="4.5" ry="3.5" fill="${eyeColor}"/>`);
    parts.push(`<ellipse cx="${cx - eyeOffset}" cy="${eyeY}" rx="1.2" ry="3" fill="${pupilColor}"/>`);
    parts.push(`<ellipse cx="${cx + eyeOffset}" cy="${eyeY}" rx="1.2" ry="3" fill="${pupilColor}"/>`);
    parts.push(`<circle cx="${cx - eyeOffset - 1}" cy="${eyeY - 1}" r="0.8" fill="#ffffff" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx + eyeOffset - 1}" cy="${eyeY - 1}" r="0.8" fill="#ffffff" opacity="0.8"/>`);
  } else if (eyeStyle === 3) {
    // Star-shaped pupils
    parts.push(`<circle cx="${cx - eyeOffset}" cy="${eyeY}" r="5" fill="${eyeColor}"/>`);
    parts.push(`<circle cx="${cx + eyeOffset}" cy="${eyeY}" r="5" fill="${eyeColor}"/>`);
    // Star pupils - simplified as cross
    for (const xo of [cx - eyeOffset, cx + eyeOffset]) {
      parts.push(`<line x1="${xo-2.5}" y1="${eyeY}" x2="${xo+2.5}" y2="${eyeY}" stroke="${pupilColor}" stroke-width="1.8"/>`);
      parts.push(`<line x1="${xo}" y1="${eyeY-2.5}" x2="${xo}" y2="${eyeY+2.5}" stroke="${pupilColor}" stroke-width="1.8"/>`);
    }
  } else {
    // X eyes (determined expression)
    parts.push(`<circle cx="${cx - eyeOffset}" cy="${eyeY}" r="4.5" fill="${eyeColor}"/>`);
    parts.push(`<circle cx="${cx + eyeOffset}" cy="${eyeY}" r="4.5" fill="${eyeColor}"/>`);
    for (const xo of [cx - eyeOffset, cx + eyeOffset]) {
      parts.push(`<line x1="${xo-2.5}" y1="${eyeY-2.5}" x2="${xo+2.5}" y2="${eyeY+2.5}" stroke="${pupilColor}" stroke-width="1.8"/>`);
      parts.push(`<line x1="${xo+2.5}" y1="${eyeY-2.5}" x2="${xo-2.5}" y2="${eyeY+2.5}" stroke="${pupilColor}" stroke-width="1.8"/>`);
    }
  }
  return parts;
}

// Mouth styles
function monsterMouth(id, cx, cy, bodySize) {
  const parts = [];
  const mouthStyle = id % 4;
  const mY = cy + bodySize * 0.32;
  const mColor = '#000000';

  if (mouthStyle === 0) {
    // Smile
    parts.push(`<path d="M ${cx - 6} ${mY} Q ${cx} ${mY + 5} ${cx + 6} ${mY}" fill="none" stroke="${mColor}" stroke-width="1.8" stroke-linecap="round"/>`);
  } else if (mouthStyle === 1) {
    // Grin with teeth
    parts.push(`<path d="M ${cx - 7} ${mY} Q ${cx} ${mY + 7} ${cx + 7} ${mY}" fill="${mColor}" stroke="${mColor}" stroke-width="1.5"/>`);
    parts.push(`<rect x="${cx - 4}" y="${mY}" width="3" height="3" fill="#ffffff"/>`);
    parts.push(`<rect x="${cx}" y="${mY}" width="3" height="3" fill="#ffffff"/>`);
  } else if (mouthStyle === 2) {
    // Frown/serious
    parts.push(`<path d="M ${cx - 6} ${mY + 4} Q ${cx} ${mY - 1} ${cx + 6} ${mY + 4}" fill="none" stroke="${mColor}" stroke-width="1.8" stroke-linecap="round"/>`);
  } else {
    // Open circle mouth
    parts.push(`<circle cx="${cx}" cy="${mY + 2}" r="4" fill="${mColor}"/>`);
    parts.push(`<circle cx="${cx}" cy="${mY + 2}" r="2.5" fill="#880000"/>`);
  }
  return parts;
}

// Type-specific decorations (horns, spikes, aura effects)
function typeDecorations(theme, id, cx, cy, bodySize, primaryType) {
  const parts = [];
  const decType = id % 6;

  // Ear/horn shapes based on type
  if (primaryType === 'Fire') {
    // Flame wisps above head
    parts.push(`<path d="M ${cx - 10} ${cy - bodySize} Q ${cx - 14} ${cy - bodySize - 12} ${cx - 8} ${cy - bodySize - 8}" fill="${theme.accent}" opacity="0.8"/>`);
    parts.push(`<path d="M ${cx} ${cy - bodySize} Q ${cx - 4} ${cy - bodySize - 16} ${cx + 2} ${cy - bodySize - 10}" fill="${lightenHex(theme.accent, 40)}" opacity="0.8"/>`);
    parts.push(`<path d="M ${cx + 10} ${cy - bodySize} Q ${cx + 14} ${cy - bodySize - 12} ${cx + 8} ${cy - bodySize - 8}" fill="${theme.accent}" opacity="0.8"/>`);
  } else if (primaryType === 'Water') {
    // Water droplets
    parts.push(`<ellipse cx="${cx - 12}" cy="${cy - bodySize + 2}" rx="4" ry="6" fill="${theme.accent}" opacity="0.7" transform="rotate(-15, ${cx-12}, ${cy-bodySize+2})"/>`);
    parts.push(`<ellipse cx="${cx + 12}" cy="${cy - bodySize + 2}" rx="4" ry="6" fill="${theme.accent}" opacity="0.7" transform="rotate(15, ${cx+12}, ${cy-bodySize+2})"/>`);
  } else if (primaryType === 'Electric') {
    // Lighting bolt ears
    parts.push(`<polygon points="${cx-18},${cy-bodySize+4} ${cx-12},${cy-bodySize-8} ${cx-9},${cy-bodySize+1} ${cx-5},${cy-bodySize-10}" fill="${theme.accent}" opacity="0.9"/>`);
    parts.push(`<polygon points="${cx+18},${cy-bodySize+4} ${cx+12},${cy-bodySize-8} ${cx+9},${cy-bodySize+1} ${cx+5},${cy-bodySize-10}" fill="${theme.accent}" opacity="0.9"/>`);
  } else if (primaryType === 'Ice') {
    // Ice crystal spikes
    parts.push(`<polygon points="${cx-8},${cy-bodySize} ${cx-12},${cy-bodySize-14} ${cx-4},${cy-bodySize-2}" fill="${theme.accent}" opacity="0.8"/>`);
    parts.push(`<polygon points="${cx},${cy-bodySize} ${cx},${cy-bodySize-16} ${cx+4},${cy-bodySize-2}" fill="${lightenHex(theme.accent, 30)}" opacity="0.8"/>`);
    parts.push(`<polygon points="${cx+8},${cy-bodySize} ${cx+12},${cy-bodySize-14} ${cx+4},${cy-bodySize-2}" fill="${theme.accent}" opacity="0.8"/>`);
  } else if (primaryType === 'Dark') {
    // Dark aura wisps
    parts.push(`<path d="M ${cx-16} ${cy-bodySize-2} Q ${cx-20} ${cy-bodySize-14} ${cx-10} ${cy-bodySize-8}" fill="${theme.accent}" opacity="0.6"/>`);
    parts.push(`<path d="M ${cx+16} ${cy-bodySize-2} Q ${cx+20} ${cy-bodySize-14} ${cx+10} ${cy-bodySize-8}" fill="${theme.accent}" opacity="0.6"/>`);
  } else if (primaryType === 'Grass') {
    // Leaf ears
    parts.push(`<ellipse cx="${cx-14}" cy="${cy-bodySize-4}" rx="5" ry="10" fill="${theme.accent}" opacity="0.8" transform="rotate(-25, ${cx-14}, ${cy-bodySize-4})"/>`);
    parts.push(`<ellipse cx="${cx+14}" cy="${cy-bodySize-4}" rx="5" ry="10" fill="${theme.accent}" opacity="0.8" transform="rotate(25, ${cx+14}, ${cy-bodySize-4})"/>`);
  } else if (primaryType === 'Dragon') {
    // Dragon horns
    parts.push(`<polygon points="${cx-8},${cy-bodySize+4} ${cx-14},${cy-bodySize-14} ${cx-4},${cy-bodySize-2}" fill="${theme.accent}" opacity="0.9"/>`);
    parts.push(`<polygon points="${cx+8},${cy-bodySize+4} ${cx+14},${cy-bodySize-14} ${cx+4},${cy-bodySize-2}" fill="${theme.accent}" opacity="0.9"/>`);
  } else if (primaryType === 'Fairy') {
    // Star sparkles
    for (let i = 0; i < 3; i++) {
      const sx = cx - 18 + i * 18;
      const sy = cy - bodySize - 6 + (i % 2) * 4;
      parts.push(`<text x="${sx}" y="${sy}" font-size="8" text-anchor="middle" fill="${theme.accent}" opacity="0.9">✦</text>`);
    }
  } else if (primaryType === 'Psychic') {
    // Psychic rings
    parts.push(`<circle cx="${cx}" cy="${cy-bodySize-6}" r="10" fill="none" stroke="${theme.accent}" stroke-width="2" opacity="0.5"/>`);
    parts.push(`<circle cx="${cx}" cy="${cy-bodySize-6}" r="6" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.4"/>`);
  } else if (primaryType === 'Steel') {
    // Metal bolts
    parts.push(`<rect x="${cx-16}" y="${cy-bodySize-6}" width="7" height="10" rx="2" fill="${theme.accent}" opacity="0.7"/>`);
    parts.push(`<rect x="${cx+9}" y="${cy-bodySize-6}" width="7" height="10" rx="2" fill="${theme.accent}" opacity="0.7"/>`);
  } else if (primaryType === 'Wind') {
    // Wind swirls
    parts.push(`<path d="M ${cx-14} ${cy-bodySize-2} Q ${cx-6} ${cy-bodySize-12} ${cx} ${cy-bodySize-6} Q ${cx+6} ${cy-bodySize} ${cx+14} ${cy-bodySize-8}" fill="none" stroke="${theme.accent}" stroke-width="2" opacity="0.7"/>`);
  } else if (primaryType === 'Poison') {
    // Poison orb bubbles
    parts.push(`<circle cx="${cx-14}" cy="${cy-bodySize-2}" r="5" fill="${theme.accent}" opacity="0.6"/>`);
    parts.push(`<circle cx="${cx+14}" cy="${cy-bodySize-2}" r="5" fill="${theme.accent}" opacity="0.6"/>`);
    parts.push(`<circle cx="${cx}" cy="${cy-bodySize-10}" r="4" fill="${lightenHex(theme.accent, 40)}" opacity="0.6"/>`);
  } else if (primaryType === 'Bug') {
    // Antennae
    parts.push(`<line x1="${cx-8}" y1="${cy-bodySize+2}" x2="${cx-16}" y2="${cy-bodySize-14}" stroke="${theme.accent}" stroke-width="2" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx-16}" cy="${cy-bodySize-14}" r="3" fill="${theme.accent}" opacity="0.9"/>`);
    parts.push(`<line x1="${cx+8}" y1="${cy-bodySize+2}" x2="${cx+16}" y2="${cy-bodySize-14}" stroke="${theme.accent}" stroke-width="2" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx+16}" cy="${cy-bodySize-14}" r="3" fill="${theme.accent}" opacity="0.9"/>`);
  } else if (primaryType === 'Ground') {
    // Rock chunks
    parts.push(`<polygon points="${cx-18},${cy-bodySize+4} ${cx-12},${cy-bodySize-8} ${cx-6},${cy-bodySize+2}" fill="${theme.accent}" opacity="0.7"/>`);
    parts.push(`<polygon points="${cx+18},${cy-bodySize+4} ${cx+12},${cy-bodySize-8} ${cx+6},${cy-bodySize+2}" fill="${theme.accent}" opacity="0.7"/>`);
  } else {
    // Normal: round ears
    parts.push(`<circle cx="${cx-16}" cy="${cy-bodySize+2}" r="6" fill="${theme.accent}" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx+16}" cy="${cy-bodySize+2}" r="6" fill="${theme.accent}" opacity="0.8"/>`);
    parts.push(`<circle cx="${cx-16}" cy="${cy-bodySize+2}" r="3.5" fill="${lightenHex(theme.accent, 50)}" opacity="0.7"/>`);
    parts.push(`<circle cx="${cx+16}" cy="${cy-bodySize+2}" r="3.5" fill="${lightenHex(theme.accent, 50)}" opacity="0.7"/>`);
  }
  return parts;
}

// Tail decorations
function monsterTail(id, cx, cy, bodySize, theme) {
  const parts = [];
  if (id % 2 === 0) return parts; // Only some monsters have visible tails
  const tailStyle = id % 3;
  const tc = theme.accent;

  if (tailStyle === 0) {
    // Curved tail
    parts.push(`<path d="M ${cx + bodySize * 0.8} ${cy + bodySize * 0.5} Q ${cx + bodySize * 1.4} ${cy + bodySize * 0.1} ${cx + bodySize * 1.2} ${cy - bodySize * 0.3}" fill="none" stroke="${tc}" stroke-width="4" stroke-linecap="round" opacity="0.9"/>`);
    parts.push(`<circle cx="${cx + bodySize * 1.2}" cy="${cy - bodySize * 0.3}" r="5" fill="${tc}" opacity="0.9"/>`);
  } else if (tailStyle === 1) {
    // Spiky tail
    parts.push(`<polygon points="${cx+bodySize*0.7},${cy+bodySize*0.5} ${cx+bodySize*1.3},${cy+bodySize*0.3} ${cx+bodySize*1.1},${cy+bodySize*0.8}" fill="${tc}" opacity="0.8"/>`);
  } else {
    // Wavy tail
    parts.push(`<path d="M ${cx + bodySize * 0.8} ${cy + bodySize * 0.4} Q ${cx + bodySize * 1.2} ${cy + bodySize * 0.1} ${cx + bodySize * 1.0} ${cy - bodySize * 0.15} Q ${cx + bodySize * 0.8} ${cy - bodySize * 0.4} ${cx + bodySize * 1.1} ${cy - bodySize * 0.55}" fill="none" stroke="${tc}" stroke-width="3.5" stroke-linecap="round" opacity="0.85"/>`);
  }
  return parts;
}

// Rarity sparkle/crown
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

// Monster ID label (bottom-left)
function idLabel(monster, size, theme) {
  return [`<text x="5" y="${size - 4}" font-size="7" fill="${theme.accent}" opacity="0.6" font-family="monospace">#${String(monster.id).padStart(3,'0')}</text>`];
}

// Main entry: generate full SVG for a monster
function getMonsterSVG(monster, size = 80) {
  if (!monster) return '';
  const primaryType = monster.types[0];
  const theme = SPRITE_TYPE_THEMES[primaryType] || SPRITE_TYPE_THEMES.Normal;
  const cx = size / 2;
  const cy = size / 2 + 2;
  const bodySize = 20 + (monster.id % 8);

  const parts = [];

  // Background gradient
  const bgGradId = `bg_${monster.id}`;
  parts.push(`<defs>
    <radialGradient id="${bgGradId}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${theme.bg2}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </radialGradient>
  </defs>`);
  parts.push(`<rect width="${size}" height="${size}" rx="10" fill="url(#${bgGradId})"/>`);

  // Glow ring around body
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${bodySize + 13}" fill="${theme.glow}" opacity="0.08"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${bodySize + 9}" fill="${theme.glow}" opacity="0.07"/>`);

  // Background decorative pattern
  parts.push(...bgPattern(theme, monster.id, size));

  // Type decorations (ears, horns, etc.)
  parts.push(...typeDecorations(theme, monster.id, cx, cy, bodySize, primaryType));

  // Tail (behind body)
  parts.push(...monsterTail(monster.id, cx, cy, bodySize, theme));

  // Main body
  parts.push(...monsterBody(monster.id, cx, cy, size, theme));

  // Eyes
  parts.push(...monsterEyes(monster.id, cx, cy, bodySize, primaryType));

  // Mouth
  parts.push(...monsterMouth(monster.id, cx, cy, bodySize));

  // Type badge overlay (small, bottom-right)
  const secType = monster.types[1];
  if (secType) {
    const secTheme = SPRITE_TYPE_THEMES[secType] || SPRITE_TYPE_THEMES.Normal;
    parts.push(`<circle cx="${size - 10}" cy="${size - 10}" r="7" fill="${secTheme.accent}" opacity="0.85"/>`);
  }

  // Rarity sparkle
  parts.push(...rarityBadge(monster, size));

  // ID label
  parts.push(...idLabel(monster, size, theme));

  // Border
  parts.push(`<rect width="${size}" height="${size}" rx="10" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.35"/>`);

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
