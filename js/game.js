// ============================================================
// LUMORIA - Main Game Logic & UI
// ============================================================

// ---- Game State ----
let G = null; // Global game state

function newGameState(playerName, starterMonsterId) {
  const starter = createPartySlot(starterMonsterId, 5);
  return {
    playerName,
    money: 3000,
    badges: [],
    defeatedLeaders: [],
    team: [starter],
    box: [],
    bag: { ...STARTING_BAG },
    location: "seedvale",
    seenMonsters: new Set([starterMonsterId]),
    caughtMonsters: new Set([starterMonsterId]),
    championDefeated: false,
    questsCompleted: [],
    questsActive: [],
    visitedLocations: ["seedvale"],
    defeatedTrainers: [],
    defeatedUmbraEncounters: [],
    defeatedLegendaries: [],
    saveTimestamp: Date.now()
  };
}

function createPartySlot(monsterId, level) {
  const def = MONSTERS_DATA[monsterId];
  const ivs = generateIVs();
  const maxHP = calcMaxHP(def.base.hp, level, ivs.hp);
  // Build initial moveset
  const known = def.learnset.filter(e => e[0] <= level).map(e => e[1]);
  const moves = known.slice(-4);
  if (moves.length === 0) moves.push("tackle");
  return {
    monsterId,
    nickname: null,
    level,
    xp: xpForLevel(level),
    maxHP,
    currentHP: maxHP,
    moves,
    status: null,
    heldItem: null,
    nature: getRandomNature(),
    ivs
  };
}

// ---- Save / Load ----
function saveGame() {
  if (!G) return;
  G.saveTimestamp = Date.now();
  const save = { ...G, seenMonsters: [...G.seenMonsters], caughtMonsters: [...G.caughtMonsters] };
  localStorage.setItem("lumoria_save", JSON.stringify(save));
  showNotification("Game saved! ✅");
}

function loadGame() {
  const raw = localStorage.getItem("lumoria_save");
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    data.seenMonsters = new Set(data.seenMonsters);
    data.caughtMonsters = new Set(data.caughtMonsters);
    // Ensure new fields exist for old saves
    if (!data.questsCompleted) data.questsCompleted = [];
    if (!data.questsActive) data.questsActive = [];
    if (!data.visitedLocations) data.visitedLocations = [data.location];
    if (!data.box) data.box = [];
    if (data.bag && data.bag.rareCandy === undefined) data.bag.rareCandy = 0;
    if (!data.defeatedTrainers) data.defeatedTrainers = [];
    if (!data.defeatedUmbraEncounters) data.defeatedUmbraEncounters = [];
    if (!data.defeatedLegendaries) data.defeatedLegendaries = [];
    // Add new evo items to existing bags
    const evoItems = ["fireStone","waterStone","leafStone","thunderStone","moonStone","sunStone","duskStone","dragonScale","steelCoating","prismShard"];
    if (data.bag) {
      for (const ei of evoItems) { if (data.bag[ei] === undefined) data.bag[ei] = 0; }
    }
    // Assign natures and IVs to existing mons that don't have them
    for (const mon of (data.team || [])) {
      if (!mon.nature) mon.nature = getRandomNature();
      if (!mon.ivs) mon.ivs = generateIVs();
    }
    for (const mon of (data.box || [])) {
      if (!mon.nature) mon.nature = getRandomNature();
      if (!mon.ivs) mon.ivs = generateIVs();
    }
    G = data;
    return true;
  } catch(e) { return false; }
}

function hasSave() {
  return !!localStorage.getItem("lumoria_save");
}

// ---- Screen Management ----
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

// ---- Notification Overlay ----
function showNotification(text, cb) {
  const overlay = document.getElementById("notification-overlay");
  document.getElementById("notification-text").innerHTML = text;
  overlay.classList.remove("hidden");
  document.getElementById("btn-notification-ok").onclick = () => {
    overlay.classList.add("hidden");
    if (cb) cb();
  };
}

// ---- Level Up Overlay ----
function showLevelUp(partySlot, levelUps, cb) {
  if (levelUps.length === 0) { if (cb) cb(); return; }
  const lu = levelUps.shift();
  const def = MONSTERS_DATA[partySlot.monsterId];
  const lv = lu.level;
  document.getElementById("levelup-overlay").classList.remove("hidden");
  document.getElementById("levelup-text").textContent =
    `${partySlot.nickname || def.name} reached Level ${lv}!`;
  const statsDiv = document.getElementById("levelup-stats");
  statsDiv.innerHTML = "";
  const pIvs = partySlot.ivs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
  const stats = [
    ["HP", calcMaxHP(def.base.hp, lv, pIvs.hp) - calcMaxHP(def.base.hp, lv-1, pIvs.hp)],
    ["ATK", calcStat(def.base.atk, lv, pIvs.atk) - calcStat(def.base.atk, lv-1, pIvs.atk)],
    ["DEF", calcStat(def.base.def, lv, pIvs.def) - calcStat(def.base.def, lv-1, pIvs.def)],
    ["SP.A", calcStat(def.base.spa, lv, pIvs.spa) - calcStat(def.base.spa, lv-1, pIvs.spa)],
    ["SP.D", calcStat(def.base.spd, lv, pIvs.spd) - calcStat(def.base.spd, lv-1, pIvs.spd)],
    ["SPE", calcStat(def.base.spe, lv, pIvs.spe) - calcStat(def.base.spe, lv-1, pIvs.spe)]
  ];
  for (const [name, gain] of stats) {
    const d = document.createElement("div");
    d.className = "levelup-stat";
    d.innerHTML = `<div class="levelup-stat-name">${name}</div><div class="levelup-stat-gain">+${gain}</div>`;
    statsDiv.appendChild(d);
  }
  if (lu.newMoves.length > 0) {
    const moveNames = lu.newMoves.map(m => MOVES_DATA[m]?.name || m).join(", ");
    document.getElementById("levelup-text").textContent +=
      `\nLearned: ${moveNames}!`;
  }
  document.getElementById("btn-levelup-ok").onclick = () => {
    document.getElementById("levelup-overlay").classList.add("hidden");
    // Check evolution after leveling
    const evoId = checkEvolution(partySlot);
    if (evoId) {
      showEvolution(partySlot, evoId, () => showLevelUp(partySlot, levelUps, cb));
    } else {
      showLevelUp(partySlot, levelUps, cb);
    }
  };
}

// ---- Evolution Overlay ----
function showEvolution(partySlot, newId, cb) {
  const oldDef = MONSTERS_DATA[partySlot.monsterId];
  const newDef = MONSTERS_DATA[newId];
  document.getElementById("evo-old-sprite").textContent = oldDef.emoji;
  document.getElementById("evo-new-sprite").textContent = newDef.emoji;
  document.getElementById("evo-title").textContent =
    `${partySlot.nickname || oldDef.name} evolved into ${newDef.name}!`;
  document.getElementById("evo-text").textContent = newDef.desc;
  document.getElementById("evolution-overlay").classList.remove("hidden");

  // Perform evolution
  const result = evolveMonster(partySlot);
  if (result) {
    G.seenMonsters.add(newId);
    G.caughtMonsters.add(newId);
  }

  document.getElementById("btn-evo-ok").onclick = () => {
    document.getElementById("evolution-overlay").classList.add("hidden");
    if (cb) cb();
  };
}

// ============================================================
// WORLD MAP - Pokemon-style SVG Region Map
// ============================================================

// Terrain biome definitions for Pokemon-style map background
// Each biome uses an organic SVG path (%) for natural coastline shapes
const BIOME_REGIONS = [
  // Main continent landmass - large organic shape
  { type:'land', color:'#4a9e52', shadow:'#357a3c', highlight:'#6abb6e',
    path:'M 8,18 C 5,16 3,20 3,28 C 3,40 4,55 5,65 C 6,78 8,88 14,92 C 22,96 38,97 52,94 C 62,92 68,86 70,78 C 72,70 68,62 62,56 C 60,54 58,50 60,46 C 63,40 68,38 72,34 C 78,28 82,22 80,16 C 78,12 72,10 65,10 C 56,10 48,12 40,14 C 32,16 22,18 15,18 Z' },
  // Southern peninsula - starter forest
  { type:'land', color:'#3d8a44', shadow:'#2d6e32', highlight:'#5aad5e',
    path:'M 5,62 C 3,60 2,65 3,72 C 4,80 6,88 12,92 C 18,95 28,96 36,94 C 42,92 48,88 50,82 C 52,76 50,70 46,66 C 42,62 36,60 28,60 C 20,60 12,61 5,62 Z' },
  // Volcanic eastern peninsula
  { type:'volcanic', color:'#8B4513', shadow:'#5a2d0e', highlight:'#a0622a',
    path:'M 62,20 C 58,18 56,22 58,28 C 60,34 64,38 70,36 C 76,34 82,28 84,22 C 86,16 82,12 76,12 C 70,12 66,16 62,20 Z' },
  // Ice/glacier northern region
  { type:'ice', color:'#7ab8c4', shadow:'#5a98a8', highlight:'#a0dce6',
    path:'M 6,8 C 4,6 3,10 4,16 C 5,22 8,26 14,28 C 20,30 28,28 34,24 C 38,22 42,18 42,14 C 42,10 38,6 32,4 C 26,2 18,3 12,6 C 10,7 8,8 6,8 Z' },
  // Thunder plains - top center
  { type:'plains', color:'#8a8e30', shadow:'#6a6e1c', highlight:'#aab240',
    path:'M 32,6 C 30,4 28,6 30,12 C 32,18 36,22 42,22 C 48,22 54,20 58,16 C 62,12 62,8 58,6 C 54,4 46,3 40,4 C 36,5 34,6 32,6 Z' },
  // Shadow/dark western region
  { type:'dark', color:'#2a1040', shadow:'#1a0828', highlight:'#3e1a5a',
    path:'M 4,32 C 3,30 2,34 3,40 C 4,48 6,54 10,56 C 14,58 18,56 20,52 C 22,48 22,42 20,38 C 18,34 14,32 10,32 C 8,32 6,32 4,32 Z' },
  // Mystic/psychic central zone
  { type:'mystic', color:'#2a2050', shadow:'#1a1238', highlight:'#3e3068',
    path:'M 20,48 C 18,46 16,48 18,54 C 20,60 24,62 30,62 C 36,62 40,58 42,54 C 44,50 42,46 38,44 C 34,42 28,42 24,44 C 22,46 21,47 20,48 Z' },
  // Dragon peak - central mountain
  { type:'mountain', color:'#4a3068', shadow:'#321e4a', highlight:'#624088',
    path:'M 46,36 C 44,34 42,36 44,42 C 46,46 50,48 54,46 C 58,44 60,40 60,36 C 60,34 58,32 54,32 C 50,32 48,34 46,36 Z' },
];

// Build SVG terrain patterns for Pokemon-style textures
function buildMapPatterns(svgNS, defs, mapW, mapH) {
  // Ocean wave pattern
  const oceanPat = document.createElementNS(svgNS, "pattern");
  oceanPat.setAttribute("id", "oceanPattern");
  oceanPat.setAttribute("width", "30");
  oceanPat.setAttribute("height", "20");
  oceanPat.setAttribute("patternUnits", "userSpaceOnUse");
  const wave1 = document.createElementNS(svgNS, "path");
  wave1.setAttribute("d", "M 0,10 Q 7.5,5 15,10 Q 22.5,15 30,10");
  wave1.setAttribute("stroke", "#2a7aaa");
  wave1.setAttribute("stroke-width", "0.8");
  wave1.setAttribute("fill", "none");
  wave1.setAttribute("opacity", "0.4");
  oceanPat.appendChild(wave1);
  const wave2 = document.createElementNS(svgNS, "path");
  wave2.setAttribute("d", "M 0,16 Q 7.5,11 15,16 Q 22.5,21 30,16");
  wave2.setAttribute("stroke", "#2a7aaa");
  wave2.setAttribute("stroke-width", "0.5");
  wave2.setAttribute("fill", "none");
  wave2.setAttribute("opacity", "0.25");
  oceanPat.appendChild(wave2);
  defs.appendChild(oceanPat);

  // Grass tuft pattern
  const grassPat = document.createElementNS(svgNS, "pattern");
  grassPat.setAttribute("id", "grassPattern");
  grassPat.setAttribute("width", "16");
  grassPat.setAttribute("height", "16");
  grassPat.setAttribute("patternUnits", "userSpaceOnUse");
  const grassBg = document.createElementNS(svgNS, "rect");
  grassBg.setAttribute("width", "16");
  grassBg.setAttribute("height", "16");
  grassBg.setAttribute("fill", "transparent");
  grassPat.appendChild(grassBg);
  // Small grass tufts
  for (const [gx, gy] of [[3,12],[11,6],[7,14],[13,10]]) {
    const tuft = document.createElementNS(svgNS, "path");
    tuft.setAttribute("d", `M ${gx},${gy} l -1,-3 l 1,1 l 1,-2 l 0.5,1.5 l 1,-2.5 l -0.5,3 Z`);
    tuft.setAttribute("fill", "#2d7a30");
    tuft.setAttribute("opacity", "0.35");
    grassPat.appendChild(tuft);
  }
  defs.appendChild(grassPat);

  // Mountain/rock texture pattern
  const mtnPat = document.createElementNS(svgNS, "pattern");
  mtnPat.setAttribute("id", "mountainPattern");
  mtnPat.setAttribute("width", "20");
  mtnPat.setAttribute("height", "18");
  mtnPat.setAttribute("patternUnits", "userSpaceOnUse");
  const peak = document.createElementNS(svgNS, "path");
  peak.setAttribute("d", "M 4,16 L 10,4 L 16,16 Z");
  peak.setAttribute("fill", "none");
  peak.setAttribute("stroke", "#ffffff");
  peak.setAttribute("stroke-width", "0.6");
  peak.setAttribute("opacity", "0.15");
  mtnPat.appendChild(peak);
  const snowCap = document.createElementNS(svgNS, "path");
  snowCap.setAttribute("d", "M 8,8 L 10,4 L 12,8 Z");
  snowCap.setAttribute("fill", "#ffffff");
  snowCap.setAttribute("opacity", "0.12");
  mtnPat.appendChild(snowCap);
  defs.appendChild(mtnPat);

  // Ice crystal pattern
  const icePat = document.createElementNS(svgNS, "pattern");
  icePat.setAttribute("id", "icePattern");
  icePat.setAttribute("width", "14");
  icePat.setAttribute("height", "14");
  icePat.setAttribute("patternUnits", "userSpaceOnUse");
  for (const [ix, iy] of [[4,4],[10,10]]) {
    const crystal = document.createElementNS(svgNS, "path");
    crystal.setAttribute("d", `M ${ix},${iy-2} L ${ix+1},${iy} L ${ix},${iy+2} L ${ix-1},${iy} Z`);
    crystal.setAttribute("fill", "#ffffff");
    crystal.setAttribute("opacity", "0.2");
    icePat.appendChild(crystal);
  }
  defs.appendChild(icePat);

  // Dark mist pattern
  const darkPat = document.createElementNS(svgNS, "pattern");
  darkPat.setAttribute("id", "darkPattern");
  darkPat.setAttribute("width", "20");
  darkPat.setAttribute("height", "20");
  darkPat.setAttribute("patternUnits", "userSpaceOnUse");
  const mist = document.createElementNS(svgNS, "circle");
  mist.setAttribute("cx", "10");
  mist.setAttribute("cy", "10");
  mist.setAttribute("r", "5");
  mist.setAttribute("fill", "#6a2aaa");
  mist.setAttribute("opacity", "0.1");
  darkPat.appendChild(mist);
  defs.appendChild(darkPat);

  // Volcanic lava crack pattern
  const lavaPat = document.createElementNS(svgNS, "pattern");
  lavaPat.setAttribute("id", "lavaPattern");
  lavaPat.setAttribute("width", "18");
  lavaPat.setAttribute("height", "18");
  lavaPat.setAttribute("patternUnits", "userSpaceOnUse");
  const crack = document.createElementNS(svgNS, "path");
  crack.setAttribute("d", "M 2,8 Q 6,4 9,9 Q 12,14 16,10");
  crack.setAttribute("stroke", "#ff4400");
  crack.setAttribute("stroke-width", "0.7");
  crack.setAttribute("fill", "none");
  crack.setAttribute("opacity", "0.3");
  lavaPat.appendChild(crack);
  defs.appendChild(lavaPat);

  // Sandy beach pattern (for coastlines)
  const sandPat = document.createElementNS(svgNS, "pattern");
  sandPat.setAttribute("id", "sandPattern");
  sandPat.setAttribute("width", "8");
  sandPat.setAttribute("height", "8");
  sandPat.setAttribute("patternUnits", "userSpaceOnUse");
  for (const [sx, sy] of [[2,2],[6,5],[4,7],[1,5]]) {
    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", String(sx));
    dot.setAttribute("cy", String(sy));
    dot.setAttribute("r", "0.5");
    dot.setAttribute("fill", "#d4b876");
    dot.setAttribute("opacity", "0.5");
    sandPat.appendChild(dot);
  }
  defs.appendChild(sandPat);
}

// Scale a path string from percentage coordinates to pixel coordinates
function scaleMapPath(pathStr, mapW, mapH) {
  return pathStr.replace(/([0-9]+\.?[0-9]*)/g, (match, num, offset) => {
    // Determine if this is an X or Y coordinate based on position in path commands
    const before = pathStr.substring(0, offset);
    const cmdMatch = before.match(/[MLCQZ\s,]/g);
    // Count numbers before this one to determine x vs y
    const nums = before.match(/[0-9]+\.?[0-9]*/g);
    const count = nums ? nums.length : 0;
    // In SVG path: after M/L/C/Q, coordinates alternate x,y
    const isX = count % 2 === 0;
    return String(Math.round((parseFloat(num) / 100) * (isX ? mapW : mapH)));
  });
}

// Zoom state
let mapZoom = 1;
const MAP_ZOOM_LEVELS = [1, 1.5, 2, 2.5];

function setMapZoom(level) {
  mapZoom = level;
  const mapEl = document.getElementById("world-map");
  const viewport = document.getElementById("world-map-viewport");
  if (!mapEl || !viewport) return;
  const baseW = viewport.clientWidth;
  const baseH = viewport.clientHeight;
  mapEl.style.width = (baseW * mapZoom) + "px";
  mapEl.style.height = (baseH * mapZoom) + "px";
  document.getElementById("btn-zoom-reset").textContent = mapZoom === 1 ? "1x" : mapZoom + "x";
  renderWorldMap();
}

function renderWorldMap() {
  const mapEl = document.getElementById("world-map");
  mapEl.innerHTML = "";
  const viewport = document.getElementById("world-map-viewport");
  const baseW = viewport ? viewport.clientWidth : 420;
  const baseH = viewport ? viewport.clientHeight : 320;
  const mapW = Math.round(baseW * mapZoom);
  const mapH = Math.round(baseH * mapZoom);
  mapEl.style.width = mapW + "px";
  mapEl.style.height = mapH + "px";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", mapW);
  svg.setAttribute("height", mapH);
  svg.setAttribute("viewBox", `0 0 ${mapW} ${mapH}`);
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.zIndex = "5";

  // Defs for patterns and gradients
  const defs = document.createElementNS(svgNS, "defs");
  svg.appendChild(defs);

  // Ocean gradient (deep to lighter blue, like Pokemon ocean)
  const oceanGrad = document.createElementNS(svgNS, "radialGradient");
  oceanGrad.setAttribute("id", "oceanGrad");
  oceanGrad.setAttribute("cx", "40%");
  oceanGrad.setAttribute("cy", "50%");
  oceanGrad.setAttribute("r", "60%");
  const os1 = document.createElementNS(svgNS, "stop");
  os1.setAttribute("offset", "0%");
  os1.setAttribute("stop-color", "#1a6a9a");
  const os2 = document.createElementNS(svgNS, "stop");
  os2.setAttribute("offset", "100%");
  os2.setAttribute("stop-color", "#0e3a5a");
  oceanGrad.appendChild(os1);
  oceanGrad.appendChild(os2);
  defs.appendChild(oceanGrad);

  // Build texture patterns
  buildMapPatterns(svgNS, defs, mapW, mapH);

  // Non-interactive background group
  const bgGroup = document.createElementNS(svgNS, "g");
  bgGroup.setAttribute("pointer-events", "none");
  svg.appendChild(bgGroup);

  // Ocean background with gradient
  const bgRect = document.createElementNS(svgNS, "rect");
  bgRect.setAttribute("width", mapW);
  bgRect.setAttribute("height", mapH);
  bgRect.setAttribute("fill", "url(#oceanGrad)");
  bgGroup.appendChild(bgRect);

  // Ocean wave overlay
  const waveRect = document.createElementNS(svgNS, "rect");
  waveRect.setAttribute("width", mapW);
  waveRect.setAttribute("height", mapH);
  waveRect.setAttribute("fill", "url(#oceanPattern)");
  bgGroup.appendChild(waveRect);

  // Render terrain biomes with organic shapes, shadows, highlights, and textures
  for (const b of BIOME_REGIONS) {
    const scaledPath = scaleMapPath(b.path, mapW, mapH);

    // Beach/sand border (slightly larger, behind the land)
    if (b.type === 'land') {
      const beach = document.createElementNS(svgNS, "path");
      beach.setAttribute("d", scaledPath);
      beach.setAttribute("fill", "#c8a860");
      beach.setAttribute("stroke", "#b89848");
      beach.setAttribute("stroke-width", "6");
      beach.setAttribute("opacity", "0.6");
      bgGroup.appendChild(beach);

      // Beach sand dots overlay
      const beachTex = document.createElementNS(svgNS, "path");
      beachTex.setAttribute("d", scaledPath);
      beachTex.setAttribute("fill", "url(#sandPattern)");
      beachTex.setAttribute("stroke", "none");
      beachTex.setAttribute("opacity", "0.5");
      // Make beach slightly bigger via stroke
      beachTex.setAttribute("stroke", "url(#sandPattern)");
      beachTex.setAttribute("stroke-width", "4");
      bgGroup.appendChild(beachTex);
    }

    // Drop shadow (offset darker shape behind terrain)
    const shadow = document.createElementNS(svgNS, "path");
    shadow.setAttribute("d", scaledPath);
    shadow.setAttribute("fill", b.shadow);
    shadow.setAttribute("transform", "translate(2, 3)");
    shadow.setAttribute("opacity", "0.5");
    bgGroup.appendChild(shadow);

    // Main terrain fill
    const terrain = document.createElementNS(svgNS, "path");
    terrain.setAttribute("d", scaledPath);
    terrain.setAttribute("fill", b.color);
    terrain.setAttribute("stroke", b.shadow);
    terrain.setAttribute("stroke-width", "1.5");
    bgGroup.appendChild(terrain);

    // Highlight edge (inner glow for 3D effect, like official Pokemon maps)
    const highlightPath = document.createElementNS(svgNS, "path");
    highlightPath.setAttribute("d", scaledPath);
    highlightPath.setAttribute("fill", "none");
    highlightPath.setAttribute("stroke", b.highlight);
    highlightPath.setAttribute("stroke-width", "1.5");
    highlightPath.setAttribute("opacity", "0.5");
    highlightPath.setAttribute("transform", "translate(-0.5, -0.5)");
    bgGroup.appendChild(highlightPath);

    // Apply texture pattern based on biome type
    let patternId = null;
    if (b.type === 'land') patternId = 'grassPattern';
    else if (b.type === 'ice') patternId = 'icePattern';
    else if (b.type === 'dark' || b.type === 'mystic') patternId = 'darkPattern';
    else if (b.type === 'volcanic') patternId = 'lavaPattern';
    else if (b.type === 'mountain') patternId = 'mountainPattern';
    else if (b.type === 'plains') patternId = 'grassPattern';

    if (patternId) {
      const texOverlay = document.createElementNS(svgNS, "path");
      texOverlay.setAttribute("d", scaledPath);
      texOverlay.setAttribute("fill", `url(#${patternId})`);
      texOverlay.setAttribute("opacity", "0.8");
      bgGroup.appendChild(texOverlay);
    }
  }

  // Determine if a connection is a water route
  function isWaterConn(a, b) {
    const wKeys = ['ocean', 'trench', 'abyss', 'shore', 'deep sea', 'underwater', 'coral'];
    const check = area => area && (area.id === 'deep_trench' ||
      (area.desc && wKeys.some(k => area.desc.toLowerCase().includes(k))));
    return check(a) || check(b);
  }

  // Build orthogonal segments between two map points
  // Returns array of straight-line segment paths (split at direction changes)
  function orthSegments(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    // If nearly a straight line, return single segment
    if (dx < 3 || dy < 3) {
      return [`M ${x1},${y1} L ${x2},${y2}`];
    }
    // L-shaped: split into two straight segments at the corner
    if (dx >= dy) {
      // Horizontal first, then vertical. Corner at (x2, y1)
      return [
        `M ${x1},${y1} L ${x2},${y1}`,
        `M ${x2},${y1} L ${x2},${y2}`
      ];
    } else {
      // Vertical first, then horizontal. Corner at (x1, y2)
      return [
        `M ${x1},${y1} L ${x1},${y2}`,
        `M ${x1},${y2} L ${x2},${y2}`
      ];
    }
  }

  // Collect which route areas sit on which connections (for placing route labels on paths)
  // A route area is positioned at its mapPos, which should be along the connection path
  const routeAreas = {};
  for (const [areaId, area] of Object.entries(WORLD_DATA)) {
    if (area.type === "route" && area.mapPos) {
      routeAreas[areaId] = area;
    }
  }

  // Draw route connections as orthogonal paths
  // For each connection, draw the path and if a route area lies on it, make it clickable
  const drawnConnections = new Set();
  const routesMapped = new Set(); // track which route areas got placed on a connection

  for (const [areaId, area] of Object.entries(WORLD_DATA)) {
    if (!area.mapPos) continue;
    for (const conn of area.connections) {
      const sortedKey = [areaId, conn].sort().join("|");
      if (drawnConnections.has(sortedKey)) continue;
      drawnConnections.add(sortedKey);
      const toArea = WORLD_DATA[conn];
      if (!toArea || !toArea.mapPos) continue;

      const x1 = (area.mapPos.x / 100) * mapW;
      const y1 = (area.mapPos.y / 100) * mapH;
      const x2 = (toArea.mapPos.x / 100) * mapW;
      const y2 = (toArea.mapPos.y / 100) * mapH;
      const segments = orthSegments(x1, y1, x2, y2);

      const fromLocked = G.badges.length < (area.requiredBadges || 0);
      const toLocked   = G.badges.length < (toArea.requiredBadges || 0);
      const bothLocked = fromLocked && toLocked;
      const water = isWaterConn(area, toArea);
      const routeColor  = bothLocked ? "#4a4a4a" : water ? "#3a9acc" : "#d4a030";
      const shadowColor = bothLocked ? "#222"    : water ? "#0d2a4a" : "#6a4a08";

      // Draw each segment separately so they can be clicked individually
      const segLines = [];
      for (const segD of segments) {
        // Shadow
        const shadow = document.createElementNS(svgNS, "path");
        shadow.setAttribute("d", segD);
        shadow.setAttribute("stroke", shadowColor);
        shadow.setAttribute("stroke-width", "7");
        shadow.setAttribute("fill", "none");
        shadow.setAttribute("stroke-linecap", "round");
        shadow.setAttribute("stroke-linejoin", "round");
        shadow.setAttribute("opacity", "0.55");
        bgGroup.appendChild(shadow);

        // Route line
        const line = document.createElementNS(svgNS, "path");
        line.setAttribute("d", segD);
        line.setAttribute("stroke", routeColor);
        line.setAttribute("stroke-width", "5");
        line.setAttribute("fill", "none");
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("stroke-linejoin", "round");
        bgGroup.appendChild(line);

        // Edge highlight (3D road feel)
        const highlight = document.createElementNS(svgNS, "path");
        highlight.setAttribute("d", segD);
        highlight.setAttribute("stroke", "#ffffff");
        highlight.setAttribute("stroke-width", "1.5");
        highlight.setAttribute("fill", "none");
        highlight.setAttribute("stroke-linecap", "round");
        highlight.setAttribute("stroke-linejoin", "round");
        highlight.setAttribute("opacity", "0.2");
        bgGroup.appendChild(highlight);

        segLines.push({ pathD: segD, line });
      }

      // Find which route area(s) sit on or near this connection
      const connRouteIds = [];
      if (area.type === "route") connRouteIds.push(areaId);
      if (toArea.type === "route") connRouteIds.push(conn);

      for (const rId of connRouteIds) {
        if (routesMapped.has(rId)) continue;
        routesMapped.add(rId);
        const rArea = WORLD_DATA[rId];
        const rx = (rArea.mapPos.x / 100) * mapW;
        const ry = (rArea.mapPos.y / 100) * mapH;
        const rBadgesNeeded = rArea.requiredBadges || 0;
        const rLocked = G.badges.length < rBadgesNeeded && rId !== G.location;

        // Add a clickable hit-area for each segment
        if (!rLocked) {
          for (const seg of segLines) {
            const hitArea = document.createElementNS(svgNS, "path");
            hitArea.setAttribute("d", seg.pathD);
            hitArea.setAttribute("stroke", "transparent");
            hitArea.setAttribute("stroke-width", "18");
            hitArea.setAttribute("fill", "none");
            hitArea.setAttribute("stroke-linecap", "round");
            hitArea.setAttribute("stroke-linejoin", "round");
            hitArea.style.cursor = "pointer";
            hitArea.style.pointerEvents = "stroke";
            hitArea.addEventListener("click", () => travelTo(rId));
            hitArea.addEventListener("touchend", (e) => { e.preventDefault(); travelTo(rId); });
            // Hover effect: brighten all segments of this route together
            hitArea.addEventListener("mouseenter", () => {
              for (const s of segLines) {
                s.line.setAttribute("stroke", water ? "#5ac0ee" : "#f0c050");
                s.line.setAttribute("stroke-width", "6");
              }
            });
            hitArea.addEventListener("mouseleave", () => {
              for (const s of segLines) {
                s.line.setAttribute("stroke", routeColor);
                s.line.setAttribute("stroke-width", "5");
              }
            });
            svg.appendChild(hitArea);
          }
        }

        // Route label positioned at the route area's mapPos
        const routeLabel = document.createElement("div");
        routeLabel.className = "map-route-label";
        if (rLocked) routeLabel.classList.add("locked");
        if (rId === G.location) routeLabel.classList.add("current");
        routeLabel.textContent = rArea.name;
        routeLabel.style.left = rx + "px";
        routeLabel.style.top = (ry - 8) + "px";
        mapEl.appendChild(routeLabel);
      }
    }
  }

  // Also place labels for any route areas not yet mapped (e.g. routes only connected to one path)
  for (const [rId, rArea] of Object.entries(routeAreas)) {
    if (routesMapped.has(rId)) continue;
    const rx = (rArea.mapPos.x / 100) * mapW;
    const ry = (rArea.mapPos.y / 100) * mapH;
    const rLocked = G.badges.length < (rArea.requiredBadges || 0) && rId !== G.location;

    const routeLabel = document.createElement("div");
    routeLabel.className = "map-route-label";
    if (rLocked) routeLabel.classList.add("locked");
    if (rId === G.location) routeLabel.classList.add("current");
    routeLabel.textContent = rArea.name;
    routeLabel.style.left = rx + "px";
    routeLabel.style.top = (ry - 8) + "px";
    if (!rLocked) {
      routeLabel.style.pointerEvents = "auto";
      routeLabel.style.cursor = "pointer";
      routeLabel.addEventListener("click", () => travelTo(rId));
    }
    mapEl.appendChild(routeLabel);
  }

  mapEl.appendChild(svg);

  // Draw location markers for cities, towns, and special locations only (not routes)
  for (const [areaId, area] of Object.entries(WORLD_DATA)) {
    if (!area.mapPos) continue;
    if (area.type === "route") continue; // Routes are on the paths now
    const x = (area.mapPos.x / 100) * mapW;
    const y = (area.mapPos.y / 100) * mapH;

    const loc = document.createElement("div");
    loc.className = "map-location";
    if (area.type === "city") loc.classList.add("city");
    if (area.type === "town") loc.classList.add("town");
    if (area.type === "special") loc.classList.add("special");
    if (areaId === G.location) loc.classList.add("current");

    const badgesNeeded = area.requiredBadges || 0;
    const locked = G.badges.length < badgesNeeded && areaId !== G.location;
    if (locked) loc.classList.add("locked");
    if (area.hasGym && G.defeatedLeaders.includes(area.gymLeader)) loc.classList.add("gym-done");
    if (area.hasUmbraBase && G.defeatedLeaders.includes("umbra_shade")) loc.classList.add("gym-done");

    loc.style.left = x + "px";
    loc.style.top  = y + "px";

    const dot = document.createElement("div");
    dot.className = "map-loc-dot";
    dot.textContent = locked ? "🔒" : area.icon;

    const label = document.createElement("div");
    label.className = "map-loc-label";
    label.textContent = area.name; // Full name visible

    loc.appendChild(dot);
    loc.appendChild(label);

    if (!locked) {
      loc.addEventListener("click", () => travelTo(areaId));
      loc.addEventListener("touchend", (e) => { e.preventDefault(); travelTo(areaId); });
      loc.style.cursor = "pointer";
    }
    mapEl.appendChild(loc);
  }

  // Region label
  const regionLabel = document.createElement("div");
  regionLabel.style.cssText = "position:absolute;bottom:4px;right:8px;font-size:0.6rem;color:#adf;opacity:0.5;pointer-events:none;font-family:monospace;letter-spacing:1px;";
  regionLabel.textContent = "LUMORIA REGION";
  mapEl.appendChild(regionLabel);
}

function travelTo(areaId) {
  const area = WORLD_DATA[areaId];
  if (!area) return;
  if (G.badges.length < (area.requiredBadges || 0)) {
    showNotification(`You need ${area.requiredBadges} badge(s) to enter ${area.name}.`);
    return;
  }
  G.location = areaId;
  trackLocationVisit(areaId);
  renderWorldMap();
  renderAreaPanel();
}

function renderAreaPanel() {
  const area = WORLD_DATA[G.location];
  if (!area) return;

  document.getElementById("area-name").textContent = area.name;
  document.getElementById("hud-location").textContent = "📍 " + area.name;

  const typeBadge = document.getElementById("area-type-badge");
  typeBadge.textContent = area.type.toUpperCase();
  typeBadge.className = "type-badge";
  typeBadge.style.background = "#333";

  document.getElementById("area-description").textContent = area.desc;

  // Wild monster list
  const wildList = document.getElementById("area-wild-list");
  wildList.innerHTML = "";
  if (area.wildMonsters && area.wildMonsters.length > 0) {
    for (const wm of area.wildMonsters) {
      const def = MONSTERS_DATA[wm.id];
      const chip = document.createElement("div");
      chip.className = "wild-mon-chip";
      const seen = G.seenMonsters.has(wm.id);
      chip.textContent = seen ? `${def.emoji} ${def.name}` : "???";
      wildList.appendChild(chip);
    }
  } else {
    wildList.innerHTML = "<span class='wild-mon-chip'>None</span>";
  }

  // Area actions
  const exploreBtn = document.getElementById("btn-explore");
  const gymBtn = document.getElementById("btn-gym");
  const championBtn = document.getElementById("btn-champion");
  const gymInfo = document.getElementById("area-gym-info");

  exploreBtn.classList.toggle("hidden", !area.wildMonsters || area.wildMonsters.length === 0);
  gymBtn.classList.add("hidden");
  championBtn.classList.add("hidden");
  gymInfo.classList.add("hidden");

  if (area.hasGym && area.gymLeader) {
    const leader = GYM_LEADERS[area.gymLeader];
    const beaten = G.defeatedLeaders.includes(area.gymLeader);
    gymBtn.classList.remove("hidden");
    gymBtn.textContent = beaten ? `✅ ${leader.name} (Won)` : `🏛 Challenge ${leader.name}`;
    gymBtn.disabled = beaten;
    gymInfo.classList.remove("hidden");
    const leaderEmojiEl = document.getElementById("gym-leader-emoji");
    if (typeof getTrainerSpriteURL === "function") {
      leaderEmojiEl.innerHTML = `<img src="${getTrainerSpriteURL(area.gymLeader, leader, 48)}" width="48" height="48" alt="${leader.name}" style="border-radius:8px">`;
    } else {
      leaderEmojiEl.textContent = leader.emoji;
    }
    document.getElementById("gym-leader-name").textContent = leader.name;
    document.getElementById("gym-leader-type").textContent = `Type: ${leader.type}`;
    document.getElementById("gym-badge-name").textContent = `Badge: ${leader.badge}`;
  }

  if (area.isChampion) {
    const beaten = G.championDefeated;
    championBtn.classList.remove("hidden");
    championBtn.textContent = beaten ? "✅ Champion Defeated!" : "👑 Challenge Champion Lumian";
    championBtn.disabled = beaten;
  }

  // Umbra Base button
  const umbraBtn = document.getElementById("btn-umbra-base");
  umbraBtn.classList.add("hidden");
  if (area.hasUmbraBase) {
    const beaten = G.defeatedLeaders.includes("umbra_shade");
    umbraBtn.classList.remove("hidden");
    umbraBtn.textContent = beaten ? "✅ Umbra Base Cleared!" : "☠️ Storm the Umbra Base";
    umbraBtn.disabled = beaten;
  }

  // Rival button
  const rivalBtn = document.getElementById("btn-rival");
  rivalBtn.classList.add("hidden");
  if (typeof RIVAL_BATTLES !== "undefined") {
    const pendingRival = getPendingRivalBattle();
    if (pendingRival) {
      rivalBtn.classList.remove("hidden");
      rivalBtn.textContent = "🧒 Battle Rival Marcus";
    }
  }

  // Shop button in area
  const shopAreaBtn = document.getElementById("btn-area-shop");
  if (shopAreaBtn) {
    shopAreaBtn.classList.add("hidden");
    if (typeof SHOPS_DATA !== "undefined" && SHOPS_DATA[G.location]) {
      shopAreaBtn.classList.remove("hidden");
      shopAreaBtn.textContent = `🛒 ${SHOPS_DATA[G.location].name}`;
    }
  }

  // Legendary encounter button
  const legendBtn = document.getElementById("btn-legendary");
  if (legendBtn) {
    legendBtn.classList.add("hidden");
    if (area.legendaryEncounter) {
      const legDef = MONSTERS_DATA[area.legendaryEncounter.monsterId];
      const caught = G.defeatedLegendaries && G.defeatedLegendaries.includes(area.legendaryEncounter.monsterId);
      legendBtn.classList.remove("hidden");
      legendBtn.textContent = caught
        ? `✅ ${legDef.name} (Caught/Defeated)`
        : `🌟 Challenge ${legDef.name}`;
      legendBtn.disabled = caught;
    }
  }

  // Route trainer button
  const routeTrainerBtn = document.getElementById("btn-route-trainer");
  if (routeTrainerBtn) {
    routeTrainerBtn.classList.add("hidden");
    if (typeof ROUTE_TRAINERS !== "undefined" && ROUTE_TRAINERS[G.location]) {
      const trainers = ROUTE_TRAINERS[G.location];
      const beaten = trainers.filter((t, i) =>
        G.defeatedTrainers.includes(`${G.location}_trainer_${i}`)
      ).length;
      if (beaten < trainers.length) {
        routeTrainerBtn.classList.remove("hidden");
        const next = trainers[beaten];
        routeTrainerBtn.textContent = `⚔️ Battle ${next.name}`;
        routeTrainerBtn.innerHTML += `<span class="trainer-progress"> (${beaten}/${trainers.length})</span>`;
      }
    }
  }

  // Umbra area encounter button
  const umbraAreaBtn = document.getElementById("btn-umbra-area");
  if (umbraAreaBtn) {
    umbraAreaBtn.classList.add("hidden");
    if (area.hasUmbraEncounter && typeof UMBRA_BATTLES !== "undefined") {
      // Find the umbra battle for this location
      const umbraId = Object.keys(UMBRA_BATTLES).find(k => {
        const b = UMBRA_BATTLES[k];
        return b.triggerLocation === G.location;
      });
      if (umbraId) {
        const beaten = G.defeatedUmbraEncounters && G.defeatedUmbraEncounters.includes(umbraId);
        umbraAreaBtn.classList.remove("hidden");
        const ub = UMBRA_BATTLES[umbraId];
        umbraAreaBtn.textContent = beaten
          ? `✅ ${ub.name} (Defeated)`
          : `🕶️ Battle ${ub.name}`;
        umbraAreaBtn.disabled = beaten;
      }
    }
  }

  // Gym trainer button
  const gymTrainerBtn = document.getElementById("btn-gym-trainers");
  if (gymTrainerBtn) {
    gymTrainerBtn.classList.add("hidden");
    if (area.hasGym && area.gymLeader && typeof GYM_TRAINERS !== "undefined" && GYM_TRAINERS[area.gymLeader]) {
      const beaten = G.defeatedLeaders.includes(area.gymLeader);
      if (!beaten) {
        const trainers = GYM_TRAINERS[area.gymLeader];
        const beatenCount = trainers.filter((t, i) =>
          G.defeatedTrainers.includes(`gym_${area.gymLeader}_trainer_${i}`)
        ).length;
        if (beatenCount < trainers.length) {
          gymTrainerBtn.classList.remove("hidden");
          const next = trainers[beatenCount];
          gymTrainerBtn.textContent = `🥋 Battle ${next.name}`;
          gymTrainerBtn.innerHTML += `<span class="trainer-progress"> (${beatenCount}/${trainers.length})</span>`;
        }
      }
    }
  }

  // Heal button in towns/cities
  const healBtn = document.getElementById("btn-heal");
  if (healBtn) {
    healBtn.classList.add("hidden");
    if (area.type === "town" || area.type === "city") {
      healBtn.classList.remove("hidden");
    }
  }

  // Elite Four button
  const eliteBtn = document.getElementById("btn-elite-four");
  if (eliteBtn) {
    eliteBtn.classList.add("hidden");
    if (area.isChampion && typeof ELITE_FOUR !== "undefined") {
      // Show elite four challenge if not all defeated
      const eliteDefeated = ELITE_FOUR.every(e => G.defeatedLeaders.includes(e.id));
      if (!eliteDefeated) {
        eliteBtn.classList.remove("hidden");
        const nextElite = ELITE_FOUR.find(e => !G.defeatedLeaders.includes(e.id));
        eliteBtn.textContent = `⚔️ Challenge Elite: ${nextElite?.name || "???"}`;
        eliteBtn.disabled = false;
      }
      // Only allow champion battle if all elite four are defeated
      if (championBtn) {
        championBtn.classList.toggle("hidden", !eliteDefeated || G.championDefeated);
      }
    }
  }
}

function renderHUD() {
  document.getElementById("hud-player-name").textContent = G.playerName;
  document.getElementById("hud-money").textContent = `💰 ${G.money}`;

  const badgesDiv = document.getElementById("hud-badges");
  badgesDiv.innerHTML = "";
  const allBadges = Object.values(GYM_LEADERS).filter(l => l.badge).map(l => ({ id: l.id }));
  for (const b of allBadges) {
    const earned = G.badges.includes(b.id);
    const el = document.createElement("div");
    el.className = "badge-icon";
    el.title = GYM_LEADERS[b.id]?.badge || "";
    el.innerHTML = generateBadgeSVG(b.id, earned, 30);
    badgesDiv.appendChild(el);
  }
}

// ============================================================
// EXPLORATION (Wild Encounters)
// ============================================================
function exploreArea() {
  const area = WORLD_DATA[G.location];
  if (!area?.wildMonsters?.length) { showNotification("There's nothing to explore here."); return; }
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumos have fainted! Heal at a town first."); return; }

  // Filter out high-BST mons until the player has enough badges; also exclude unknown IDs (BST=0)
  const pool = G.badges.length < 3
    ? area.wildMonsters.filter(wm => { const b = getMonBST(wm.id); return b > 0 && b <= 375; })
    : area.wildMonsters.filter(wm => getMonBST(wm.id) > 0);
  if (!pool.length) { showNotification("No wild Lumos appear here yet."); return; }

  const total = pool.reduce((s, wm) => s + wm.rate, 0);
  let roll = Math.random() * total;
  let chosen = pool[pool.length - 1];
  for (const wm of pool) { roll -= wm.rate; if (roll <= 0) { chosen = wm; break; } }

  const level = chosen.minLv + Math.floor(Math.random() * (chosen.maxLv - chosen.minLv + 1));
  G.seenMonsters.add(chosen.id);
  startWildBattle(buildWildMon(chosen.id, level));
}

// ============================================================
// BATTLE SYSTEM
// ============================================================
let battleLog = [];
let battleResolve = null;
let playerActiveMon = null;
let enemyActiveMon = null;
let battleContext = {};

// Multi-battle state (double/triple)
let playerActiveMons = [];  // Array of active player mons in multi battles
let enemyActiveMons = [];   // Array of active enemy mons in multi battles
let playerTeamIdxs = [];    // Team indices for active player mons
let multiBattlePendingMoves = []; // Moves queued for multi battle turn

function logMsg(text, cls) {
  const logEl = document.getElementById("battle-log");
  const entry = document.createElement("div");
  entry.className = "log-entry" + (cls ? " " + cls : "");
  entry.textContent = text;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

function clearBattleLog() {
  document.getElementById("battle-log").innerHTML = "";
}

function updateBattleUI() {
  const player = playerActiveMon;
  const enemy = enemyActiveMon;

  // Enemy sprite (SVG illustration)
  const enemySpriteEl = document.getElementById("enemy-sprite");
  if (typeof getMonsterSpriteURL === "function" && MONSTERS_DATA[enemy.monsterId]) {
    enemySpriteEl.innerHTML = `<img src="${getMonsterSpriteURL(MONSTERS_DATA[enemy.monsterId], 90)}" width="90" height="90" alt="${enemy.name}">`;
  } else {
    enemySpriteEl.textContent = enemy.emoji;
  }
  document.getElementById("enemy-name").textContent = enemy.name;
  document.getElementById("enemy-level").textContent = `Lv.${enemy.level}`;
  const enemyHPPct = Math.max(0, (enemy.currentHP / enemy.maxHP) * 100);
  const enemyFill = document.getElementById("enemy-hp-fill");
  enemyFill.style.width = enemyHPPct + "%";
  enemyFill.className = "hp-fill" + (enemyHPPct < 25 ? " red" : enemyHPPct < 50 ? " yellow" : "");

  const enemyStatus = document.getElementById("enemy-status-badge");
  if (enemy.status) {
    enemyStatus.classList.remove("hidden");
    enemyStatus.textContent = enemy.status.toUpperCase();
    enemyStatus.className = `status-badge status-${enemy.status}`;
  } else {
    enemyStatus.classList.add("hidden");
  }

  const enemyTypes = document.getElementById("enemy-type-badges");
  enemyTypes.innerHTML = "";
  for (const t of enemy.types) {
    const badge = document.createElement("span");
    badge.className = `type-badge-small type-${t}`;
    badge.textContent = t;
    enemyTypes.appendChild(badge);
  }

  // Show IVs for wild encounters so players can evaluate
  const enemyIVsEl = document.getElementById("enemy-ivs");
  if (enemyIVsEl) {
    if (battleContext.isWild && enemy.ivs) {
      const iv = enemy.ivs;
      const total = iv.hp + iv.atk + iv.def + iv.spa + iv.spd + iv.spe;
      enemyIVsEl.innerHTML = `<span class="iv-label">IVs:</span> ` +
        `HP:${iv.hp} ATK:${iv.atk} DEF:${iv.def} SPA:${iv.spa} SPD:${iv.spd} SPE:${iv.spe}` +
        ` <span class="iv-total">(${total}/186)</span>`;
      enemyIVsEl.classList.remove("hidden");
    } else {
      enemyIVsEl.classList.add("hidden");
    }
  }

  // Player sprite (SVG illustration)
  const playerSpriteEl = document.getElementById("player-sprite");
  if (typeof getMonsterSpriteURL === "function" && MONSTERS_DATA[player.monsterId]) {
    playerSpriteEl.innerHTML = `<img src="${getMonsterSpriteURL(MONSTERS_DATA[player.monsterId], 90)}" width="90" height="90" alt="${player.name}">`;
  } else {
    playerSpriteEl.textContent = player.emoji;
  }
  document.getElementById("player-mon-name").textContent = player.name;
  document.getElementById("player-mon-level").textContent = `Lv.${player.level}`;
  const playerHPPct = Math.max(0, (player.currentHP / player.maxHP) * 100);
  const playerFill = document.getElementById("player-hp-fill");
  playerFill.style.width = playerHPPct + "%";
  playerFill.className = "hp-fill" + (playerHPPct < 25 ? " red" : playerHPPct < 50 ? " yellow" : "");
  document.getElementById("player-hp-text").textContent = `${player.currentHP} / ${player.maxHP}`;

  const playerStatus = document.getElementById("player-status-badge");
  if (player.status) {
    playerStatus.classList.remove("hidden");
    playerStatus.textContent = player.status.toUpperCase();
    playerStatus.className = `status-badge status-${player.status}`;
  } else {
    playerStatus.classList.add("hidden");
  }

  // XP bar
  const pSlot = G.team[battleContext.playerTeamIdx];
  if (pSlot) {
    const currXP = pSlot.xp || 0;
    const nextLvXP = xpForLevel(pSlot.level + 1);
    const thisLvXP = xpForLevel(pSlot.level);
    const pct = Math.min(100, ((currXP - thisLvXP) / (nextLvXP - thisLvXP)) * 100);
    document.getElementById("battle-xp-fill").style.width = pct + "%";
    document.getElementById("battle-xp-bar-container").classList.remove("hidden");
  }
}

function showBattleMainActions() {
  document.getElementById("battle-main-actions").classList.remove("hidden");
  document.getElementById("battle-moves-panel").classList.add("hidden");
  document.getElementById("battle-catch-panel").classList.add("hidden");
  document.getElementById("battle-bag-panel").classList.add("hidden");
  document.getElementById("battle-switch-panel").classList.add("hidden");
  document.getElementById("battle-target-panel")?.classList.add("hidden");
}

function showMovePanel() {
  document.getElementById("battle-main-actions").classList.add("hidden");
  document.getElementById("battle-moves-panel").classList.remove("hidden");
  const grid = document.getElementById("battle-moves-grid");
  grid.innerHTML = "";
  // Remove any existing move info tooltip
  const oldTooltip = document.getElementById("move-info-tooltip");
  if (oldTooltip) oldTooltip.remove();

  for (const m of playerActiveMon.moves) {
    const move = MOVES_DATA[m.id];
    if (!move) continue;
    const btn = document.createElement("button");
    btn.className = "move-btn";
    const typeColor = getTypeColor(move.type);
    btn.disabled = m.pp <= 0;
    const catIcon = move.cat === "physical" ? "⚔" : move.cat === "special" ? "✦" : "◈";
    btn.innerHTML = `
      <div class="move-btn-left">
        <span class="move-btn-name">${move.name}</span>
        <span class="move-btn-pp">PP: ${m.pp}/${m.maxPP}</span>
      </div>
      <div class="move-btn-meta">
        <span class="move-btn-stats">${catIcon} ${move.power || "—"} / ${move.acc}%</span>
        <span class="move-btn-right" style="background:${typeColor}">${move.type}</span>
      </div>
    `;
    // Show move info tooltip on long press / right click / hover
    const showTooltip = (e) => {
      e.preventDefault();
      e.stopPropagation();
      let tooltip = document.getElementById("move-info-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "move-info-tooltip";
        document.body.appendChild(tooltip);
      }
      const effectText = move.effect ? move.effect.replace(/([a-z])([A-Z])/g, "$1 $2") : "None";
      tooltip.innerHTML = `
        <div class="move-tooltip-header" style="background:${typeColor}">
          <strong>${move.name}</strong>
          <span>${move.type} ${catIcon}</span>
        </div>
        <div class="move-tooltip-body">
          <div class="move-tooltip-row"><span>Power</span><span>${move.power || "—"}</span></div>
          <div class="move-tooltip-row"><span>Accuracy</span><span>${move.acc}%</span></div>
          <div class="move-tooltip-row"><span>Category</span><span>${move.cat}</span></div>
          <div class="move-tooltip-row"><span>PP</span><span>${m.pp}/${m.maxPP}</span></div>
          <p class="move-tooltip-desc">${move.desc}</p>
        </div>
        <div class="move-tooltip-close">Tap anywhere to close</div>
      `;
      tooltip.classList.add("visible");
      // Close on click anywhere
      const closeTooltip = () => {
        tooltip.classList.remove("visible");
        document.removeEventListener("click", closeTooltip);
      };
      setTimeout(() => document.addEventListener("click", closeTooltip), 10);
    };
    btn.addEventListener("contextmenu", showTooltip);
    // Long press for mobile
    let pressTimer;
    btn.addEventListener("touchstart", (e) => {
      pressTimer = setTimeout(() => showTooltip(e), 400);
    }, {passive: false});
    btn.addEventListener("touchend", () => clearTimeout(pressTimer));
    btn.addEventListener("touchmove", () => clearTimeout(pressTimer));
    btn.addEventListener("click", () => {
      if (m.pp > 0) playerUseMove(m.id);
    });
    grid.appendChild(btn);
  }
}

function showCatchPanel() {
  document.getElementById("battle-main-actions").classList.add("hidden");
  document.getElementById("battle-catch-panel").classList.remove("hidden");
  const grid = document.getElementById("catch-items-grid");
  grid.innerHTML = "";
  for (const [itemId, count] of Object.entries(G.bag)) {
    const item = ITEMS_DATA[itemId];
    if (!item || item.type !== "ball" || count <= 0) continue;
    const btn = document.createElement("button");
    btn.className = "catch-item-btn";
    btn.innerHTML = `${item.emoji} ${item.name}<br><small>x${count}</small>`;
    btn.addEventListener("click", () => playerUseBall(itemId));
    grid.appendChild(btn);
  }
  if (grid.children.length === 0) {
    grid.innerHTML = "<p style='color:#888;font-size:0.8rem'>No capture orbs!</p>";
  }
}

function showSwitchPanel(forceSwitch = false) {
  document.getElementById("battle-main-actions").classList.add("hidden");
  document.getElementById("battle-switch-panel").classList.remove("hidden");
  const list = document.getElementById("switch-monsters-list");
  list.innerHTML = "";
  G.team.forEach((slot, idx) => {
    if (idx === battleContext.playerTeamIdx && !forceSwitch) return;
    const def = MONSTERS_DATA[slot.monsterId];
    const btn = document.createElement("button");
    btn.className = "switch-mon-btn";
    btn.disabled = slot.currentHP <= 0;
    const hpPct = Math.round((slot.currentHP / slot.maxHP) * 100);
    btn.innerHTML = `${def.emoji} <strong>${slot.nickname || def.name}</strong> Lv.${slot.level} — HP: ${slot.currentHP}/${slot.maxHP} (${hpPct}%)`;
    btn.addEventListener("click", () => playerSwitch(idx));
    list.appendChild(btn);
  });
}

let battleBagSelectedMon = 0;

function showBattleBagPanel() {
  document.getElementById("battle-main-actions").classList.add("hidden");
  document.getElementById("battle-bag-panel").classList.remove("hidden");
  battleBagSelectedMon = battleContext.playerTeamIdx;
  renderBattleBagPanel();
}

function renderBattleBagPanel() {
  // Mon selector
  const monSel = document.getElementById("battle-bag-mon-select");
  monSel.innerHTML = "";
  G.team.forEach((slot, idx) => {
    const def = MONSTERS_DATA[slot.monsterId];
    const btn = document.createElement("button");
    btn.className = "switch-mon-btn" + (idx === battleBagSelectedMon ? " active" : "");
    btn.style.fontSize = "0.7rem";
    btn.style.padding = "0.3rem 0.5rem";
    btn.innerHTML = `${def.emoji} ${slot.nickname || def.name}<br><small>${slot.currentHP}/${slot.maxHP} HP</small>`;
    btn.disabled = false;
    btn.addEventListener("click", () => { battleBagSelectedMon = idx; renderBattleBagPanel(); });
    monSel.appendChild(btn);
  });

  // Items grid
  const grid = document.getElementById("battle-bag-items-grid");
  grid.innerHTML = "";
  const usable = Object.entries(G.bag).filter(([id, cnt]) => {
    if (!cnt || cnt <= 0) return false;
    const item = ITEMS_DATA[id];
    if (!item) return false;
    return item.type === "heal" || item.type === "revive" || item.type === "battle";
  });
  if (!usable.length) {
    grid.innerHTML = "<p style='color:#888;font-size:0.8rem'>No usable items!</p>";
    return;
  }
  usable.forEach(([id, cnt]) => {
    const item = ITEMS_DATA[id];
    const btn = document.createElement("button");
    btn.className = "catch-item-btn";
    btn.innerHTML = `${item.emoji} ${item.name}<br><small>x${cnt} — ${item.desc}</small>`;
    btn.addEventListener("click", () => playerUseBattleItem(id, battleBagSelectedMon));
    grid.appendChild(btn);
  });
}

async function playerUseBattleItem(itemId, monIdx) {
  const item = ITEMS_DATA[itemId];
  const slot = G.team[monIdx];
  if (!item || !slot || (G.bag[itemId] || 0) <= 0) return;

  if (item.type === "heal") {
    if (slot.currentHP <= 0) { showNotification("Can't heal a fainted Lumo in battle!"); return; }
    if (slot.currentHP >= slot.maxHP) { showNotification("Already at full HP!"); return; }
    const healed = Math.min(slot.maxHP - slot.currentHP, item.healAmt);
    slot.currentHP += healed;
    // Also update live battle mon if it's the active one
    if (monIdx === battleContext.playerTeamIdx) {
      playerActiveMon.currentHP = Math.min(playerActiveMon.maxHP, playerActiveMon.currentHP + healed);
    }
    G.bag[itemId]--;
    logMsg(`Used ${item.name} on ${slot.nickname || MONSTERS_DATA[slot.monsterId].name}! +${healed} HP`);
  } else if (item.type === "revive") {
    if (slot.currentHP > 0) { showNotification("That Lumo isn't fainted!"); return; }
    slot.currentHP = Math.floor(slot.maxHP * 0.5);
    slot.status = null;
    G.bag[itemId]--;
    logMsg(`${slot.nickname || MONSTERS_DATA[slot.monsterId].name} was revived!`);
  } else if (item.type === "battle") {
    // Stat booster — only works on active mon
    if (monIdx !== battleContext.playerTeamIdx) { showNotification("Stat items only work on your active Lumo!"); return; }
    const eff = item.battleEffect;
    if (eff?.stat) {
      playerActiveMon.stages[eff.stat] = Math.min(6, (playerActiveMon.stages[eff.stat] || 0) + (eff.stages || 1));
      logMsg(`${playerActiveMon.name}'s ${eff.stat.toUpperCase()} rose!`);
    }
    G.bag[itemId]--;
  }

  showBattleMainActions();
  updateBattleUI();
  saveGame();
  // Enemy gets a free turn as cost of using an item
  await enemyTurn();
  if (!battleContext.battleEnded) updateBattleUI();
  if (!battleContext.battleEnded) showBattleMainActions();
}

function getTypeColor(type) {
  const colors = {
    Fire:"#ff6b35",Water:"#4da6ff",Grass:"#4caf50",Electric:"#ffd700",
    Ground:"#c8a045",Wind:"#7ec8e3",Ice:"#96d5d5",Dark:"#5a4a6e",
    Fairy:"#ff69b4",Steel:"#9e9e9e",Poison:"#9b59b6",Psychic:"#ff4081",
    Dragon:"#7038f8",Normal:"#a8a878",Rock:"#b8a038",Bug:"#a8b820"
  };
  return colors[type] || "#666";
}

function startWildBattle(wildMon) {
  battleContext = {
    isWild: true,
    isGym: false,
    isChampion: false,
    battleMode: "single",
    wildMon,
    playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
  };
  playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx]);
  enemyActiveMon = wildMon;
  hideMultiBattleSlots();
  showScreen("screen-battle");
  clearBattleLog();
  logMsg(`A wild Lumo — ${wildMon.name} appeared! (Lv.${wildMon.level})`);
  updateBattleUI();
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = false;
  if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle(battleContext);
}

function showBattleFormatSelection(label, emoji, quote, onSelect) {
  document.getElementById("format-select-opponent").textContent = `${emoji} ${label}`;
  document.getElementById("format-select-quote").textContent = quote ? `"${quote}"` : "";
  document.getElementById("format-select-overlay").classList.remove("hidden");
  ["single","double","triple"].forEach(fmt => {
    document.getElementById(`format-card-${fmt}`).addEventListener("click", () => {
      document.getElementById("format-select-overlay").classList.add("hidden");
      onSelect(fmt);
    }, { once: true });
  });
}

function getMonBST(id) {
  const b = MONSTERS_DATA[id]?.base;
  return b ? b.hp + b.atk + b.def + b.spa + b.spd + b.spe : 0;
}

function startGymBattle(leaderId, battleType = "single") {
  // Look up in GYM_LEADERS first, then ELITE_FOUR
  let leader = GYM_LEADERS[leaderId];
  if (!leader && typeof ELITE_FOUR !== "undefined") {
    leader = ELITE_FOUR.find(e => e.id === leaderId);
  }
  if (!leader) return;
  const levelCap = (typeof LEVEL_CAPS !== "undefined" && LEVEL_CAPS[leaderId]) ? LEVEL_CAPS[leaderId] : null;
  // Support both old team: [...] and new teams: { single, double, triple }
  const teamSlots = (leader.teams && leader.teams[battleType]) ? leader.teams[battleType]
                  : (leader.teams && leader.teams.single) ? leader.teams.single
                  : leader.team || [];
  const battleMode = leader.battleMode || "single";

  battleContext = {
    isWild: false,
    isGym: true,
    isChampion: leaderId === "champion",
    isEliteFour: !!(typeof ELITE_FOUR !== "undefined" && ELITE_FOUR.find(e => e.id === leaderId)),
    leaderId,
    battleType,
    levelCap,
    enemyTeam: teamSlots.map(s => buildGymMon(s)),
    battleMode,
    enemyTeam: leader.team.map(s => buildGymMon(s)),
    enemyTeamIdx: 0,
    playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
  };

  // Multi-battle mode
  if (battleMode === "double" || battleMode === "triple") {
    logMsg(`${leader.emoji} ${leader.name}: "${leader.quote}"`);
    startMultiBattle(battleContext.enemyTeam, leader.name, battleMode);
    return;
  }

  playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx], levelCap);
  enemyActiveMon = battleContext.enemyTeam[0];
  hideMultiBattleSlots();
  showScreen("screen-battle");
  clearBattleLog();
  if (levelCap) logMsg(`⚠️ Level Cap: ${levelCap} — your team is scaled down!`);
  const fmtLabel = {single:"Single",double:"Double",triple:"Triple"}[battleType] || "Single";
  logMsg(`⚔️ ${fmtLabel} Battle — ${leader.emoji} ${leader.name}`);
  logMsg(`${leader.name} sent out ${enemyActiveMon.name}!`);
  updateBattleUI();
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = true;
  if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle(battleContext);
}

// ---- Player Actions ----

async function playerUseMove(moveId) {
  showBattleMainActions();
  const moveSlot = playerActiveMon.moves.find(m => m.id === moveId);
  if (!moveSlot || moveSlot.pp <= 0) return;
  moveSlot.pp--;
  // Sync PP back to party slot
  const partySlot = G.team[battleContext.playerTeamIdx];
  const partyMove = partySlot.moves.indexOf(moveId);
  // Turns
  await executeTurn(moveId, null);
}

async function playerUseBall(orbId) {
  showBattleMainActions();
  if (!battleContext.isWild) { logMsg("Can't catch gym Lumos!"); return; }
  if ((G.bag[orbId] || 0) <= 0) { logMsg("No orbs of that type!"); return; }
  G.bag[orbId]--;
  const item = ITEMS_DATA[orbId];
  logMsg(`You threw a ${item.name}!`, "log-catch");
  await delay(600);

  const caught = attemptCapture(enemyActiveMon, orbId);
  if (caught) {
    logMsg(`✅ Gotcha! ${enemyActiveMon.name} was caught!`, "log-catch");
    G.caughtMonsters.add(enemyActiveMon.monsterId);
    G.seenMonsters.add(enemyActiveMon.monsterId);
    // Add to team or box
    const caught_slot = createCaughtSlot(enemyActiveMon);
    if (G.team.length < 6) {
      G.team.push(caught_slot);
    } else {
      G.box.push(caught_slot);
      logMsg(`${enemyActiveMon.name} was sent to the box (team full).`);
    }
    await delay(1000);
    endBattle("caught");
  } else {
    logMsg(`Oh no! ${enemyActiveMon.name} broke free!`, "log-catch");
    await delay(600);
    // Enemy turn
    await enemyTurn();
    if (!battleContext.battleEnded) updateBattleUI();
  }
}

function createCaughtSlot(battleMon) {
  return {
    monsterId: battleMon.monsterId,
    nickname: null,
    level: battleMon.level,
    xp: xpForLevel(battleMon.level),
    maxHP: battleMon.maxHP,
    currentHP: battleMon.currentHP,
    moves: battleMon.moves.map(m => m.id),
    status: battleMon.status,
    nature: battleMon.nature || getRandomNature(),
    ivs: battleMon.ivs || generateIVs()
  };
}

async function playerSwitch(idx) {
  if (G.team[idx].currentHP <= 0) return;
  showBattleMainActions();
  // Sync current HP back
  syncPlayerMonHP();
  battleContext.playerTeamIdx = idx;
  playerActiveMon = buildBattleMon(G.team[idx], battleContext.levelCap || null);
  logMsg(`Go, ${playerActiveMon.name}!`);
  updateBattleUI();
  // Enemy gets a free turn after switch (unless forced switch)
  if (!battleContext.forcedSwitch) {
    await enemyTurn();
  }
  battleContext.forcedSwitch = false;
  showBattleMainActions();
}

async function playerRun() {
  if (!battleContext.isWild) {
    logMsg("Can't run from a gym battle!");
    return;
  }
  // Escape chance
  const playerSpe = playerActiveMon.spe * stageMultiplier(playerActiveMon.stages.spe);
  const enemySpe  = enemyActiveMon.spe  * stageMultiplier(enemyActiveMon.stages.spe);
  const escapeChance = (playerSpe * 128 / (enemySpe + 1)) + 30;
  if (rollPercent(Math.min(100, escapeChance))) {
    logMsg("Got away safely!");
    await delay(600);
    endBattle("ran");
  } else {
    logMsg("Can't escape!");
    await delay(600);
    await enemyTurn();
    if (!battleContext.battleEnded) updateBattleUI();
  }
}

// ---- Turn Execution ----

async function executeTurn(playerMoveId, _unused) {
  if (battleContext.battleEnded) return;
  const move = MOVES_DATA[playerMoveId];
  if (!move) return;

  // Determine turn order by speed (priority moves go first, Quick Claw may override)
  const playerSpe = playerActiveMon.spe * stageMultiplier(playerActiveMon.stages.spe);
  const enemySpe  = enemyActiveMon.spe  * stageMultiplier(enemyActiveMon.stages.spe);
  const playerQuickClaw = checkQuickClaw(playerActiveMon);
  const enemyQuickClaw = checkQuickClaw(enemyActiveMon);
  if (playerQuickClaw && !enemyQuickClaw) logMsg(`${playerActiveMon.name}'s Quick Claw let it move first!`);
  if (enemyQuickClaw && !playerQuickClaw) logMsg(`${enemyActiveMon.name}'s Quick Claw let it move first!`);
  let playerFirst = move.effect === "priority" || playerSpe >= enemySpe;
  if (playerQuickClaw && !enemyQuickClaw) playerFirst = true;
  else if (enemyQuickClaw && !playerQuickClaw) playerFirst = false;

  if (playerFirst) {
    await doAttack(playerActiveMon, enemyActiveMon, playerMoveId, true);
    if (enemyActiveMon.fainted || enemyActiveMon.currentHP <= 0) {
      await handleEnemyFainted();
      return;
    }
    await enemyTurn();
  } else {
    await enemyTurn();
    if (battleContext.battleEnded) return;
    if (playerActiveMon.fainted || playerActiveMon.currentHP <= 0) return;
    await doAttack(playerActiveMon, enemyActiveMon, playerMoveId, true);
    if (enemyActiveMon.fainted || enemyActiveMon.currentHP <= 0) {
      await handleEnemyFainted();
      return;
    }
  }

  // Status ticks
  if (!battleContext.battleEnded) {
    const playerTickMsgs = tickStatus(playerActiveMon);
    for (const msg of playerTickMsgs) logMsg(msg);
    syncPlayerMonHP();
    if (playerActiveMon.fainted || playerActiveMon.currentHP <= 0) {
      await handlePlayerFainted();
      return;
    }
    updateBattleUI();
    showBattleMainActions();
  }
}

async function doAttack(attacker, defender, moveId, isPlayer) {
  const move = MOVES_DATA[moveId];
  if (!move) return;

  logMsg(`${attacker.name} used ${move.name}!`);
  await delay(500);

  // Check if can move
  const canMoveResult = canMove(attacker);
  if (!canMoveResult.can) {
    logMsg(canMoveResult.msg);
    await delay(400);
    return;
  }
  if (canMoveResult.msg) logMsg(canMoveResult.msg);

  if (move.power === 0) {
    // Status move
    const effMsgs = applyMoveEffect(move, attacker, defender);
    for (const msg of effMsgs) logMsg(msg, "log-status");
    if (isPlayer) {
      // Animate player sprite
      document.getElementById("player-sprite").classList.add("flash");
      setTimeout(() => document.getElementById("player-sprite").classList.remove("flash"), 500);
    } else {
      document.getElementById("enemy-sprite").classList.add("flash");
      setTimeout(() => document.getElementById("enemy-sprite").classList.remove("flash"), 500);
    }
    updateBattleUI();
    return;
  }

  // Accuracy check
  if (!rollPercent(move.acc)) {
    logMsg(`${attacker.name}'s attack missed!`);
    return;
  }

  // Damage
  const result = calcDamage(attacker, defender, move);
  // Focus Sash check
  const sashResult = applyFocusSash(defender, result.damage);
  if (sashResult.triggered) {
    result.damage = sashResult.damage;
  }
  defender.currentHP = Math.max(0, defender.currentHP - result.damage);
  if (sashResult.triggered) {
    defender.currentHP = Math.max(1, defender.currentHP);
  }
  if (defender.currentHP <= 0) defender.fainted = true;

  // Animations
  if (isPlayer) {
    document.getElementById("enemy-sprite").classList.add("shake");
    setTimeout(() => document.getElementById("enemy-sprite").classList.remove("shake"), 400);
  } else {
    document.getElementById("player-sprite").classList.add("shake");
    setTimeout(() => document.getElementById("player-sprite").classList.remove("shake"), 400);
  }

  // Sync HP back to party if player's mon
  if (isPlayer) syncPlayerMonHP();
  updateBattleUI();
  await delay(400);

  // Effectiveness message
  if (result.effectiveness > 1) logMsg("It's super effective!", "log-super-effective");
  else if (result.effectiveness < 1 && result.effectiveness > 0) logMsg("It's not very effective...", "log-not-effective");
  else if (result.effectiveness === 0) logMsg("It had no effect!", "log-immune");
  if (result.crit) logMsg("A critical hit!", "log-damage");

  logMsg(`${defender.name} took ${result.damage} damage!`, "log-damage");
  if (sashResult.triggered) logMsg(`${defender.name}'s Focus Sash kept it standing!`, "log-status");

  // Apply secondary effects
  const effMsgs = applyMoveEffect(move, attacker, defender);
  for (const msg of effMsgs) logMsg(msg, "log-status");
  await delay(300);
}

async function enemyTurn() {
  if (battleContext.battleEnded) return;
  const moveSlot = aiChooseMove(enemyActiveMon, playerActiveMon);
  const move = MOVES_DATA[moveSlot.id];
  if (moveSlot.id !== "tackle") moveSlot.pp = Math.max(0, moveSlot.pp - 1);

  await doAttack(enemyActiveMon, playerActiveMon, moveSlot.id, false);

  // Status ticks on enemy
  const enemyTickMsgs = tickStatus(enemyActiveMon);
  for (const msg of enemyTickMsgs) logMsg(msg);
  updateBattleUI();

  syncPlayerMonHP();
  if (playerActiveMon.fainted || playerActiveMon.currentHP <= 0) {
    await handlePlayerFainted();
  }
}

function syncPlayerMonHP() {
  const slot = G.team[battleContext.playerTeamIdx];
  if (slot && playerActiveMon) {
    slot.currentHP = Math.max(0, playerActiveMon.currentHP);
    slot.status = playerActiveMon.status;
  }
}

async function handleEnemyFainted() {
  logMsg(`${enemyActiveMon.name} fainted!`);
  await delay(700);

  if (battleContext.isWild) {
    // Give XP
    const xpGain = calcXPGain(enemyActiveMon, true);
    const slot = G.team[battleContext.playerTeamIdx];
    const levelUps = giveXP(slot, xpGain);
    logMsg(`${slot.nickname || MONSTERS_DATA[slot.monsterId].name} gained ${xpGain} XP!`);
    updateBattleUI();
    await delay(500);
    endBattle("won", slot, levelUps);
  } else {
    // Gym battle - next enemy
    battleContext.enemyTeamIdx++;
    if (battleContext.enemyTeamIdx >= battleContext.enemyTeam.length) {
      // Give XP to all team members
      const xpGain = calcXPGain(enemyActiveMon, false);
      const slot = G.team[battleContext.playerTeamIdx];
      const levelUps = giveXP(slot, xpGain);
      endBattle("won", slot, levelUps);
    } else {
      const xpGain = calcXPGain(enemyActiveMon, false);
      const slot = G.team[battleContext.playerTeamIdx];
      giveXP(slot, xpGain);
      enemyActiveMon = battleContext.enemyTeam[battleContext.enemyTeamIdx];
      const leaderName = GYM_LEADERS[battleContext.leaderId].name;
      logMsg(`${leaderName} sent out ${enemyActiveMon.name}!`);
      updateBattleUI();
      await delay(600);
      showBattleMainActions();
    }
  }
}

async function handlePlayerFainted() {
  logMsg(`${playerActiveMon.name} fainted!`);
  syncPlayerMonHP();
  await delay(700);

  // Find next healthy monster
  const nextIdx = G.team.findIndex((m, i) => i !== battleContext.playerTeamIdx && m.currentHP > 0);
  if (nextIdx === -1) {
    // All fainted
    endBattle("lost");
  } else {
    logMsg("Choose your next Lumo!");
    battleContext.forcedSwitch = true;
    showSwitchPanel(true);
  }
}

function endBattle(outcome, slot, levelUps) {
  battleContext.battleEnded = true;
  syncPlayerMonHP();
  if (typeof MusicEngine !== "undefined") {
    MusicEngine.stop();
    // Resume overworld music after a short delay
    setTimeout(() => { if (typeof MusicEngine !== "undefined" && !MusicEngine.isMuted()) MusicEngine.playOverworld(); }, 1500);
  }

  if (outcome === "ran" || outcome === "caught") {
    // Mark legendary as caught/encountered
    if (outcome === "caught" && battleContext.isLegendary && battleContext.wildMon) {
      if (!G.defeatedLegendaries.includes(battleContext.wildMon.monsterId)) {
        G.defeatedLegendaries.push(battleContext.wildMon.monsterId);
      }
      saveGame();
    }
    showScreen("screen-main");
    renderWorldMap();
    renderAreaPanel();
    renderHUD();
    return;
  }

  if (outcome === "lost") {
    // Blackout: heal team to 100% HP, lose 5% money
    const moneyLost = Math.floor(G.money * 0.05);
    G.money -= moneyLost;
    for (const m of G.team) { m.currentHP = m.maxHP; m.status = null; }
    showScreen("screen-gameover");
    const lostMsg = moneyLost > 0 ? ` You lost 💰${moneyLost} in the confusion.` : "";
    document.getElementById("gameover-text").textContent =
      `You blacked out and were rushed to ${WORLD_DATA[G.location]?.name || "town"}.${lostMsg} Your Lumos have been fully healed.`;
    return;
  }

  if (outcome === "won") {
    // Show level ups then return
    const handleAfterLevelUps = () => {
      if (battleContext.isGym || battleContext.isChampion || battleContext.isEliteFour) {
        // Look up leader in GYM_LEADERS or ELITE_FOUR
        let leader = GYM_LEADERS[battleContext.leaderId];
        if (!leader && typeof ELITE_FOUR !== "undefined") {
          leader = ELITE_FOUR.find(e => e.id === battleContext.leaderId);
        }
        if (!G.defeatedLeaders.includes(battleContext.leaderId)) {
          G.defeatedLeaders.push(battleContext.leaderId);
        }
        if (battleContext.leaderId === "champion") {
          G.championDefeated = true;
          showHallOfFame();
          triggerStorySequence("champion_defeated");
        } else if (battleContext.isEliteFour) {
          // Elite Four defeated - give money reward
          G.money += 8000;
          showNotification(`⚔️ ${leader?.winQuote || "You defeated the Elite!"}<br><br>Received 💰8000!`, () => {
            showScreen("screen-main");
            renderWorldMap();
            renderAreaPanel();
            renderHUD();
            saveGame();
          });
        } else {
          if (leader && leader.badge) {
            G.badges.push(battleContext.leaderId);
            G.money += 1000 * G.badges.length;
          }
          // Award a held item based on which gym was beaten
          const GYM_HELD_REWARDS = {
            rex: "powerBand", marina: "mysticDew", pyros: "charcoal",
            zara: "magnet", glacier: "leftovers", nyx: "scopeLens",
            oracle: "wisdomLens", drake: "focusSash",
            thorne: "miracleSeed", viper: "blackBelt", atlas: "guardCloak",
            mantis: "quickClaw", zephyra: "swiftFeather", ferro: "wiseGlasses",
            boulder: "vitalSeed", seraphina: "spiritVeil"
          };
          const rewardItem = GYM_HELD_REWARDS[battleContext.leaderId];
          let rewardMsg = "";
          if (rewardItem) {
            G.bag[rewardItem] = (G.bag[rewardItem] || 0) + 1;
            const ri = ITEMS_DATA[rewardItem];
            rewardMsg = `<br>${ri.emoji} You also received a <strong>${ri.name}</strong>!`;
          }
          showNotification(`🏅 ${leader.winQuote}<br><br>You received the <strong>${leader.badge}</strong>! ${leader.badgeEmoji}${rewardMsg}`, () => {
            showScreen("screen-main");
            renderWorldMap();
            renderAreaPanel();
            renderHUD();
            saveGame();
            // Trigger story event for this badge milestone
            triggerBadgeStoryEvent(G.badges.length);
          });
        }
      } else if (battleContext.isRival || battleContext.isUmbra) {
        // Rival / Umbra battle won
        const winner = battleContext.isRival
          ? RIVAL_BATTLES[battleContext.leaderId]
          : UMBRA_BATTLES[battleContext.leaderId];
        if (winner) {
          // Mark as defeated
          if (!G.defeatedLeaders) G.defeatedLeaders = [];
          if (!G.defeatedLeaders.includes(battleContext.leaderId)) {
            G.defeatedLeaders.push(battleContext.leaderId);
          }
          // Give reward if any
          if (winner.reward) {
            for (const [item, amt] of Object.entries(winner.reward)) {
              G.bag[item] = (G.bag[item] || 0) + amt;
            }
          }
          showNotification(`${winner.emoji} <strong>${winner.name}</strong>: "${winner.winQuote}"`, () => {
            showScreen("screen-main");
            renderWorldMap();
            renderAreaPanel();
            renderHUD();
            saveGame();
          });
        } else {
          showScreen("screen-main");
          renderWorldMap();
          renderAreaPanel();
          renderHUD();
        }
      } else if (battleContext.isTrainer) {
        // Route/gym trainer defeated
        if (!G.defeatedTrainers.includes(battleContext.trainerId)) {
          G.defeatedTrainers.push(battleContext.trainerId);
        }
        // Money reward based on enemy team level
        const trainerReward = battleContext.enemyTeam.reduce((sum, m) => sum + m.level * 30, 0);
        G.money += trainerReward;
        showNotification(`⚔️ You defeated the trainer!<br><br>Received 💰${trainerReward}!`, () => {
          showScreen("screen-main");
          renderWorldMap();
          renderAreaPanel();
          renderHUD();
          saveGame();
        });
      } else if (battleContext.isUmbraArea) {
        // Umbra area encounter defeated
        if (!G.defeatedUmbraEncounters.includes(battleContext.leaderId)) {
          G.defeatedUmbraEncounters.push(battleContext.leaderId);
        }
        const battle = UMBRA_BATTLES[battleContext.leaderId];
        // Give reward if any
        if (battle?.reward) {
          for (const [item, amt] of Object.entries(battle.reward)) {
            G.bag[item] = (G.bag[item] || 0) + amt;
          }
        }
        showNotification(`${battle?.emoji || "🕶️"} <strong>${battle?.name || "Umbra Agent"}</strong>: "${battle?.winQuote || "You win..."}"`, () => {
          showScreen("screen-main");
          renderWorldMap();
          renderAreaPanel();
          renderHUD();
          saveGame();
        });
      } else if (battleContext.isQuest) {
        // Quest boss defeated
        const quest = typeof QUESTS_DATA !== "undefined" ? QUESTS_DATA.find(q => q.id === battleContext.questId) : null;
        if (quest) {
          completeQuest(quest);
        }
        showScreen("screen-main");
        renderWorldMap();
        renderAreaPanel();
        renderHUD();
      } else {
        // Wild battle won (including legendary)
        if (battleContext.isLegendary && battleContext.wildMon) {
          if (!G.defeatedLegendaries.includes(battleContext.wildMon.monsterId)) {
            G.defeatedLegendaries.push(battleContext.wildMon.monsterId);
          }
        }
        showScreen("screen-main");
        renderWorldMap();
        renderAreaPanel();
        renderHUD();
      }
    };

    if (slot && levelUps && levelUps.length > 0) {
      showLevelUp(slot, levelUps, handleAfterLevelUps);
    } else {
      handleAfterLevelUps();
    }
  }
}

function showHallOfFame() {
  showScreen("screen-hof");
  document.getElementById("hof-player-name").textContent = `Champion: ${G.playerName}`;
  const teamEl = document.getElementById("hof-team");
  teamEl.innerHTML = "";
  for (const slot of G.team) {
    const def = MONSTERS_DATA[slot.monsterId];
    const div = document.createElement("div");
    div.className = "hof-mon";
    div.innerHTML = `
      <div class="hof-mon-sprite">${def.emoji}</div>
      <div class="hof-mon-name">${slot.nickname || def.name}</div>
      <div class="hof-mon-level">Lv.${slot.level}</div>
    `;
    teamEl.appendChild(div);
  }
  saveGame();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================================
// MULTI-BATTLE SYSTEM (Double & Triple)
// ============================================================

function isMultiBattle() {
  return battleContext.battleMode === "double" || battleContext.battleMode === "triple";
}

function getMultiSlotCount() {
  if (battleContext.battleMode === "triple") return 3;
  if (battleContext.battleMode === "double") return 2;
  return 1;
}

function startMultiBattle(enemyTeam, leaderName, mode) {
  const slots = mode === "triple" ? 3 : 2;
  battleContext.battleMode = mode;

  // Initialize active enemy mons (up to slots from enemy team)
  enemyActiveMons = [];
  battleContext.enemyTeamIdx = 0;
  for (let i = 0; i < Math.min(slots, enemyTeam.length); i++) {
    enemyActiveMons.push(enemyTeam[i]);
    battleContext.enemyTeamIdx = i + 1;
  }
  enemyActiveMon = enemyActiveMons[0]; // primary for compatibility

  // Initialize active player mons
  playerActiveMons = [];
  playerTeamIdxs = [];
  let placed = 0;
  for (let i = 0; i < G.team.length && placed < slots; i++) {
    if (G.team[i].currentHP > 0) {
      const levelCap = battleContext.levelCap || null;
      playerActiveMons.push(buildBattleMon(G.team[i], levelCap));
      playerTeamIdxs.push(i);
      placed++;
    }
  }
  playerActiveMon = playerActiveMons[0]; // primary for compatibility
  battleContext.playerTeamIdx = playerTeamIdxs[0];

  showScreen("screen-battle");
  clearBattleLog();

  // Show multi-battle slots
  const enemySide = document.getElementById("battle-enemy-side");
  const playerSide = document.getElementById("battle-player-side");
  enemySide.classList.add("multi-battle");
  playerSide.classList.add("multi-battle");

  if (battleContext.levelCap) logMsg(`⚠️ Level Cap: ${battleContext.levelCap} — your team is scaled down!`);
  const modeLabel = mode === "triple" ? "TRIPLE BATTLE" : "DOUBLE BATTLE";
  logMsg(`⚔️ ${modeLabel}! ${leaderName} sent out ${enemyActiveMons.map(m => m.name).join(" & ")}!`);

  updateMultiBattleUI();
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = true;
  if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle(battleContext);
}

function updateMultiBattleUI() {
  // Update primary slots (reuse existing updateBattleUI for slot 0)
  updateBattleUI();

  // Update extra enemy slots
  for (let i = 1; i < 3; i++) {
    const infoEl = document.getElementById(`enemy-info-${i + 1}`);
    const spriteEl = document.getElementById(`enemy-sprite-${i + 1}`);
    if (i < enemyActiveMons.length && enemyActiveMons[i] && !enemyActiveMons[i].fainted) {
      const e = enemyActiveMons[i];
      infoEl.classList.remove("hidden");
      spriteEl.classList.remove("hidden");
      document.getElementById(`enemy-name-${i + 1}`).textContent = e.name;
      document.getElementById(`enemy-level-${i + 1}`).textContent = `Lv.${e.level}`;
      const hpPct = Math.max(0, (e.currentHP / e.maxHP) * 100);
      const fill = document.getElementById(`enemy-hp-fill-${i + 1}`);
      fill.style.width = hpPct + "%";
      fill.className = "hp-fill" + (hpPct < 25 ? " red" : hpPct < 50 ? " yellow" : "");
      const statusEl = document.getElementById(`enemy-status-badge-${i + 1}`);
      if (e.status) {
        statusEl.classList.remove("hidden");
        statusEl.textContent = e.status.toUpperCase();
        statusEl.className = `status-badge status-${e.status}`;
      } else {
        statusEl.classList.add("hidden");
      }
      const typesEl = document.getElementById(`enemy-type-badges-${i + 1}`);
      typesEl.innerHTML = "";
      for (const t of e.types) {
        const badge = document.createElement("span");
        badge.className = `type-badge-small type-${t}`;
        badge.textContent = t;
        typesEl.appendChild(badge);
      }
      if (typeof getMonsterSpriteURL === "function" && MONSTERS_DATA[e.monsterId]) {
        spriteEl.innerHTML = `<img src="${getMonsterSpriteURL(MONSTERS_DATA[e.monsterId], 60)}" width="60" height="60" alt="${e.name}">`;
      } else {
        spriteEl.textContent = e.emoji;
      }
    } else {
      infoEl.classList.add("hidden");
      spriteEl.classList.add("hidden");
    }
  }

  // Update extra player slots
  for (let i = 1; i < 3; i++) {
    const infoEl = document.getElementById(`player-info-${i + 1}`);
    const spriteEl = document.getElementById(`player-sprite-${i + 1}`);
    if (i < playerActiveMons.length && playerActiveMons[i] && !playerActiveMons[i].fainted) {
      const p = playerActiveMons[i];
      infoEl.classList.remove("hidden");
      spriteEl.classList.remove("hidden");
      document.getElementById(`player-mon-name-${i + 1}`).textContent = p.name;
      document.getElementById(`player-mon-level-${i + 1}`).textContent = `Lv.${p.level}`;
      const hpPct = Math.max(0, (p.currentHP / p.maxHP) * 100);
      const fill = document.getElementById(`player-hp-fill-${i + 1}`);
      fill.style.width = hpPct + "%";
      fill.className = "hp-fill" + (hpPct < 25 ? " red" : hpPct < 50 ? " yellow" : "");
      document.getElementById(`player-hp-text-${i + 1}`).textContent = `${p.currentHP} / ${p.maxHP}`;
      const statusEl = document.getElementById(`player-status-badge-${i + 1}`);
      if (p.status) {
        statusEl.classList.remove("hidden");
        statusEl.textContent = p.status.toUpperCase();
        statusEl.className = `status-badge status-${p.status}`;
      } else {
        statusEl.classList.add("hidden");
      }
      if (typeof getMonsterSpriteURL === "function" && MONSTERS_DATA[p.monsterId]) {
        spriteEl.innerHTML = `<img src="${getMonsterSpriteURL(MONSTERS_DATA[p.monsterId], 60)}" width="60" height="60" alt="${p.name}">`;
      } else {
        spriteEl.textContent = p.emoji;
      }
    } else {
      infoEl.classList.add("hidden");
      spriteEl.classList.add("hidden");
    }
  }
}

function hideMultiBattleSlots() {
  const enemySide = document.getElementById("battle-enemy-side");
  const playerSide = document.getElementById("battle-player-side");
  enemySide.classList.remove("multi-battle");
  playerSide.classList.remove("multi-battle");
  for (let i = 2; i <= 3; i++) {
    document.getElementById(`enemy-info-${i}`)?.classList.add("hidden");
    document.getElementById(`enemy-sprite-${i}`)?.classList.add("hidden");
    document.getElementById(`player-info-${i}`)?.classList.add("hidden");
    document.getElementById(`player-sprite-${i}`)?.classList.add("hidden");
  }
}

// Multi-battle move panel: player picks a move, then a target
function showMultiMovePanel(monIndex) {
  const mon = playerActiveMons[monIndex];
  if (!mon || mon.fainted) return;

  document.getElementById("battle-main-actions").classList.add("hidden");
  document.getElementById("battle-moves-panel").classList.remove("hidden");
  const grid = document.getElementById("battle-moves-grid");
  grid.innerHTML = "";

  const oldTooltip = document.getElementById("move-info-tooltip");
  if (oldTooltip) oldTooltip.remove();

  logMsg(`Choose a move for ${mon.name}:`);

  for (const m of mon.moves) {
    const move = MOVES_DATA[m.id];
    if (!move) continue;
    const btn = document.createElement("button");
    btn.className = "move-btn";
    const typeColor = getTypeColor(move.type);
    btn.disabled = m.pp <= 0;
    const catIcon = move.cat === "physical" ? "⚔" : move.cat === "special" ? "✦" : "◈";
    btn.innerHTML = `
      <div class="move-btn-left">
        <span class="move-btn-name">${move.name}</span>
        <span class="move-btn-pp">PP: ${m.pp}/${m.maxPP}</span>
      </div>
      <div class="move-btn-meta">
        <span class="move-btn-stats">${catIcon} ${move.power || "—"} / ${move.acc}%</span>
        <span class="move-btn-right" style="background:${typeColor}">${move.type}</span>
      </div>
    `;
    btn.addEventListener("click", () => {
      if (m.pp <= 0) return;
      // For damaging moves, show target selection
      if (move.power > 0) {
        showMultiTargetPanel(monIndex, m.id);
      } else {
        // Status moves target a random enemy
        const aliveEnemies = enemyActiveMons.filter(e => e && !e.fainted && e.currentHP > 0);
        const target = aliveEnemies.length > 0 ? enemyActiveMons.indexOf(aliveEnemies[0]) : 0;
        queueMultiMove(monIndex, m.id, target);
      }
    });
    grid.appendChild(btn);
  }
}

function showMultiTargetPanel(monIndex, moveId) {
  document.getElementById("battle-moves-panel").classList.add("hidden");
  document.getElementById("battle-target-panel").classList.remove("hidden");
  const list = document.getElementById("target-list");
  list.innerHTML = "";

  enemyActiveMons.forEach((e, idx) => {
    if (!e) return;
    const btn = document.createElement("button");
    btn.textContent = `${e.emoji} ${e.name} (Lv.${e.level})`;
    if (e.fainted || e.currentHP <= 0) {
      btn.classList.add("fainted-target");
    } else {
      btn.addEventListener("click", () => {
        document.getElementById("battle-target-panel").classList.add("hidden");
        queueMultiMove(monIndex, moveId, idx);
      });
    }
    list.appendChild(btn);
  });

  document.getElementById("btn-target-back").onclick = () => {
    document.getElementById("battle-target-panel").classList.add("hidden");
    showMultiMovePanel(monIndex);
  };
}

function queueMultiMove(monIndex, moveId, targetIndex) {
  multiBattlePendingMoves.push({ monIndex, moveId, targetIndex });

  // Check if all alive player mons have queued moves
  const alivePlayerMons = playerActiveMons.filter(m => m && !m.fainted && m.currentHP > 0);
  if (multiBattlePendingMoves.length >= alivePlayerMons.length) {
    executeMultiTurn();
  } else {
    // Queue next mon's move
    const nextIdx = playerActiveMons.findIndex((m, i) =>
      m && !m.fainted && m.currentHP > 0 && !multiBattlePendingMoves.find(p => p.monIndex === i));
    if (nextIdx >= 0) {
      showMultiMovePanel(nextIdx);
    }
  }
}

async function executeMultiTurn() {
  if (battleContext.battleEnded) return;
  document.getElementById("battle-main-actions").classList.add("hidden");
  document.getElementById("battle-moves-panel").classList.add("hidden");

  // Build all actions: player moves + enemy AI moves
  const actions = [];

  // Player moves
  for (const pm of multiBattlePendingMoves) {
    const mon = playerActiveMons[pm.monIndex];
    if (!mon || mon.fainted) continue;
    const moveSlot = mon.moves.find(m => m.id === pm.moveId);
    if (moveSlot) moveSlot.pp = Math.max(0, moveSlot.pp - 1);
    actions.push({
      mon, moveId: pm.moveId, targetIdx: pm.targetIndex, isPlayer: true,
      monIdx: pm.monIndex,
      spe: mon.spe * stageMultiplier(mon.stages.spe)
    });
  }

  // Enemy AI moves
  for (let i = 0; i < enemyActiveMons.length; i++) {
    const e = enemyActiveMons[i];
    if (!e || e.fainted || e.currentHP <= 0) continue;
    // Pick a random alive player target
    const alivePlayers = playerActiveMons.map((m, idx) => ({ m, idx })).filter(x => x.m && !x.m.fainted && x.m.currentHP > 0);
    if (alivePlayers.length === 0) break;
    const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    const moveSlot = aiChooseMove(e, target.m);
    const move = MOVES_DATA[moveSlot.id];
    if (moveSlot.id !== "tackle") moveSlot.pp = Math.max(0, moveSlot.pp - 1);
    actions.push({
      mon: e, moveId: moveSlot.id, targetIdx: target.idx, isPlayer: false,
      monIdx: i,
      spe: e.spe * stageMultiplier(e.stages.spe)
    });
  }

  // Sort by speed (fastest first)
  actions.sort((a, b) => {
    const moveA = MOVES_DATA[a.moveId];
    const moveB = MOVES_DATA[b.moveId];
    if (moveA?.effect === "priority" && moveB?.effect !== "priority") return -1;
    if (moveB?.effect === "priority" && moveA?.effect !== "priority") return 1;
    return b.spe - a.spe;
  });

  // Execute all actions in order
  for (const action of actions) {
    if (battleContext.battleEnded) break;
    if (action.mon.fainted || action.mon.currentHP <= 0) continue;

    const target = action.isPlayer
      ? enemyActiveMons[action.targetIdx]
      : playerActiveMons[action.targetIdx];

    if (!target || target.fainted || target.currentHP <= 0) {
      // Retarget to another alive target
      const pool = action.isPlayer ? enemyActiveMons : playerActiveMons;
      const alive = pool.find(m => m && !m.fainted && m.currentHP > 0);
      if (!alive) continue;
      await doAttack(action.mon, alive, action.moveId, action.isPlayer);
    } else {
      await doAttack(action.mon, target, action.moveId, action.isPlayer);
    }

    // Sync HP for player mons
    for (let i = 0; i < playerActiveMons.length; i++) {
      if (playerActiveMons[i]) {
        const slot = G.team[playerTeamIdxs[i]];
        if (slot) {
          slot.currentHP = Math.max(0, playerActiveMons[i].currentHP);
          slot.status = playerActiveMons[i].status;
        }
      }
    }

    updateMultiBattleUI();
    await delay(300);
  }

  // Status ticks for all active mons
  for (const mon of [...playerActiveMons, ...enemyActiveMons]) {
    if (mon && !mon.fainted && mon.currentHP > 0) {
      const msgs = tickStatus(mon);
      for (const msg of msgs) logMsg(msg);
    }
  }

  // Sync HP again
  for (let i = 0; i < playerActiveMons.length; i++) {
    if (playerActiveMons[i]) {
      const slot = G.team[playerTeamIdxs[i]];
      if (slot) {
        slot.currentHP = Math.max(0, playerActiveMons[i].currentHP);
        slot.status = playerActiveMons[i].status;
      }
    }
  }

  updateMultiBattleUI();

  // Check for fainted mons and handle replacements
  await handleMultiFaintedMons();

  multiBattlePendingMoves = [];

  if (!battleContext.battleEnded) {
    // Start next turn - prompt for moves for each alive player mon
    const alivePlayer = playerActiveMons.find(m => m && !m.fainted && m.currentHP > 0);
    if (alivePlayer) {
      const firstIdx = playerActiveMons.indexOf(alivePlayer);
      showBattleMainActions();
    }
  }
}

async function handleMultiFaintedMons() {
  // Handle fainted enemy mons - try to send in replacements
  for (let i = 0; i < enemyActiveMons.length; i++) {
    const e = enemyActiveMons[i];
    if (e && (e.fainted || e.currentHP <= 0)) {
      logMsg(`${e.name} fainted!`);
      // Give XP to the player mon that was targeting it
      const xpGain = calcXPGain(e, false);
      const alivePlayerMon = playerActiveMons.find(m => m && !m.fainted && m.currentHP > 0);
      if (alivePlayerMon) {
        const pIdx = playerActiveMons.indexOf(alivePlayerMon);
        const slot = G.team[playerTeamIdxs[pIdx]];
        giveXP(slot, xpGain);
      }
      // Try to send in next enemy from team
      if (battleContext.enemyTeamIdx < battleContext.enemyTeam.length) {
        const next = battleContext.enemyTeam[battleContext.enemyTeamIdx];
        battleContext.enemyTeamIdx++;
        enemyActiveMons[i] = next;
        logMsg(`${next.name} was sent out!`);
      } else {
        enemyActiveMons[i] = null;
      }
    }
  }

  // Handle fainted player mons - try to send in replacements
  for (let i = 0; i < playerActiveMons.length; i++) {
    const p = playerActiveMons[i];
    if (p && (p.fainted || p.currentHP <= 0)) {
      logMsg(`${p.name} fainted!`);
      // Find next alive team member not already in battle
      const nextIdx = G.team.findIndex((m, idx) =>
        m.currentHP > 0 && !playerTeamIdxs.includes(idx));
      if (nextIdx >= 0) {
        const levelCap = battleContext.levelCap || null;
        playerActiveMons[i] = buildBattleMon(G.team[nextIdx], levelCap);
        playerTeamIdxs[i] = nextIdx;
        logMsg(`Go, ${playerActiveMons[i].name}!`);
      } else {
        playerActiveMons[i] = null;
      }
    }
  }

  // Check if all enemies are down
  const aliveEnemies = enemyActiveMons.filter(e => e && !e.fainted && e.currentHP > 0);
  if (aliveEnemies.length === 0) {
    // Find XP slot for level ups
    const aliveP = playerActiveMons.find(m => m && !m.fainted);
    const pIdx = aliveP ? playerActiveMons.indexOf(aliveP) : 0;
    const slot = G.team[playerTeamIdxs[pIdx] || 0];
    const levelUps = []; // XP was already given during faint handling
    hideMultiBattleSlots();
    endBattle("won", slot, levelUps);
    return;
  }

  // Check if all players are down
  const alivePlayers = playerActiveMons.filter(p => p && !p.fainted && p.currentHP > 0);
  if (alivePlayers.length === 0) {
    hideMultiBattleSlots();
    endBattle("lost");
    return;
  }

  // Update main references for compatibility
  enemyActiveMon = aliveEnemies[0];
  const alivePlayerMon = alivePlayers[0];
  playerActiveMon = alivePlayerMon;
  battleContext.playerTeamIdx = playerTeamIdxs[playerActiveMons.indexOf(alivePlayerMon)];

  updateMultiBattleUI();
  await delay(500);
}

// Override showMovePanel for multi battles
const _originalShowMovePanel = typeof showMovePanel === "function" ? showMovePanel : null;

// Hook into the fight button for multi battles
function onFightButtonMulti() {
  if (!isMultiBattle()) return false;
  multiBattlePendingMoves = [];
  const firstAlive = playerActiveMons.findIndex(m => m && !m.fainted && m.currentHP > 0);
  if (firstAlive >= 0) {
    showMultiMovePanel(firstAlive);
  }
  return true;
}

// ============================================================
// TEAM SCREEN
// ============================================================
function showTeamScreen() {
  showScreen("screen-team");
  document.getElementById("team-detail").classList.add("hidden");
  const list = document.getElementById("team-list");
  list.style.display = "";
  list.innerHTML = "";
  G.team.forEach((slot, idx) => {
    const def = MONSTERS_DATA[slot.monsterId];
    const card = document.createElement("div");
    card.className = "team-card" + (slot.currentHP <= 0 ? " fainted" : "");
    const hpPct = Math.round((slot.currentHP / slot.maxHP) * 100);
    const hpClass = hpPct < 25 ? "red" : hpPct < 50 ? "yellow" : "";
    const typeHTML = def.types.map(t => `<span class="type-badge type-${t}" style="font-size:0.6rem">${t}</span>`).join("");
    const spriteHTML = (typeof getMonsterSpriteURL === "function")
      ? `<img src="${getMonsterSpriteURL(def, 56)}" width="56" height="56" alt="${def.name}" class="team-sprite-img">`
      : `<span class="team-sprite">${def.emoji}</span>`;
    const heldBadge = slot.heldItem && ITEMS_DATA[slot.heldItem]
      ? `<span class="held-badge" title="${ITEMS_DATA[slot.heldItem].name}">${ITEMS_DATA[slot.heldItem].emoji}</span>`
      : "";
    card.innerHTML = `
      <div class="team-card-header">
        ${spriteHTML}
        <div>
          <div class="team-name">${slot.nickname || def.name} ${heldBadge}</div>
          <div class="team-level">Lv.${slot.level}</div>
          <div class="team-types">${typeHTML}</div>
        </div>
      </div>
      <div class="team-hp-bar-wrap">
        <div class="team-hp-bar"><div class="team-hp-fill ${hpClass}" style="width:${hpPct}%"></div></div>
        <span class="team-hp-text">${slot.currentHP}/${slot.maxHP}</span>
      </div>
    `;
    card.addEventListener("click", () => showTeamDetail(slot, idx));
    list.appendChild(card);
  });
}

function showTeamDetail(slot, idx) {
  const def = MONSTERS_DATA[slot.monsterId];
  const lv = slot.level;
  document.getElementById("team-detail").classList.remove("hidden");
  document.getElementById("team-list").style.display = "none";

  const nature = slot.nature || "Balanced";
  const natureData = typeof NATURES_DATA !== "undefined" ? NATURES_DATA[nature] : null;
  const ivs = slot.ivs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
  const stats = [
    ["HP",  calcMaxHP(def.base.hp, lv, ivs.hp),                                250],
    ["ATK", applyNatureToStat("atk", calcStat(def.base.atk, lv, ivs.atk), nature), 200],
    ["DEF", applyNatureToStat("def", calcStat(def.base.def, lv, ivs.def), nature), 200],
    ["SPA", applyNatureToStat("spa", calcStat(def.base.spa, lv, ivs.spa), nature), 200],
    ["SPD", applyNatureToStat("spd", calcStat(def.base.spd, lv, ivs.spd), nature), 200],
    ["SPE", applyNatureToStat("spe", calcStat(def.base.spe, lv, ivs.spe), nature), 200]
  ];
  const statKeyMap = { ATK:"atk", DEF:"def", SPA:"spa", SPD:"spd", SPE:"spe" };
  const typeHTML = def.types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(" ");
  const statsHTML = stats.map(([n, v, max]) => {
    const key = statKeyMap[n];
    let color = n === "HP" ? "#3fb950" : "#58a6ff";
    let label = n;
    if (natureData && key) {
      if (natureData.up === key) { color = "#f85149"; label = n + "▲"; }
      if (natureData.down === key) { color = "#58a6ff"; label = n + "▼"; }
    }
    return `<div class="stat-row">
      <span class="stat-label">${label}</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100,(v/max)*100)}%;background:${color}"></div></div>
      <span class="stat-val">${v}</span>
    </div>`;
  }).join("");
  const movesHTML = slot.moves.map(mid => {
    const m = MOVES_DATA[mid];
    if (!m) return "";
    return `<div class="move-detail-card">
      <div class="move-detail-name">${m.name}</div>
      <div class="move-detail-info">${m.type} | ${m.cat} | Pwr:${m.power||"—"}</div>
    </div>`;
  }).join("");

  // Held item display
  const currentHeld = slot.heldItem ? ITEMS_DATA[slot.heldItem] : null;
  const heldDisplay = currentHeld
    ? `<div class="held-item-current">
        <span class="held-item-icon">${currentHeld.emoji}</span>
        <div class="held-item-info">
          <div class="held-item-name">${currentHeld.name}</div>
          <div class="held-item-desc">${currentHeld.desc}</div>
        </div>
        <button class="btn-unequip-held" data-unequip-mon="${idx}">Remove</button>
      </div>`
    : `<span style="color:#888;font-size:0.8rem">No item held</span>`;

  // Available held items from bag to equip
  const availableHeld = Object.entries(G.bag)
    .filter(([id, cnt]) => cnt > 0 && ITEMS_DATA[id]?.type === "held");
  const heldOptionsHTML = availableHeld.map(([id, cnt]) => {
    const item = ITEMS_DATA[id];
    return `<button class="held-item-option" data-equip-item="${id}" data-equip-mon="${idx}">
      ${item.emoji} ${item.name} <span class="held-item-qty">x${cnt}</span>
    </button>`;
  }).join("") || "<span style='color:#888;font-size:0.8rem'>No held items in bag</span>";

  // Use item panel
  const healableItems = Object.entries(G.bag)
    .filter(([id, cnt]) => cnt > 0 && (ITEMS_DATA[id]?.type === "heal" || ITEMS_DATA[id]?.type === "revive" || ITEMS_DATA[id]?.type === "candy"));
  const itemsHTML = healableItems.map(([id, cnt]) => {
    const item = ITEMS_DATA[id];
    return `<button class="catch-item-btn" data-item="${id}" data-mon="${idx}">
      ${item.emoji} ${item.name} x${cnt}
    </button>`;
  }).join("") || "<span style='color:#888;font-size:0.8rem'>No usable items</span>";

  const nextLvXP = xpForLevel(lv + 1);
  const thisLvXP = xpForLevel(lv);
  const currXP = slot.xp || 0;
  const xpToNext = Math.max(0, nextLvXP - currXP);

  const detailSpriteHTML = (typeof getMonsterSpriteURL === "function")
    ? `<img src="${getMonsterSpriteURL(def, 100)}" width="100" height="100" alt="${def.name}" style="border-radius:12px">`
    : `<span class="detail-sprite">${def.emoji}</span>`;
  document.getElementById("team-detail-content").innerHTML = `
    <div style="text-align:center;margin-bottom:1rem">
      ${detailSpriteHTML}
      <h3>${slot.nickname || def.name} ${typeHTML}</h3>
      <p style="color:var(--text-secondary);font-size:0.8rem">Lv.${lv} | XP to next: ${xpToNext}</p>
      <p style="font-size:0.8rem;color:#c9a0dc;margin:0.2rem 0"><strong>${nature}</strong> nature${natureData ? ` — ${natureData.desc}` : ""}</p>
      <p style="font-size:0.8rem;color:var(--text-muted)">${def.desc}</p>
    </div>
    <div class="detail-section"><h4>Stats</h4>${statsHTML}
      <div style="margin-top:0.5rem;font-size:0.7rem;color:var(--text-muted)">
        <span style="color:var(--accent-purple);font-weight:bold">IVs:</span>
        HP:${(slot.ivs||{}).hp||0} ATK:${(slot.ivs||{}).atk||0} DEF:${(slot.ivs||{}).def||0} SPA:${(slot.ivs||{}).spa||0} SPD:${(slot.ivs||{}).spd||0} SPE:${(slot.ivs||{}).spe||0}
        <span style="color:var(--accent-blue)">(${Object.values(slot.ivs||{}).reduce((a,b)=>a+b,0)}/186)</span>
      </div>
    </div>
    <div class="detail-section"><h4>Moves</h4><div class="moves-grid">${movesHTML}</div></div>
    <div class="detail-section">
      <h4>Held Item</h4>
      ${heldDisplay}
      <div class="held-item-options" style="margin-top:0.5rem;display:flex;gap:0.4rem;flex-wrap:wrap">${heldOptionsHTML}</div>
    </div>
    <div class="detail-section"><h4>Use Item</h4><div style="display:flex;gap:0.5rem;flex-wrap:wrap">${itemsHTML}</div></div>
  `;

  // Held item equip handlers
  document.querySelectorAll("[data-equip-item]").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.equipItem;
      const monIdx = parseInt(btn.dataset.equipMon);
      const mon = G.team[monIdx];
      // If already holding something, return it to bag
      if (mon.heldItem) {
        G.bag[mon.heldItem] = (G.bag[mon.heldItem] || 0) + 1;
      }
      mon.heldItem = itemId;
      G.bag[itemId]--;
      showNotification(`${MONSTERS_DATA[mon.monsterId].name} is now holding ${ITEMS_DATA[itemId].name}!`);
      showTeamDetail(G.team[monIdx], monIdx);
    });
  });

  // Held item unequip handler
  document.querySelectorAll("[data-unequip-mon]").forEach(btn => {
    btn.addEventListener("click", () => {
      const monIdx = parseInt(btn.dataset.unequipMon);
      const mon = G.team[monIdx];
      if (mon.heldItem) {
        const itemName = ITEMS_DATA[mon.heldItem].name;
        G.bag[mon.heldItem] = (G.bag[mon.heldItem] || 0) + 1;
        mon.heldItem = null;
        showNotification(`Removed ${itemName} and returned it to bag.`);
        showTeamDetail(G.team[monIdx], monIdx);
      }
    });
  });

  // Item use handlers
  document.querySelectorAll("[data-item][data-mon]").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.item;
      const monIdx = parseInt(btn.dataset.mon);
      useItemOnMon(itemId, monIdx);
      showTeamDetail(G.team[monIdx], monIdx);
    });
  });
}

function useItemOnMon(itemId, monIdx) {
  const item = ITEMS_DATA[itemId];
  const slot = G.team[monIdx];
  if (!item || (G.bag[itemId] || 0) <= 0) return;
  if (item.type === "heal") {
    if (slot.currentHP >= slot.maxHP) { showNotification("Already at full HP!"); return; }
    if (slot.currentHP <= 0) { showNotification("Can't use on a fainted Lumo!"); return; }
    slot.currentHP = Math.min(slot.maxHP, slot.currentHP + item.healAmt);
    G.bag[itemId]--;
    showNotification(`Used ${item.name}! HP restored.`);
  } else if (item.type === "revive") {
    if (slot.currentHP > 0) { showNotification("Lumo is not fainted!"); return; }
    slot.currentHP = Math.floor(slot.maxHP / 2);
    G.bag[itemId]--;
    showNotification(`${MONSTERS_DATA[slot.monsterId].name} was revived!`);
  } else if (item.type === "candy") {
    if (slot.currentHP <= 0) { showNotification("Can't use on a fainted Lumo!"); return; }
    if (slot.level >= 100) { showNotification("Already at max level!"); return; }
    G.bag[itemId]--;
    const levelUps = giveXP(slot, xpForLevel(slot.level + 1) - (slot.xp || 0));
    // Check evolution
    const evoTarget = checkEvolution(slot);
    if (evoTarget) {
      const evoResult = evolveMonster(slot);
      if (evoResult) {
        const oldDef = MONSTERS_DATA[evoResult.oldId];
        const newDef = MONSTERS_DATA[evoResult.newId];
        G.seenMonsters.add(evoResult.newId);
        G.caughtMonsters.add(evoResult.newId);
        showNotification(`🍬 ${oldDef.name} leveled up to Lv.${slot.level}!<br><br>✨ ${oldDef.name} evolved into <strong>${newDef.name}</strong>!`);
        return;
      }
    }
    showNotification(`🍬 ${MONSTERS_DATA[slot.monsterId].name} leveled up to Lv.${slot.level}!`);
  }
}

// ============================================================
// BAG SCREEN
// ============================================================
function showBagScreen() {
  showScreen("screen-bag");
  const orbsEl = document.getElementById("bag-orbs");
  const medEl = document.getElementById("bag-medicine");
  const heldEl = document.getElementById("bag-held");
  orbsEl.innerHTML = "";
  medEl.innerHTML = "";
  heldEl.innerHTML = "";

  // Count held items that are equipped on team members
  const equippedCounts = {};
  for (const mon of G.team) {
    if (mon.heldItem) equippedCounts[mon.heldItem] = (equippedCounts[mon.heldItem] || 0) + 1;
  }

  for (const [itemId, count] of Object.entries(G.bag)) {
    const item = ITEMS_DATA[itemId];
    if (!item || count <= 0) continue;
    const div = document.createElement("div");
    div.className = "bag-item";
    div.innerHTML = `
      <span class="bag-item-icon">${item.emoji}</span>
      <div style="flex:1">
        <div class="bag-item-name">${item.name}</div>
        <div class="bag-item-desc">${item.desc}</div>
      </div>
      <span class="bag-item-count">x${count}</span>
    `;
    if (item.type === "ball") orbsEl.appendChild(div);
    else if (item.type === "held") heldEl.appendChild(div);
    else medEl.appendChild(div); // heal, revive, candy all go in medicine
  }

  // Show equipped items info
  for (const [itemId, eqCount] of Object.entries(equippedCounts)) {
    const item = ITEMS_DATA[itemId];
    if (!item) continue;
    const div = document.createElement("div");
    div.className = "bag-item bag-item-equipped";
    div.innerHTML = `
      <span class="bag-item-icon">${item.emoji}</span>
      <div style="flex:1">
        <div class="bag-item-name">${item.name} <span class="equipped-tag">EQUIPPED</span></div>
        <div class="bag-item-desc">${item.desc}</div>
      </div>
      <span class="bag-item-count">x${eqCount}</span>
    `;
    heldEl.appendChild(div);
  }

  if (!heldEl.hasChildNodes()) {
    heldEl.innerHTML = '<div class="bag-item-empty" style="color:#888;font-size:0.85rem;padding:0.5rem">No held items yet. Win gym battles to earn held items!</div>';
  }
}

// ============================================================
// PC BOX SCREEN
// ============================================================
function showBoxScreen() {
  showScreen("screen-box");
  renderBoxScreen();
}

function renderBoxScreen() {
  const teamList = document.getElementById("box-team-list");
  const storageList = document.getElementById("box-storage-list");
  document.getElementById("box-team-count").textContent = G.team.length;
  document.getElementById("box-storage-count").textContent = G.box.length;
  teamList.innerHTML = "";
  storageList.innerHTML = "";

  // Render team
  G.team.forEach((slot, idx) => {
    const card = createBoxCard(slot, idx, "team");
    teamList.appendChild(card);
  });

  // Render box storage
  if (G.box.length === 0) {
    storageList.innerHTML = '<div class="box-empty">No Lumos in storage. Catch more when your team is full!</div>';
  } else {
    G.box.forEach((slot, idx) => {
      const card = createBoxCard(slot, idx, "box");
      storageList.appendChild(card);
    });
  }
}

function createBoxCard(slot, idx, source) {
  const def = MONSTERS_DATA[slot.monsterId];
  const card = document.createElement("div");
  const hpPct = Math.round((slot.currentHP / slot.maxHP) * 100);
  const hpClass = slot.currentHP <= 0 ? "fainted" : "";
  card.className = `box-card ${hpClass}`;
  const spriteHTML = (typeof getMonsterSpriteURL === "function")
    ? `<img src="${getMonsterSpriteURL(def, 40)}" width="40" height="40" alt="${def.name}">`
    : `<span style="font-size:1.5rem">${def.emoji}</span>`;
  const typeHTML = def.types.map(t => `<span class="type-badge type-${t}" style="font-size:0.55rem">${t}</span>`).join("");
  card.innerHTML = `
    <div class="box-card-sprite">${spriteHTML}</div>
    <div class="box-card-info">
      <div class="box-card-name">${slot.nickname || def.name}</div>
      <div class="box-card-level">Lv.${slot.level} ${typeHTML}</div>
      <div class="box-card-hp">${slot.currentHP}/${slot.maxHP} HP</div>
    </div>
    <div class="box-card-actions">
      ${source === "box" ? `<button class="box-btn box-withdraw" data-box-idx="${idx}">Withdraw</button>` : ""}
      ${source === "team" && G.team.length > 1 ? `<button class="box-btn box-deposit" data-team-idx="${idx}">Deposit</button>` : ""}
    </div>
  `;

  if (source === "box") {
    const withdrawBtn = card.querySelector(".box-withdraw");
    if (withdrawBtn) {
      withdrawBtn.addEventListener("click", () => {
        if (G.team.length >= 6) {
          // Swap mode: ask which team member to swap
          showBoxSwapPicker(idx);
        } else {
          // Withdraw directly
          const mon = G.box.splice(idx, 1)[0];
          G.team.push(mon);
          renderBoxScreen();
        }
      });
    }
  }
  if (source === "team") {
    const depositBtn = card.querySelector(".box-deposit");
    if (depositBtn) {
      depositBtn.addEventListener("click", () => {
        if (G.team.length <= 1) {
          showNotification("You must keep at least 1 Lumo on your team!");
          return;
        }
        const mon = G.team.splice(idx, 1)[0];
        G.box.push(mon);
        renderBoxScreen();
      });
    }
  }

  return card;
}

function showBoxSwapPicker(boxIdx) {
  showNotification("Team is full! Choose a team member to swap:", () => {});
  // Replace notification with swap picker
  const notifBox = document.getElementById("notification-box");
  const notifOverlay = document.getElementById("notification-overlay");
  notifOverlay.classList.remove("hidden");
  let swapHTML = '<p style="margin-bottom:0.5rem"><strong>Swap with which team member?</strong></p>';
  G.team.forEach((slot, tIdx) => {
    const def = MONSTERS_DATA[slot.monsterId];
    swapHTML += `<button class="box-swap-btn" data-swap-team="${tIdx}" style="display:block;width:100%;margin:0.3rem 0;padding:0.5rem;border-radius:6px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);cursor:pointer;text-align:left">
      ${def.emoji} ${slot.nickname || def.name} Lv.${slot.level}
    </button>`;
  });
  swapHTML += `<button class="btn-secondary" id="btn-swap-cancel" style="margin-top:0.5rem;width:100%">Cancel</button>`;
  notifBox.innerHTML = swapHTML;
  notifBox.querySelectorAll("[data-swap-team]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tIdx = parseInt(btn.dataset.swapTeam);
      const fromBox = G.box.splice(boxIdx, 1)[0];
      const fromTeam = G.team.splice(tIdx, 1, fromBox)[0];
      G.box.push(fromTeam);
      notifOverlay.classList.add("hidden");
      renderBoxScreen();
    });
  });
  document.getElementById("btn-swap-cancel").addEventListener("click", () => {
    notifOverlay.classList.add("hidden");
  });
}

// ============================================================
// MONSTERDEX
// ============================================================
function showDexScreen() {
  showScreen("screen-dex");
  document.getElementById("dex-detail").classList.add("hidden");
  document.getElementById("dex-grid").style.display = "";
  const seen = G.seenMonsters.size;
  const caught = G.caughtMonsters.size;
  const total = Object.keys(MONSTERS_DATA).length;
  document.getElementById("dex-stats").textContent =
    `Seen: ${seen} / ${total} | Caught: ${caught} / ${total}`;
  renderDexGrid("all", "");
}

function showTutorial() {
  document.getElementById("tutorial-overlay").classList.remove("hidden");
}

function hideTutorial() {
  document.getElementById("tutorial-overlay").classList.add("hidden");
}

function renderDexGrid(filter, search) {
  const grid = document.getElementById("dex-grid");
  grid.innerHTML = "";
  for (const [id, def] of Object.entries(MONSTERS_DATA)) {
    const mid = parseInt(id);
    const seen = G.seenMonsters.has(mid);
    const caught = G.caughtMonsters.has(mid);
    if (filter === "caught" && !caught) continue;
    if (filter === "seen" && !seen) continue;
    if (search && !def.name.toLowerCase().includes(search.toLowerCase()) && !seen) continue;

    const card = document.createElement("div");
    card.className = "dex-card";
    if (!seen) card.classList.add("unseen");
    else if (!caught) card.classList.add("seen");
    else card.classList.add("caught");
    const dexSpriteHTML = seen && typeof getMonsterSpriteURL === "function"
      ? `<img src="${getMonsterSpriteURL(def, 56)}" width="56" height="56" alt="${def.name}" style="border-radius:6px">`
      : `<div class="dex-emoji">${seen ? def.emoji : "❓"}</div>`;
    card.innerHTML = `
      <div class="dex-num">#${String(mid).padStart(3,"0")}</div>
      ${dexSpriteHTML}
      <div class="dex-name">${seen ? def.name : "???"}</div>
    `;
    if (seen) {
      card.addEventListener("click", () => showDexDetail(mid));
    }
    grid.appendChild(card);
  }
}

function showDexDetail(monsterId) {
  const def = MONSTERS_DATA[monsterId];
  const caught = G.caughtMonsters.has(monsterId);
  document.getElementById("dex-detail").classList.remove("hidden");
  document.getElementById("dex-grid").style.display = "none";

  const typeHTML = def.types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(" ");
  const bst = Object.values(def.base).reduce((s, v) => s + v, 0);
  const statsHTML = Object.entries(def.base).map(([stat, val]) => `
    <div class="stat-row">
      <span class="stat-label">${stat.toUpperCase()}</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100,(val/180)*100)}%;background:#58a6ff"></div></div>
      <span class="stat-val">${val}</span>
    </div>`).join("") + `
    <div class="stat-row stat-row-bst">
      <span class="stat-label">BST</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100,(bst/720)*100)}%;background:var(--accent-yellow)"></div></div>
      <span class="stat-val">${bst}</span>
    </div>`;
  const evoInfo = def.evolveTo
    ? `Evolves into ${MONSTERS_DATA[def.evolveTo]?.name} at Lv.${def.evolveLevel}`
    : "Does not evolve";

  const dexDetailSprite = (typeof getMonsterSpriteURL === "function")
    ? `<img src="${getMonsterSpriteURL(def, 110)}" width="110" height="110" alt="${def.name}" style="border-radius:12px">`
    : `<span style="font-size:5rem">${def.emoji}</span>`;
  // Build learnset/moveset table
  const movesetRows = [];
  const seenMoves = new Set();
  // Collect all moves with their learn levels
  const moveEntries = [];
  for (const entry of def.learnset) {
    if (typeof entry[0] === "number" && typeof entry[1] === "string") {
      moveEntries.push({level: entry[0], moveId: entry[1]});
    }
    if (entry.length >= 3 && Array.isArray(entry[2])) {
      moveEntries.push({level: entry[2][0], moveId: entry[2][1]});
    }
  }
  moveEntries.sort((a, b) => a.level - b.level);
  for (const me of moveEntries) {
    if (seenMoves.has(me.moveId)) continue;
    seenMoves.add(me.moveId);
    const mv = MOVES_DATA[me.moveId];
    if (!mv) continue;
    const typeColor = getTypeColor(mv.type);
    const catIcon = mv.cat === "physical" ? "⚔" : mv.cat === "special" ? "✦" : "◈";
    movesetRows.push(`
      <tr class="dex-move-row" title="${mv.desc}">
        <td style="font-size:0.7rem;color:var(--text-muted);width:30px">Lv${me.level}</td>
        <td style="font-weight:bold;font-size:0.78rem">${mv.name}</td>
        <td><span style="background:${typeColor};color:#fff;font-size:0.6rem;padding:1px 4px;border-radius:3px">${mv.type}</span></td>
        <td style="font-size:0.7rem;text-align:center;width:22px" title="${mv.cat}">${catIcon}</td>
        <td style="font-size:0.7rem;text-align:right;width:28px">${mv.power || "—"}</td>
        <td style="font-size:0.7rem;text-align:right;width:28px">${mv.acc}%</td>
      </tr>`);
  }
  const movesetHTML = `
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="font-size:0.65rem;color:var(--text-muted);text-align:left;border-bottom:1px solid var(--border)">
        <th>Lv</th><th>Move</th><th>Type</th><th style="text-align:center">Cat</th><th style="text-align:right">Pow</th><th style="text-align:right">Acc</th>
      </tr></thead>
      <tbody>${movesetRows.join("")}</tbody>
    </table>`;

  // Build paginated lore lines (4 lines per page)
  const loreText = def.lore || def.desc;
  // Split into sentences then wrap into lines of ~45 chars
  const sentences = loreText.match(/[^.!?]+[.!?]+/g) || [loreText];
  const lines = [];
  for (const s of sentences) {
    const words = s.trim().split(" ");
    let line = "";
    for (const w of words) {
      if ((line + " " + w).trim().length > 45 && line.length > 0) {
        lines.push(line.trim());
        line = w;
      } else {
        line = (line + " " + w).trim();
      }
    }
    if (line) lines.push(line.trim());
  }
  const LINES_PER_PAGE = 4;
  const totalPages = Math.max(1, Math.ceil(lines.length / LINES_PER_PAGE));
  let lorePage = 0;

  const renderLoreScreen = () => {
    const start = lorePage * LINES_PER_PAGE;
    const pageLines = lines.slice(start, start + LINES_PER_PAGE);
    while (pageLines.length < LINES_PER_PAGE) pageLines.push("");
    document.getElementById("pokedex-lines").innerHTML = pageLines.map(l => `<div>${l || "&nbsp;"}</div>`).join("");
    document.getElementById("pokedex-page-indicator").textContent = `${lorePage + 1} / ${totalPages}`;
    document.getElementById("pokedex-prev").disabled = lorePage === 0;
    document.getElementById("pokedex-next").disabled = lorePage >= totalPages - 1;
  };

  document.getElementById("dex-detail-content").innerHTML = `
    <div style="text-align:center;margin-bottom:1rem">
      ${dexDetailSprite}
      <h3 style="margin-top:0.5rem">#${String(monsterId).padStart(3,"0")} ${def.name}</h3>
      <div>${typeHTML}</div>
      <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem">${caught ? "✅ Caught" : "👁 Seen"}</p>
    </div>
    <div class="detail-section">
      <div class="pokedex-screen">
        <div class="pokedex-screen-lines" id="pokedex-lines"></div>
        <div class="pokedex-page-nav">
          <button class="pokedex-page-btn" id="pokedex-prev">◀ PREV</button>
          <span class="pokedex-page-indicator" id="pokedex-page-indicator"></span>
          <button class="pokedex-page-btn" id="pokedex-next">NEXT ▶</button>
        </div>
      </div>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.3rem">${evoInfo}</p>
      <p style="font-size:0.8rem;color:var(--text-muted)">Rarity: ${def.rarity}</p>
    </div>
    <div class="detail-section"><h4>Base Stats</h4>${statsHTML}</div>
    <div class="detail-section"><h4>Learnset</h4>${movesetHTML}</div>
  `;

  renderLoreScreen();
  document.getElementById("pokedex-prev").addEventListener("click", () => { lorePage--; renderLoreScreen(); });
  document.getElementById("pokedex-next").addEventListener("click", () => { lorePage++; renderLoreScreen(); });
}

// ============================================================
// EVENT LISTENERS & INIT
// ============================================================
function initEventListeners() {
  // Title screen
  document.getElementById("btn-new-game").addEventListener("click", () => {
    showScreen("screen-create");
    typewriterDialog("Welcome to the world of Lumoria! I am Professor Arbor. The world is full of incredible creatures called Lumos. Tell me, what is your name?");
  });
  document.getElementById("btn-continue").addEventListener("click", () => {
    if (loadGame()) {
      showScreen("screen-main");
      renderHUD();
      renderWorldMap();
      renderAreaPanel();
      if (typeof MusicEngine !== "undefined") { MusicEngine.init(); MusicEngine.playOverworld(); }
    } else {
      showNotification("No save file found!");
    }
  });

  // Character creation
  document.getElementById("btn-confirm-name").addEventListener("click", () => {
    const name = document.getElementById("player-name-input").value.trim();
    if (!name) { showNotification("Please enter your name!"); return; }
    window._pendingName = name;
    showStarterScreen();
  });
  document.getElementById("player-name-input").addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("btn-confirm-name").click();
  });

  // Starter selection
  document.getElementById("btn-take-starter").addEventListener("click", () => {
    const starterId = window._selectedStarter;
    if (!starterId) return;
    G = newGameState(window._pendingName, starterId);
    showScreen("screen-main");
    renderHUD();
    renderWorldMap();
    renderAreaPanel();
    saveGame();
    showNotification(`🎉 You chose ${MONSTERS_DATA[starterId].name}! Your adventure begins!`, () => {
      if (typeof MusicEngine !== "undefined") { MusicEngine.init(); MusicEngine.playOverworld(); }
      triggerStorySequence("intro");
    });
  });
  document.getElementById("btn-cancel-starter").addEventListener("click", () => {
    window._selectedStarter = null;
    document.getElementById("starter-confirm").classList.add("hidden");
    document.querySelectorAll(".starter-card").forEach(c => c.classList.remove("selected"));
  });

  // World actions
  document.getElementById("btn-explore").addEventListener("click", exploreArea);
  document.getElementById("btn-gym").addEventListener("click", () => {
    const area = WORLD_DATA[G.location];
    if (!area?.gymLeader || G.defeatedLeaders.includes(area.gymLeader)) return;
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumos are fainted! Heal first."); return; }
    // Require all gym trainers beaten first (if feature is active)
    if (typeof GYM_TRAINERS !== "undefined" && GYM_TRAINERS[area.gymLeader]) {
      const trainers = GYM_TRAINERS[area.gymLeader];
      const beatenCount = trainers.filter((t, i) => G.defeatedTrainers.includes(`gym_${area.gymLeader}_trainer_${i}`)).length;
      if (beatenCount < trainers.length) { showNotification("You must defeat all gym trainers before challenging the leader!"); return; }
    }
    const leader = GYM_LEADERS[area.gymLeader];
    showBattleFormatSelection(leader.name, leader.emoji, leader.quote, fmt => startGymBattle(area.gymLeader, fmt));
  });
  document.getElementById("btn-champion").addEventListener("click", () => {
    if (G.championDefeated) return;
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumos are fainted! Heal first."); return; }
    const leader = GYM_LEADERS["champion"];
    showBattleFormatSelection(leader.name, "👑", leader.quote, fmt => startGymBattle("champion", fmt));
  });

  // Elite Four
  document.getElementById("btn-elite-four")?.addEventListener("click", () => {
    if (typeof ELITE_FOUR === "undefined") return;
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumos are fainted! Heal first."); return; }
    const nextElite = ELITE_FOUR.find(e => !G.defeatedLeaders.includes(e.id));
    if (nextElite) {
      showBattleFormatSelection(nextElite.name, nextElite.emoji || "⚔️", nextElite.quote, fmt => startGymBattle(nextElite.id, fmt));
    }
  });

  // Bottom nav
  document.getElementById("nav-team").addEventListener("click", showTeamScreen);
  document.getElementById("nav-bag").addEventListener("click", showBagScreen);
  document.getElementById("nav-dex").addEventListener("click", showDexScreen);
  document.getElementById("nav-save").addEventListener("click", saveGame);
  document.getElementById("nav-tutorial")?.addEventListener("click", showTutorial);
  document.getElementById("nav-music")?.addEventListener("click", () => {
    if (typeof MusicEngine !== "undefined") {
      const muted = MusicEngine.toggleMute();
      const btn = document.getElementById("nav-music");
      btn.textContent = muted ? "🔇 MUSIC" : "🔊 MUSIC";
      if (!muted) MusicEngine.playOverworld();
    }
  });
  document.getElementById("nav-quests").addEventListener("click", showQuestScreen);
  document.getElementById("nav-box").addEventListener("click", showBoxScreen);
  document.getElementById("nav-shop").addEventListener("click", showShopScreen);

  // Quest filter buttons
  document.querySelectorAll(".quest-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".quest-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderQuestLog();
    });
  });

  // Shop/Quest back buttons
  document.getElementById("shop-back-btn")?.addEventListener("click", () => {
    showScreen("screen-main"); renderHUD();
  });
  document.getElementById("quests-back-btn")?.addEventListener("click", () => {
    showScreen("screen-main"); renderHUD();
  });
  document.getElementById("btn-tutorial-close").addEventListener("click", hideTutorial);

  // Battle controls
  document.getElementById("btn-fight").addEventListener("click", () => {
    if (!onFightButtonMulti()) showMovePanel();
  });
  document.getElementById("btn-catch").addEventListener("click", showCatchPanel);
  document.getElementById("btn-battle-bag").addEventListener("click", showBattleBagPanel);
  document.getElementById("btn-switch").addEventListener("click", () => showSwitchPanel(false));
  document.getElementById("btn-run").addEventListener("click", playerRun);
  document.getElementById("btn-moves-back").addEventListener("click", showBattleMainActions);
  document.getElementById("btn-catch-back").addEventListener("click", showBattleMainActions);
  document.getElementById("btn-battle-bag-back").addEventListener("click", showBattleMainActions);
  document.getElementById("btn-switch-back").addEventListener("click", showBattleMainActions);

  // Team screen
  document.getElementById("btn-close-team").addEventListener("click", () => {
    showScreen("screen-main");
  });
  document.getElementById("btn-team-detail-back").addEventListener("click", () => {
    document.getElementById("team-detail").classList.add("hidden");
    document.getElementById("team-list").style.display = "";
    showTeamScreen();
  });

  // Bag screen
  document.getElementById("btn-close-bag").addEventListener("click", () => showScreen("screen-main"));

  // Box screen
  document.getElementById("btn-close-box").addEventListener("click", () => showScreen("screen-main"));

  // Dex screen
  document.getElementById("btn-close-dex").addEventListener("click", () => showScreen("screen-main"));
  document.getElementById("btn-dex-detail-back").addEventListener("click", () => {
    document.getElementById("dex-detail").classList.add("hidden");
    document.getElementById("dex-grid").style.display = "";
  });
  document.querySelectorAll(".dex-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".dex-filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderDexGrid(btn.dataset.filter, document.getElementById("dex-search-input").value);
    });
  });
  document.getElementById("dex-search-input").addEventListener("input", e => {
    const activeFilter = document.querySelector(".dex-filter.active")?.dataset.filter || "all";
    renderDexGrid(activeFilter, e.target.value);
  });

  // Umbra Base button
  document.getElementById("btn-umbra-base").addEventListener("click", () => {
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your monsters are fainted! Heal first."); return; }
    const shade = UMBRA_BATTLES["umbra_shade"];
    showBattleFormatSelection(shade.name, shade.emoji, shade.quote, fmt => startSpecialBattle("umbra_shade", UMBRA_BATTLES, true, fmt));
  });

  // Legendary encounter button
  document.getElementById("btn-legendary")?.addEventListener("click", () => {
    const area = WORLD_DATA[G.location];
    if (!area?.legendaryEncounter) return;
    if (G.team.every(m => m.currentHP <= 0)) {
      showNotification("All your Lumos are fainted! Heal first.");
      return;
    }
    const legDef = MONSTERS_DATA[area.legendaryEncounter.monsterId];
    showNotification(`🌟 A <strong>${legDef.name}</strong> (Lv.${area.legendaryEncounter.level}) blocks your path!<br>"${legDef.desc}"`, () => {
      const wildMon = buildWildMon(area.legendaryEncounter.monsterId, area.legendaryEncounter.level);
      G.seenMonsters.add(area.legendaryEncounter.monsterId);
      battleContext = {
        isWild: true,
        isGym: false,
        isChampion: false,
        isLegendary: true,
        battleMode: "single",
        wildMon,
        playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
      };
      playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx]);
      enemyActiveMon = wildMon;
      hideMultiBattleSlots();
      showScreen("screen-battle");
      clearBattleLog();
      logMsg(`🌟 The Legendary ${wildMon.name} appeared! (Lv.${wildMon.level})`);
      updateBattleUI();
      showBattleMainActions();
      document.getElementById("btn-catch").disabled = false;
      if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle({ ...battleContext, isUmbra: true });
    });
  });

  // Route trainer button
  document.getElementById("btn-route-trainer")?.addEventListener("click", () => {
    if (typeof ROUTE_TRAINERS === "undefined" || !ROUTE_TRAINERS[G.location]) return;
    if (G.team.every(m => m.currentHP <= 0)) {
      showNotification("All your Lumos are fainted! Heal first.");
      return;
    }
    const trainers = ROUTE_TRAINERS[G.location];
    const beaten = trainers.filter((t, i) =>
      G.defeatedTrainers.includes(`${G.location}_trainer_${i}`)
    ).length;
    if (beaten >= trainers.length) return;
    const trainer = trainers[beaten];
    const trainerId = `${G.location}_trainer_${beaten}`;
    showNotification(`${trainer.emoji} <strong>${trainer.name}</strong> wants to battle!`, () => {
      startTrainerBattle(trainerId, trainer);
    });
  });

  // Gym trainer button
  document.getElementById("btn-gym-trainers")?.addEventListener("click", () => {
    const area = WORLD_DATA[G.location];
    if (!area?.gymLeader || typeof GYM_TRAINERS === "undefined" || !GYM_TRAINERS[area.gymLeader]) return;
    if (G.team.every(m => m.currentHP <= 0)) {
      showNotification("All your Lumos are fainted! Heal first.");
      return;
    }
    const trainers = GYM_TRAINERS[area.gymLeader];
    const beatenCount = trainers.filter((t, i) =>
      G.defeatedTrainers.includes(`gym_${area.gymLeader}_trainer_${i}`)
    ).length;
    if (beatenCount >= trainers.length) return;
    const trainer = trainers[beatenCount];
    const trainerId = `gym_${area.gymLeader}_trainer_${beatenCount}`;
    showNotification(`${trainer.emoji} <strong>${trainer.name}</strong>: "You won't get past me!"`, () => {
      startTrainerBattle(trainerId, trainer);
    });
  });

  // Umbra area encounter button
  document.getElementById("btn-umbra-area")?.addEventListener("click", () => {
    if (G.team.every(m => m.currentHP <= 0)) {
      showNotification("All your Lumos are fainted! Heal first.");
      return;
    }
    if (typeof UMBRA_BATTLES === "undefined") return;
    const umbraId = Object.keys(UMBRA_BATTLES).find(k => {
      const b = UMBRA_BATTLES[k];
      return b.triggerLocation === G.location;
    });
    if (!umbraId) return;
    const battle = UMBRA_BATTLES[umbraId];
    showNotification(`${battle.emoji} <strong>${battle.name}</strong>:<br>"${battle.quote}"`, () => {
      startUmbraAreaBattle(umbraId, battle);
    });
  });

  // Battle mode selection buttons
  document.querySelectorAll(".battle-mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      const overlay = document.getElementById("battle-mode-overlay");
      overlay.classList.add("hidden");
      if (window._battleModeCallback) {
        window._battleModeCallback(mode);
        window._battleModeCallback = null;
      }
    });
  });
  document.getElementById("btn-battle-mode-cancel")?.addEventListener("click", () => {
    document.getElementById("battle-mode-overlay").classList.add("hidden");
    window._battleModeCallback = null;
  });

  // Evolution item cancel
  document.getElementById("btn-evo-item-cancel")?.addEventListener("click", () => {
    document.getElementById("evo-item-overlay").classList.add("hidden");
  });

  // Area shop button
  document.getElementById("btn-area-shop")?.addEventListener("click", showShopScreen);

  // Heal button
  document.getElementById("btn-heal")?.addEventListener("click", healTeam);

  // Rival button
  document.getElementById("btn-rival").addEventListener("click", () => {
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your monsters are fainted! Heal first."); return; }
    const pending = getPendingRivalBattle();
    if (pending) {
      showBattleFormatSelection(pending.name, pending.emoji, pending.quote, fmt => startSpecialBattle(pending.id, RIVAL_BATTLES, false, fmt));
    }
  });

  // Game over
  document.getElementById("btn-gameover-heal").addEventListener("click", () => {
    // Team already healed to 100% in battle outcome handler
    for (const m of G.team) { m.currentHP = m.maxHP; m.status = null; }
    showScreen("screen-main");
    renderHUD();
    renderWorldMap();
    renderAreaPanel();
    saveGame();
  });

  // Hall of fame
  document.getElementById("btn-hof-continue").addEventListener("click", () => {
    showScreen("screen-main");
    renderHUD();
    renderWorldMap();
    renderAreaPanel();
  });

  // Zoom controls
  document.getElementById("btn-zoom-in").addEventListener("click", () => {
    const idx = MAP_ZOOM_LEVELS.indexOf(mapZoom);
    if (idx < MAP_ZOOM_LEVELS.length - 1) setMapZoom(MAP_ZOOM_LEVELS[idx + 1]);
  });
  document.getElementById("btn-zoom-out").addEventListener("click", () => {
    const idx = MAP_ZOOM_LEVELS.indexOf(mapZoom);
    if (idx > 0) setMapZoom(MAP_ZOOM_LEVELS[idx - 1]);
  });
  document.getElementById("btn-zoom-reset").addEventListener("click", () => {
    setMapZoom(1);
  });
}

function showStarterScreen() {
  showScreen("screen-starter");
  const grid = document.getElementById("starter-choices");
  grid.innerHTML = "";
  document.getElementById("starter-confirm").classList.add("hidden");

  for (const id of STARTER_IDS) {
    const def = MONSTERS_DATA[id];
    const card = document.createElement("div");
    card.className = "starter-card";
    const typeColor = getTypeColor(def.types[0]);
    const starterSpriteHTML = (typeof getMonsterSpriteURL === "function")
      ? `<img src="${getMonsterSpriteURL(def, 80)}" width="80" height="80" alt="${def.name}" style="border-radius:10px;margin-bottom:0.5rem">`
      : `<span class="starter-emoji">${def.emoji}</span>`;
    card.innerHTML = `
      ${starterSpriteHTML}
      <div class="starter-name">${def.name}</div>
      <span class="starter-type" style="background:${typeColor}">${def.types[0]}</span>
      <p class="starter-desc">${def.desc}</p>
    `;
    card.addEventListener("click", () => {
      document.querySelectorAll(".starter-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      window._selectedStarter = id;
      document.getElementById("starter-confirm").classList.remove("hidden");
      document.getElementById("starter-confirm-text").textContent =
        `You chose ${def.name}, the ${def.types[0]}-type companion!`;
      document.getElementById("starter-name-btn").textContent = def.name;
    });
    grid.appendChild(card);
  }
}

// Setup dialog typewriter effect
function typewriterDialog(text) {
  const el = document.getElementById("create-text");
  el.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) { el.textContent += text[i++]; }
    else clearInterval(interval);
  }, 40);
}

// ============================================================
// STORYLINE & SPECIAL BATTLES
// ============================================================

function getPendingRivalBattle() {
  if (typeof RIVAL_BATTLES === "undefined") return null;
  for (const [id, battle] of Object.entries(RIVAL_BATTLES)) {
    if (G.badges.length >= battle.triggerBadges && !G.defeatedLeaders.includes(id)) {
      return battle;
    }
  }
  return null;
}

function startSpecialBattle(battleId, battleData, isUmbra, battleType = "single") {
  const battle = battleData[battleId];
  if (!battle) return;
  const levelCap = (typeof LEVEL_CAPS !== "undefined" && LEVEL_CAPS[battleId]) ? LEVEL_CAPS[battleId] : null;
  // Support both old team: [...] and new teams: { single, double, triple }
  const teamSlots = (battle.teams && battle.teams[battleType]) ? battle.teams[battleType]
                  : (battle.teams && battle.teams.single) ? battle.teams.single
                  : battle.team || [];
  battleContext = {
    isWild: false,
    isGym: false,
    isChampion: false,
    isRival: !isUmbra,
    isUmbra: isUmbra,
    battleMode: "single",
    leaderId: battleId,
    battleType,
    levelCap,
    enemyTeam: teamSlots.map(s => buildGymMon(s)),
    enemyTeamIdx: 0,
    playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
  };
  playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx], levelCap);
  enemyActiveMon = battleContext.enemyTeam[0];
  hideMultiBattleSlots();
  showScreen("screen-battle");
  clearBattleLog();
  if (levelCap) logMsg(`⚠️ Level Cap: ${levelCap} — your team is scaled down!`);
  logMsg(`${battle.emoji} ${battle.name}: "${battle.quote}"`);
  logMsg(`${battle.name} sent out ${enemyActiveMon.name}!`);
  updateBattleUI();
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = true;
  if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle(battleContext);
}

// ============================================================
// ROUTE/GYM TRAINER BATTLES
// ============================================================
function startTrainerBattle(trainerId, trainer) {
  const levelCap = null;
  battleContext = {
    isWild: false,
    isGym: false,
    isChampion: false,
    isTrainer: true,
    trainerId,
    battleMode: "single",
    enemyTeam: trainer.team.map(s => buildGymMon(s)),
    enemyTeamIdx: 0,
    playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
  };
  playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx], levelCap);
  enemyActiveMon = battleContext.enemyTeam[0];
  hideMultiBattleSlots();
  showScreen("screen-battle");
  clearBattleLog();
  logMsg(`${trainer.emoji} ${trainer.name} wants to battle!`);
  logMsg(`${trainer.name} sent out ${enemyActiveMon.name}!`);
  updateBattleUI();
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = true;
  if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle(battleContext);
}

function startUmbraAreaBattle(umbraId, battle) {
  const levelCap = (typeof LEVEL_CAPS !== "undefined" && LEVEL_CAPS[umbraId]) ? LEVEL_CAPS[umbraId] : null;
  battleContext = {
    isWild: false,
    isGym: false,
    isChampion: false,
    isUmbra: true,
    isUmbraArea: true,
    leaderId: umbraId,
    levelCap,
    battleMode: "single",
    enemyTeam: battle.team.map(s => buildGymMon(s)),
    enemyTeamIdx: 0,
    playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
  };
  playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx], levelCap);
  enemyActiveMon = battleContext.enemyTeam[0];
  hideMultiBattleSlots();
  showScreen("screen-battle");
  clearBattleLog();
  if (levelCap) logMsg(`⚠️ Level Cap: ${levelCap} — your team is scaled down!`);
  const fmtLabel = {single:"Single",double:"Double",triple:"Triple"}[battleType] || "Single";
  logMsg(`⚔️ ${fmtLabel} Battle — ${battle.emoji} ${battle.name}`);
  logMsg(`${battle.name} sent out ${enemyActiveMon.name}!`);
  updateBattleUI();
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = true;
  if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle(battleContext);
}

// ============================================================
// BATTLE TYPE SELECTION
// ============================================================
function showBattleTypeSelection(leaderId, leader) {
  const overlay = document.getElementById("battle-mode-overlay");
  overlay.classList.remove("hidden");
  document.getElementById("battle-mode-title").textContent = `Battle ${leader.name}`;
  document.getElementById("battle-mode-desc").textContent = "Choose your battle format:";

  // Determine available modes
  const btns = document.querySelectorAll(".battle-mode-btn");
  btns.forEach(btn => {
    const mode = btn.dataset.mode;
    // Always allow single for leaders that have any team
    if (mode === "single") {
      btn.disabled = false;
      btn.classList.remove("hidden");
    } else if (mode === "double") {
      btn.disabled = G.team.filter(m => m.currentHP > 0).length < 2;
      btn.classList.remove("hidden");
    } else if (mode === "triple") {
      btn.disabled = G.team.filter(m => m.currentHP > 0).length < 3;
      btn.classList.remove("hidden");
    }
  });

  window._battleModeCallback = (chosenMode) => {
    // Select the right team for the chosen mode
    let team;
    if (chosenMode === "single" && leader.teamSingle) {
      team = leader.teamSingle;
    } else if (chosenMode === "double" && leader.teamDouble) {
      team = leader.teamDouble;
    } else if (chosenMode === "triple" && leader.teamTriple) {
      team = leader.teamTriple;
    } else {
      team = leader.team; // fallback to default team
    }

    // Temporarily set the leader's team and battle mode, then start the battle
    const origTeam = leader.team;
    const origMode = leader.battleMode;
    leader.team = team;
    leader.battleMode = chosenMode;

    const trainerImg = typeof getTrainerSpriteURL === "function"
      ? `<img src="${getTrainerSpriteURL(leaderId, leader, 64)}" width="64" height="64" style="border-radius:10px;margin-bottom:0.5rem"><br>`
      : "";
    showNotification(`${trainerImg}${leader.emoji} <strong>${leader.name}</strong>: "${leader.quote}"<br><br>⚔️ ${chosenMode.toUpperCase()} BATTLE`, () => {
      startGymBattle(leaderId);
      // Restore original team/mode so data stays clean
      leader.team = origTeam;
      leader.battleMode = origMode;
    });
  };
}

// ============================================================
// EVOLUTION ITEM USAGE
// ============================================================
function useEvoItem(itemId, partyIdx) {
  const slot = G.team[partyIdx];
  if (!slot) return;
  const def = MONSTERS_DATA[slot.monsterId];
  if (!def) return;

  let targetId = null;

  // Check if this mon evolves with this item
  if (def.evolveItem === itemId && def.evolveTo) {
    targetId = def.evolveTo;
  }
  // Check alt evolution
  if (def.evolveAlt && def.evolveAlt.item === itemId) {
    targetId = def.evolveAlt.monsterId;
  }

  if (!targetId) {
    showNotification("This item has no effect on this Lumo.");
    return;
  }

  // Consume item
  G.bag[itemId]--;

  // Evolve
  const oldDef = MONSTERS_DATA[slot.monsterId];
  const newDef = MONSTERS_DATA[targetId];
  slot.monsterId = targetId;
  const newMax = calcMaxHP(newDef.base.hp, slot.level, slot.ivs?.hp || 0);
  const ratio = slot.currentHP / slot.maxHP;
  slot.maxHP = newMax;
  slot.currentHP = Math.max(1, Math.floor(newMax * ratio));
  // Merge moves
  const existingMoves = new Set(slot.moves);
  const newMoves = newDef.learnset
    .filter(e => e[0] <= slot.level)
    .map(e => e[1])
    .filter(m => !existingMoves.has(m));
  for (const m of newMoves) {
    if (slot.moves.length < 4) slot.moves.push(m);
  }
  G.seenMonsters.add(targetId);
  G.caughtMonsters.add(targetId);

  showNotification(`🌟 ${oldDef.name} evolved into <strong>${newDef.name}</strong>!`, () => {
    showTeamScreen();
    saveGame();
  });
}

function showEvoItemSelection(partyIdx) {
  const slot = G.team[partyIdx];
  if (!slot) return;
  const def = MONSTERS_DATA[slot.monsterId];
  if (!def) return;

  // Find which evo items work on this mon
  const validItems = [];
  if (def.evolveItem && def.evolveTo && G.bag[def.evolveItem] > 0) {
    const targetDef = MONSTERS_DATA[def.evolveTo];
    validItems.push({ itemId: def.evolveItem, targetName: targetDef?.name || "???", targetId: def.evolveTo });
  }
  if (def.evolveAlt && def.evolveAlt.item && G.bag[def.evolveAlt.item] > 0) {
    const targetDef = MONSTERS_DATA[def.evolveAlt.monsterId];
    validItems.push({ itemId: def.evolveAlt.item, targetName: targetDef?.name || "???", targetId: def.evolveAlt.monsterId });
  }

  if (validItems.length === 0) {
    showNotification("No evolution items can be used on this Lumo.");
    return;
  }

  const overlay = document.getElementById("evo-item-overlay");
  overlay.classList.remove("hidden");
  document.getElementById("evo-item-text").textContent = `Choose an evolution for ${def.name}:`;
  const optionsEl = document.getElementById("evo-item-options");
  optionsEl.innerHTML = "";

  for (const vi of validItems) {
    const itemDef = ITEMS_DATA[vi.itemId];
    const btn = document.createElement("button");
    btn.className = "evo-item-btn";
    btn.innerHTML = `${itemDef?.emoji || "🔮"} Use <strong>${itemDef?.name || vi.itemId}</strong> → <strong>${vi.targetName}</strong> (x${G.bag[vi.itemId]})`;
    btn.addEventListener("click", () => {
      overlay.classList.add("hidden");
      useEvoItem(vi.itemId, partyIdx);
    });
    optionsEl.appendChild(btn);
  }
}

// Show a sequence of story messages one-by-one
function triggerStorySequence(eventKey) {
  if (typeof STORY_EVENTS === "undefined") return;
  const messages = STORY_EVENTS[eventKey];
  if (!messages || messages.length === 0) return;
  showStoryMessage(messages, 0);
}

function showStoryMessage(messages, idx) {
  if (idx >= messages.length) return;
  showNotification(messages[idx], () => {
    showStoryMessage(messages, idx + 1);
  });
}

function triggerBadgeStoryEvent(badgeCount) {
  const key = `after_badge_${badgeCount}`;
  if (typeof STORY_EVENTS !== "undefined" && STORY_EVENTS[key]) {
    setTimeout(() => triggerStorySequence(key), 400);
  }
  renderAreaPanel(); // refresh to show rival button if unlocked
}

// ============================================================
// HEAL SYSTEM
// ============================================================
function healTeam() {
  const area = WORLD_DATA[G.location];
  if (!area || (area.type !== "town" && area.type !== "city")) {
    showNotification("You can only heal at a town or city.");
    return;
  }
  let healed = false;
  for (const mon of G.team) {
    if (mon.currentHP < mon.maxHP || mon.status) {
      mon.currentHP = mon.maxHP;
      mon.status = null;
      healed = true;
    }
  }
  if (healed) {
    renderHUD();
    saveGame();
    showNotification("💊 Your Lumos team has been fully healed!");
  } else {
    showNotification("Your Lumos are already at full health!");
  }
}

// ============================================================
// SHOP SYSTEM
// ============================================================
function showShopScreen() {
  if (typeof SHOPS_DATA === "undefined") { showNotification("No shops available yet."); return; }
  const shop = SHOPS_DATA[G.location];
  if (!shop) { showNotification("There is no shop in this area."); return; }
  showScreen("screen-shop");
  renderShop(shop);
}

function renderShop(shop) {
  const container = document.getElementById("shop-content");
  document.getElementById("shop-title").textContent = shop.name;
  document.getElementById("shop-money").textContent = `💰 ${G.money}`;
  container.innerHTML = "";
  for (const shopEntry of shop.items) {
    const itemId = shopEntry.itemId;
    const price = shopEntry.price;
    const item = ITEMS_DATA[itemId];
    if (!item) continue;
    const owned = G.bag[itemId] || 0;
    const canAfford = G.money >= price;
    const row = document.createElement("div");
    row.className = "shop-item" + (canAfford ? "" : " shop-item-disabled");
    row.innerHTML = `
      <div class="shop-item-info">
        <span class="shop-item-name">${item.emoji} ${item.name}</span>
        <span class="shop-item-desc">${item.desc}</span>
      </div>
      <div class="shop-item-right">
        <span class="shop-item-owned">Owned: ${owned}</span>
        <span class="shop-item-price">💰 ${price}</span>
        <button class="shop-buy-btn" ${canAfford ? "" : "disabled"}>BUY</button>
      </div>
    `;
    row.querySelector(".shop-buy-btn").addEventListener("click", () => {
      if (G.money >= price) {
        G.money -= price;
        G.bag[itemId] = (G.bag[itemId] || 0) + 1;
        renderShop(shop);
        renderHUD();
      }
    });
    container.appendChild(row);
  }
}

// ============================================================
// QUEST LOG SYSTEM
// ============================================================
function showQuestScreen() {
  showScreen("screen-quests");
  renderQuestLog();
}

function renderQuestLog() {
  if (typeof QUESTS_DATA === "undefined") return;
  const container = document.getElementById("quest-list");
  const filterBtns = document.querySelectorAll(".quest-filter-btn");
  let activeFilter = document.querySelector(".quest-filter-btn.active")?.dataset?.filter || "available";

  // Ensure quest state arrays exist
  if (!G.questsCompleted) G.questsCompleted = [];
  if (!G.questsActive) G.questsActive = [];

  container.innerHTML = "";

  const allQuests = Object.values(QUESTS_DATA);
  let filteredQuests;

  if (activeFilter === "available") {
    filteredQuests = allQuests.filter(q =>
      !G.questsCompleted.includes(q.id) &&
      !G.questsActive.includes(q.id) &&
      G.badges.length >= (q.requiredBadges || 0)
    );
  } else if (activeFilter === "active") {
    filteredQuests = allQuests.filter(q => G.questsActive.includes(q.id));
  } else {
    filteredQuests = allQuests.filter(q => G.questsCompleted.includes(q.id));
  }

  if (filteredQuests.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:2rem">No ${activeFilter} quests.</p>`;
    return;
  }

  // Sort by required badges then by name
  filteredQuests.sort((a, b) => (a.requirements?.badges || 0) - (b.requirements?.badges || 0));

  for (const quest of filteredQuests) {
    const isCompleted = G.questsCompleted.includes(quest.id);
    const isActive = G.questsActive.includes(quest.id);
    const locationName = WORLD_DATA[quest.location]?.name || quest.location;
    const typeIcons = { boss: "⚔️", catch: "🔵", visit: "🗺️", fetch: "📦", battle: "🥊" };

    const card = document.createElement("div");
    card.className = "quest-card" + (isCompleted ? " quest-completed" : "");
    card.innerHTML = `
      <div class="quest-card-header">
        <span class="quest-type-icon">${typeIcons[quest.type] || "📋"}</span>
        <div class="quest-card-title">
          <strong>${quest.title}</strong>
          <span class="quest-location">${locationName}</span>
        </div>
        <span class="quest-badge-req">${quest.requiredBadges || 0}+ badges</span>
      </div>
      <p class="quest-desc">${quest.desc}</p>
      <div class="quest-rewards">
        <span>🎁 ${quest.rewardText}</span>
      </div>
      <div class="quest-actions">
        ${!isCompleted && !isActive ? `<button class="quest-accept-btn">Accept Quest</button>` : ""}
        ${isActive ? `<button class="quest-start-btn">Start Quest</button>` : ""}
        ${isCompleted ? `<span class="quest-done-label">✅ Completed</span>` : ""}
      </div>
    `;

    // Accept quest
    const acceptBtn = card.querySelector(".quest-accept-btn");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => {
        G.questsActive.push(quest.id);
        renderQuestLog();
        showNotification(`Quest accepted: <strong>${quest.title}</strong>`);
      });
    }

    // Start quest (begin boss battle or check objectives)
    const startBtn = card.querySelector(".quest-start-btn");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        attemptQuestCompletion(quest);
      });
    }

    container.appendChild(card);
  }
}

function attemptQuestCompletion(quest) {
  if (quest.type === "boss") {
    // Must be at the quest location
    if (G.location !== quest.location) {
      showNotification(`You must be at <strong>${WORLD_DATA[quest.location]?.name || quest.location}</strong> to attempt this quest.`);
      return;
    }
    startQuestBattle(quest);
  } else if (quest.type === "visit") {
    if (!G.visitedLocations) G.visitedLocations = [];
    if (G.visitedLocations.includes(quest.location)) {
      completeQuest(quest);
    } else {
      const locName = WORLD_DATA[quest.location]?.name || quest.location;
      showNotification(`You need to visit <strong>${locName}</strong> to complete this quest.`);
    }
  } else {
    completeQuest(quest);
  }
}

function startQuestBattle(quest) {
  const boss = quest.boss;
  const bossTeam = [{
    monsterId: boss.monsterId,
    level: boss.level,
    moves: boss.moves,
    heldItem: boss.heldItem || null
  }];

  const bossName = MONSTERS_DATA[boss.monsterId]?.name || "Quest Boss";

  battleContext = {
    isWild: false,
    isGym: false, isChampion: false, isRival: false, isUmbra: false,
    isQuest: true, questId: quest.id,
    battleMode: "single",
    leaderId: quest.id,
    enemyTeam: bossTeam.map(s => buildGymMon(s)),
    enemyTeamIdx: 0,
    playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
  };

  showNotification(`⚔️ A wild <strong>${bossName}</strong> (Lv.${boss.level}) appears!`, () => {
    playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx]);
    enemyActiveMon = battleContext.enemyTeam[0];
    hideMultiBattleSlots();
    showScreen("screen-battle");
    clearBattleLog();
    logMsg(`⚔️ Quest Boss ${bossName} appeared! (Lv.${boss.level})`);
    updateBattleUI();
    showBattleMainActions();
    document.getElementById("btn-catch").disabled = true;
    if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle(battleContext);
  });
}

function completeQuest(quest) {
  if (G.questsCompleted.includes(quest.id)) return;
  G.questsCompleted.push(quest.id);
  G.questsActive = G.questsActive.filter(id => id !== quest.id);

  // Grant rewards
  const r = quest.reward;
  if (r.type === "money") {
    G.money += r.amount;
  } else if (r.type === "item") {
    G.bag[r.itemId] = (G.bag[r.itemId] || 0) + (r.qty || 1);
  }

  renderHUD();
  saveGame();
  showNotification(`✅ Quest Complete: <strong>${quest.title}</strong>!<br><br>Rewards: ${quest.rewardText}<br><br>Well done!`);
}

// Track location visits for quest completion
function trackLocationVisit(locationId) {
  if (!G.visitedLocations) G.visitedLocations = [];
  if (!G.visitedLocations.includes(locationId)) {
    G.visitedLocations.push(locationId);
  }
  // Check if any active quests have visit objectives for this location
  if (typeof QUESTS_DATA !== "undefined") {
    for (const qid of (G.questsActive || [])) {
      const q = QUESTS_DATA.find(quest => quest.id === qid);
      if (q && q.type === "visit" && q.location === locationId) {
        completeQuest(q);
      }
    }
  }
}

// ---- BOOT ----
window.addEventListener("load", () => {
  initEventListeners();

  // Show continue button only if save exists
  document.getElementById("btn-continue").style.display = hasSave() ? "" : "none";

  // Start on title screen
  showScreen("screen-title");

  // Creation screen dialog now triggered when NEW GAME is clicked

  // Map re-render on resize
  window.addEventListener("resize", () => {
    if (G) { renderWorldMap(); }
  });
});

