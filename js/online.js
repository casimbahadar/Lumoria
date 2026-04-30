// ============================================================
// LUMORIA ONLINE SYSTEM
// Firebase Realtime Database — Auth, Leaderboards, Events,
// Trading, PvP Battles, and Time-Based Events
//
// TO ACTIVATE: Replace the firebaseConfig object below with
// your own Firebase project credentials from:
// https://console.firebase.google.com → Project Settings → Your apps
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let firebaseApp = null;
let firebaseDB  = null;
let firebaseUID = null;
let onlineReady = false;

// ---- Init ----
async function initOnline() {
  if (typeof firebase === "undefined") { console.warn("Firebase SDK not loaded."); return; }
  try {
    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    firebaseDB  = firebase.database();
    const cred  = await firebase.auth().signInAnonymously();
    firebaseUID = cred.user.uid;
    onlineReady = true;
    console.log("Online ready, uid:", firebaseUID);
    loadLiveEvent();
    renderOnlineHUD();
  } catch(e) {
    console.warn("Firebase init failed:", e.message);
  }
}

function requireOnline() {
  if (!onlineReady) { showNotification("Online features unavailable. Check your internet connection."); return false; }
  return true;
}

function renderOnlineHUD() {
  const el = document.getElementById("hud-online-status");
  if (el) el.textContent = onlineReady ? "🌐" : "";
}

// ============================================================
// LEADERBOARDS
// ============================================================
const LB_CATEGORIES = [
  { id:"champion_count", label:"Champion Clears", icon:"🏆", getValue: g => (g.championDefeated ? 1 : 0) },
  { id:"badges",         label:"Badges Earned",  icon:"🏅", getValue: g => (g.badges||[]).length },
  { id:"dex",            label:"Lumori Caught",  icon:"📖", getValue: g => (g.caughtMonsters?.size || [...(g.caughtMonsters||[])].length) },
  { id:"ng_plus",        label:"NG+ Runs",       icon:"⭐", getValue: g => g.ngPlusCount || 0 },
];

async function submitLeaderboardScore(category) {
  if (!requireOnline() || !G) return;
  const cat = LB_CATEGORIES.find(c => c.id === category);
  if (!cat) return;
  const value = cat.getValue(G);
  const entry = {
    name: G.playerName,
    value,
    ngPlus: G.ngPlusCount || 0,
    ts: Date.now()
  };
  await firebaseDB.ref(`leaderboards/${category}/${firebaseUID}`).set(entry);
}

async function submitAllScores() {
  if (!onlineReady || !G) return;
  for (const cat of LB_CATEGORIES) await submitLeaderboardScore(cat.id);
}

async function showLeaderboards() {
  if (!requireOnline()) return;
  showScreen("screen-leaderboards");
  const container = document.getElementById("lb-entries");
  const tabs = document.getElementById("lb-tabs");
  if (!container || !tabs) return;

  async function loadCategory(catId) {
    container.innerHTML = '<div class="lb-loading">Loading...</div>';
    const snap = await firebaseDB.ref(`leaderboards/${catId}`).orderByChild("value").limitToLast(20).once("value");
    const entries = [];
    snap.forEach(child => entries.push({ uid: child.key, ...child.val() }));
    entries.sort((a,b) => b.value - a.value);

    if (!entries.length) { container.innerHTML = '<div class="lb-empty">No entries yet. Be the first!</div>'; return; }
    container.innerHTML = entries.map((e, i) => `
      <div class="lb-row ${e.uid === firebaseUID ? "lb-mine" : ""}">
        <span class="lb-rank">#${i+1}</span>
        <span class="lb-name">${escapeHtml(e.name)}${e.ngPlus > 0 ? ` <span class="ng-badge">NG+${e.ngPlus}</span>` : ""}</span>
        <span class="lb-value">${e.value}</span>
      </div>`).join("");
  }

  tabs.innerHTML = LB_CATEGORIES.map(c =>
    `<button class="lb-tab" data-cat="${c.id}">${c.icon} ${c.label}</button>`
  ).join("");
  tabs.querySelectorAll(".lb-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.querySelectorAll(".lb-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadCategory(btn.dataset.cat);
    });
  });
  tabs.querySelector(".lb-tab").click();
}

// ============================================================
// LIVE EVENTS
// ============================================================
let activeEvent = null;

async function loadLiveEvent() {
  if (!onlineReady) return;
  try {
    const snap = await firebaseDB.ref("events/active").once("value");
    const ev = snap.val();
    if (!ev) return;
    const now = Date.now();
    if (ev.endTime && now > ev.endTime) return;
    if (ev.startTime && now < ev.startTime) return;
    activeEvent = ev;
    showLiveEventBanner(ev);
    if (ev.type === "community_challenge") watchCommunityProgress(ev);
  } catch(e) { console.warn("Event load failed:", e); }
}

function showLiveEventBanner(ev) {
  const el = document.getElementById("live-event-banner");
  if (!el) return;
  el.classList.remove("hidden");
  const timeLeft = ev.endTime ? `Ends ${timeSince(ev.endTime - (ev.endTime - Date.now()) * 2)}` : "";
  el.innerHTML = `<strong>🎉 ${escapeHtml(ev.name)}</strong> ${escapeHtml(ev.desc || "")} <span class="event-timer">${timeLeft}</span>`;
}

function getEventSpawnBoost(type) {
  if (!activeEvent || activeEvent.type !== "spawn_boost") return 1;
  return activeEvent.param?.type === type ? (activeEvent.param?.mult || 1.5) : 1;
}

function getEventShinyBoost() {
  if (!activeEvent || activeEvent.type !== "shiny_boost") return 1;
  return activeEvent.param?.mult || 2;
}

function getEventExclusiveMons(areaId) {
  if (!activeEvent || activeEvent.type !== "exclusive_lumori") return [];
  const p = activeEvent.param;
  if (!p || (p.areaId && p.areaId !== areaId)) return [];
  return [{ id: p.monsterId, minLv: p.minLv || 5, maxLv: p.maxLv || 10, rate: p.rate || 5 }];
}

async function watchCommunityProgress(ev) {
  firebaseDB.ref("events/community_progress").on("value", snap => {
    const progress = snap.val() || 0;
    const el = document.getElementById("community-progress");
    if (!el) return;
    const pct = Math.min(100, Math.round((progress / ev.param.target) * 100));
    el.innerHTML = `<div class="comm-bar-wrap"><div class="comm-bar" style="width:${pct}%"></div></div>
      <span>${progress.toLocaleString()} / ${ev.param.target.toLocaleString()} — Reward: ${ev.param.reward}</span>`;
    if (progress >= ev.param.target && G) {
      const item = ev.param.rewardItemId || "masterOrb";
      if (!G.bag[item + "_event_claimed"]) {
        G.bag[item] = (G.bag[item] || 0) + (ev.param.rewardQty || 1);
        G.bag[item + "_event_claimed"] = true;
        saveGame();
        showNotification(`🎉 Community goal reached! You received ${ev.param.reward}!`);
      }
    }
  });
}

async function incrementCommunityProgress() {
  if (!onlineReady || !activeEvent || activeEvent.type !== "community_challenge") return;
  await firebaseDB.ref("events/community_progress").transaction(v => (v || 0) + 1);
}

// ============================================================
// TIME-BASED EVENTS (client-side, no server needed)
// ============================================================
function getTimeEvent() {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth(); // 0-11
  const day = now.getDay();    // 0=Sun

  const events = [];

  // Time of day
  if (hour >= 21 || hour < 5) {
    events.push({ label:"🌙 Night", typeBoost:"Dark",    shinyMult:1.5, desc:"Dark & Ghost types are more active." });
    events.push({ label:"🌙 Night", typeBoost:"Ghost",   shinyMult:1.5 });
    events.push({ label:"🌙 Night", typeBoost:"Psychic", shinyMult:1.0 });
  } else if (hour >= 5 && hour < 10) {
    events.push({ label:"🌅 Dawn",  typeBoost:"Normal",  spawnMult:1.5 });
    events.push({ label:"🌅 Dawn",  typeBoost:"Flying",  spawnMult:1.5 });
    events.push({ label:"🌅 Dawn",  typeBoost:"Grass",   spawnMult:1.3 });
  } else if (hour >= 10 && hour < 17) {
    events.push({ label:"☀️ Day",   typeBoost:"Fire",    spawnMult:1.3 });
  } else {
    events.push({ label:"🌆 Dusk",  typeBoost:"Ground",  spawnMult:1.3 });
    events.push({ label:"🌆 Dusk",  typeBoost:"Rock",    spawnMult:1.3 });
  }

  // Season (Northern Hemisphere)
  const season = [
    { label:"🌸 Spring", types:["Grass","Bug"],        months:[2,3,4] },
    { label:"🌞 Summer", types:["Fire","Flying"],       months:[5,6,7] },
    { label:"🍂 Autumn", types:["Ground","Rock"],       months:[8,9,10] },
    { label:"❄️ Winter", types:["Ice","Dark"],          months:[11,0,1] },
  ].find(s => s.months.includes(month));
  if (season) season.types.forEach(t => events.push({ label:season.label, typeBoost:t, spawnMult:1.4, seasonal:true }));

  // Weekly spotlight (each day has a bonus type)
  const weeklyTypes = ["Normal","Water","Fire","Electric","Psychic","Fairy","Dragon"];
  events.push({ label:"📅 Weekly", typeBoost:weeklyTypes[day], spawnMult:1.6, xpMult:1.2 });

  return events;
}

function getTimeSpawnMult(type) {
  return getTimeEvent().filter(e => e.typeBoost === type).reduce((acc, e) => acc * (e.spawnMult || 1), 1);
}

function getTimeShinyMult() {
  return getTimeEvent().filter(e => e.shinyMult).reduce((acc, e) => acc * e.shinyMult, 1);
}

function renderTimeEvents() {
  const el = document.getElementById("time-events-display");
  if (!el) return;
  const evs = getTimeEvent().filter(e => e.seasonal || e.label.includes("Weekly") ||
    e.label.includes("Night") || e.label.includes("Dawn") || e.label.includes("Dusk") || e.label.includes("Day"));
  const seen = new Set();
  const unique = evs.filter(e => { if (seen.has(e.label)) return false; seen.add(e.label); return true; });
  el.innerHTML = unique.map(e => `<span class="time-event-tag">${e.label}</span>`).join("");
}

// ============================================================
// LUMORI TRADING
// ============================================================
async function showTradingScreen() {
  if (!requireOnline()) return;
  showScreen("screen-trade");
  loadTradeListings();
  renderMyBoxForTrade();
}

async function loadTradeListings() {
  const container = document.getElementById("trade-listings");
  if (!container) return;
  container.innerHTML = '<div class="trade-loading">Loading trades...</div>';
  try {
    const snap = await firebaseDB.ref("trades").orderByChild("status").equalTo("open").limitToFirst(30).once("value");
    const trades = [];
    snap.forEach(child => trades.push({ id: child.key, ...child.val() }));
    if (!trades.length) { container.innerHTML = '<div class="trade-empty">No open trades. Post one from your box!</div>'; return; }
    container.innerHTML = trades.map(t => {
      const def = MONSTERS_DATA[t.monsterId];
      if (!def) return "";
      const isOwn = t.posterUID === firebaseUID;
      return `<div class="trade-card">
        <div class="trade-mon-info">
          <span class="trade-emoji">${def.emoji}</span>
          <div>
            <div class="trade-mon-name">${def.name} Lv.${t.level}${t.shiny ? " ✨" : ""}${t.variant ? " 🔀" : ""}</div>
            <div class="trade-poster">From: ${escapeHtml(t.posterName)}</div>
            ${t.wantedType ? `<div class="trade-want">Wants: ${t.wantedType}-type</div>` : ""}
          </div>
        </div>
        ${isOwn
          ? `<button class="btn-danger trade-cancel" data-id="${t.id}">Cancel</button>`
          : `<button class="btn-primary trade-accept" data-id="${t.id}" data-mid="${t.monsterId}" data-uid="${t.posterUID}">Trade</button>`
        }
      </div>`;
    }).join("");
    container.querySelectorAll(".trade-accept").forEach(btn => {
      btn.addEventListener("click", () => acceptTrade(btn.dataset.id, btn.dataset.mid));
    });
    container.querySelectorAll(".trade-cancel").forEach(btn => {
      btn.addEventListener("click", () => cancelTrade(btn.dataset.id));
    });
  } catch(e) {
    container.innerHTML = '<div class="trade-error">Failed to load trades.</div>';
  }
}

function renderMyBoxForTrade() {
  if (!G) return;
  const container = document.getElementById("trade-my-box");
  if (!container) return;
  const postable = [...G.team, ...G.box].filter(m => m.currentHP > 0);
  if (!postable.length) { container.innerHTML = '<p>No Lumori available to trade.</p>'; return; }
  container.innerHTML = `<p class="trade-label">Select a Lumori to offer:</p>` +
    postable.map((m, i) => {
      const def = MONSTERS_DATA[m.monsterId];
      return `<div class="trade-box-slot" data-idx="${i}" data-source="${i < G.team.length ? "team" : "box"}">
        ${def.emoji} ${def.name} Lv.${m.level}${m.shiny ? " ✨" : ""}
      </div>`;
    }).join("");
  container.querySelectorAll(".trade-box-slot").forEach(slot => {
    slot.addEventListener("click", () => {
      container.querySelectorAll(".trade-box-slot").forEach(s => s.classList.remove("selected"));
      slot.classList.add("selected");
      window._selectedTradeIdx = parseInt(slot.dataset.idx);
      window._selectedTradeSource = slot.dataset.source;
    });
  });
}

async function postTrade(wantedType) {
  if (!requireOnline() || !G) return;
  if (window._selectedTradeIdx === undefined) { showNotification("Select a Lumori to offer first."); return; }
  const all = [...G.team, ...G.box];
  const mon = all[window._selectedTradeIdx];
  if (!mon) return;

  const entry = {
    posterUID: firebaseUID,
    posterName: G.playerName,
    monsterId: mon.monsterId,
    level: mon.level,
    shiny: !!mon.shiny,
    variant: !!mon.variant,
    nature: mon.nature || "Hardy",
    monData: JSON.stringify(mon),
    wantedType: wantedType || null,
    status: "open",
    ts: Date.now()
  };

  const ref = await firebaseDB.ref("trades").push(entry);

  // Remove from team/box
  if (window._selectedTradeSource === "team") {
    if (G.team.length <= 1) { showNotification("You must keep at least 1 Lumori in your team!"); return; }
    G.team.splice(window._selectedTradeIdx, 1);
  } else {
    G.box.splice(window._selectedTradeIdx - G.team.length, 1);
  }
  window._selectedTradeIdx = undefined;
  saveGame();
  showNotification(`Trade posted! Share Trade ID: ${ref.key.slice(-6).toUpperCase()}`);
  loadTradeListings();
  renderMyBoxForTrade();
}

async function acceptTrade(tradeId, theirMonsterId) {
  if (!requireOnline() || !G) return;
  if (G.team.length + G.box.length >= 300) { showNotification("Your box is full! Release some Lumori first."); return; }

  try {
    const tradeRef = firebaseDB.ref(`trades/${tradeId}`);
    const snap = await tradeRef.once("value");
    const trade = snap.val();
    if (!trade || trade.status !== "open") { showNotification("This trade is no longer available."); return; }

    // Claim the traded Lumori
    let theirMon;
    try { theirMon = JSON.parse(trade.monData); } catch(e) {
      theirMon = createPartySlot(trade.monsterId, trade.level);
      theirMon.shiny = trade.shiny;
    }
    theirMon.nickname = null; // traded Lumori lose nicknames

    G.box.push(theirMon);
    await tradeRef.update({ status: "completed", acceptorUID: firebaseUID, completedTs: Date.now() });
    saveGame();
    const def = MONSTERS_DATA[trade.monsterId];
    showNotification(`🤝 Trade complete! You received ${def?.name || "a Lumori"}!`);
    loadTradeListings();
  } catch(e) {
    showNotification("Trade failed. Please try again.");
  }
}

async function cancelTrade(tradeId) {
  if (!requireOnline()) return;
  if (!confirm("Cancel this trade? The Lumori will be returned to your box.")) return;
  const snap = await firebaseDB.ref(`trades/${tradeId}`).once("value");
  const trade = snap.val();
  if (trade && trade.posterUID === firebaseUID) {
    try { const mon = JSON.parse(trade.monData); G.box.push(mon); } catch(e) {}
    await firebaseDB.ref(`trades/${tradeId}`).update({ status: "cancelled" });
    saveGame();
    showNotification("Trade cancelled. Lumori returned to your box.");
    loadTradeListings();
    renderMyBoxForTrade();
  }
}

// ============================================================
// PvP BATTLES (auto-resolve, challenge code system)
// ============================================================
async function postBattleChallenge() {
  if (!requireOnline() || !G) return;
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team before challenging!"); return; }

  const challengerTeam = G.team.filter(m => m.currentHP > 0).slice(0, 3).map(m => ({
    monsterId: m.monsterId, level: m.level, moves: m.moves.map(mv => mv.id),
    nature: m.nature, shiny: m.shiny
  }));

  const challenge = {
    challengerUID: firebaseUID,
    challengerName: G.playerName,
    challengerBadges: G.badges.length,
    team: JSON.stringify(challengerTeam),
    status: "open",
    ts: Date.now()
  };
  const ref = await firebaseDB.ref("battles").push(challenge);
  const code = ref.key.slice(-6).toUpperCase();
  showNotification(`⚔️ Challenge posted! Share code: <strong>${code}</strong> — tell your opponent to enter it in PvP.`);
  return code;
}

async function acceptBattleChallenge(code) {
  if (!requireOnline() || !G) return;
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team before battling!"); return; }

  // Find challenge by last 6 chars of key
  const snap = await firebaseDB.ref("battles").orderByChild("status").equalTo("open").once("value");
  let challengeId = null, challenge = null;
  snap.forEach(child => {
    if (child.key.slice(-6).toUpperCase() === code.toUpperCase() && child.val().challengerUID !== firebaseUID) {
      challengeId = child.key;
      challenge = child.val();
    }
  });
  if (!challenge) { showNotification("Challenge code not found or already completed."); return; }

  // Auto-resolve battle
  let challengerTeam, defenderTeam;
  try { challengerTeam = JSON.parse(challenge.team); } catch(e) { showNotification("Invalid challenge data."); return; }
  defenderTeam = G.team.filter(m => m.currentHP > 0).slice(0, 3).map(m => ({
    monsterId: m.monsterId, level: m.level, moves: m.moves.map(mv => mv.id), nature: m.nature
  }));

  const result = simulatePvPBattle(challengerTeam, defenderTeam);
  const won = result.winner === "defender";

  await firebaseDB.ref(`battles/${challengeId}`).update({
    status: "completed",
    defenderUID: firebaseUID,
    defenderName: G.playerName,
    result: result.winner,
    completedTs: Date.now()
  });

  const prize = won ? 500 : 100;
  G.money += prize;
  saveGame();
  showNotification(
    won
      ? `🏆 You won the PvP battle vs ${escapeHtml(challenge.challengerName)}! +${prize} coins`
      : `😞 You lost to ${escapeHtml(challenge.challengerName)}. +${prize} coins for participating.`
  );
}

function simulatePvPBattle(teamA, teamB) {
  // Simple simulation: compare team power scores
  function teamScore(team) {
    return team.reduce((sum, m) => {
      const def = MONSTERS_DATA[m.monsterId];
      if (!def) return sum;
      const statTotal = Object.values(def.baseStats || {}).reduce((a,b) => a+b, 0);
      return sum + (statTotal * m.level / 100);
    }, 0);
  }
  const scoreA = teamScore(teamA) * (0.85 + Math.random() * 0.3);
  const scoreB = teamScore(teamB) * (0.85 + Math.random() * 0.3);
  return { winner: scoreA >= scoreB ? "challenger" : "defender", scoreA, scoreB };
}

async function showPvPScreen() {
  if (!requireOnline()) return;
  showScreen("screen-pvp");
  loadOpenChallenges();
}

async function loadOpenChallenges() {
  const container = document.getElementById("pvp-listings");
  if (!container) return;
  container.innerHTML = '<div class="pvp-loading">Loading challenges...</div>';
  try {
    const snap = await firebaseDB.ref("battles").orderByChild("status").equalTo("open").limitToFirst(20).once("value");
    const battles = [];
    snap.forEach(child => {
      if (child.val().challengerUID !== firebaseUID)
        battles.push({ id: child.key, ...child.val() });
    });
    if (!battles.length) { container.innerHTML = '<div class="pvp-empty">No open challenges. Post one!</div>'; return; }
    container.innerHTML = battles.map(b => `
      <div class="pvp-card">
        <span class="pvp-challenger">${escapeHtml(b.challengerName)}</span>
        <span class="pvp-badges">🏅 ${b.challengerBadges}</span>
        <span class="pvp-code">Code: ${b.id.slice(-6).toUpperCase()}</span>
        <button class="btn-primary pvp-accept" data-code="${b.id.slice(-6)}">⚔️ Accept</button>
      </div>`).join("");
    container.querySelectorAll(".pvp-accept").forEach(btn => {
      btn.addEventListener("click", () => acceptBattleChallenge(btn.dataset.code));
    });
  } catch(e) {
    container.innerHTML = '<div class="pvp-error">Failed to load challenges.</div>';
  }
}

// ============================================================
// UTILITY
// ============================================================
function escapeHtml(str) {
  return String(str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// Auto-submit scores after key events
function onChampionDefeated() { submitAllScores(); }
function onLumoriCaught()     { submitLeaderboardScore("dex"); }
function onNGPlusStarted()    { submitLeaderboardScore("ng_plus"); }

// Start on page load
window.addEventListener("load", () => {
  if (FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY") initOnline();
  else console.info("Firebase not configured — online features disabled.");
  setInterval(renderTimeEvents, 60000); // update time events display every minute
  setTimeout(renderTimeEvents, 2000);   // initial render after game boots
});
