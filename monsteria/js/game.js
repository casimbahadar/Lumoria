// ============================================================
// MONSTERIA - Main Game Logic & UI
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
    saveTimestamp: Date.now()
  };
}

function createPartySlot(monsterId, level) {
  const def = MONSTERS_DATA[monsterId];
  const maxHP = calcMaxHP(def.base.hp, level);
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
    status: null
  };
}

// ---- Save / Load ----
function saveGame() {
  if (!G) return;
  G.saveTimestamp = Date.now();
  const save = { ...G, seenMonsters: [...G.seenMonsters], caughtMonsters: [...G.caughtMonsters] };
  localStorage.setItem("monsteria_save", JSON.stringify(save));
  showNotification("Game saved! ✅");
}

function loadGame() {
  const raw = localStorage.getItem("monsteria_save");
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    data.seenMonsters = new Set(data.seenMonsters);
    data.caughtMonsters = new Set(data.caughtMonsters);
    G = data;
    return true;
  } catch(e) { return false; }
}

function hasSave() {
  return !!localStorage.getItem("monsteria_save");
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
  const stats = [
    ["HP", calcMaxHP(def.base.hp, lv) - calcMaxHP(def.base.hp, lv-1)],
    ["ATK", calcStat(def.base.atk, lv) - calcStat(def.base.atk, lv-1)],
    ["DEF", calcStat(def.base.def, lv) - calcStat(def.base.def, lv-1)],
    ["SP.A", calcStat(def.base.spa, lv) - calcStat(def.base.spa, lv-1)],
    ["SP.D", calcStat(def.base.spd, lv) - calcStat(def.base.spd, lv-1)],
    ["SPE", calcStat(def.base.spe, lv) - calcStat(def.base.spe, lv-1)]
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
// WORLD MAP
// ============================================================
function renderWorldMap() {
  const mapEl = document.getElementById("world-map");
  mapEl.innerHTML = "";
  const mapW = mapEl.offsetWidth || 400;
  const mapH = mapEl.offsetHeight || 300;

  // Draw route connections
  const connections = [];
  for (const [areaId, area] of Object.entries(WORLD_DATA)) {
    for (const conn of area.connections) {
      const sortedKey = [areaId, conn].sort().join("-");
      if (!connections.includes(sortedKey)) {
        connections.push(sortedKey);
        const fromArea = WORLD_DATA[areaId];
        const toArea = WORLD_DATA[conn];
        if (fromArea && toArea) {
          const x1 = (fromArea.mapPos.x / 100) * mapW;
          const y1 = (fromArea.mapPos.y / 100) * mapH;
          const x2 = (toArea.mapPos.x / 100) * mapW;
          const y2 = (toArea.mapPos.y / 100) * mapH;
          const line = document.createElement("div");
          line.className = "map-route";
          const dx = x2 - x1, dy = y2 - y1;
          const len = Math.sqrt(dx*dx + dy*dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          Object.assign(line.style, {
            left: x1 + "px", top: (y1 - 1) + "px",
            width: len + "px", height: "2px",
            transform: `rotate(${angle}deg)`
          });
          mapEl.appendChild(line);
        }
      }
    }
  }

  // Draw locations
  for (const [areaId, area] of Object.entries(WORLD_DATA)) {
    const x = (area.mapPos.x / 100) * mapW;
    const y = (area.mapPos.y / 100) * mapH;
    const loc = document.createElement("div");
    loc.className = "map-location";
    if (area.type === "city" || area.type === "special") loc.classList.add("city");
    if (areaId === G.location) loc.classList.add("current");
    const badgesNeeded = area.requiredBadges || 0;
    const locked = G.badges.length < badgesNeeded && areaId !== G.location;
    if (locked) loc.classList.add("locked");
    if (area.hasGym && G.defeatedLeaders.includes(area.gymLeader)) loc.classList.add("gym-done");
    loc.style.left = x + "px";
    loc.style.top = y + "px";
    const dot = document.createElement("div");
    dot.className = "map-loc-dot";
    dot.textContent = area.icon;
    const label = document.createElement("div");
    label.className = "map-loc-label";
    label.textContent = area.name.split(" ")[0];
    loc.appendChild(dot);
    loc.appendChild(label);
    if (!locked) {
      loc.addEventListener("click", () => travelTo(areaId));
      loc.style.cursor = "pointer";
    }
    mapEl.appendChild(loc);
  }
}

function travelTo(areaId) {
  const area = WORLD_DATA[areaId];
  if (!area) return;
  if (G.badges.length < (area.requiredBadges || 0)) {
    showNotification(`You need ${area.requiredBadges} badge(s) to enter ${area.name}.`);
    return;
  }
  G.location = areaId;
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
    document.getElementById("gym-leader-emoji").textContent = leader.emoji;
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
}

function renderHUD() {
  document.getElementById("hud-player-name").textContent = G.playerName;
  document.getElementById("hud-money").textContent = `💰 ${G.money}`;

  const badgesDiv = document.getElementById("hud-badges");
  badgesDiv.innerHTML = "";
  const allBadges = Object.values(GYM_LEADERS).filter(l => l.badge).map(l => ({ emoji: l.badgeEmoji, id: l.id }));
  for (const b of allBadges) {
    const el = document.createElement("div");
    el.className = "badge-icon";
    el.style.background = G.badges.includes(b.id) ? "#ffd700" : "#333";
    el.title = GYM_LEADERS[b.id]?.badge || "";
    el.textContent = G.badges.includes(b.id) ? b.emoji : "";
    badgesDiv.appendChild(el);
  }
}

// ============================================================
// EXPLORATION (Wild Encounters)
// ============================================================
function exploreArea() {
  const area = WORLD_DATA[G.location];
  if (!area || !area.wildMonsters || area.wildMonsters.length === 0) {
    showNotification("There's nothing to explore here.");
    return;
  }
  // Check if team can fight
  if (G.team.every(m => m.currentHP <= 0)) {
    showNotification("All your monsters have fainted! Heal at a town first.");
    return;
  }
  // Pick a random monster based on rates
  const total = area.wildMonsters.reduce((s, wm) => s + wm.rate, 0);
  let roll = Math.random() * total;
  let chosen = area.wildMonsters[0];
  for (const wm of area.wildMonsters) {
    roll -= wm.rate;
    if (roll <= 0) { chosen = wm; break; }
  }
  const level = chosen.minLv + Math.floor(Math.random() * (chosen.maxLv - chosen.minLv + 1));
  const wildMon = buildWildMon(chosen.id, level);

  // Mark as seen
  G.seenMonsters.add(chosen.id);

  // Start wild battle
  startWildBattle(wildMon);
}

// ============================================================
// BATTLE SYSTEM
// ============================================================
let battleLog = [];
let battleResolve = null;
let playerActiveMon = null;
let enemyActiveMon = null;
let battleContext = {};

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

  // Enemy
  document.getElementById("enemy-sprite").textContent = enemy.emoji;
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

  // Player
  document.getElementById("player-sprite").textContent = player.emoji;
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
  document.getElementById("battle-switch-panel").classList.add("hidden");
}

function showMovePanel() {
  document.getElementById("battle-main-actions").classList.add("hidden");
  document.getElementById("battle-moves-panel").classList.remove("hidden");
  const grid = document.getElementById("battle-moves-grid");
  grid.innerHTML = "";
  for (const m of playerActiveMon.moves) {
    const move = MOVES_DATA[m.id];
    if (!move) continue;
    const btn = document.createElement("button");
    btn.className = "move-btn";
    const typeColor = getTypeColor(move.type);
    btn.disabled = m.pp <= 0;
    btn.innerHTML = `
      <div class="move-btn-left">
        <span class="move-btn-name">${move.name}</span>
        <span class="move-btn-pp">PP: ${m.pp}/${m.maxPP}</span>
      </div>
      <span class="move-btn-right" style="background:${typeColor}">${move.type}</span>
    `;
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
    wildMon,
    playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
  };
  playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx]);
  enemyActiveMon = wildMon;
  showScreen("screen-battle");
  clearBattleLog();
  logMsg(`A wild ${wildMon.name} appeared! (Lv.${wildMon.level})`);
  updateBattleUI();
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = false;
}

function startGymBattle(leaderId) {
  const leader = GYM_LEADERS[leaderId];
  battleContext = {
    isWild: false,
    isGym: true,
    isChampion: leaderId === "champion",
    leaderId,
    enemyTeam: leader.team.map(s => buildGymMon(s)),
    enemyTeamIdx: 0,
    playerTeamIdx: G.team.findIndex(m => m.currentHP > 0)
  };
  playerActiveMon = buildBattleMon(G.team[battleContext.playerTeamIdx]);
  enemyActiveMon = battleContext.enemyTeam[0];
  showScreen("screen-battle");
  clearBattleLog();
  logMsg(`${leader.emoji} ${leader.name}: "${leader.quote}"`);
  logMsg(`${leader.name} sent out ${enemyActiveMon.name}!`);
  updateBattleUI();
  showBattleMainActions();
  document.getElementById("btn-catch").disabled = true;
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
  if (!battleContext.isWild) { logMsg("Can't catch gym monsters!"); return; }
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
    status: battleMon.status
  };
}

async function playerSwitch(idx) {
  if (G.team[idx].currentHP <= 0) return;
  showBattleMainActions();
  // Sync current HP back
  syncPlayerMonHP();
  battleContext.playerTeamIdx = idx;
  playerActiveMon = buildBattleMon(G.team[idx]);
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

  // Determine turn order by speed (priority moves go first)
  const playerSpe = playerActiveMon.spe * stageMultiplier(playerActiveMon.stages.spe);
  const enemySpe  = enemyActiveMon.spe  * stageMultiplier(enemyActiveMon.stages.spe);
  const playerFirst = move.effect === "priority" || playerSpe >= enemySpe;

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
  if (!rollPercent(move.accuracy)) {
    logMsg(`${attacker.name}'s attack missed!`);
    return;
  }

  // Damage
  const result = calcDamage(attacker, defender, move);
  defender.currentHP = Math.max(0, defender.currentHP - result.damage);
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
    logMsg("Choose your next monster!");
    battleContext.forcedSwitch = true;
    showSwitchPanel(true);
  }
}

function endBattle(outcome, slot, levelUps) {
  battleContext.battleEnded = true;
  syncPlayerMonHP();

  if (outcome === "ran" || outcome === "caught") {
    showScreen("screen-main");
    renderWorldMap();
    renderAreaPanel();
    renderHUD();
    return;
  }

  if (outcome === "lost") {
    // Heal team to 1 HP each and return to last safe area
    for (const m of G.team) { if (m.currentHP <= 0) m.currentHP = Math.floor(m.maxHP * 0.5); }
    showScreen("screen-gameover");
    document.getElementById("gameover-text").textContent =
      `You blacked out and returned to ${WORLD_DATA[G.location]?.name || "town"}.`;
    return;
  }

  if (outcome === "won") {
    // Show level ups then return
    const handleAfterLevelUps = () => {
      if (battleContext.isGym || battleContext.isChampion) {
        const leader = GYM_LEADERS[battleContext.leaderId];
        G.defeatedLeaders.push(battleContext.leaderId);
        if (battleContext.leaderId === "champion") {
          G.championDefeated = true;
          showHallOfFame();
        } else {
          if (leader.badge) {
            G.badges.push(battleContext.leaderId);
            G.money += 1000 * G.badges.length;
          }
          showNotification(`🏅 ${leader.winQuote}<br><br>You received the <strong>${leader.badge}</strong>! ${leader.badgeEmoji}`, () => {
            showScreen("screen-main");
            renderWorldMap();
            renderAreaPanel();
            renderHUD();
            saveGame();
          });
        }
      } else {
        // Wild battle won
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
// TEAM SCREEN
// ============================================================
function showTeamScreen() {
  showScreen("screen-team");
  document.getElementById("team-detail").classList.add("hidden");
  const list = document.getElementById("team-list");
  list.innerHTML = "";
  G.team.forEach((slot, idx) => {
    const def = MONSTERS_DATA[slot.monsterId];
    const card = document.createElement("div");
    card.className = "team-card" + (slot.currentHP <= 0 ? " fainted" : "");
    const hpPct = Math.round((slot.currentHP / slot.maxHP) * 100);
    const hpClass = hpPct < 25 ? "red" : hpPct < 50 ? "yellow" : "";
    const typeHTML = def.types.map(t => `<span class="type-badge type-${t}" style="font-size:0.6rem">${t}</span>`).join("");
    card.innerHTML = `
      <div class="team-card-header">
        <span class="team-sprite">${def.emoji}</span>
        <div>
          <div class="team-name">${slot.nickname || def.name}</div>
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

  const stats = [
    ["HP",  slot.maxHP,                    250],
    ["ATK", calcStat(def.base.atk, lv), 200],
    ["DEF", calcStat(def.base.def, lv), 200],
    ["SPA", calcStat(def.base.spa, lv), 200],
    ["SPD", calcStat(def.base.spd, lv), 200],
    ["SPE", calcStat(def.base.spe, lv), 200]
  ];
  const typeHTML = def.types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(" ");
  const statsHTML = stats.map(([n, v, max]) => `
    <div class="stat-row">
      <span class="stat-label">${n}</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100,(v/max)*100)}%;background:${n==="HP"?"#3fb950":"#58a6ff"}"></div></div>
      <span class="stat-val">${v}</span>
    </div>`).join("");
  const movesHTML = slot.moves.map(mid => {
    const m = MOVES_DATA[mid];
    if (!m) return "";
    return `<div class="move-detail-card">
      <div class="move-detail-name">${m.name}</div>
      <div class="move-detail-info">${m.type} | ${m.cat} | Pwr:${m.power||"—"}</div>
    </div>`;
  }).join("");

  // Use item panel
  const healableItems = Object.entries(G.bag)
    .filter(([id, cnt]) => cnt > 0 && (ITEMS_DATA[id]?.type === "heal" || ITEMS_DATA[id]?.type === "revive"));
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

  document.getElementById("team-detail-content").innerHTML = `
    <div style="text-align:center;margin-bottom:1rem">
      <span class="detail-sprite">${def.emoji}</span>
      <h3>${slot.nickname || def.name} ${typeHTML}</h3>
      <p style="color:var(--text-secondary);font-size:0.8rem">Lv.${lv} | XP to next: ${xpToNext}</p>
      <p style="font-size:0.8rem;color:var(--text-muted)">${def.desc}</p>
    </div>
    <div class="detail-section"><h4>Stats</h4>${statsHTML}</div>
    <div class="detail-section"><h4>Moves</h4><div class="moves-grid">${movesHTML}</div></div>
    <div class="detail-section"><h4>Use Item</h4><div style="display:flex;gap:0.5rem;flex-wrap:wrap">${itemsHTML}</div></div>
  `;

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
    if (slot.currentHP <= 0) { showNotification("Can't use on a fainted monster!"); return; }
    slot.currentHP = Math.min(slot.maxHP, slot.currentHP + item.healAmt);
    G.bag[itemId]--;
    showNotification(`Used ${item.name}! HP restored.`);
  } else if (item.type === "revive") {
    if (slot.currentHP > 0) { showNotification("Monster is not fainted!"); return; }
    slot.currentHP = Math.floor(slot.maxHP / 2);
    G.bag[itemId]--;
    showNotification(`${MONSTERS_DATA[slot.monsterId].name} was revived!`);
  }
}

// ============================================================
// BAG SCREEN
// ============================================================
function showBagScreen() {
  showScreen("screen-bag");
  const orbsEl = document.getElementById("bag-orbs");
  const medEl = document.getElementById("bag-medicine");
  orbsEl.innerHTML = "";
  medEl.innerHTML = "";
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
    else medEl.appendChild(div);
  }
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
    card.innerHTML = `
      <div class="dex-num">#${String(mid).padStart(3,"0")}</div>
      <div class="dex-emoji">${seen ? def.emoji : "❓"}</div>
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
  const statsHTML = Object.entries(def.base).map(([stat, val]) => `
    <div class="stat-row">
      <span class="stat-label">${stat.toUpperCase()}</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100,(val/180)*100)}%;background:#58a6ff"></div></div>
      <span class="stat-val">${val}</span>
    </div>`).join("");
  const evoInfo = def.evolveTo
    ? `Evolves into ${MONSTERS_DATA[def.evolveTo]?.name} at Lv.${def.evolveLevel}`
    : "Does not evolve";

  document.getElementById("dex-detail-content").innerHTML = `
    <div style="text-align:center;margin-bottom:1rem">
      <span style="font-size:5rem">${def.emoji}</span>
      <h3 style="margin-top:0.5rem">#${String(monsterId).padStart(3,"0")} ${def.name}</h3>
      <div>${typeHTML}</div>
      <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem">${caught ? "✅ Caught" : "👁 Seen"}</p>
    </div>
    <div class="detail-section">
      <p style="font-size:0.85rem;color:var(--text-secondary)">${def.desc}</p>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.5rem">${evoInfo}</p>
      <p style="font-size:0.8rem;color:var(--text-muted)">Rarity: ${def.rarity}</p>
    </div>
    <div class="detail-section"><h4>Base Stats</h4>${statsHTML}</div>
  `;
}

// ============================================================
// EVENT LISTENERS & INIT
// ============================================================
function initEventListeners() {
  // Title screen
  document.getElementById("btn-new-game").addEventListener("click", () => showScreen("screen-create"));
  document.getElementById("btn-continue").addEventListener("click", () => {
    if (loadGame()) {
      showScreen("screen-main");
      renderHUD();
      renderWorldMap();
      renderAreaPanel();
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
    showNotification(`🎉 You chose ${MONSTERS_DATA[starterId].name}! Your adventure begins!`);
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
    if (area?.gymLeader && !G.defeatedLeaders.includes(area.gymLeader)) {
      if (G.team.every(m => m.currentHP <= 0)) {
        showNotification("All your monsters are fainted! Heal first.");
        return;
      }
      const leader = GYM_LEADERS[area.gymLeader];
      showNotification(`${leader.emoji} <strong>${leader.name}</strong> wants to battle!<br>"${leader.quote}"`, () => {
        startGymBattle(area.gymLeader);
      });
    }
  });
  document.getElementById("btn-champion").addEventListener("click", () => {
    if (!G.championDefeated) {
      if (G.team.every(m => m.currentHP <= 0)) {
        showNotification("All your monsters are fainted! Heal first.");
        return;
      }
      const leader = GYM_LEADERS["champion"];
      showNotification(`👑 <strong>${leader.name}</strong> awaits!<br>"${leader.quote}"`, () => {
        startGymBattle("champion");
      });
    }
  });

  // Bottom nav
  document.getElementById("nav-team").addEventListener("click", showTeamScreen);
  document.getElementById("nav-bag").addEventListener("click", showBagScreen);
  document.getElementById("nav-dex").addEventListener("click", showDexScreen);
  document.getElementById("nav-save").addEventListener("click", saveGame);

  // Battle controls
  document.getElementById("btn-fight").addEventListener("click", showMovePanel);
  document.getElementById("btn-catch").addEventListener("click", showCatchPanel);
  document.getElementById("btn-switch").addEventListener("click", () => showSwitchPanel(false));
  document.getElementById("btn-run").addEventListener("click", playerRun);
  document.getElementById("btn-moves-back").addEventListener("click", showBattleMainActions);
  document.getElementById("btn-catch-back").addEventListener("click", showBattleMainActions);
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

  // Game over
  document.getElementById("btn-gameover-heal").addEventListener("click", () => {
    // Heal team
    for (const m of G.team) { m.currentHP = Math.floor(m.maxHP / 2); }
    showScreen("screen-main");
    renderHUD();
    renderWorldMap();
    renderAreaPanel();
  });

  // Hall of fame
  document.getElementById("btn-hof-continue").addEventListener("click", () => {
    showScreen("screen-main");
    renderHUD();
    renderWorldMap();
    renderAreaPanel();
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
    card.innerHTML = `
      <span class="starter-emoji">${def.emoji}</span>
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

// ---- BOOT ----
window.addEventListener("load", () => {
  initEventListeners();

  // Show continue button only if save exists
  document.getElementById("btn-continue").style.display = hasSave() ? "" : "none";

  // Start on title screen
  showScreen("screen-title");

  // Setup creation screen dialog
  typewriterDialog("Welcome to the world of Monsteria! I am Professor Arbor. The world is full of incredible creatures called Monsters. Tell me, what is your name?");

  // Map re-render on resize
  window.addEventListener("resize", () => {
    if (G) { renderWorldMap(); }
  });
});

