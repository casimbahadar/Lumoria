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
    syncPlayerProfile();
    drainPvpMailbox();   // reconcile async results that landed while offline
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
  { id:"battles_won", label:"Battles Won",     icon:"⚔️",  getValue: g => g.battleWins || 0 },
  { id:"dex",         label:"Lumori Caught",   icon:"📖", getValue: g => (g.caughtMonsters?.size || [...(g.caughtMonsters||[])].length) },
  { id:"shiny_caught",label:"Radiant Caught",  icon:"✨", getValue: g => g.shinyCaught || 0 },
  { id:"event_pts",   label:"Event Points",    icon:"🎉", getValue: g => g.eventPoints || 0 },
  { id:"pvp_rating",  label:"PvP Rating",      icon:"⭐", getValue: g => g.pvpRating || 0 },
  { id:"pvp_doubles_rating", label:"PvP Doubles", icon:"👥", getValue: g => g.pvpDoublesRating || 0 },
  { id:"pvp_gauntlet",label:"Gauntlet Clears", icon:"🏟️", getValue: g => g.pvpGauntletBest || 0 },
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
    const snap = await firebaseDB.ref(`leaderboards/${catId}`).orderByChild("value").limitToLast(100).once("value");
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
  if (typeof onEventPointEarned === "function") onEventPointEarned();
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
// PvP BATTLES (async — play a snapshot of another player's team for real vs the AI)
// All battlers are normalized to Lv PVP_LEVEL_CAP with perfect IVs at battle time
// (see buildBattleMon). See docs/pvp-spec.md.
// ============================================================

// Rating: everyone starts at PVP_BASE_RATING. The amount a result moves your
// rating is a single continuous curve driven by the gap between your rating and
// your opponent's — no flat tiers, no "upset" special-casing. Close matches move
// you a little (±10–22), and the further apart the ratings, the more a result in
// the "harder" direction swings (up to ±80). See docs/pvp-spec.md.
const PVP_BASE_RATING = 1000;

// Singles and Doubles keep fully independent ladders. Each mode maps to its own
// rating / win / loss fields on the save and its own leaderboard track, so the
// same rating math (pvpRatingDelta) drives both without duplicated logic.
const PVP_MODES = {
  single: { label:"Singles", rating:"pvpRating",        wins:"pvpWins",        losses:"pvpLosses",        board:"pvp_rating" },
  double: { label:"Doubles", rating:"pvpDoublesRating",  wins:"pvpDoublesWins",  losses:"pvpDoublesLosses",  board:"pvp_doubles_rating" },
};
function pvpModeFields(mode) { return PVP_MODES[mode] || PVP_MODES.single; }

// Magnitude of a WIN as a function of gap = oppRating - myRating (+ = opponent
// rated higher). Defined by (gap, delta) breakpoints, linearly interpolated:
// beating a much weaker player floors at +10, an even match is +16, and beating
// progressively stronger players ramps continuously up to a +80 cap. Each band's
// start equals the previous band's end, so the curve is seamless.
const PVP_WIN_CURVE = [
  [-49, 10], [0, 16], [49, 22], [100, 30], [200, 36], [300, 42],
  [449, 48], [599, 58], [799, 68], [999, 75], [1199, 80]
];

// Rating delta for a result. A loss is the mirror of a win against the opposite
// gap (L(gap) = -W(-gap)): losing to a much weaker player swings as hard as
// beating a much stronger one, while losing to someone far above you floors at -10.
function pvpRatingDelta(myRating, oppRating, won) {
  const gap = won ? (oppRating - myRating) : (myRating - oppRating);
  const pts = PVP_WIN_CURVE;
  let mag;
  if (gap <= pts[0][0]) {
    mag = pts[0][1];
  } else if (gap >= pts[pts.length - 1][0]) {
    mag = pts[pts.length - 1][1];
  } else {
    mag = pts[pts.length - 1][1];
    for (let i = 1; i < pts.length; i++) {
      if (gap <= pts[i][0]) {
        const [g0, d0] = pts[i - 1], [g1, d1] = pts[i];
        mag = d0 + (d1 - d0) * (gap - g0) / (g1 - g0);
        break;
      }
    }
  }
  return won ? Math.round(mag) : -Math.round(mag);
}

// Serialize a party mon into a PvP team slot. Level/IVs are normalized at battle
// time, but variant/shiny/held/moves/nature are carried so the snapshot battles
// exactly as the owner built it. currentHP/statuses keep buildBattleMon happy.
// `ability` is carried forward-compatibly: there is no ability battle system yet,
// so it's null today, but once abilities exist on party mons the PvP snapshot will
// preserve them automatically (buildBattleMon also passes it through).
function pvpSerializeMon(m) {
  return {
    monsterId: m.monsterId,
    level: m.level,
    moves: (m.moves || []).map(mv => mv.id),
    nature: m.nature || "Balanced",
    ivs: { hp:31, atk:31, def:31, spa:31, spd:31, spe:31 },
    heldItem: m.heldItem || null,
    ability: m.ability || null,
    shiny: !!m.shiny,
    variant: !!m.variant,
    variantTypes: m.variantTypes || null,
    variantBase: m.variantBase || null,
    variantImmune: m.variantImmune || null,
    statuses: [],
    currentHP: 999999
  };
}

async function postBattleChallenge(format) {
  if (!requireOnline() || !G) return;
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team before challenging!"); return; }
  const fmt = (format === "double") ? "double" : "single";
  const F = pvpModeFields(fmt);

  const healthy = G.team.filter(m => m.currentHP > 0);
  if (fmt === "double" && healthy.length < 2) { showNotification("Doubles needs at least 2 healthy Lumori on your team!"); return; }
  // Send up to 3: doubles leads with the first 2 and keeps the rest as bench.
  const challengerTeam = healthy.slice(0, 3).map(pvpSerializeMon);

  const challenge = {
    challengerUID: firebaseUID,
    challengerName: G.playerName,
    challengerBadges: G.badges.length,
    rating: G[F.rating] || 0,
    format: fmt,
    team: JSON.stringify(challengerTeam),
    status: "open",
    ts: Date.now()
  };
  let ref;
  try {
    ref = await firebaseDB.ref("battles").push(challenge);
  } catch(e) {
    showNotification("Couldn't post your challenge — check your connection and try again.");
    return;
  }
  const code = ref.key.slice(-6).toUpperCase();
  const codeEl = document.getElementById("pvp-my-code");
  if (codeEl) { codeEl.textContent = `Your challenge code: ${code}`; codeEl.classList.remove("hidden"); }
  showNotification(`⚔️ Challenge posted! Share code <strong>${code}</strong>, or wait for someone to accept it.`);
  loadOpenChallenges();
  return code;
}

async function acceptBattleChallenge(code) {
  if (!requireOnline() || !G) return;
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team before battling!"); return; }

  if (!code || !code.trim()) { showNotification("Enter a battle code first."); return; }
  // Find challenge by last 6 chars of key
  let snap;
  try {
    snap = await firebaseDB.ref("battles").orderByChild("status").equalTo("open").once("value");
  } catch(e) {
    showNotification("Couldn't reach the challenge board — check your connection and try again.");
    return;
  }
  let challengeId = null, challenge = null;
  snap.forEach(child => {
    if (child.key.slice(-6).toUpperCase() === code.toUpperCase() && child.val().challengerUID !== firebaseUID) {
      challengeId = child.key;
      challenge = child.val();
    }
  });
  if (!challenge) { showNotification("Challenge code not found or already completed."); return; }
  launchPvpChallenge(challengeId, challenge);
}

// Launch a real, playable battle against a challenge's submitted team (vs the AI).
function launchPvpChallenge(id, challenge) {
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team before battling!"); return; }
  const fmt = (challenge.format === "double") ? "double" : "single";
  if (fmt === "double") {
    const healthy = G.team.filter(m => m.currentHP > 0).length;
    if (healthy < 2) { showNotification("This is a Doubles challenge — bring at least 2 healthy Lumori!"); return; }
  }
  let team;
  try { team = JSON.parse(challenge.team); } catch(e) { showNotification("Invalid challenge data."); return; }
  if (!Array.isArray(team) || !team.length) { showNotification("That challenge has no team."); return; }
  if (fmt === "double" && team.length < 2) { showNotification("That Doubles challenge is missing a second Lumori."); return; }
  if (typeof startPvpBattle !== "function") { showNotification("Battle engine unavailable."); return; }
  startPvpBattle(team, challenge.challengerName || "Rival", {
    challengeId: id,
    opponentUID: challenge.challengerUID || null,
    opponentRating: challenge.rating || 0,
    doubles: fmt === "double"
  });
}

// One-tap matchmaking: pick an open challenge near your rating (random among the
// closest few) and battle it.
async function quickMatch(format) {
  if (!requireOnline() || !G) return;
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team before battling!"); return; }
  const fmt = (format === "double") ? "double" : "single";
  const F = pvpModeFields(fmt);
  if (fmt === "double" && G.team.filter(m => m.currentHP > 0).length < 2) {
    showNotification("Doubles needs at least 2 healthy Lumori on your team!"); return;
  }
  let snap;
  try {
    snap = await firebaseDB.ref("battles").orderByChild("status").equalTo("open").limitToFirst(50).once("value");
  } catch(e) {
    showNotification("Couldn't reach the challenge board — check your connection and try again.");
    return;
  }
  const pool = [];
  snap.forEach(child => {
    const v = child.val();
    // Only match the requested format (untagged legacy challenges are singles).
    if (v.challengerUID !== firebaseUID && ((v.format === "double") ? "double" : "single") === fmt) {
      pool.push({ id: child.key, ...v });
    }
  });
  if (!pool.length) { showNotification(`No open ${fmt === "double" ? "Doubles" : "Singles"} challenges yet. Post one and wait, or invite a friend!`); return; }
  const myRating = G[F.rating] || 0;
  pool.sort((a, b) => Math.abs((a.rating || 0) - myRating) - Math.abs((b.rating || 0) - myRating));
  const near = pool.slice(0, Math.min(5, pool.length));
  const pick = near[Math.floor(Math.random() * near.length)];
  launchPvpChallenge(pick.id, pick);
}

// Apply the outcome of an async PvP battle: adjust rating, push it to the
// leaderboard, mark the challenge completed, and return to the PvP screen.
// Called from endBattle() in game.js when battleContext.isPvP.
async function recordPvpResult(won, mode) {
  const ctx = (typeof battleContext !== "undefined" && battleContext) ? battleContext : {};
  const oppName = ctx.pvpOpponentName || "your opponent";
  const fmt = (mode === "double") ? "double" : "single";
  const F = pvpModeFields(fmt);

  // Gap-driven rating change: close matches move ±10–22, larger gaps in the
  // "harder" direction (winning vs a higher rating / losing to a lower one) ramp
  // continuously up to ±80. See pvpRatingDelta / PVP_WIN_CURVE.
  const before = G[F.rating] || PVP_BASE_RATING;
  const oppRating = ctx.pvpOpponentRating || PVP_BASE_RATING;
  const delta = pvpRatingDelta(before, oppRating, won);
  G[F.rating] = Math.max(0, before + delta);
  if (won) G[F.wins] = (G[F.wins] || 0) + 1; else G[F.losses] = (G[F.losses] || 0) + 1;
  saveGame();

  // Record the outcome on the challenge, and leave a mailbox note so the
  // (offline) challenger can reconcile their own rating on next login.
  if (onlineReady && ctx.pvpChallengeId) {
    try {
      await firebaseDB.ref(`battles/${ctx.pvpChallengeId}`).update({
        status: "completed",
        defenderUID: firebaseUID,
        defenderName: G.playerName,
        result: won ? "defender" : "challenger",
        completedTs: Date.now()
      });
      // Only the acceptor (defender) is online, so deposit the inputs the
      // challenger needs to mirror this result via drainPvpMailbox() when they
      // next come online. The mirror is zero-sum: their delta = -ours.
      if (ctx.pvpOpponentUID && ctx.pvpOpponentUID !== firebaseUID) {
        await firebaseDB.ref(`pvpMailbox/${ctx.pvpOpponentUID}/${ctx.pvpChallengeId}`).set({
          challengeId: ctx.pvpChallengeId,
          opponentName: G.playerName,            // the defender, from the challenger's view
          opponentRating: before,                // defender rating at battle time
          challengerRatingAtPost: oppRating,     // rating the challenger posted with
          challengerWon: !won,                   // challenger won iff defender lost
          format: fmt,                           // which ladder this result belongs to
          ts: Date.now()
        });
      }
    } catch(e) { /* non-fatal; local rating already saved */ }
  }
  if (typeof submitLeaderboardScore === "function") submitLeaderboardScore(F.board);

  const sign = delta >= 0 ? "+" : "";
  showNotification(
    (won ? `🏆 You won vs ${escapeHtml(oppName)}!` : `😞 You lost to ${escapeHtml(oppName)}.`) +
    ` ${F.label} rating ${sign}${delta} → <strong>${G[F.rating]}</strong>.`,
    () => { if (typeof showPvPScreen === "function") showPvPScreen(); else showScreen("screen-pvp"); }
  );
}

// Reconcile async PvP results that landed on our posted challenges while we were
// offline. The acceptor (defender) leaves a mailbox note per battle (see
// recordPvpResult); here we mirror each one onto our own rating/record, then clear
// the note (apply-once) and delete the now-finished challenge to tidy the board.
// Called on login (initOnline) and when opening the PvP screen.
async function drainPvpMailbox() {
  if (!onlineReady || !firebaseUID || !G) return;
  const snap = await firebaseDB.ref(`pvpMailbox/${firebaseUID}`).once("value").catch(() => null);
  if (!snap || !snap.exists()) return;
  const entries = [];
  snap.forEach(c => { entries.push({ key: c.key, ...c.val() }); });

  let net = 0, w = 0, l = 0, lastName = "";
  const boardsTouched = new Set();
  for (const e of entries) {
    // Each note carries the ladder it belongs to (older notes default to singles).
    const F = pvpModeFields(e.format === "double" ? "double" : "single");
    const base = (typeof e.challengerRatingAtPost === "number") ? e.challengerRatingAtPost : (G[F.rating] || PVP_BASE_RATING);
    const oppR = (typeof e.opponentRating === "number") ? e.opponentRating : PVP_BASE_RATING;
    const delta = pvpRatingDelta(base, oppR, !!e.challengerWon);
    G[F.rating] = Math.max(0, (G[F.rating] || PVP_BASE_RATING) + delta);
    if (e.challengerWon) { G[F.wins] = (G[F.wins] || 0) + 1; w++; }
    else { G[F.losses] = (G[F.losses] || 0) + 1; l++; }
    net += delta;
    boardsTouched.add(F.board);
    lastName = e.opponentName || lastName;
    // Clear the note first so a result can never be applied twice, then remove
    // the finished challenge (we own it as the challenger).
    await firebaseDB.ref(`pvpMailbox/${firebaseUID}/${e.key}`).remove().catch(() => {});
    if (e.challengeId) await firebaseDB.ref(`battles/${e.challengeId}`).remove().catch(() => {});
  }

  saveGame();
  if (typeof submitLeaderboardScore === "function") {
    for (const board of boardsTouched) submitLeaderboardScore(board);
  }
  const sign = net >= 0 ? "+" : "";
  // Results may span both ladders, so the summary reports the net swing rather
  // than a single "→ rating" figure (each ladder is updated independently above).
  showNotification(entries.length === 1
    ? `While you were away, ${escapeHtml(lastName || "someone")} ${w ? "fell to" : "beat"} your team. Net rating ${sign}${net}.`
    : `While you were away: ${entries.length} battles (${w}W–${l}L). Net rating ${sign}${net}.`,
    () => { if (typeof showPvPScreen === "function") showPvPScreen(); else showScreen("screen-pvp"); }
  );
}

// ---- Gauntlet: battle several posted teams back-to-back; score = clears ----
// A survival ladder that reuses the 1v1 battle path but deliberately does NOT
// touch ladder rating or the mailbox — it's a separate "best clears" track so a
// long run can't farm rating off other players who aren't choosing to fight.
let gauntletRun = null;
const GAUNTLET_MAX = 8;

async function startGauntlet() {
  if (!requireOnline() || !G) return;
  if (gauntletRun) { showNotification("A gauntlet run is already in progress!"); return; }
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team before the gauntlet!"); return; }
  let snap;
  try {
    snap = await firebaseDB.ref("battles").orderByChild("status").equalTo("open").limitToFirst(50).once("value");
  } catch(e) {
    showNotification("Couldn't reach the challenge board — check your connection and try again.");
    return;
  }
  const pool = [];
  snap.forEach(child => {
    const v = child.val();
    if (v.challengerUID !== firebaseUID) pool.push({ id: child.key, ...v });
  });
  if (!pool.length) { showNotification("No open challenges to run a gauntlet against yet. Post one or invite friends!"); return; }
  // Shuffle, then take up to GAUNTLET_MAX as the run queue.
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  gauntletRun = { queue: pool.slice(0, GAUNTLET_MAX), idx: 0, clears: 0 };
  showNotification(`🏟️ Gauntlet begins! Beat as many teams as you can — ${gauntletRun.queue.length} waiting.`);
  gauntletLaunchNext();
}

function gauntletLaunchNext() {
  if (!gauntletRun) return;
  const next = gauntletRun.queue[gauntletRun.idx];
  if (!next) { finishGauntlet(true); return; }   // cleared everyone available
  let team;
  try { team = JSON.parse(next.team); } catch(e) { team = null; }
  if (!Array.isArray(team) || !team.length) {    // skip a malformed entry
    gauntletRun.idx++;
    gauntletLaunchNext();
    return;
  }
  if (typeof startPvpBattle !== "function") { showNotification("Battle engine unavailable."); gauntletRun = null; return; }
  startPvpBattle(team, next.challengerName || "Challenger", { gauntlet: true });
}

// Called from endBattle's PvP branch when battleContext.pvpGauntlet is set.
function advanceGauntlet(outcome) {
  if (!gauntletRun) { showScreen("screen-pvp"); return; }
  if (outcome === "won") {
    gauntletRun.clears++;
    gauntletRun.idx++;
    gauntletLaunchNext();
  } else {
    finishGauntlet(false);
  }
}

function finishGauntlet(clearedAll) {
  const clears = gauntletRun ? gauntletRun.clears : 0;
  gauntletRun = null;
  const prevBest = G.pvpGauntletBest || 0;
  const isRecord = clears > prevBest;
  if (isRecord) G.pvpGauntletBest = clears;
  saveGame();
  if (typeof submitLeaderboardScore === "function") submitLeaderboardScore("pvp_gauntlet");
  const head = clearedAll
    ? `🏟️ Gauntlet cleared! You beat all ${clears} team${clears === 1 ? "" : "s"}!`
    : `🏟️ Gauntlet over — ${clears} clear${clears === 1 ? "" : "s"}.`;
  const tail = isRecord ? " 🏆 New best!" : ` (Best: ${G.pvpGauntletBest || 0}.)`;
  showNotification(head + tail,
    () => { if (typeof showPvPScreen === "function") showPvPScreen(); else showScreen("screen-pvp"); });
}

async function showPvPScreen() {
  if (!requireOnline()) return;
  gauntletRun = null;        // abandon any run orphaned by backing out mid-battle
  showScreen("screen-pvp");
  await drainPvpMailbox();   // catch results that landed since login, then show fresh standing
  renderPvpRatingBanner();
  loadOpenChallenges();
}

// "Your rating: ⭐ N · W–L" header so the player sees standing without opening
// the leaderboard.
function renderPvpRatingBanner() {
  const el = document.getElementById("pvp-rating-banner");
  if (!el || !G) return;
  const sW = G.pvpWins || 0, sL = G.pvpLosses || 0;
  const dW = G.pvpDoublesWins || 0, dL = G.pvpDoublesLosses || 0;
  const playedSingles = (G.pvpRating !== undefined) || sW || sL;
  const playedDoubles = (G.pvpDoublesRating !== undefined) || dW || dL;
  const singles = playedSingles
    ? `<strong>⭐ ${G.pvpRating || PVP_BASE_RATING}</strong> <span class="pvp-record">${sW}W–${sL}L</span>`
    : `<strong>⭐ ${PVP_BASE_RATING}</strong> <span class="pvp-record">unranked</span>`;
  const doubles = playedDoubles
    ? ` · 👥 <strong>${G.pvpDoublesRating || PVP_BASE_RATING}</strong> <span class="pvp-record">${dW}W–${dL}L</span>`
    : "";
  const gauntlet = (G.pvpGauntletBest || 0) > 0
    ? ` · <span class="pvp-record">🏟️ best ${G.pvpGauntletBest}</span>`
    : "";
  el.innerHTML = `Singles: ${singles}${doubles}${gauntlet}`;
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
    container.innerHTML = battles.map((b, i) => {
      const fmtLabel = (b.format === "double") ? "👥 Doubles" : "⚔️ Singles";
      return `
      <div class="pvp-card">
        <span class="pvp-challenger">${escapeHtml(b.challengerName)}</span>
        <span class="pvp-format-tag">${fmtLabel}</span>
        <span class="pvp-badges">🏅 ${b.challengerBadges} · ⭐ ${b.rating || 0}</span>
        <span class="pvp-code">Code: ${b.id.slice(-6).toUpperCase()}</span>
        <button class="btn-primary pvp-accept" data-idx="${i}">⚔️ Battle</button>
      </div>`;
    }).join("");
    container.querySelectorAll(".pvp-accept").forEach(btn => {
      btn.addEventListener("click", () => {
        const b = battles[parseInt(btn.dataset.idx, 10)];
        if (b) launchPvpChallenge(b.id, b);
      });
    });
  } catch(e) {
    container.innerHTML = '<div class="pvp-error">Failed to load challenges.</div>';
  }
}

// ============================================================
// LIVE PvP BATTLES (real-time, room-code system)
// ============================================================
let liveRoomCode = null;
let liveRoomRef  = null;
let liveIsHost   = false;
let liveRoomListener = null;

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function buildLiveTeam() {
  if (!G) return [];
  return G.team.filter(m => m.currentHP > 0).slice(0, 3).map(m => {
    const def = MONSTERS_DATA[m.monsterId];
    const spd = (def?.baseStats?.speed || def?.base?.spe || 50) + Math.floor(m.level * 0.5);
    const atk = (def?.baseStats?.attack || def?.base?.atk || 50) + Math.floor(m.level * 0.5);
    const defStat = (def?.baseStats?.defense || def?.base?.def || 50) + Math.floor(m.level * 0.5);
    const maxHP = m.maxHP || m.currentHP;
    return {
      monsterId: m.monsterId, name: m.name, emoji: def?.emoji || "❓",
      level: m.level, nature: m.nature,
      moves: m.moves.map(mv => mv.id || mv),
      atk, def: defStat, spd, maxHP
    };
  });
}

function livePvPDamage(attackerMon, moveId, defenderMon) {
  const moveDef = MOVES_DATA[moveId];
  if (!moveDef?.power) return 0;
  const dmg = Math.floor((2 * attackerMon.level / 5 + 2) * moveDef.power * attackerMon.atk / defenderMon.def / 50 + 2);
  return Math.max(1, Math.round(dmg * (0.85 + Math.random() * 0.15)));
}

async function createLiveRoom() {
  if (!requireOnline() || !G) return;
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team first!"); return; }
  const code = generateRoomCode();
  const team = buildLiveTeam();
  const hpArr = team.map(m => m.maxHP);
  const room = {
    hostUID: firebaseUID, hostName: G.playerName,
    hostTeam: JSON.stringify(team),
    guestUID: null, guestName: null, guestTeam: null,
    status: "waiting",
    hostHP: hpArr, hostMaxHP: hpArr,
    guestHP: [], guestMaxHP: [],
    hostActive: 0, guestActive: 0,
    hostMove: null, guestMove: null,
    log: [`${G.playerName} created the room. Waiting for opponent...`],
    winner: null, ts: Date.now()
  };
  await firebaseDB.ref(`pvp_live/${code}`).set(room);
  liveRoomCode = code;
  liveIsHost = true;
  renderLiveRoomUI("waiting", code, null);
  watchLiveRoom(code);
}

async function joinLiveRoom(code) {
  if (!requireOnline() || !G) return;
  if (!code || code.length !== 6) { showNotification("Enter a 6-character room code."); return; }
  code = code.toUpperCase();
  if (G.team.every(m => m.currentHP <= 0)) { showNotification("Heal your team first!"); return; }
  const snap = await firebaseDB.ref(`pvp_live/${code}`).once("value");
  const room = snap.val();
  if (!room) { showNotification("Room not found."); return; }
  if (room.status !== "waiting") { showNotification("Room is already full or finished."); return; }
  if (room.hostUID === firebaseUID) { showNotification("You can't join your own room."); return; }
  const team = buildLiveTeam();
  const hpArr = team.map(m => m.maxHP);
  await firebaseDB.ref(`pvp_live/${code}`).update({
    guestUID: firebaseUID, guestName: G.playerName,
    guestTeam: JSON.stringify(team),
    guestHP: hpArr, guestMaxHP: hpArr,
    status: "battling",
    log: [...(room.log || []), `${G.playerName} joined! Battle begins!`]
  });
  liveRoomCode = code;
  liveIsHost = false;
  watchLiveRoom(code);
}

function watchLiveRoom(code) {
  if (liveRoomListener) liveRoomRef?.off("value", liveRoomListener);
  liveRoomRef = firebaseDB.ref(`pvp_live/${code}`);
  liveRoomListener = liveRoomRef.on("value", snap => {
    const room = snap.val();
    if (!room) return;
    renderLiveRoomUI(room.status, code, room);
    // Host resolves turn when both moves are submitted
    if (liveIsHost && room.status === "battling" && room.hostMove && room.guestMove) {
      resolveLiveTurn(code, room);
    }
  });
}

async function resolveLiveTurn(code, room) {
  let hostTeam, guestTeam;
  try { hostTeam = JSON.parse(room.hostTeam); guestTeam = JSON.parse(room.guestTeam); } catch(e) { return; }
  const hostMon  = hostTeam[room.hostActive];
  const guestMon = guestTeam[room.guestActive];
  let hostHP  = [...room.hostHP];
  let guestHP = [...room.guestHP];
  const log = [...(room.log || [])];

  // Determine turn order by speed
  const hostFirst = hostMon.spd >= guestMon.spd;
  function applyMove(attackerMon, moveId, defenderHP, defenderIdx, defenderTeam) {
    const moveDef = MOVES_DATA[moveId];
    const moveName = moveDef?.name || moveId;
    const dmg = livePvPDamage(attackerMon, moveId, defenderTeam[defenderIdx]);
    defenderHP[defenderIdx] = Math.max(0, defenderHP[defenderIdx] - dmg);
    log.push(`${attackerMon.name} used ${moveName}! ${dmg} damage.`);
    return defenderHP[defenderIdx] === 0;
  }

  let hostAct = room.hostActive, guestAct = room.guestActive;
  const first  = hostFirst ? [hostMon, room.hostMove, guestHP, guestAct, guestTeam] : [guestMon, room.guestMove, hostHP, hostAct, hostTeam];
  const second = hostFirst ? [guestMon, room.guestMove, hostHP, hostAct, hostTeam]  : [hostMon, room.hostMove, guestHP, guestAct, guestTeam];
  const firstFainted = applyMove(...first);
  if (!firstFainted) applyMove(...second);

  // Advance active index past fainted mons
  if (hostHP[hostAct] === 0) {
    const next = hostTeam.findIndex((_, i) => i > hostAct && hostHP[i] > 0);
    if (next !== -1) { hostAct = next; log.push(`${room.hostName}'s ${hostTeam[hostAct-1]?.name || "Lumori"} fainted! Go, ${hostTeam[hostAct].name}!`); }
  }
  if (guestHP[guestAct] === 0) {
    const next = guestTeam.findIndex((_, i) => i > guestAct && guestHP[i] > 0);
    if (next !== -1) { guestAct = next; log.push(`${room.guestName}'s ${guestTeam[guestAct-1]?.name || "Lumori"} fainted! Go, ${guestTeam[guestAct].name}!`); }
  }

  // Check winner
  const hostAllFainted  = hostHP.every(hp => hp <= 0);
  const guestAllFainted = guestHP.every(hp => hp <= 0);
  const winner = hostAllFainted ? "guest" : guestAllFainted ? "host" : null;
  if (winner) log.push(winner === "host" ? `${room.hostName} wins!` : `${room.guestName} wins!`);

  await firebaseDB.ref(`pvp_live/${code}`).update({
    hostHP, guestHP, hostActive: hostAct, guestActive: guestAct,
    hostMove: null, guestMove: null,
    log: log.slice(-30),
    status: winner ? "done" : "battling",
    winner
  });

  if (winner) {
    const prize = winner === (liveIsHost ? "host" : "guest") ? 600 : 150;
    if (G) { G.money += prize; G.battleWins = (G.battleWins||0) + (winner === (liveIsHost ? "host" : "guest") ? 1 : 0); saveGame(); }
    if (typeof submitLeaderboardScore === "function") submitLeaderboardScore("battles_won");
    showNotification(winner === (liveIsHost ? "host" : "guest") ? `🏆 You won the live battle! +${prize} coins` : `😞 You lost the live battle. +${prize} coins for participating.`);
    leaveLiveRoom();
  }
}

async function submitLiveMove(moveId) {
  if (!liveRoomCode || !onlineReady) return;
  const field = liveIsHost ? "hostMove" : "guestMove";
  await firebaseDB.ref(`pvp_live/${liveRoomCode}`).update({ [field]: moveId });
  // Disable move buttons until turn resolves
  document.querySelectorAll(".live-move-btn").forEach(b => b.disabled = true);
  document.getElementById("live-waiting-label")?.classList.remove("hidden");
}

function leaveLiveRoom() {
  if (liveRoomListener && liveRoomRef) liveRoomRef.off("value", liveRoomListener);
  if (liveRoomCode && liveIsHost) firebaseDB.ref(`pvp_live/${liveRoomCode}`).update({ status:"abandoned" }).catch(()=>{});
  liveRoomCode = null; liveRoomRef = null; liveIsHost = false; liveRoomListener = null;
  renderLiveRoomUI("idle", null, null);
}

function renderLiveRoomUI(status, code, room) {
  const area = document.getElementById("pvp-live-area");
  if (!area) return;

  if (status === "idle" || !code) {
    area.innerHTML = `
      <div class="live-setup">
        <button class="btn-primary" id="btn-create-room">🏠 Create Room</button>
        <div class="live-join-row">
          <input type="text" id="live-room-input" class="pvp-input" placeholder="Enter room code..." maxlength="6">
          <button class="btn-secondary" id="btn-join-room">Join</button>
        </div>
      </div>`;
    document.getElementById("btn-create-room")?.addEventListener("click", createLiveRoom);
    document.getElementById("btn-join-room")?.addEventListener("click", () => joinLiveRoom(document.getElementById("live-room-input")?.value.trim()));
    return;
  }

  if (status === "waiting") {
    area.innerHTML = `
      <div class="live-waiting">
        <div class="live-code-display">Room Code: <strong>${code}</strong></div>
        <p class="live-hint">Share this code with your opponent so they can join.</p>
        <button class="btn-secondary" id="btn-leave-room">✖ Cancel</button>
      </div>`;
    document.getElementById("btn-leave-room")?.addEventListener("click", leaveLiveRoom);
    return;
  }

  if (status === "battling" || status === "done") {
    let hostTeam, guestTeam;
    try { hostTeam = JSON.parse(room.hostTeam || "[]"); guestTeam = JSON.parse(room.guestTeam || "[]"); } catch(e) { return; }
    const myTeam    = liveIsHost ? hostTeam  : guestTeam;
    const theirTeam = liveIsHost ? guestTeam : hostTeam;
    const myHP      = liveIsHost ? (room.hostHP  || []) : (room.guestHP  || []);
    const myMaxHP   = liveIsHost ? (room.hostMaxHP || []) : (room.guestMaxHP || []);
    const theirHP   = liveIsHost ? (room.guestHP  || []) : (room.hostHP  || []);
    const theirMaxHP= liveIsHost ? (room.guestMaxHP || []) : (room.hostMaxHP || []);
    const myActive  = liveIsHost ? room.hostActive  : room.guestActive;
    const theirActive = liveIsHost ? room.guestActive : room.hostActive;
    const myMon     = myTeam[myActive] || {};
    const theirMon  = theirTeam[theirActive] || {};
    const myMoved   = liveIsHost ? !!room.hostMove : !!room.guestMove;
    const myName    = liveIsHost ? room.hostName : room.guestName;
    const theirName = liveIsHost ? room.guestName : room.hostName;

    const hpBar = (cur, max) => `<div class="live-hp-bar-wrap"><div class="live-hp-bar" style="width:${Math.max(0,Math.round((cur/max)*100))}%"></div></div><span class="live-hp-text">${cur}/${max}</span>`;

    const moveBtns = (status === "battling" && !myMoved) ?
      (myMon.moves || []).map(mv => {
        const md = MOVES_DATA[mv];
        return `<button class="live-move-btn btn-action" data-move="${mv}">${md?.name || mv} <small>${md?.type||""}</small></button>`;
      }).join("") : `<div id="live-waiting-label" class="live-waiting-msg">⏳ Waiting for opponent...</div>`;

    const logHtml = (room.log || []).slice(-8).map(l => `<div class="live-log-line">${escapeHtml(l)}</div>`).join("");

    area.innerHTML = `
      <div class="live-room-header">Room: <strong>${code}</strong></div>
      <div class="live-arena">
        <div class="live-side">
          <div class="live-side-name">${escapeHtml(myName || "You")}</div>
          <div class="live-mon-name">${myMon.emoji || "❓"} ${myMon.name || "?"} Lv.${myMon.level||"?"}</div>
          ${hpBar(myHP[myActive]||0, myMaxHP[myActive]||1)}
        </div>
        <div class="live-vs">VS</div>
        <div class="live-side">
          <div class="live-side-name">${escapeHtml(theirName || "Opponent")}</div>
          <div class="live-mon-name">${theirMon.emoji || "❓"} ${theirMon.name || "?"} Lv.${theirMon.level||"?"}</div>
          ${hpBar(theirHP[theirActive]||0, theirMaxHP[theirActive]||1)}
        </div>
      </div>
      <div class="live-moves">${moveBtns}</div>
      <div class="live-log">${logHtml}</div>
      ${status === "done" ? `<button class="btn-primary" id="btn-live-done">Back to PvP</button>` : `<button class="btn-secondary" id="btn-leave-room-battle">Forfeit</button>`}`;

    area.querySelectorAll(".live-move-btn").forEach(btn => {
      btn.addEventListener("click", () => submitLiveMove(btn.dataset.move));
    });
    document.getElementById("btn-live-done")?.addEventListener("click", () => { leaveLiveRoom(); });
    document.getElementById("btn-leave-room-battle")?.addEventListener("click", () => {
      if (confirm("Forfeit this battle?")) leaveLiveRoom();
    });
    return;
  }
}

// ============================================================
// FRIEND CODES & PROFILES
// ============================================================
function getMyFriendCode() {
  if (!firebaseUID) return null;
  return firebaseUID.slice(-8).toUpperCase();
}

async function syncPlayerProfile() {
  if (!onlineReady || !G) return;
  const profile = {
    name: G.playerName,
    badges: (G.badges || []).length,
    champion: !!G.championDefeated,
    ngPlus: G.ngPlusCount || 0,
    dex: G.caughtMonsters?.size || 0,
    lastSeen: Date.now()
  };
  await firebaseDB.ref(`players/${firebaseUID}/profile`).set(profile);
}

async function showFriendsScreen() {
  if (!requireOnline()) return;
  showScreen("screen-friends");
  const code = getMyFriendCode();
  const el = document.getElementById("my-friend-code");
  if (el) el.textContent = code || "---";
  loadFriendsList();
}

async function addFriend(code) {
  if (!requireOnline() || !code) return;
  code = code.toUpperCase().trim();
  // Search for UID with matching last-8 code
  const snap = await firebaseDB.ref("players").once("value");
  let foundUID = null;
  snap.forEach(child => {
    if (child.key.slice(-8).toUpperCase() === code && child.key !== firebaseUID) {
      foundUID = child.key;
    }
  });
  if (!foundUID) { showNotification("Friend code not found. Make sure they have played online."); return; }
  await firebaseDB.ref(`players/${firebaseUID}/friends/${foundUID}`).set(true);
  showNotification("Friend added! ✅");
  loadFriendsList();
}

async function removeFriend(friendUID) {
  if (!requireOnline()) return;
  await firebaseDB.ref(`players/${firebaseUID}/friends/${friendUID}`).remove();
  loadFriendsList();
}

async function loadFriendsList() {
  const container = document.getElementById("friends-list");
  if (!container) return;
  container.innerHTML = '<div class="friends-loading">Loading...</div>';
  try {
    const friendsSnap = await firebaseDB.ref(`players/${firebaseUID}/friends`).once("value");
    const friendUIDs = [];
    friendsSnap.forEach(child => friendUIDs.push(child.key));
    if (!friendUIDs.length) {
      container.innerHTML = '<div class="friends-empty">No friends yet. Add someone using their code!</div>';
      return;
    }
    const profiles = await Promise.all(friendUIDs.map(async uid => {
      const snap = await firebaseDB.ref(`players/${uid}/profile`).once("value");
      return { uid, ...snap.val() };
    }));
    container.innerHTML = profiles.map(p => `
      <div class="friend-card">
        <div class="friend-info">
          <div class="friend-name">${escapeHtml(p.name || "Trainer")}</div>
          <div class="friend-stats">
            🏅 ${p.badges || 0}/16
            ${p.champion ? " · 🏆 Champion" : ""}
            ${p.ngPlus > 0 ? ` · <span class="ng-badge">NG+${p.ngPlus}</span>` : ""}
            · 📖 ${p.dex || 0}
          </div>
          <div class="friend-lastseen">Last seen: ${p.lastSeen ? timeSince(p.lastSeen) : "Unknown"}</div>
        </div>
        <div class="friend-code-label">Code: ${p.uid.slice(-8).toUpperCase()}</div>
        <button class="btn-danger friend-remove" data-uid="${p.uid}">Remove</button>
      </div>`).join("");
    container.querySelectorAll(".friend-remove").forEach(btn => {
      btn.addEventListener("click", () => removeFriend(btn.dataset.uid));
    });
  } catch(e) {
    container.innerHTML = '<div class="friends-error">Failed to load friends list.</div>';
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
function onLumoriCaught(isShiny) {
  submitLeaderboardScore("dex");
  submitLeaderboardScore("battles_won");
  if (isShiny) submitLeaderboardScore("shiny_caught");
}
function onNGPlusStarted()    { submitAllScores(); }
function onEventPointEarned() {
  if (!G) return;
  G.eventPoints = (G.eventPoints || 0) + 1;
  saveGame();
  submitLeaderboardScore("event_pts");
}

// Start on page load
window.addEventListener("load", () => {
  if (FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY") initOnline();
  else console.info("Firebase not configured — online features disabled.");
  setInterval(renderTimeEvents, 60000); // update time events display every minute
  setTimeout(renderTimeEvents, 2000);   // initial render after game boots
});
