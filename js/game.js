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
    shinyDexSeen: new Set(), shinyDexCaught: new Set(),
    variantDexSeen: new Set(), variantDexCaught: new Set(),
    variantLog: {},
    seenInArea: {},
    championDefeated: false,
    questsCompleted: [],
    questsActive: [],
    visitedLocations: ["seedvale"],
    defeatedTrainers: [],
    defeatedUmbraEncounters: [],
    defeatedLegendaries: [],
    achievements: [],
    roamingCaught: [],
    dailyChallenges: null,
    saveTimestamp: Date.now(),
    saveSlot: 0,
    ngPlusCount: 0,
    vaeldrisPartyLock: null,
    defeatedWielders: [],
    forgottenLegendaryAttempted: []
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
    monsterId, nickname: null, level, xp: xpForLevel(level),
    maxHP, currentHP: maxHP, moves, statuses: [], heldItem: null,
    nature: getRandomNature(), ivs,
    shiny: false, variant: false, variantTypes: null, variantBase: null, variantImmune: null
  };
}

// ---- Save / Load ----
function saveGame() {
  if (!G) return;
  G.saveTimestamp = Date.now();
  const save = {
    ...G,
    seenMonsters: [...G.seenMonsters],
    caughtMonsters: [...G.caughtMonsters],
    shinyDexSeen: [...(G.shinyDexSeen || [])],
    shinyDexCaught: [...(G.shinyDexCaught || [])],
    variantDexSeen: [...(G.variantDexSeen || [])],
    variantDexCaught: [...(G.variantDexCaught || [])],
    seenInArea: Object.fromEntries(Object.entries(G.seenInArea || {}).map(([k, v]) => [k, [...v]]))
  };
  try {
    localStorage.setItem(getSaveKey(G.saveSlot || 0), JSON.stringify(save));
    showNotification("Game saved! ✅");
  } catch (e) {
    // QuotaExceededError name varies by browser; code 22 is the DOMException value
    const isQuota = e && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.code === 22);
    if (isQuota) {
      showNotification("❌ Save failed: browser storage is full. Delete an unused save slot or clear other site data, then try saving again.");
    } else {
      showNotification("❌ Save failed: " + (e && e.message ? e.message : "unknown error") + ". Your progress was not stored.");
    }
    console.error("saveGame failed:", e);
  }
}

function loadGame(slot) {
  slot = slot ?? 0;
  const raw = localStorage.getItem(getSaveKey(slot));
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    data.seenMonsters = new Set(data.seenMonsters);
    data.caughtMonsters = new Set(data.caughtMonsters);
    data.shinyDexSeen = new Set(data.shinyDexSeen || []);
    data.shinyDexCaught = new Set(data.shinyDexCaught || []);
    data.variantDexSeen = new Set(data.variantDexSeen || []);
    data.variantDexCaught = new Set(data.variantDexCaught || []);
    if (!data.variantLog) data.variantLog = {};
    if (!data.variantLore) data.variantLore = {}; // cached bespoke variant prose (Route 1)
    if (typeof VariantLLM !== "undefined" && VariantLLM.hydrate) VariantLLM.hydrate(data.variantLore);
    if (!data.seenInArea) data.seenInArea = {};
    for (const k of Object.keys(data.seenInArea)) data.seenInArea[k] = new Set(data.seenInArea[k]);
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
    for (const mon of [...(data.team || []), ...(data.box || [])]) {
      if (!mon.nature) mon.nature = getRandomNature();
      if (!mon.ivs) mon.ivs = generateIVs();
      if (mon.shiny === undefined) mon.shiny = false;
      if (mon.variant === undefined) mon.variant = false;
      if (mon.variantTypes === undefined) mon.variantTypes = null;
      if (mon.variantBase === undefined) mon.variantBase = null;
      if (mon.variantImmune === undefined) mon.variantImmune = null;
    }
    if (!data.achievements) data.achievements = [];
    if (!data.roamingCaught) data.roamingCaught = [];
    if (!data.dailyChallenges) data.dailyChallenges = null;
    if (data.ngPlusCount === undefined) data.ngPlusCount = 0;
    if (data.vaeldrisPartyLock === undefined) data.vaeldrisPartyLock = null;
    if (!data.defeatedWielders) data.defeatedWielders = [];
    if (!data.forgottenLegendaryAttempted) data.forgottenLegendaryAttempted = [];
    data.saveSlot = slot;
    G = data;
    return true;
  } catch(e) { return false; }
}

const SAVE_PREFIX = "lumoria_save_";
function getSaveKey(slot) { return SAVE_PREFIX + slot; }
function hasSaveInSlot(slot) { return !!localStorage.getItem(getSaveKey(slot)); }
function hasAnySave() { return [0,1,2].some(s => hasSaveInSlot(s)); }

function getSaveSlotData(slot) {
  const raw = localStorage.getItem(getSaveKey(slot));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch(e) { return null; }
}

function deleteSaveSlot(slot) {
  localStorage.removeItem(getSaveKey(slot));
}

function timeSince(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ---- NG+ Scaling ----
function ngPlusScale(level, area) {
  if (!G || !G.ngPlusCount) return level;
  // Per-tier scaling cap to keep NG+ balanced by content difficulty
  let cap;
  const badges = area?.requiredBadges || 0;
  if (area?.requiresChampion || area?.requiresNGPlus) {
    cap = 0.15;  // post-game / NG+-exclusive content
  } else if (badges >= 12) {
    cap = 0.25;  // late game (badges 12-16)
  } else if (badges >= 6) {
    cap = 0.35;  // mid game (badges 6-11)
  } else {
    cap = 0.40;  // early game (badges 1-5 or no requirement)
  }
  const boost = Math.min(cap, 0.2 * G.ngPlusCount);
  return Math.min(100, Math.round(level * (1 + boost)));
}

// ---- Fullscreen ----
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => showNotification("Fullscreen not supported by your browser."));
  } else {
    document.exitFullscreen();
  }
}

// ---- Save Slot Screen ----
function showSaveSlots() {
  const list = document.getElementById("save-slots-list");
  list.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const data = getSaveSlotData(i);
    const card = document.createElement("div");
    card.className = "slot-card " + (data ? "slot-occupied" : "slot-empty");
    if (data) {
      const team = (data.team || []).slice(0, 6).map(m => {
        const def = MONSTERS_DATA[m.monsterId];
        return def ? def.emoji : "❓";
      }).join(" ");
      const elapsed = data.saveTimestamp ? timeSince(data.saveTimestamp) : "Unknown";
      const ngTag = data.ngPlusCount > 0 ? `<span class="ng-badge">NG+${data.ngPlusCount}</span>` : "";
      card.innerHTML = `
        <div class="slot-header">Slot ${i+1} ${ngTag}</div>
        <div class="slot-name">${data.playerName || "Trainer"}</div>
        <div class="slot-info">🏅 ${(data.badges||[]).length}/16 Badges${data.championDefeated ? " · 🏆 Champion" : ""}</div>
        <div class="slot-team">${team}</div>
        <div class="slot-time">Saved ${elapsed}</div>
        <div class="slot-actions">
          <button class="btn-primary slot-load" data-slot="${i}">▶ Load</button>
          <button class="btn-danger slot-delete" data-slot="${i}">🗑</button>
        </div>`;
    } else {
      card.innerHTML = `
        <div class="slot-header">Slot ${i+1}</div>
        <div class="slot-empty-text">— Empty —</div>
        <div class="slot-actions">
          <button class="btn-primary slot-new" data-slot="${i}">⚔ New Game</button>
        </div>`;
    }
    list.appendChild(card);
  }
  list.querySelectorAll(".slot-load").forEach(btn => {
    btn.addEventListener("click", () => {
      const slot = parseInt(btn.dataset.slot);
      if (loadGame(slot)) {
        showScreen("screen-main");
        renderHUD(); renderWorldMap(); renderAreaPanel();
        if (typeof MusicEngine !== "undefined") { MusicEngine.init(); MusicEngine.playOverworld(); }
      }
    });
  });
  list.querySelectorAll(".slot-new").forEach(btn => {
    btn.addEventListener("click", () => {
      window._pendingSlot = parseInt(btn.dataset.slot);
      showScreen("screen-create");
      typewriterDialog("Welcome to the world of Lumoria! I am Professor Solaris. The world is full of incredible creatures called Lumori. Tell me, what is your name?");
    });
  });
  list.querySelectorAll(".slot-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const slot = parseInt(btn.dataset.slot);
      if (confirm(`Delete Slot ${slot+1}? This cannot be undone.`)) {
        deleteSaveSlot(slot);
        showSaveSlots();
      }
    });
  });
  showScreen("screen-saveslots");
}

// ---- New Game+ ----
function startNGPlus() {
  if (!G) return;
  if (!confirm("Start New Game+? Your box Lumori carry over. Enemies will be significantly stronger and new areas unlock.")) return;
  window._ngPlusCarry = {
    box: [...G.box],
    ngCount: (G.ngPlusCount || 0) + 1,
    name: G.playerName,
    slot: G.saveSlot
  };
  window._pendingSlot = G.saveSlot;
  checkAchievement("ngplus_start");
  if (typeof onNGPlusStarted === "function") onNGPlusStarted();
  showStarterScreen();
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
    G.evolveCount = (G.evolveCount || 0) + 1;
    if (G.evolveCount >= 5) checkAchievement("evolve5");
    trackDailyChallenge("evolve_today");
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

// SVG element helper — create a namespaced element with all attrs in one call
const svgNS = "http://www.w3.org/2000/svg";
function se(tag, attrs) {
  const el = document.createElementNS(svgNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

// Build SVG terrain patterns for Pokemon-style textures
function buildMapPatterns(defs) {
  function pat(id, w, h, children) {
    const p = se("pattern", { id, width:w, height:h, patternUnits:"userSpaceOnUse" });
    children.forEach(c => p.appendChild(c));
    defs.appendChild(p);
  }

  pat("oceanPattern", 30, 20, [
    se("path", { d:"M 0,10 Q 7.5,5 15,10 Q 22.5,15 30,10", stroke:"#2a7aaa", "stroke-width":"0.8", fill:"none", opacity:"0.4" }),
    se("path", { d:"M 0,16 Q 7.5,11 15,16 Q 22.5,21 30,16", stroke:"#2a7aaa", "stroke-width":"0.5", fill:"none", opacity:"0.25" }),
  ]);

  pat("grassPattern", 16, 16, [
    se("rect", { width:16, height:16, fill:"transparent" }),
    ...[3,12, 11,6, 7,14, 13,10].reduce((a,_,i,arr) => i%2===0
      ? [...a, se("path", { d:`M ${arr[i]},${arr[i+1]} l -1,-3 l 1,1 l 1,-2 l 0.5,1.5 l 1,-2.5 l -0.5,3 Z`, fill:"#2d7a30", opacity:"0.35" })]
      : a, []),
  ]);

  pat("mountainPattern", 20, 18, [
    se("path", { d:"M 4,16 L 10,4 L 16,16 Z", fill:"none", stroke:"#ffffff", "stroke-width":"0.6", opacity:"0.15" }),
    se("path", { d:"M 8,8 L 10,4 L 12,8 Z", fill:"#ffffff", opacity:"0.12" }),
  ]);

  pat("icePattern", 14, 14,
    [[4,4],[10,10]].map(([ix,iy]) =>
      se("path", { d:`M ${ix},${iy-2} L ${ix+1},${iy} L ${ix},${iy+2} L ${ix-1},${iy} Z`, fill:"#ffffff", opacity:"0.2" })
    )
  );

  pat("darkPattern", 20, 20, [
    se("circle", { cx:10, cy:10, r:5, fill:"#6a2aaa", opacity:"0.1" }),
  ]);

  pat("lavaPattern", 18, 18, [
    se("path", { d:"M 2,8 Q 6,4 9,9 Q 12,14 16,10", stroke:"#ff4400", "stroke-width":"0.7", fill:"none", opacity:"0.3" }),
  ]);

  pat("sandPattern", 8, 8,
    [[2,2],[6,5],[4,7],[1,5]].map(([sx,sy]) =>
      se("circle", { cx:sx, cy:sy, r:"0.5", fill:"#d4b876", opacity:"0.5" })
    )
  );
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

  const svg = se("svg", { width:mapW, height:mapH, viewBox:`0 0 ${mapW} ${mapH}` });
  Object.assign(svg.style, { position:"absolute", top:"0", left:"0", zIndex:"5" });

  const defs = se("defs", {});
  svg.appendChild(defs);

  // Ocean radial gradient
  const oceanGrad = se("radialGradient", { id:"oceanGrad", cx:"40%", cy:"50%", r:"60%" });
  oceanGrad.appendChild(se("stop", { offset:"0%",   "stop-color":"#1a6a9a" }));
  oceanGrad.appendChild(se("stop", { offset:"100%", "stop-color":"#0e3a5a" }));
  defs.appendChild(oceanGrad);

  buildMapPatterns(defs);

  const bgGroup = se("g", { "pointer-events":"none" });
  svg.appendChild(bgGroup);

  const add = (parent, el) => { parent.appendChild(el); return el; };
  add(bgGroup, se("rect", { width:mapW, height:mapH, fill:"url(#oceanGrad)" }));
  add(bgGroup, se("rect", { width:mapW, height:mapH, fill:"url(#oceanPattern)" }));

  const BIOME_PATTERN = { land:'grassPattern', ice:'icePattern', dark:'darkPattern',
    mystic:'darkPattern', volcanic:'lavaPattern', mountain:'mountainPattern', plains:'grassPattern' };

  for (const b of BIOME_REGIONS) {
    const d = scaleMapPath(b.path, mapW, mapH);
    if (b.type === 'land') {
      add(bgGroup, se("path", { d, fill:"#c8a860", stroke:"#b89848", "stroke-width":"6", opacity:"0.6" }));
      add(bgGroup, se("path", { d, fill:"url(#sandPattern)", stroke:"url(#sandPattern)", "stroke-width":"4", opacity:"0.5" }));
    }
    add(bgGroup, se("path", { d, fill:b.shadow, transform:"translate(2, 3)", opacity:"0.5" }));
    add(bgGroup, se("path", { d, fill:b.color, stroke:b.shadow, "stroke-width":"1.5" }));
    add(bgGroup, se("path", { d, fill:"none", stroke:b.highlight, "stroke-width":"1.5", opacity:"0.5", transform:"translate(-0.5, -0.5)" }));
    const pid = BIOME_PATTERN[b.type];
    if (pid) add(bgGroup, se("path", { d, fill:`url(#${pid})`, opacity:"0.8" }));
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
    if (area.requiresChampion && !G?.championDefeated || (area.requiresNGPlus && !(G?.ngPlusCount > 0))) continue;
    if (area.requiresDefeated && !(G?.defeatedLeaders || []).includes(area.requiresDefeated)) continue;
    for (const conn of area.connections) {
      const sortedKey = [areaId, conn].sort().join("|");
      if (drawnConnections.has(sortedKey)) continue;
      drawnConnections.add(sortedKey);
      const toArea = WORLD_DATA[conn];
      if (!toArea || !toArea.mapPos) continue;
      if (toArea.requiresChampion && !G?.championDefeated) continue;
      if (toArea.requiresNGPlus && !(G?.ngPlusCount > 0)) continue;
      if (toArea.requiresDefeated && !(G?.defeatedLeaders || []).includes(toArea.requiresDefeated)) continue;

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
        const pathAttrs = { d:segD, fill:"none", "stroke-linecap":"round", "stroke-linejoin":"round" };
        add(bgGroup, se("path", { ...pathAttrs, stroke:shadowColor, "stroke-width":"7", opacity:"0.55" }));
        const line = add(bgGroup, se("path", { ...pathAttrs, stroke:routeColor, "stroke-width":"5" }));
        add(bgGroup, se("path", { ...pathAttrs, stroke:"#ffffff", "stroke-width":"1.5", opacity:"0.2" }));
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
            const hitArea = se("path", { d:seg.pathD, stroke:"transparent", "stroke-width":"18", fill:"none", "stroke-linecap":"round", "stroke-linejoin":"round" });
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
    if (area.requiresChampion && !G?.championDefeated || (area.requiresNGPlus && !(G?.ngPlusCount > 0))) continue;
    if (area.requiresDefeated && !(G?.defeatedLeaders || []).includes(area.requiresDefeated)) continue;
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
  if (area.requiresChampion && !G.championDefeated) {
    showNotification(`🔒 ${area.name} is only accessible after becoming Champion.`);
    return;
  }
  if (area.requiresNGPlus && !(G.ngPlusCount > 0)) {
    showNotification(`⭐ ${area.name} is only accessible in New Game+.`);
    return;
  }
  if (area.requiresDefeated && !(G.defeatedLeaders || []).includes(area.requiresDefeated)) {
    showNotification(`🔒 ${area.name} requires defeating ${area.requiresDefeated.replace(/_/g, " ")} first.`);
    return;
  }
  if (G.badges.length < (area.requiredBadges || 0)) {
    showNotification(`You need ${area.requiredBadges} badge(s) to enter ${area.name}.`);
    return;
  }
  trackDailyChallenge("visit_areas");
  G.location = areaId;
  trackLocationVisit(areaId);
  renderWorldMap();
  renderAreaPanel();
  maybeTriggerForgottenLegendaryEncounter(areaId);
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
      const seenHere = G.seenInArea[area.id]?.has(wm.id);
      chip.textContent = seenHere ? `${def.emoji} ${def.name}` : "???";
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

  // Roaming legendary button
  const roamingBtn = document.getElementById("btn-roaming");
  if (roamingBtn) {
    roamingBtn.classList.add("hidden");
    const roamersHere = getRoamingAtLocation(G.location);
    if (roamersHere.length > 0) {
      const roamer = roamersHere[0];
      roamingBtn.classList.remove("hidden");
      roamingBtn.textContent = `🌿 Roaming ${roamer.name} is here!`;
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

  // The Vanguard button
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
  if (typeof renderTimeEvents === "function") renderTimeEvents();

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
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumori have fainted! Heal at a town first."); return; }

  // Filter out high-BST mons until the player has enough badges; also exclude unknown IDs (BST=0)
  let pool = G.badges.length < 3
    ? area.wildMonsters.filter(wm => { const b = getMonBST(wm.id); return b > 0 && b <= 375; })
    : area.wildMonsters.filter(wm => getMonBST(wm.id) > 0);
  if (!pool.length) { showNotification("No wild Lumori appear here yet."); return; }

  // Inject NG+-exclusive spawns when in NG+ run
  if (G.ngPlusCount > 0 && area.ngPlusWildMonsters?.length) {
    pool = pool.concat(area.ngPlusWildMonsters.filter(wm => getMonBST(wm.id) > 0));
  }

  // Inject event-exclusive spawns if active
  if (typeof getEventExclusiveMons === "function") {
    const extras = getEventExclusiveMons(area.id);
    if (extras.length) pool = pool.concat(extras);
  }

  // Apply time/event spawn-rate multipliers per monster type
  const getEffectiveRate = (wm) => {
    const def = MONSTERS_DATA[wm.id];
    if (!def) return wm.rate;
    let mult = 1;
    for (const t of (def.types || [])) {
      if (typeof getTimeSpawnMult  === "function") mult *= getTimeSpawnMult(t);
      if (typeof getEventSpawnBoost === "function") mult *= getEventSpawnBoost(t);
    }
    return wm.rate * mult;
  };

  const total = pool.reduce((s, wm) => s + getEffectiveRate(wm), 0);
  let roll = Math.random() * total;
  let chosen = pool[pool.length - 1];
  for (const wm of pool) { roll -= getEffectiveRate(wm); if (roll <= 0) { chosen = wm; break; } }

  const level = ngPlusScale(chosen.minLv + Math.floor(Math.random() * (chosen.maxLv - chosen.minLv + 1)), area);
  G.seenMonsters.add(chosen.id);
  if (!G.seenInArea[area.id]) G.seenInArea[area.id] = new Set();
  G.seenInArea[area.id].add(chosen.id);
  if (typeof incrementCommunityProgress === "function") incrementCommunityProgress();
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

// Returns the player-facing display name for a battle mon.
// foreignRegion mons show as "Forgotten Lumori X" and are added to seenMonsters.
function getDisplayName(mon) {
  const def = MONSTERS_DATA[mon.monsterId];
  if (def && def.foreignRegion) {
    G.seenMonsters.add(mon.monsterId);
    return `Forgotten Lumori ${mon.monsterId - 461}`;
  }
  return mon.name;
}

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
  trackEncounterFlags(enemy);

  // Enemy sprite (SVG illustration)
  const enemySpriteEl = document.getElementById("enemy-sprite");
  enemySpriteEl.classList.toggle("shiny-sprite", !!enemy.shiny);
  enemySpriteEl.classList.toggle("variant-sprite", !!enemy.variant);
  if (typeof getMonsterSpriteURL === "function" && MONSTERS_DATA[enemy.monsterId]) {
    enemySpriteEl.innerHTML = `<img src="${getMonsterSpriteURL(MONSTERS_DATA[enemy.monsterId], 90)}" width="90" height="90" alt="${enemy.name}">`;
  } else {
    enemySpriteEl.textContent = enemy.emoji;
  }
  const enemyNameEl = document.getElementById("enemy-name");
  enemyNameEl.className = enemy.shiny ? "shiny-name" : enemy.variant ? "variant-name" : "";
  enemyNameEl.textContent = enemy.name;
  document.getElementById("enemy-level").textContent = `Lv.${enemy.level}`;
  const enemyHPPct = Math.max(0, (enemy.currentHP / enemy.maxHP) * 100);
  const enemyFill = document.getElementById("enemy-hp-fill");
  enemyFill.style.width = enemyHPPct + "%";
  enemyFill.className = "hp-fill" + (enemyHPPct < 25 ? " red" : enemyHPPct < 50 ? " yellow" : "");

  const enemyStatus = document.getElementById("enemy-status-badge");
  if (hasAnyStatus(enemy)) {
    enemyStatus.classList.remove("hidden");
    enemyStatus.textContent = enemy.statuses.map(s => STATUS_REGISTRY[s.type]?.label || s.type.toUpperCase()).join(" ");
    const firstClass = STATUS_REGISTRY[enemy.statuses[0].type]?.cssClass || `status-${enemy.statuses[0].type}`;
    enemyStatus.className = `status-badge ${firstClass}`;
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
  playerSpriteEl.classList.toggle("shiny-sprite", !!player.shiny);
  playerSpriteEl.classList.toggle("variant-sprite", !!player.variant);
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
  if (hasAnyStatus(player)) {
    playerStatus.classList.remove("hidden");
    playerStatus.textContent = player.statuses.map(s => STATUS_REGISTRY[s.type]?.label || s.type.toUpperCase()).join(" ");
    const firstClass = STATUS_REGISTRY[player.statuses[0].type]?.cssClass || `status-${player.statuses[0].type}`;
    playerStatus.className = `status-badge ${firstClass}`;
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
  const allowedSlots = battleContext.isWielder && battleContext.vaeldrisPlayerSlots
    ? new Set(battleContext.vaeldrisPlayerSlots)
    : null;
  G.team.forEach((slot, idx) => {
    if (allowedSlots && !allowedSlots.has(idx)) return;
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
    if (slot.currentHP <= 0) { showNotification("Can't heal a fainted Lumori in battle!"); return; }
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
    if (slot.currentHP > 0) { showNotification("That Lumori isn't fainted!"); return; }
    slot.currentHP = Math.floor(slot.maxHP * 0.5);
    clearStatuses(slot);
    G.bag[itemId]--;
    logMsg(`${slot.nickname || MONSTERS_DATA[slot.monsterId].name} was revived!`);
  } else if (item.type === "battle") {
    // Stat booster — only works on active mon
    if (monIdx !== battleContext.playerTeamIdx) { showNotification("Stat items only work on your active Lumori!"); return; }
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
  if (wildMon.shiny)   logMsg(`✨ A Radiant ${wildMon.name} appeared! (Lv.${wildMon.level})`, "log-catch");
  else if (wildMon.variant) logMsg(`🔀 A variant ${wildMon.name} appeared! [${wildMon.types.join("/")}] (Lv.${wildMon.level})`, "log-catch");
  else logMsg(`A wild Lumori — ${wildMon.name} appeared! (Lv.${wildMon.level})`);
  if (wildMon.shiny) { checkAchievement("first_shiny"); trackDailyChallenge("shiny_encounter"); }
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
  logMsg(`${leader.name} sent out ${getDisplayName(enemyActiveMon)}!`);
  updateBattleUI();
  // Phase 3b: onEntry hooks for both active mons at battle start
  fireOnEntryHooks(playerActiveMon, enemyActiveMon);
  fireOnEntryHooks(enemyActiveMon, playerActiveMon);
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = true;
  if (typeof MusicEngine !== "undefined") MusicEngine.playForBattle(battleContext);
}

// Phase 3b: dispatch + log onEntry trait hooks for a mon entering the field.
function fireOnEntryHooks(mon, foe) {
  if (!mon || typeof applyOnEntry !== "function") return;
  const msgs = applyOnEntry(mon, foe);
  for (const msg of msgs) logMsg(msg, "log-status");
  if (msgs.length > 0) updateBattleUI();
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
  if (!battleContext.isWild) { logMsg("Can't catch gym Lumori!"); return; }
  if ((G.bag[orbId] || 0) <= 0) { logMsg("No orbs of that type!"); return; }
  G.bag[orbId]--;
  const item = ITEMS_DATA[orbId];
  logMsg(`You threw a ${item.name}!`, "log-catch");
  await delay(600);

  const caught = attemptCapture(enemyActiveMon, orbId);
  if (caught) {
    logMsg(`✅ Gotcha! ${enemyActiveMon.name} was caught!`, "log-catch");
    G.caughtMonsters.add(enemyActiveMon.monsterId);
    if (enemyActiveMon.shiny) G.shinyCaught = (G.shinyCaught || 0) + 1;
    if (enemyActiveMon.shiny) (G.shinyDexCaught ||= new Set()).add(enemyActiveMon.monsterId);
    if (enemyActiveMon.variant) {
      (G.variantDexCaught ||= new Set()).add(enemyActiveMon.monsterId); recordVariantLog(enemyActiveMon, true);
      // Route 1 (dormant unless VariantLLM.ENABLED): fetch + cache bespoke prose for this
      // caught variant. No-op offline/disabled — team detail keeps using the C generator.
      if (typeof VariantLLM !== "undefined" && VariantLLM.warm) {
        const cdef = MONSTERS_DATA[enemyActiveMon.monsterId];
        VariantLLM.warm(cdef, enemyActiveMon, (k, entry) => { (G.variantLore ||= {})[k] = entry; if (typeof saveGame === "function") saveGame(); });
      }
    }
    if (typeof onLumoriCaught === "function") onLumoriCaught(!!enemyActiveMon.shiny);
    if (enemyActiveMon.shiny)   checkAchievement("catch_shiny");
    if (enemyActiveMon.variant) checkAchievement("catch_variant");
    const caughtDef = MONSTERS_DATA[enemyActiveMon.monsterId];
    if (caughtDef?.rarity === "legendary") checkAchievement("legendary");
    if (caughtDef?.rarity === "legendary" && enemyActiveMon.monsterId >= NG_PLUS_DEX_START) checkAchievement("ngplus_legend");
    if (caughtDef?.rarity === "pseudolegendary") checkAchievement("ngplus_pseudo");
    if (enemyActiveMon.monsterId >= NG_PLUS_DEX_START) {
      const ngCaught = [...G.caughtMonsters].filter(id => id >= NG_PLUS_DEX_START).length;
      if (ngCaught >= 25) checkAchievement("ngplus_catch25");
      if (ngCaught >= 50) checkAchievement("ngplus_catch50");
      const totalNGPlus = Object.keys(MONSTERS_DATA).filter(k => parseInt(k) >= NG_PLUS_DEX_START).length;
      if (ngCaught >= totalNGPlus) checkAchievement("ngplus_catchall");
    }
    checkAchievements();
    trackDailyChallenge("catch_count");
    if (caughtDef) for (const t of caughtDef.types) trackDailyChallenge("catch_type", t);
    if (caughtDef?.rarity === "rare" || caughtDef?.rarity === "legendary") trackDailyChallenge("catch_rare");
    if (enemyActiveMon.shiny) trackDailyChallenge("shiny_encounter");
    if (battleContext.isRoaming && !G.roamingCaught.includes(battleContext.roamingId)) {
      G.roamingCaught.push(battleContext.roamingId);
    }
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
    nickname: null, level: battleMon.level,
    xp: xpForLevel(battleMon.level),
    maxHP: battleMon.maxHP, currentHP: battleMon.currentHP,
    moves: battleMon.moves.map(m => m.id),
    statuses: (battleMon.statuses || []).map(s => ({ ...s })),
    nature: battleMon.nature || getRandomNature(),
    ivs: battleMon.ivs || generateIVs(),
    shiny: !!battleMon.shiny, variant: !!battleMon.variant,
    variantTypes: battleMon.variantTypes || null,
    variantBase: battleMon.variantBase || null,
    variantImmune: battleMon.variantImmune || null,
    variantMods: battleMon.variantMods || null
  };
}

// ===== Shiny / variant dex tracking (see docs/variant-system-spec.md §F) =====
// Records a variant instance (caught or merely encountered) for the Luminex 🔀 tracker.
function recordVariantLog(mon, caught) {
  if (!mon || !mon.variant || !G) return;
  if (!G.variantLog) G.variantLog = {};
  const arr = (G.variantLog[mon.monsterId] ||= []);
  arr.push({
    types: mon.variantTypes ? [...mon.variantTypes] : null,
    base: mon.variantBase ? { ...mon.variantBase } : null,
    immune: mon.variantImmune || null,
    caught: !!caught,
    shiny: !!mon.shiny
  });
  if (arr.length > 30) arr.shift(); // cap log per species
}

// Called as enemy/wild mons appear so shinies/variants register even when
// they can't be caught (trainer/Umbra/wielder enemies, fled wilds).
function trackEncounterFlags(mon) {
  if (!mon || !G) return;
  if (mon.shiny) (G.shinyDexSeen ||= new Set()).add(mon.monsterId);
  if (mon.variant && !mon._variantLogged) {
    (G.variantDexSeen ||= new Set()).add(mon.monsterId);
    recordVariantLog(mon, false);
    mon._variantLogged = true;
  }
}

async function playerSwitch(idx) {
  if (G.team[idx].currentHP <= 0) return;
  // Phase 3: blocksSwitch (Weighed Down, Anchored) + switchCost (Tethered) on active mon.
  // Forced switches (post-faint) bypass these.
  if (playerActiveMon && !battleContext.forcedSwitch && playerActiveMon.currentHP > 0) {
    const blocked = checkBlocksSwitch(playerActiveMon);
    if (blocked) {
      logMsg(blocked.msg, "log-status");
      return;
    }
    const costFrac = getSwitchCost(playerActiveMon);
    if (costFrac > 0) {
      const hpCost = Math.max(1, Math.floor(playerActiveMon.maxHP * costFrac));
      playerActiveMon.currentHP = Math.max(0, playerActiveMon.currentHP - hpCost);
      logMsg(`⛓️ ${playerActiveMon.name} lost ${hpCost} HP from switching while tethered!`, "log-damage");
      if (playerActiveMon.currentHP <= 0) playerActiveMon.fainted = true;
    }
  }
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
  const playerSpe = getEffectiveSpeed(playerActiveMon);
  const enemySpe  = getEffectiveSpeed(enemyActiveMon);
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
  const playerSpe = getEffectiveSpeed(playerActiveMon);
  const enemySpe  = getEffectiveSpeed(enemyActiveMon);
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

async function doAttack(attacker, defender, moveId, isPlayer, opts = {}) {
  let move = MOVES_DATA[moveId];
  if (!move) return;

  // Wide-spread support: opts.targetCount feeds calcDamage's 0.75× modifier.
  // opts.suppressIntro skips the "used X!" log on follow-up wide-hit targets.
  // opts.allies: defender's team (for Bonded share); single-battle leaves it undefined.
  if (!opts.suppressIntro) {
    logMsg(`${attacker.name} used ${move.name}!`);
  }
  await delay(500);

  // Check if can move (paralyze/sleep/freeze/recharge/petrify/sluggish/comatose/statue)
  const canMoveResult = canMove(attacker);
  if (!canMoveResult.can) {
    logMsg(canMoveResult.msg);
    await delay(400);
    return;
  }
  if (canMoveResult.msg) logMsg(canMoveResult.msg);

  // Phase 3: intercept (Disoriented / Possessed may substitute a different move)
  const chosenSlot = attacker.moves.find(m => m.id === moveId) || { id: moveId };
  const intercepted = interceptMove(attacker, chosenSlot, attacker.moves);
  if (intercepted.move.id !== moveId) {
    const subMove = MOVES_DATA[intercepted.move.id];
    if (subMove) {
      if (intercepted.msg) logMsg(intercepted.msg, "log-status");
      move = subMove;
    }
  }

  // Phase 3: outgoing-move block (Mind-numb / Crippled / Bound / Muted / Sealed / Tangled)
  const block = checkBlocksOutgoingMove(attacker, move);
  if (block) {
    logMsg(block.msg, "log-status");
    await delay(400);
    return;
  }

  // Phase 3: move-attempt hook (Concussion 30% self-hit)
  const attempt = checkOnMoveAttempt(attacker, move);
  if (attempt && attempt.selfHit) {
    logMsg(attempt.msg, "log-damage");
    if (isPlayer) syncPlayerMonHP();
    updateBattleUI();
    await delay(400);
    return;
  }

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

  // Accuracy check — Phase 3: respects forceHit (Echolocation) + accuracyMod (Smothered/Faded/Mirage)
  if (!rollPercent(getEffectiveAccuracy(attacker, defender, move))) {
    logMsg(`${attacker.name}'s attack missed!`);
    return;
  }

  // Multi-hit loop (move.hits defaults to 1)
  const hitCount = move.hits || 1;
  let totalDamage = 0;
  let lastResult = null;
  let sashTriggered = false;

  for (let h = 0; h < hitCount; h++) {
    if (defender.fainted) break;

    const result = calcDamage(attacker, defender, move, { targetCount: opts.targetCount || 1 });

    // Focus Sash only activates on the first hit
    if (h === 0) {
      const sashResult = applyFocusSash(defender, result.damage);
      if (sashResult.triggered) {
        result.damage = sashResult.damage;
        sashTriggered = true;
      }
    }

    defender.currentHP = Math.max(0, defender.currentHP - result.damage);
    if (h === 0 && sashTriggered) defender.currentHP = Math.max(1, defender.currentHP);
    if (defender.currentHP <= 0) defender.fainted = true;

    totalDamage += result.damage;
    lastResult = result;

    // Phase 3: reflect (Bouncy / Refracted / Mirrored). Fires per-hit; the per-status
    // _reflectedThisTurn guard (Mirrored) is reset in tickAfter at end of turn.
    const reflect = applyOnHitReflect(defender, attacker, move, result.damage);
    if (reflect) {
      logMsg(reflect.msg, "log-status");
      if (!isPlayer) syncPlayerMonHP();
      updateBattleUI();
    }

    // Phase 3a: on-incoming-hit dispatch (defender traits: Thorned, Flame Aura,
    // Resolute, Vengeance, Pride, Per-type auras, Mirror Form, etc.)
    const onHitMsgs = applyOnIncomingHit(defender, attacker, move, result.damage, result.effectiveness);
    for (const msg of onHitMsgs) logMsg(msg, "log-status");

    // Phase 3a: on-damage-dealt dispatch (attacker traits: Vampire)
    if (result.damage > 0) {
      const onDealtMsgs = applyOnDamageDealt(attacker, defender, result.damage);
      for (const msg of onDealtMsgs) logMsg(msg, "log-status");
      if (isPlayer) syncPlayerMonHP();
      updateBattleUI();
    }

    // Phase 3a: trait on-incoming-hit dispatch (Thorned, Flame/Frost/Toxic Aura, Resolute,
    // Vengeance, Mind Steal, Toxin Coat, Slime Coat, Bewitching, Magnetic Skin, Snatcher, etc.)
    if (typeof applyOnIncomingHit === "function") {
      const hitMsgs = applyOnIncomingHit(defender, attacker, move, result.damage, result.effectiveness);
      for (const m of hitMsgs) logMsg(m, "log-status");
    }

    // Phase 3a: trait on-damage-dealt for the attacker (Vampire's drain on dealt damage)
    if (typeof applyOnDamageDealt === "function" && result.damage > 0) {
      const dealtMsgs = applyOnDamageDealt(attacker, defender, result.damage);
      for (const m of dealtMsgs) logMsg(m, "log-status");
    }

    // Animations
    if (isPlayer) {
      document.getElementById("enemy-sprite").classList.add("shake");
      setTimeout(() => document.getElementById("enemy-sprite").classList.remove("shake"), 400);
    } else {
      document.getElementById("player-sprite").classList.add("shake");
      setTimeout(() => document.getElementById("player-sprite").classList.remove("shake"), 400);
    }

    if (isPlayer) syncPlayerMonHP();
    updateBattleUI();
    await delay(hitCount > 1 ? 200 : 400);
  }

  if (hitCount > 1) logMsg(`Hit ${hitCount} times!`, "log-damage");

  // Effectiveness and damage messages (based on last hit)
  if (lastResult.effectiveness > 1) logMsg("It's super effective!", "log-super-effective");
  else if (lastResult.effectiveness < 1 && lastResult.effectiveness > 0) logMsg("It's not very effective...", "log-not-effective");
  else if (lastResult.effectiveness === 0) logMsg("It had no effect!", "log-immune");
  if (lastResult.crit) logMsg("A critical hit!", "log-damage");

  logMsg(`${defender.name} took ${totalDamage} damage!`, "log-damage");
  if (sashTriggered) logMsg(`${defender.name}'s Focus Sash kept it standing!`, "log-status");

  // Phase 3 follow-up: Bonded ally-share (multi-battle only — opts.allies undefined in 1v1)
  const bondedShare = applyBondedShare(defender, opts.allies, totalDamage);
  if (bondedShare) logMsg(bondedShare.msg, "log-status");

  // Recoil damage
  if (move.effect === "recoil" && totalDamage > 0 && !attacker.fainted) {
    const recoilDmg = Math.max(1, Math.floor(totalDamage / 3));
    attacker.currentHP = Math.max(0, attacker.currentHP - recoilDmg);
    if (attacker.currentHP <= 0) attacker.fainted = true;
    logMsg(`${attacker.name} was hurt by recoil! (${recoilDmg})`, "log-damage");
    if (isPlayer) syncPlayerMonHP();
    updateBattleUI();
  }

  // Drain heal
  if (move.effect === "drain" && totalDamage > 0 && !attacker.fainted) {
    const drainAmt = Math.max(1, Math.floor(totalDamage / 2));
    attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + drainAmt);
    logMsg(`${attacker.name} drained ${drainAmt} HP!`, "log-status");
    if (isPlayer) syncPlayerMonHP();
    updateBattleUI();
  }

  // Secondary stat/status effects (recoil and drain moves have no additional secondary effect)
  if (move.effect !== "recoil" && move.effect !== "drain") {
    const effMsgs = applyMoveEffect(move, attacker, defender);
    for (const msg of effMsgs) logMsg(msg, "log-status");
  }
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
    slot.statuses = (playerActiveMon.statuses || []).map(s => ({ ...s }));
    delete slot.status; delete slot.poisonTurns; delete slot.sleepTurns;
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
      logMsg(`${leaderName} sent out ${getDisplayName(enemyActiveMon)}!`);
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
    logMsg("Choose your next Lumori!");
    battleContext.forcedSwitch = true;
    showSwitchPanel(true);
  }
}

function endBattle(outcome, slot, levelUps) {
  battleContext.battleEnded = true;
  syncPlayerMonHP();

  // Clear all statuses from the entire team — fresh slate when returning to the overworld.
  // Statuses do not persist outside of battle, regardless of how the battle ended
  // (won, lost, ran, caught).
  for (const mon of G.team) {
    if (mon) clearStatuses(mon);
  }
  // Consume one-time legendary forgotten encounter on any resolution (caught,
  // ran, lost, won). Once marked, the area-entry hook won't re-trigger it.
  if (battleContext.isLegendaryForgotten && battleContext.legendaryForgottenMonId) {
    if (!G.forgottenLegendaryAttempted) G.forgottenLegendaryAttempted = [];
    if (!G.forgottenLegendaryAttempted.includes(battleContext.legendaryForgottenMonId)) {
      G.forgottenLegendaryAttempted.push(battleContext.legendaryForgottenMonId);
      saveGame();
    }
  }
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
    for (const m of G.team) { m.currentHP = m.maxHP; clearStatuses(m); }
    showScreen("screen-gameover");
    const lostMsg = moneyLost > 0 ? ` You lost 💰${moneyLost} in the confusion.` : "";
    document.getElementById("gameover-text").textContent =
      `You blacked out and were rushed to ${WORLD_DATA[G.location]?.name || "town"}.${lostMsg} Your Lumori have been fully healed.`;
    return;
  }

  if (outcome === "won") {
    G.battleWins = (G.battleWins || 0) + 1;
    if (battleContext.battleMode === "double" || battleContext.battleMode === "triple") checkAchievement("win_double");
    checkAchievements();
    trackDailyChallenge("battle_wins");
    if (battleContext.battleMode === "double" || battleContext.battleMode === "triple") trackDailyChallenge("win_double");
    if (slot && slot.currentHP === slot.maxHP) trackDailyChallenge("full_hp_win");
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
          checkAchievements();
          if (typeof onChampionDefeated === "function") onChampionDefeated();
          showHallOfFame();
          triggerStorySequence("champion_defeated");
        } else if (battleContext.isEliteFour) {
          // The Vanguard defeated - give money reward
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
            checkAchievements();
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
      } else if (battleContext.isWielder) {
        // Vaeldris Wielder defeated
        if (!G.defeatedWielders) G.defeatedWielders = [];
        if (!G.defeatedWielders.includes(battleContext.wielderId)) {
          G.defeatedWielders.push(battleContext.wielderId);
        }
        const wielder = typeof VAELDRIS_WIELDERS !== "undefined" ? VAELDRIS_WIELDERS[battleContext.wielderId] : null;
        const wq = typeof QUESTS_DATA !== "undefined" ? QUESTS_DATA.find(q => q.id === battleContext.wielderId) : null;
        if (wq) completeQuest(wq);
        if (isForgottenUnlocked()) {
          G.vaeldrisPartyLock = null;
        }
        const wMsg = wielder ? `${wielder.emoji} <strong>${wielder.name}</strong>:<br>"${wielder.winQuote}"` : "⚔️ Wielder defeated!";
        const afterWin = () => {
          showScreen("screen-main");
          renderWorldMap();
          renderAreaPanel();
          renderHUD();
          saveGame();
        };
        if (wielder && (wielder.lumoriLore || wielder.vaeldrisLore)) {
          showNotification(wMsg, () => {
            if (wielder.lumoriLore) {
              showNotification(`📖 <strong>${wielder.name} — Their Forgotten Lumori</strong><br><br>${wielder.lumoriLore}`, () => {
                if (wielder.vaeldrisLore) {
                  const loreSegments = wielder.vaeldrisLore.split("\n\n");
                  const showSegment = (i) => {
                    if (i >= loreSegments.length) { afterWin(); return; }
                    showNotification(`🌌 <strong>${wielder.name} — Fragment of Vaeldris</strong><br><br>${loreSegments[i]}`, () => showSegment(i + 1));
                  };
                  showSegment(0);
                } else { afterWin(); }
              });
            } else if (wielder.vaeldrisLore) {
              const loreSegments = wielder.vaeldrisLore.split("\n\n");
              const showSegment = (i) => {
                if (i >= loreSegments.length) { afterWin(); return; }
                showNotification(`🌌 <strong>${wielder.name} — Fragment of Vaeldris</strong><br><br>${loreSegments[i]}`, () => showSegment(i + 1));
              };
              showSegment(0);
            } else { afterWin(); }
          });
        } else {
          showNotification(wMsg, afterWin);
        }
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
        // Wild battle won (including legendary and roaming)
        if (battleContext.isLegendary && battleContext.wildMon) {
          if (!G.defeatedLegendaries.includes(battleContext.wildMon.monsterId)) {
            G.defeatedLegendaries.push(battleContext.wildMon.monsterId);
          }
        }
        if (battleContext.isRoaming && battleContext.roamingId) {
          if (!G.roamingCaught.includes(battleContext.roamingId)) {
            G.roamingCaught.push(battleContext.roamingId);
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
  const ngBtn = document.getElementById("btn-hof-ng-plus");
  if (ngBtn) ngBtn.classList.remove("hidden");
  setTimeout(showPostGameContent, 1500);
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

function startMultiBattle(enemyTeam, leaderName, mode, playerSlots = null) {
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
  // playerSlots restricts which team indices are allowed (used for wielder battles)
  playerActiveMons = [];
  playerTeamIdxs = [];
  let placed = 0;
  const allowedSlots = playerSlots || G.team.map((_, i) => i);
  for (const idx of allowedSlots) {
    if (placed >= slots) break;
    const m = G.team[idx];
    if (m && m.currentHP > 0) {
      const levelCap = battleContext.levelCap || null;
      playerActiveMons.push(buildBattleMon(m, levelCap));
      playerTeamIdxs.push(idx);
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
  logMsg(`⚔️ ${modeLabel}! ${leaderName} sent out ${enemyActiveMons.map(m => getDisplayName(m)).join(" & ")}!`);

  updateMultiBattleUI();
  document.getElementById("btn-catch").disabled = true;
  showMultiMovePanel(0);
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
      trackEncounterFlags(e);
      infoEl.classList.remove("hidden");
      spriteEl.classList.remove("hidden");
      document.getElementById(`enemy-name-${i + 1}`).textContent = e.name;
      document.getElementById(`enemy-level-${i + 1}`).textContent = `Lv.${e.level}`;
      const hpPct = Math.max(0, (e.currentHP / e.maxHP) * 100);
      const fill = document.getElementById(`enemy-hp-fill-${i + 1}`);
      fill.style.width = hpPct + "%";
      fill.className = "hp-fill" + (hpPct < 25 ? " red" : hpPct < 50 ? " yellow" : "");
      const statusEl = document.getElementById(`enemy-status-badge-${i + 1}`);
      if (hasAnyStatus(e)) {
        statusEl.classList.remove("hidden");
        statusEl.textContent = e.statuses.map(s => STATUS_REGISTRY[s.type]?.label || s.type.toUpperCase()).join(" ");
        const firstClass = STATUS_REGISTRY[e.statuses[0].type]?.cssClass || `status-${e.statuses[0].type}`;
        statusEl.className = `status-badge ${firstClass}`;
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
      if (hasAnyStatus(p)) {
        statusEl.classList.remove("hidden");
        statusEl.textContent = p.statuses.map(s => STATUS_REGISTRY[s.type]?.label || s.type.toUpperCase()).join(" ");
        const firstClass = STATUS_REGISTRY[p.statuses[0].type]?.cssClass || `status-${p.statuses[0].type}`;
        statusEl.className = `status-badge ${firstClass}`;
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
      spe: getEffectiveSpeed(mon)
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
      spe: getEffectiveSpeed(e)
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

    const moveData = MOVES_DATA[action.moveId];
    const opposingTeam = action.isPlayer ? enemyActiveMons : playerActiveMons;

    // Phase 3 follow-up: wide-spread targets all alive opposing mons (0.75× per-hit)
    if (moveData && moveData.target === "wide") {
      const targets = opposingTeam.filter(m => m && !m.fainted && m.currentHP > 0);
      if (targets.length === 0) continue;
      let first = true;
      for (const t of targets) {
        if (battleContext.battleEnded) break;
        if (action.mon.fainted || action.mon.currentHP <= 0) break;
        await doAttack(action.mon, t, action.moveId, action.isPlayer, {
          targetCount: targets.length,
          suppressIntro: !first,
          allies: opposingTeam,
        });
        first = false;
      }
    } else {
      // Single-target (existing logic, plus opts.allies for Bonded)
      let target = action.isPlayer
        ? enemyActiveMons[action.targetIdx]
        : playerActiveMons[action.targetIdx];
      if (!target || target.fainted || target.currentHP <= 0) {
        target = opposingTeam.find(m => m && !m.fainted && m.currentHP > 0);
        if (!target) continue;
      }
      await doAttack(action.mon, target, action.moveId, action.isPlayer, {
        allies: opposingTeam,
      });
    }

    // Sync HP for player mons
    for (let i = 0; i < playerActiveMons.length; i++) {
      if (playerActiveMons[i]) {
        const slot = G.team[playerTeamIdxs[i]];
        if (slot) {
          slot.currentHP = Math.max(0, playerActiveMons[i].currentHP);
          slot.statuses = (playerActiveMons[i].statuses || []).map(s => ({ ...s }));
          delete slot.status; delete slot.poisonTurns; delete slot.sleepTurns;
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

  // Phase 3 follow-up: Plague intra-team spread (per team, not cross-team)
  const playerSpread = applyPlagueSpread(playerActiveMons);
  const enemySpread = applyPlagueSpread(enemyActiveMons);
  for (const msg of [...playerSpread, ...enemySpread]) logMsg(msg, "log-status");

  // Sync HP again
  for (let i = 0; i < playerActiveMons.length; i++) {
    if (playerActiveMons[i]) {
      const slot = G.team[playerTeamIdxs[i]];
      if (slot) {
        slot.currentHP = Math.max(0, playerActiveMons[i].currentHP);
        slot.statuses = (playerActiveMons[i].statuses || []).map(s => ({ ...s }));
        delete slot.status; delete slot.poisonTurns; delete slot.sleepTurns;
      }
    }
  }

  updateMultiBattleUI();

  // Check for fainted mons and handle replacements
  await handleMultiFaintedMons();

  multiBattlePendingMoves = [];

  if (!battleContext.battleEnded) {
    const firstAliveIdx = playerActiveMons.findIndex(m => m && !m.fainted && m.currentHP > 0);
    if (firstAliveIdx >= 0) showMultiMovePanel(firstAliveIdx);
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
        logMsg(`${getDisplayName(next)} was sent out!`);
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
      // For wielder battles, restrict replacement to the selected 4 slots
      const allowedSlots = battleContext.vaeldrisPlayerSlots ||
        G.team.map((_, idx) => idx);
      const nextIdx = allowedSlots.find(idx =>
        G.team[idx]?.currentHP > 0 && !playerTeamIdxs.includes(idx));
      if (nextIdx !== undefined) {
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
  // Variants use their permuted+drifted base values and rolled typing.
  const base = (slot.variant && slot.variantBase) ? slot.variantBase : def.base;
  const dispTypes = (slot.variant && slot.variantTypes) ? slot.variantTypes : def.types;
  const stats = [
    ["HP",  calcMaxHP(base.hp, lv, ivs.hp),                                250],
    ["ATK", applyNatureToStat("atk", calcStat(base.atk, lv, ivs.atk), nature), 200],
    ["DEF", applyNatureToStat("def", calcStat(base.def, lv, ivs.def), nature), 200],
    ["SPA", applyNatureToStat("spa", calcStat(base.spa, lv, ivs.spa), nature), 200],
    ["SPD", applyNatureToStat("spd", calcStat(base.spd, lv, ivs.spd), nature), 200],
    ["SPE", applyNatureToStat("spe", calcStat(base.spe, lv, ivs.spe), nature), 200]
  ];
  const statKeyMap = { ATK:"atk", DEF:"def", SPA:"spa", SPD:"spd", SPE:"spe" };
  const typeHTML = dispTypes.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(" ");
  const variantBadge = slot.variant ? `<span class="variant-name" style="margin-left:6px">Variant</span>` : "";
  const shinyBadge = slot.shiny ? `<span class="shiny-name" style="margin-left:6px">Radiant</span>` : "";
  const immuneRow = (slot.variant && slot.variantImmune)
    ? `<div class="detail-immune-row" style="margin:6px 0;color:var(--text-muted)">🛡️ Immune to <span class="type-badge type-${slot.variantImmune}">${slot.variantImmune}</span></div>`
    : "";
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

  // Variant distortion block (caught variant only): bespoke/C lore + generated learnset.
  let variantHTML = "";
  if (slot.variant && typeof VariantContent !== "undefined") {
    const vc = (typeof VariantLLM !== "undefined" && VariantLLM.getContent)
      ? VariantLLM.getContent(def, slot) : VariantContent.generate(def, slot);
    const ls = VariantContent.generateLearnset ? VariantContent.generateLearnset(def, slot) : [];
    const lsRows = ls.map(([l, m]) => {
      const mv = MOVES_DATA[m];
      return mv ? `<tr><td>Lv${l}</td><td>${mv.name}</td><td><span class="type-badge type-${mv.type}">${mv.type}</span></td><td style="text-align:right">${mv.power || "—"}</td></tr>` : "";
    }).join("");
    if (vc) variantHTML = `
      <div class="detail-section variant-content">
        <h4>🔀 Variant Distortion</h4>
        <p class="variant-desc">${vc.desc || ""}</p>
        <p class="variant-lore">${vc.lore || ""}</p>
        ${vc.behaviour ? `<p class="variant-behaviour"><strong>In battle:</strong> ${vc.behaviour}</p>` : ""}
        ${lsRows ? `<h4 style="margin-top:0.7rem">Variant Learnset</h4>
        <div class="variant-learnset-wrap"><table class="variant-learnset"><tbody>${lsRows}</tbody></table></div>` : ""}
      </div>`;
  }

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
    <div class="${slot.shiny ? "shiny-sprite" : ""} ${slot.variant ? "variant-sprite" : ""}" style="text-align:center;margin-bottom:1rem">
      ${detailSpriteHTML}
      <h3>${slot.nickname || def.name} ${typeHTML}${variantBadge}${shinyBadge}</h3>
      <p style="color:var(--text-secondary);font-size:0.8rem">Lv.${lv} | XP to next: ${xpToNext}</p>
      <p style="font-size:0.8rem;color:#c9a0dc;margin:0.2rem 0"><strong>${nature}</strong> nature${natureData ? ` — ${natureData.desc}` : ""}</p>
      ${immuneRow}
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
    ${variantHTML}
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
    if (slot.currentHP <= 0) { showNotification("Can't use on a fainted Lumori!"); return; }
    slot.currentHP = Math.min(slot.maxHP, slot.currentHP + item.healAmt);
    G.bag[itemId]--;
    showNotification(`Used ${item.name}! HP restored.`);
  } else if (item.type === "revive") {
    if (slot.currentHP > 0) { showNotification("Lumori is not fainted!"); return; }
    slot.currentHP = Math.floor(slot.maxHP / 2);
    G.bag[itemId]--;
    showNotification(`${MONSTERS_DATA[slot.monsterId].name} was revived!`);
  } else if (item.type === "candy") {
    if (slot.currentHP <= 0) { showNotification("Can't use on a fainted Lumori!"); return; }
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
  if (G.vaeldrisPartyLock) {
    showNotification("🌀 <strong>Vaeldrian Gauntlet Active</strong><br><br>Your party is locked for the duration of the 13 Wielder battles. PC access is restricted until all Wielders are defeated.");
    return;
  }
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
    storageList.innerHTML = '<div class="box-empty">No Lumori in storage. Catch more when your team is full!</div>';
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
          showNotification("You must keep at least 1 Lumori on your team!");
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

const NG_PLUS_DEX_START = 322; // IDs 322-461 are NG+-exclusive (upper bound = FORGOTTEN_DEX_START - 1)
const FORGOTTEN_DEX_START = 462; // IDs >= this are Forgotten Lumori, gated behind Vaeldris-quest completion (not NG+-exclusive)

function isForgottenUnlocked() {
  if (!G || !G.defeatedWielders || typeof VAELDRIS_WIELDERS === "undefined") return false;
  return Object.keys(VAELDRIS_WIELDERS).every(id => G.defeatedWielders.includes(id));
}

// Each wielder's team[0] is by convention the BST-720 Forgotten Lumori catchable
// once the player has finished the full Vaeldris quest. team[1]/team[2] (BST 750/800)
// stay encounter-only via the wielder battles themselves.
function getForgottenLegendaryForArea(areaId) {
  if (typeof VAELDRIS_WIELDERS === "undefined") return null;
  for (const wielder of Object.values(VAELDRIS_WIELDERS)) {
    if (wielder.location === areaId && wielder.team && wielder.team[0]) {
      return { wielder, monId: wielder.team[0].monsterId, level: wielder.team[0].level };
    }
  }
  return null;
}

function maybeTriggerForgottenLegendaryEncounter(areaId) {
  if (!isForgottenUnlocked()) return false;
  const enc = getForgottenLegendaryForArea(areaId);
  if (!enc) return false;
  if (!G.forgottenLegendaryAttempted) G.forgottenLegendaryAttempted = [];
  if (G.forgottenLegendaryAttempted.includes(enc.monId)) return false;
  if (!G.team || G.team.every(m => m.currentHP <= 0)) return false;
  triggerForgottenLegendaryEncounter(enc);
  return true;
}

function triggerForgottenLegendaryEncounter(enc) {
  const w = enc.wielder;
  const def = MONSTERS_DATA[enc.monId];
  if (!def) return;
  // Placeholder cutscene — to be replaced with 13 hand-authored scripts
  // after the stat-spread review (see TODO.md "Forgotten legendary cutscenes").
  const areaName = WORLD_DATA[w.location]?.name || w.location;
  const lines = [
    `${w.emoji || "🌌"} <strong>${w.name}</strong> reappears as you enter ${areaName}.`,
    `${w.emoji || "🌌"} <strong>${w.name}</strong>: "Our duel awakened something in the bond between us and our Lumori. ${def.name} has chosen to test you. Make this chance count — it will not come again."`,
    `🌌 A wild <strong>${def.name}</strong> appears!`
  ];
  showStoryMessage(lines, 0, () => {
    const wildMon = buildWildMon(enc.monId, enc.level);
    startWildBattle(wildMon);
    battleContext.isLegendaryForgotten = true;
    battleContext.legendaryForgottenMonId = enc.monId;
  });
}

function renderDexGrid(filter, search) {
  const grid = document.getElementById("dex-grid");
  grid.innerHTML = "";

  // Sort entries: base game (by ID), then NG+ regular (by ID), then pseudo (tier 1),
  // then legend minor (tier 2), mid (tier 3), apex (tier 4) — all within NG+ section
  const entries = Object.entries(MONSTERS_DATA).map(([id, def]) => [parseInt(id), def]);
  entries.sort(([aId, aDef], [bId, bDef]) => {
    const aNg = aId >= NG_PLUS_DEX_START;
    const bNg = bId >= NG_PLUS_DEX_START;
    if (!aNg && !bNg) return aId - bId;
    if (!aNg) return -1;
    if (!bNg) return 1;
    const aTier = aDef.ngPlusTier || 0;
    const bTier = bDef.ngPlusTier || 0;
    if (aTier !== bTier) return aTier - bTier;
    return aId - bId;
  });

  for (const [mid, def] of entries) {
    const seen = G.seenMonsters.has(mid);
    const caught = G.caughtMonsters.has(mid);
    const isNGPlus = mid >= NG_PLUS_DEX_START;
    const isForeign = !!def.foreignRegion;

    // Vaeldris filter: only show foreignRegion mons (mystery display).
    // Caught mons (the 13 BST-720 legendaries the player can catch post-quest)
    // reveal their real name; otherwise show "Forgotten Lumori N" placeholder.
    if (filter === "vaeldris") {
      if (!isForeign) continue;
      const num = mid - 461;
      const displayName = caught ? def.name : (seen ? `Forgotten Lumori ${num}` : "???");
      const emojiHTML = (seen || caught) ? `<div class="dex-emoji">${def.emoji}</div>` : `<div class="dex-emoji">❓</div>`;
      const card = document.createElement("div");
      card.className = "dex-card vaeldris-card" + (seen ? " seen" : " unseen");
      card.innerHTML = `
        <div class="dex-num">#V${String(num).padStart(2,"0")}</div>
        ${emojiHTML}
        <div class="dex-name">${displayName}</div>
      `;
      if (seen) card.addEventListener("click", () => showForgottenDetail(mid));
      grid.appendChild(card);
      continue;
    }

    // ✨ Shiny showcase: reveal shiny art for species whose shiny you've seen/caught.
    if (filter === "shiny") {
      if (isForeign) continue;
      const sCaught = G.shinyDexCaught && G.shinyDexCaught.has(mid);
      const sSeen = G.shinyDexSeen && G.shinyDexSeen.has(mid);
      if (search && !def.name.toLowerCase().includes(search.toLowerCase()) && !(sCaught || sSeen)) continue;
      const card = document.createElement("div");
      card.className = "dex-card" + (sCaught ? " caught" : sSeen ? " seen" : " unseen");
      const spriteHTML = (sCaught || sSeen) && typeof getMonsterSpriteURL === "function"
        ? `<div class="shiny-sprite"${sSeen && !sCaught ? ' style="opacity:.55"' : ''}><img src="${getMonsterSpriteURL(def, 56)}" width="56" height="56" alt="${def.name}" style="border-radius:6px"></div>`
        : `<div class="dex-emoji">❓</div>`;
      card.innerHTML = `
        <div class="dex-num">✨#${String(mid).padStart(3,"0")}</div>
        ${spriteHTML}
        <div class="dex-name">${(sCaught || sSeen) ? def.name : "???"}</div>`;
      grid.appendChild(card);
      continue;
    }
    // 🔀 Variant tracker: species you've encountered variants of; click for the log.
    if (filter === "variant") {
      if (isForeign) continue;
      const log = (G.variantLog && G.variantLog[mid]) || [];
      const known = log.length || (G.variantDexSeen && G.variantDexSeen.has(mid)) || (G.variantDexCaught && G.variantDexCaught.has(mid));
      if (!known) continue;
      if (search && !def.name.toLowerCase().includes(search.toLowerCase())) continue;
      const vCaught = G.variantDexCaught && G.variantDexCaught.has(mid);
      const card = document.createElement("div");
      card.className = "dex-card" + (vCaught ? " caught" : " seen");
      const spriteHTML = typeof getMonsterSpriteURL === "function"
        ? `<div class="variant-sprite"><img src="${getMonsterSpriteURL(def, 56)}" width="56" height="56" alt="${def.name}" style="border-radius:6px"></div>`
        : `<div class="dex-emoji">${def.emoji}</div>`;
      card.innerHTML = `
        <div class="dex-num">🔀#${String(mid).padStart(3,"0")}</div>
        ${spriteHTML}
        <div class="dex-name">${def.name}</div>
        <div class="dex-name" style="font-size:.65rem;color:var(--text-muted)">${log.length} logged</div>`;
      card.addEventListener("click", () => showVariantDetail(mid));
      grid.appendChild(card);
      continue;
    }

    // All other filters: skip foreignRegion mons entirely
    if (isForeign) continue;
    if (isNGPlus && !(G.ngPlusCount > 0) && !seen) continue;
    if (filter === "ngplus" && !isNGPlus) continue;
    if (filter === "caught" && !caught) continue;
    if (filter === "seen" && !seen) continue;
    if (search && !def.name.toLowerCase().includes(search.toLowerCase()) && !seen) continue;

    const tier = def.ngPlusTier || 0;
    const tierLabels = { 1:"Pseudo", 2:"Legend", 3:"Legend", 4:"Apex Legend" };
    const card = document.createElement("div");
    card.className = "dex-card";
    if (!seen) card.classList.add("unseen");
    else if (!caught) card.classList.add("seen");
    else card.classList.add("caught");
    if (isNGPlus) card.classList.add("ngplus-dex-card");
    if (tier >= 2) card.classList.add(`ngplus-tier-${tier}`);
    const dexSpriteHTML = seen && typeof getMonsterSpriteURL === "function"
      ? `<img src="${getMonsterSpriteURL(def, 56)}" width="56" height="56" alt="${def.name}" style="border-radius:6px">`
      : `<div class="dex-emoji">${seen ? def.emoji : "❓"}</div>`;
    const ngBadge = isNGPlus ? `<span class="dex-ngplus-badge" title="NG+ Exclusive${tier >= 2 ? ' — '+tierLabels[tier] : ''}">⭐</span>` : "";
    card.innerHTML = `
      <div class="dex-num">#${String(mid).padStart(3,"0")}${ngBadge}</div>
      ${dexSpriteHTML}
      <div class="dex-name">${seen ? def.name : "???"}</div>
    `;
    if (seen) card.addEventListener("click", () => showDexDetail(mid));
    grid.appendChild(card);
  }
}

function showVariantDetail(mid) {
  const def = MONSTERS_DATA[mid];
  const log = (G.variantLog && G.variantLog[mid]) || [];
  document.getElementById("dex-detail").classList.remove("hidden");
  document.getElementById("dex-grid").style.display = "none";
  const keys = ["hp","atk","def","spa","spd","spe"];
  const SHAPE = { swift:"swift, fragile", brute:"physical bruiser", caster:"ranged attacker", bulwark:"durable wall", even:"balanced" };
  const hasVC = typeof VariantContent !== "undefined";
  const rows = log.slice().reverse().map((e, i) => {
    const n = log.length - i;
    const v = { variant:true, variantTypes:e.types, variantBase:e.base, variantImmune:e.immune };
    const types = e.types ? e.types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(" ") : "—";
    const prof = (hasVC && e.base) ? VariantContent.statProfile(def, e.base) : null;
    const head = `<div><strong>#${n}</strong> — ${e.caught ? "🎒 Caught" : "👁 Seen"}${e.shiny ? " ✨ Radiant" : ""}</div>
      <div style="margin:.2rem 0">Typing: ${types}</div>`;
    if (e.caught) {
      // Full reveal: exact stats, immunity, bespoke/C lore + behaviour, generated learnset.
      const imm = e.immune ? `<span class="type-badge type-${e.immune}">${e.immune}</span>` : "—";
      const base = e.base ? keys.map(k => `${k.toUpperCase()}&nbsp;${e.base[k]}`).join(" · ") : "—";
      const vc = hasVC ? ((typeof VariantLLM !== "undefined" && VariantLLM.getContent) ? VariantLLM.getContent(def, v) : VariantContent.generate(def, v)) : null;
      const ls = (hasVC && VariantContent.generateLearnset) ? VariantContent.generateLearnset(def, v) : [];
      const lsRows = ls.map(([l, m]) => { const mv = MOVES_DATA[m]; return mv ? `<tr><td>Lv${l}</td><td>${mv.name}</td><td><span class="type-badge type-${mv.type}">${mv.type}</span></td><td style="text-align:right">${mv.power || "—"}</td></tr>` : ""; }).join("");
      return `<div class="detail-section variant-content" style="text-align:left">
        ${head}
        <div style="margin:.2rem 0">🛡️ Immune to: ${imm}</div>
        <div style="font-size:.72rem;color:var(--text-muted)">Stat spread: ${base}</div>
        ${vc ? `<p class="variant-desc">${vc.desc || ""}</p><p class="variant-lore">${vc.lore || ""}</p>${vc.behaviour ? `<p class="variant-behaviour"><strong>In battle:</strong> ${vc.behaviour}</p>` : ""}` : ""}
        ${lsRows ? `<div class="variant-learnset-wrap"><table class="variant-learnset"><tbody>${lsRows}</tbody></table></div>` : ""}
      </div>`;
    }
    // Seen / enemy (uncatchable): observed only — typing + qualitative shape; lore & learnset locked.
    return `<div class="detail-section" style="text-align:left">
      ${head}
      <div style="font-size:.72rem;color:var(--text-muted)">Observed build: ${prof ? (SHAPE[prof.label] || prof.label) + ", " + prof.heft + " than base" : "unclear"}</div>
      <div style="font-size:.72rem;color:var(--text-muted)">🛡️ Immune to: ???</div>
      <div style="font-size:.72rem;color:#c9a0dc;margin-top:.2rem">🔒 Catch this variant to reveal its lore, immunity, and learnset.</div>
    </div>`;
  }).join("") || "<p style='color:var(--text-muted)'>No variants recorded yet.</p>";
  document.getElementById("dex-detail-content").innerHTML = `
    <div style="text-align:center;margin-bottom:.5rem">
      <h2 style="color:var(--accent-purple)">🔀 ${def.name} — Variant log</h2>
      <p style="color:var(--text-muted);font-size:.8rem">${log.length} variant${log.length === 1 ? "" : "s"} recorded (newest first, last 30 kept)</p>
    </div>
    ${rows}`;
}

function showForgottenDetail(monsterId) {
  const def = MONSTERS_DATA[monsterId];
  const num = monsterId - 461;
  document.getElementById("dex-detail").classList.remove("hidden");
  document.getElementById("dex-grid").style.display = "none";
  document.getElementById("dex-detail-content").innerHTML = `
    <div style="text-align:center;padding:2rem 1rem">
      <div style="font-size:4rem;margin-bottom:0.5rem">${def.emoji}</div>
      <h2 style="color:var(--accent-yellow);margin:0 0 0.5rem">Forgotten Lumori ${num}</h2>
      <div style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem">Encountered in battle</div>
      <div style="display:flex;gap:0.5rem;justify-content:center;margin-bottom:1.5rem">
        <span class="type-badge" style="background:#555;color:#aaa">???</span>
        <span class="type-badge" style="background:#555;color:#aaa">???</span>
      </div>
      <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:8px;padding:1rem;max-width:280px;margin:0 auto">
        <p style="color:var(--text-muted);font-style:italic;font-size:0.85rem;line-height:1.6">
          No data available. This creature is not native to Lumoria.<br><br>
          Its origins, typing, and capabilities remain unknown.
        </p>
      </div>
    </div>`;
}

function showDexDetail(monsterId) {
  const def = MONSTERS_DATA[monsterId];
  const caught = G.caughtMonsters.has(monsterId);
  document.getElementById("dex-detail").classList.remove("hidden");
  document.getElementById("dex-grid").style.display = "none";

  const isNGPlusMon = monsterId >= NG_PLUS_DEX_START;
  const ngPlusDetailBadge = isNGPlusMon ? `<span class="ngplus-detail-badge">⭐ NG+ Exclusive — only found in New Game+ runs</span>` : "";
  const typeHTML = def.types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(" ");
  const bst = Object.values(def.base).reduce((s, v) => s + v, 0);
  const STAT_CAP = 180;
  const BST_CAP = 720;
  const renderOverdrive = (val, cap) => {
    if (val <= cap) return '';
    const pct = ((val - cap) / cap) * 100;
    return `<div class="stat-fill-overdrive" style="width:${pct}%" title="Overdrive: ${val - cap} above standard cap of ${cap}"></div>`;
  };
  const statsHTML = Object.entries(def.base).map(([stat, val]) => `
    <div class="stat-row">
      <span class="stat-label">${stat.toUpperCase()}</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100,(val/STAT_CAP)*100)}%;background:#58a6ff"></div>${renderOverdrive(val, STAT_CAP)}</div>
      <span class="stat-val">${val}</span>
    </div>`).join("") + `
    <div class="stat-row stat-row-bst">
      <span class="stat-label">BST</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100,(bst/BST_CAP)*100)}%;background:var(--accent-yellow)"></div>${renderOverdrive(bst, BST_CAP)}</div>
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
      ${ngPlusDetailBadge}
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
  document.getElementById("btn-new-game").addEventListener("click", () => showSaveSlots());
  document.getElementById("btn-continue").addEventListener("click", () => showSaveSlots());
  document.getElementById("btn-slots-back").addEventListener("click", () => showScreen("screen-title"));
  document.getElementById("btn-fullscreen").addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", () => {
    const btn = document.getElementById("btn-fullscreen");
    if (btn) btn.textContent = document.fullscreenElement ? "⛶ Exit" : "⛶";
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
    const carry = window._ngPlusCarry;
    G = newGameState(window._pendingName || carry?.name || "Trainer", starterId);
    G.saveSlot = window._pendingSlot || 0;
    if (carry) {
      G.ngPlusCount = carry.ngCount;
      G.box = carry.box;
      window._ngPlusCarry = null;
    }
    showScreen("screen-main");
    renderHUD();
    renderWorldMap();
    renderAreaPanel();
    saveGame();
    const isNGP = G.ngPlusCount > 0;
    showNotification(
      isNGP
        ? `⭐ NG+${G.ngPlusCount} started! You chose ${MONSTERS_DATA[starterId].name}!`
        : `🎉 You chose ${MONSTERS_DATA[starterId].name}! Your adventure begins!`,
      () => {
        if (typeof MusicEngine !== "undefined") { MusicEngine.init(); MusicEngine.playOverworld(); }
        if (!isNGP) triggerStorySequence("intro");
      }
    );
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
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumori are fainted! Heal first."); return; }
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
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumori are fainted! Heal first."); return; }
    const leader = GYM_LEADERS["champion"];
    showBattleFormatSelection(leader.name, "👑", leader.quote, fmt => startGymBattle("champion", fmt));
  });

  // The Vanguard
  document.getElementById("btn-elite-four")?.addEventListener("click", () => {
    if (typeof ELITE_FOUR === "undefined") return;
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumori are fainted! Heal first."); return; }
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
  document.getElementById("nav-achievements")?.addEventListener("click", showAchievementsScreen);
  document.getElementById("btn-achievements-back")?.addEventListener("click", () => showScreen("screen-main"));

  // Online nav + hub
  document.getElementById("nav-online")?.addEventListener("click", () => showOnlineHub());
  document.getElementById("btn-online-hub-back")?.addEventListener("click", () => showScreen("screen-main"));
  document.getElementById("hub-leaderboards")?.addEventListener("click", () => { if (typeof showLeaderboards === "function") showLeaderboards(); else showScreen("screen-leaderboards"); });
  document.getElementById("hub-trade")?.addEventListener("click", () => { if (typeof loadTradeListings === "function") { loadTradeListings(); if (typeof renderMyBoxForTrade === "function") renderMyBoxForTrade(); } showScreen("screen-trade"); });
  document.getElementById("hub-pvp")?.addEventListener("click", () => { if (typeof showPvPScreen === "function") showPvPScreen(); else showScreen("screen-pvp"); });
  document.getElementById("hub-friends")?.addEventListener("click", () => { if (typeof showFriendsScreen === "function") showFriendsScreen(); else showScreen("screen-friends"); });

  // Online screens back buttons — return to hub
  document.getElementById("btn-friends-back")?.addEventListener("click", () => showScreen("screen-online-hub"));
  document.getElementById("btn-add-friend")?.addEventListener("click", () => {
    const code = document.getElementById("add-friend-input")?.value.trim();
    if (code && typeof addFriend === "function") addFriend(code);
  });
  document.getElementById("btn-lb-back")?.addEventListener("click", () => showScreen("screen-online-hub"));
  document.getElementById("btn-trade-back")?.addEventListener("click", () => showScreen("screen-online-hub"));
  document.getElementById("btn-pvp-back")?.addEventListener("click", () => {
    if (typeof leaveLiveRoom === "function") leaveLiveRoom();
    showScreen("screen-online-hub");
  });
  // PvP mode tabs (simulated / live)
  document.querySelectorAll(".pvp-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pvp-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".pvp-tab-content").forEach(c => c.classList.add("hidden"));
      btn.classList.add("active");
      document.getElementById(`pvp-tab-${btn.dataset.tab}`)?.classList.remove("hidden");
      if (btn.dataset.tab === "live" && typeof renderLiveRoomUI === "function") {
        renderLiveRoomUI("idle", null, null);
      }
    });
  });
  document.getElementById("btn-post-trade")?.addEventListener("click", () => {
    const type = document.getElementById("trade-wanted-type")?.value || "";
    if (typeof postTrade === "function") postTrade(type);
  });
  document.getElementById("btn-post-challenge")?.addEventListener("click", () => {
    if (typeof postBattleChallenge === "function") postBattleChallenge();
  });
  document.getElementById("btn-accept-by-code")?.addEventListener("click", () => {
    const code = document.getElementById("pvp-code-input")?.value.trim();
    if (code && typeof acceptBattleChallenge === "function") acceptBattleChallenge(code);
  });

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
      showNotification("All your Lumori are fainted! Heal first.");
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
      showNotification("All your Lumori are fainted! Heal first.");
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
      showNotification("All your Lumori are fainted! Heal first.");
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
      showNotification("All your Lumori are fainted! Heal first.");
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

  // Roaming legendary button
  document.getElementById("btn-roaming")?.addEventListener("click", () => {
    if (G.team.every(m => m.currentHP <= 0)) { showNotification("All your Lumori are fainted! Heal first."); return; }
    const roamers = getRoamingAtLocation(G.location);
    if (roamers.length === 0) { renderAreaPanel(); return; }
    const r = roamers[0];
    const def = MONSTERS_DATA[r.monsterId];
    showNotification(`🌿 The roaming <strong>${r.name}</strong> (Lv.${r.level}) has been spotted here!<br>"${def.desc}"`, () => {
      const wildMon = buildWildMon(r.monsterId, r.level);
      G.seenMonsters.add(r.monsterId);
      battleContext = {
        isWild: true, isGym: false, isChampion: false, isLegendary: true,
        isRoaming: true, roamingId: r.monsterId,
        battleMode: "single", wildMon,
        playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
      };
      playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx]);
      enemyActiveMon = wildMon;
      hideMultiBattleSlots();
      showScreen("screen-battle");
      clearBattleLog();
      logMsg(`🌿 The roaming ${r.name} appeared! (Lv.${r.level})`, "log-catch");
      updateBattleUI();
      showBattleMainActions();
      document.getElementById("btn-catch").disabled = false;
    });
  });

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
    for (const m of G.team) { m.currentHP = m.maxHP; clearStatuses(m); }
    showScreen("screen-main");
    renderHUD();
    renderWorldMap();
    renderAreaPanel();
    saveGame();
  });

  // Hall of fame / New Game+
  document.getElementById("btn-hof-ng-plus").addEventListener("click", () => startNGPlus());
  document.getElementById("btn-hof-ngplus-info")?.addEventListener("click", () => showScreen("screen-ngplus-info"));
  document.getElementById("btn-ngplus-info-back")?.addEventListener("click", () => showScreen("screen-hof"));
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
  logMsg(`${battle.name} sent out ${getDisplayName(enemyActiveMon)}!`);
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
  logMsg(`${trainer.name} sent out ${getDisplayName(enemyActiveMon)}!`);
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
  logMsg(`${battle.name} sent out ${getDisplayName(enemyActiveMon)}!`);
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
    showNotification("This item has no effect on this Lumori.");
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
    showNotification("No evolution items can be used on this Lumori.");
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

function showStoryMessage(messages, idx, onComplete) {
  if (idx >= messages.length) { if (onComplete) onComplete(); return; }
  showNotification(messages[idx], () => {
    showStoryMessage(messages, idx + 1, onComplete);
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
    migrateStatuses(mon);
    if (mon.currentHP < mon.maxHP || hasAnyStatus(mon)) {
      mon.currentHP = mon.maxHP;
      clearStatuses(mon);
      healed = true;
    }
  }
  if (healed) {
    trackDailyChallenge("heal");
    renderHUD();
    saveGame();
    showNotification("💊 Your Lumori team has been fully healed!");
  } else {
    showNotification("Your Lumori are already at full health!");
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
  renderDailyChallengesUI();
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
      G.badges.length >= (q.requiredBadges || 0) &&
      (!q.requiresNGPlus || (G.ngPlusCount > 0)) &&
      (!q.requiresChampion || G.championDefeated) &&
      (!q.requiresDefeated || (G.defeatedLeaders || []).includes(q.requiresDefeated))
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
    const typeIcons = { boss: "⚔️", catch: "🔵", visit: "🗺️", fetch: "📦", battle: "🥊", wielder: "🌀" };

    const card = document.createElement("div");
    const ngPlusQuest = !!quest.requiresNGPlus;
    card.className = "quest-card" + (isCompleted ? " quest-completed" : "") + (ngPlusQuest ? " quest-ngplus" : "");
    card.innerHTML = `
      <div class="quest-card-header">
        <span class="quest-type-icon">${typeIcons[quest.type] || "📋"}</span>
        <div class="quest-card-title">
          <strong>${quest.title}${ngPlusQuest ? ' <span class="ng-badge">NG+</span>' : ""}</strong>
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
  if (quest.type === "wielder") {
    if (G.location !== quest.location) {
      showNotification(`You must be at <strong>${WORLD_DATA[quest.location]?.name || quest.location}</strong> to challenge this Wielder.`);
      return;
    }
    if ((G.defeatedWielders || []).includes(quest.id)) {
      showNotification(`You have already defeated this Wielder.`);
      return;
    }
    startWielderBattle(quest);
    return;
  }
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

// ============================================================
// VAELDRIS WIELDER BATTLE SYSTEM
// ============================================================

function startWielderBattle(quest) {
  const wielder = typeof VAELDRIS_WIELDERS !== "undefined" ? VAELDRIS_WIELDERS[quest.id] : null;
  const doFormatThenParty = () => {
    showBattleFormatSelection(
      wielder?.name || "the Wielder",
      wielder?.emoji || "🌀",
      wielder?.quote || "",
      fmt => showVaeldrisPartySelect(quest, fmt)
    );
  };
  if (!G.vaeldrisPartyLock) {
    G.vaeldrisPartyLock = G.team.map((_, i) => i);
    saveGame();
    showNotification(`🌀 <strong>Vaeldrian Gauntlet Begins!</strong><br><br>Your current party of ${G.team.length} is now locked for all 13 Wielder battles. You cannot change your team via PC until all 13 are defeated.<br><br>You will choose how many Lumori to bring each fight.`, doFormatThenParty);
  } else {
    doFormatThenParty();
  }
}

function showVaeldrisPartySelect(quest, fmt = "triple") {
  const wielderId = quest.id;
  const wielder = typeof VAELDRIS_WIELDERS !== "undefined" ? VAELDRIS_WIELDERS[wielderId] : null;
  const lockedIndices = G.vaeldrisPartyLock || G.team.map((_, i) => i);
  const pickCount = fmt === "single" ? 2 : fmt === "double" ? 3 : 4;

  const overlay = document.getElementById("vaeldris-party-select");
  const title = document.getElementById("vaeldris-select-title");
  const grid = document.getElementById("vaeldris-select-grid");
  const confirmBtn = document.getElementById("vaeldris-select-confirm");

  if (!overlay || !grid || !confirmBtn) {
    const fallback = lockedIndices.filter(i => G.team[i]?.currentHP > 0).slice(0, pickCount);
    if (fallback.length < 1) { showNotification("Your Lumori have no HP! Heal before challenging a Wielder."); return; }
    launchWielderBattle(quest, fallback, fmt);
    return;
  }

  const fmtLabel = {single:"Single",double:"Double",triple:"Triple"}[fmt] || "Triple";
  title.textContent = `${fmtLabel} Battle — Choose ${pickCount} for ${wielder?.name || "the Wielder"}`;
  grid.innerHTML = "";
  let selected = [];

  for (const idx of lockedIndices) {
    const m = G.team[idx];
    if (!m) continue;
    const def = MONSTERS_DATA[m.monsterId];
    const card = document.createElement("div");
    card.className = "vaeldris-select-card" + (m.currentHP <= 0 ? " fainted" : "");
    card.dataset.idx = idx;
    card.innerHTML = `
      <div class="vaeldris-card-emoji">${def?.emoji || "❓"}</div>
      <div class="vaeldris-card-name">${m.nickname || def?.name || "?"}</div>
      <div class="vaeldris-card-level">Lv.${m.level}</div>
      <div class="vaeldris-card-hp" style="color:${m.currentHP <= 0 ? "#e74c3c" : "var(--text-muted)"}">
        ${m.currentHP <= 0 ? "FAINTED" : `HP: ${m.currentHP}/${m.maxHP}`}
      </div>`;
    if (m.currentHP > 0) {
      card.addEventListener("click", () => {
        if (card.classList.contains("chosen")) {
          card.classList.remove("chosen");
          selected = selected.filter(i => i !== idx);
        } else if (selected.length < pickCount) {
          card.classList.add("chosen");
          selected.push(idx);
        }
        confirmBtn.disabled = selected.length !== pickCount;
        confirmBtn.textContent = `Confirm (${selected.length}/${pickCount} selected)`;
      });
    }
    grid.appendChild(card);
  }

  confirmBtn.disabled = true;
  confirmBtn.textContent = `Confirm (0/${pickCount} selected)`;
  confirmBtn.onclick = () => {
    if (selected.length !== pickCount) return;
    overlay.classList.add("hidden");
    launchWielderBattle(quest, selected, fmt);
  };
  document.getElementById("vaeldris-select-cancel")?.addEventListener("click", () => {
    overlay.classList.add("hidden");
  }, { once: true });

  overlay.classList.remove("hidden");
}

function launchWielderBattle(quest, playerSlots, fmt = "triple") {
  const wielderId = quest.id;
  const wielder = typeof VAELDRIS_WIELDERS !== "undefined" ? VAELDRIS_WIELDERS[wielderId] : null;
  if (!wielder) { showNotification("Wielder data not found."); return; }
  const isNGPlus = G.ngPlusCount > 0;
  const teamData = (isNGPlus && wielder.ngTeam) ? wielder.ngTeam : wielder.team;
  const enemyTeam = teamData.map(s => buildGymMon(s));

  battleContext = {
    isWild: false, isGym: false, isChampion: false, isRival: false,
    isUmbra: false, isUmbraArea: false, isQuest: false, isTrainer: false,
    isWielder: true, wielderId, questId: wielderId,
    battleMode: fmt,
    leaderId: wielderId,
    enemyTeam, enemyTeamIdx: Math.min(fmt === "triple" ? 3 : fmt === "double" ? 2 : 1, enemyTeam.length),
    vaeldrisPlayerSlots: playerSlots,
    levelCap: null
  };

  if (fmt === "single") {
    const playerIdx = playerSlots[0];
    battleContext.playerTeamIdx = playerIdx;
    const levelCap = null;
    playerActiveMon = buildBattleMon(G.team[playerIdx], levelCap);
    enemyActiveMon = enemyTeam[0];
    hideMultiBattleSlots();
    showScreen("screen-battle");
    clearBattleLog();
    logMsg(`${wielder.emoji} ${wielder.name}: "${wielder.quote}"`);
    renderBattleUI();
  } else {
    startMultiBattle(enemyTeam, wielder.name, fmt, playerSlots);
  }
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

// ============================================================
// ACHIEVEMENTS
// ============================================================
const ACHIEVEMENTS = [
  { id:"first_catch",    icon:"🎉", name:"First Catch",        desc:"Catch your first Lumori" },
  { id:"catch_10",       icon:"📦", name:"Collector",           desc:"Catch 10 different Lumori" },
  { id:"catch_50",       icon:"🏆", name:"Great Collector",     desc:"Catch 50 different Lumori" },
  { id:"catch_all",      icon:"👑", name:"Luminex Complete",    desc:"Catch all 321 Lumori" },
  { id:"first_badge",    icon:"🏅", name:"Badge Earner",        desc:"Win your first gym badge" },
  { id:"eight_badges",   icon:"💎", name:"Badge Master",        desc:"Earn all 16 badges" },
  { id:"first_shiny",    icon:"✨", name:"Radiant Hunter",        desc:"Encounter a Radiant Lumori" },
  { id:"catch_shiny",    icon:"🌟", name:"Radiant Keeper",        desc:"Catch a Radiant Lumori" },
  { id:"catch_variant",  icon:"🔀", name:"Variant Collector",   desc:"Catch a variant Lumori" },
  { id:"champion",       icon:"🥇", name:"Champion",            desc:"Defeat the Lumoria Champion" },
  { id:"elite_four",     icon:"⚔️", name:"Elite Victor",        desc:"Defeat all The Vanguard members" },
  { id:"level100",       icon:"💯", name:"Max Level",           desc:"Raise a Lumori to level 100" },
  { id:"win_50",         icon:"🔥", name:"Battle Veteran",      desc:"Win 50 battles" },
  { id:"win_double",     icon:"🤝", name:"Double Trouble",      desc:"Win a double battle" },
  { id:"evolve5",        icon:"⬆️", name:"Evolver",             desc:"Evolve 5 Lumori" },
  { id:"use_all_types",  icon:"🌈", name:"Type Master",         desc:"Use a move of every type in battle" },
  { id:"full_party",     icon:"🐾", name:"Full Team",           desc:"Fill your party with 6 Lumori" },
  { id:"dex100",         icon:"📖", name:"Half-Dex",            desc:"See 100 different Lumori" },
  { id:"post_game",      icon:"🌐", name:"What Lies Beyond",    desc:"Become Champion and start post-game" },
  { id:"legendary",      icon:"🦋", name:"Legendary Tamer",     desc:"Catch a legendary Lumori" },
  // NG+ achievements
  { id:"ngplus_start",   icon:"⭐", name:"NG+ Pioneer",         desc:"Begin your first New Game Plus run" },
  { id:"ngplus_catch25", icon:"🌌", name:"Rift Walker",         desc:"Catch 25 NG+-exclusive Lumori" },
  { id:"ngplus_catch50", icon:"🔮", name:"Void Collector",      desc:"Catch 50 NG+-exclusive Lumori" },
  { id:"ngplus_catchall",icon:"👑", name:"Apex Completionist",  desc:"Catch all NG+-exclusive Lumori" },
  { id:"ngplus_pseudo",  icon:"🐉", name:"Pseudo Hunter",       desc:"Catch a pseudo-legendary NG+ Lumori" },
  { id:"ngplus_legend",  icon:"⚡", name:"Legend of Legends",   desc:"Catch a legendary NG+ Lumori" },
];

function checkAchievement(id) {
  if (!G || G.achievements.includes(id)) return;
  const def = ACHIEVEMENTS.find(a => a.id === id);
  if (!def) return;
  G.achievements.push(id);
  showAchievementToast(def);
}

function checkAchievements() {
  if (!G) return;
  const caught = G.caughtMonsters.size;
  if (caught >= 1)  checkAchievement("first_catch");
  if (caught >= 10) checkAchievement("catch_10");
  if (caught >= 50) checkAchievement("catch_50");
  if (caught >= 321) checkAchievement("catch_all");
  if (G.badges.length >= 1)  checkAchievement("first_badge");
  if (G.badges.length >= 16) checkAchievement("eight_badges");
  if (G.championDefeated)    checkAchievement("champion");
  if (typeof ELITE_FOUR !== "undefined" && ELITE_FOUR.every(e => G.defeatedLeaders.includes(e.id))) checkAchievement("elite_four");
  if (G.team.some(m => m.level >= 100)) checkAchievement("level100");
  if (G.team.length >= 6)    checkAchievement("full_party");
  if (G.seenMonsters.size >= 100) checkAchievement("dex100");
  if (G.team.some(m => m.shiny && G.caughtMonsters.has(m.monsterId))) checkAchievement("catch_shiny");
  if (G.team.some(m => m.variant) || (G.box||[]).some(m => m.variant)) checkAchievement("catch_variant");
  if (G.defeatedLegendaries?.length > 0) checkAchievement("legendary");
  const wins = G.battleWins || 0;
  if (wins >= 50) checkAchievement("win_50");
}

let _achieveTimer = null;
function showAchievementToast(def) {
  const toast = document.getElementById("achievement-toast");
  if (!toast) return;
  toast.querySelector(".achievement-toast-icon").textContent = def.icon;
  toast.querySelector(".achievement-toast-name").textContent = def.name;
  toast.querySelector(".achievement-toast-desc").textContent = def.desc;
  toast.classList.add("visible");
  clearTimeout(_achieveTimer);
  _achieveTimer = setTimeout(() => toast.classList.remove("visible"), 4000);
}

function showOnlineHub() {
  showScreen("screen-online-hub");
  const statusEl = document.getElementById("online-hub-status");
  if (!statusEl) return;
  if (typeof onlineReady !== "undefined" && onlineReady) {
    const code = typeof getMyFriendCode === "function" ? getMyFriendCode() : null;
    statusEl.innerHTML = `<span class="online-status-on">🟢 Online</span>${code ? ` · Your Friend Code: <strong>${code}</strong>` : ""}`;
  } else {
    statusEl.innerHTML = `<span class="online-status-off">🔴 Offline</span> — Configure Firebase in js/online.js to enable online features.`;
  }
}

function showAchievementsScreen() {
  showScreen("screen-achievements");
  const list = document.getElementById("achievements-list");
  list.innerHTML = "";
  for (const a of ACHIEVEMENTS) {
    const earned = G.achievements.includes(a.id);
    const div = document.createElement("div");
    div.className = "achievement-card" + (earned ? " earned" : "");
    div.innerHTML = `<div class="achievement-icon">${earned ? a.icon : "❓"}</div><div class="achievement-info"><div class="achievement-name">${a.name}</div><div class="achievement-desc">${a.desc}</div></div>`;
    list.appendChild(div);
  }
}

// ============================================================
// POST-GAME
// ============================================================
function showPostGameContent() {
  const banner = document.getElementById("postGame-banner");
  if (!banner || !G?.championDefeated) return;
  banner.classList.remove("hidden");
  banner.innerHTML = `<strong>🌐 Post-Game Unlocked!</strong><br>
    • Gym leaders will rematch you at higher levels<br>
    • Seek out the <em>legendary Lumori</em> still hidden across the region<br>
    • 🌿 <em>Roaming Legendaries</em> appear at different areas each day<br>
    • 🧪 <em>Umbra Remnant Raids</em> are now accessible from the Void Rift<br>
    • Hunt for <em>✨ shinies</em> (1/2048) and <em>🔀 variants</em> (1/100)<br>
    • Complete your Luminex — ${G.caughtMonsters.size}/321 caught<br>
    • Earn all ${ACHIEVEMENTS.length} achievements`;
  checkAchievement("post_game");
}

// ============================================================
// ROAMING LEGENDARIES
// ============================================================
const ROAMING_LEGENDARIES = [
  { monsterId:314, name:"Galeaxis",  emoji:"🌪️", level:65,
    areas:["route4","gale_peak","storm_plateau","route8","crystal_cliffs","route2"] },
  { monsterId:317, name:"Temporith", emoji:"⏳",  level:68,
    areas:["ancient_ruins","void_rift","cosmic_cavern","astral_plateau","nebula_gorge","route16"] },
];

function getRoamingArea(entry) {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return entry.areas[dayIndex % entry.areas.length];
}

function getRoamingAtLocation(locationId) {
  if (!G?.championDefeated) return [];
  return ROAMING_LEGENDARIES.filter(r =>
    !(G.roamingCaught || []).includes(r.monsterId) &&
    getRoamingArea(r) === locationId
  );
}

// ============================================================
// DAILY CHALLENGES
// ============================================================
const DAILY_CHALLENGE_POOL = [
  { id:"win3",      icon:"⚔️", text:"Win 3 battles today",          type:"battle_wins",    target:3,  reward:{money:500} },
  { id:"win5",      icon:"🏅", text:"Win 5 battles today",          type:"battle_wins",    target:5,  reward:{item:"maxPotion",qty:2} },
  { id:"catch2",    icon:"🔵", text:"Catch 2 Lumori today",           type:"catch_count",    target:2,  reward:{item:"greatOrb",qty:3} },
  { id:"catch_fire",icon:"🔥", text:"Catch a Fire-type Lumori",       type:"catch_type",     param:"Fire",    target:1, reward:{money:400} },
  { id:"catch_water",icon:"💧",text:"Catch a Water-type Lumori",      type:"catch_type",     param:"Water",   target:1, reward:{money:400} },
  { id:"catch_elec",icon:"⚡", text:"Catch an Electric-type Lumori",  type:"catch_type",     param:"Electric",target:1, reward:{money:400} },
  { id:"catch_dark",icon:"🌑", text:"Catch a Dark-type Lumori",       type:"catch_type",     param:"Dark",    target:1, reward:{money:400} },
  { id:"catch_psyc",icon:"🔮", text:"Catch a Psychic-type Lumori",    type:"catch_type",     param:"Psychic", target:1, reward:{money:400} },
  { id:"catch_rare",icon:"⭐", text:"Catch a rare or legendary Lumori",type:"catch_rare",    target:1,  reward:{item:"ultraOrb",qty:2} },
  { id:"heal",      icon:"💊", text:"Heal your team at a town",      type:"heal",           target:1,  reward:{money:200} },
  { id:"visit3",    icon:"🗺️", text:"Visit 3 different areas",      type:"visit_areas",    target:3,  reward:{money:300} },
  { id:"evolve",    icon:"⬆️", text:"Evolve a Lumori today",           type:"evolve_today",   target:1,  reward:{item:"rareCandy",qty:2} },
  { id:"win_double",icon:"🤝", text:"Win a double battle",           type:"win_double",     target:1,  reward:{money:600} },
  { id:"shiny_enc", icon:"✨", text:"Encounter a Radiant Lumori",        type:"shiny_encounter",target:1,  reward:{item:"masterOrb",qty:1} },
  { id:"full_hp",   icon:"❤️", text:"Win a battle with your lead at full HP", type:"full_hp_win", target:1, reward:{money:400} },
];

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function getDailyChallenges() {
  const d = new Date();
  let seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const pool = [...DAILY_CHALLENGE_POOL];
  const picks = [];
  while (picks.length < 3 && pool.length > 0) {
    seed = ((seed * 1664525) + 1013904223) & 0x7fffffff;
    picks.push(pool.splice(seed % pool.length, 1)[0]);
  }
  return picks;
}

function initDailyChallenges() {
  const today = getTodayKey();
  if (!G.dailyChallenges || G.dailyChallenges.date !== today) {
    G.dailyChallenges = { date: today, progress: {}, completed: [] };
  }
}

function trackDailyChallenge(type, param) {
  if (!G) return;
  initDailyChallenges();
  for (const ch of getDailyChallenges()) {
    if (G.dailyChallenges.completed.includes(ch.id)) continue;
    if (ch.type !== type) continue;
    if (ch.param && ch.param !== param) continue;
    G.dailyChallenges.progress[ch.id] = (G.dailyChallenges.progress[ch.id] || 0) + 1;
    if (G.dailyChallenges.progress[ch.id] >= ch.target) {
      completeDailyChallenge(ch);
    }
  }
}

function completeDailyChallenge(ch) {
  G.dailyChallenges.completed.push(ch.id);
  if (ch.reward.money) G.money += ch.reward.money;
  if (ch.reward.item)  G.bag[ch.reward.item] = (G.bag[ch.reward.item] || 0) + (ch.reward.qty || 1);
  renderHUD();
  saveGame();
  showAchievementToast({ icon: ch.icon, name: "Daily Complete! " + ch.icon, desc: ch.text });
  renderDailyChallengesUI();
}

function renderDailyChallengesUI() {
  const el = document.getElementById("daily-challenges-section");
  if (!el || !G) return;
  initDailyChallenges();
  const challenges = getDailyChallenges();
  el.innerHTML = `<div class="daily-header">📅 Daily Challenges — ${getTodayKey()}</div>`;
  for (const ch of challenges) {
    const done = G.dailyChallenges.completed.includes(ch.id);
    const prog = G.dailyChallenges.progress[ch.id] || 0;
    const rewardText = ch.reward.money
      ? `💰 ${ch.reward.money}`
      : `${ch.reward.item} ×${ch.reward.qty || 1}`;
    const div = document.createElement("div");
    div.className = "daily-card" + (done ? " daily-done" : "");
    div.innerHTML = `
      <span class="daily-icon">${done ? "✅" : ch.icon}</span>
      <div class="daily-info">
        <div class="daily-text">${ch.text}</div>
        <div class="daily-progress">${done ? "Complete!" : `${prog} / ${ch.target}`}</div>
      </div>
      <div class="daily-reward">${rewardText}</div>`;
    el.appendChild(div);
  }
}

// ---- BOOT ----
window.addEventListener("load", () => {
  initEventListeners();
  showScreen("screen-title");

  // Map re-render on resize
  window.addEventListener("resize", () => {
    if (G) { renderWorldMap(); }
  });
});

