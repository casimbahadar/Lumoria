# Online PvP Battle System — Spec (TODO #13)

Branch `claude/online-pvp`. Builds on the existing Firebase RTDB online layer
(`js/online.js`: anonymous auth, `firebaseDB`, leaderboards, trades, events).

> ⚠️ **Untestable in CI/dev:** `FIREBASE_CONFIG` is placeholder, and there's no
> browser / second client here, so PvP netcode cannot be runtime-verified in
> this environment. Code is written to be correct-by-inspection; playtest after
> real Firebase credentials are added.

## Decisions (locked)
- **Two modes, player's choice:**
  - **Async** — battle a *snapshot* of another player's team, run locally vs the existing AI. Robust, reuses the battle engine.
  - **Real-time** — live turn-by-turn battle between two simultaneously-online players (host-authoritative sync over Firebase).
- **Level cap: Lv 50** — all PvP mons normalized to Lv 50 (perfect-IV style stat calc at Lv 50) so team-building/skill decides, not grind.
- **Matchmaking:** browse board (like trades) + one-tap random/rating queue + **passcode rooms** (private by default; can be flipped to public spectating — Showdown-style).
- **Variants and shinies both allowed** in PvP (no restriction).

## Data model (Firebase RTDB)
```
/pvpPool/{uid}        { name, rating, team:[slots], updated }      // async opponents + queue
/pvpRooms/{roomId}    { host, hostName, guest, guestName,
                        passcode, public:bool, mode:"live",
                        status:"open|active|done",
                        state:{...}, turn:{...}, created }
/leaderboards/pvp/{uid} { name, value:rating }                     // reuse leaderboard system
/pvpMailbox/{uid}/{challengeId} { opponentName, opponentRating,    // async result notes for the
                        challengerRatingAtPost, challengerWon, ts } // offline challenger to drain
```
**Security rules note:** the acceptor (defender) writes to the *challenger's*
`/pvpMailbox/{uid}` node, so RTDB rules must allow any authed user to write there
(read/delete restricted to the owner uid). Apply console-side.
A PvP team slot stores `{ monsterId, level:50, moves, nature, ivs(31), heldItem, ability, shiny, variant, variantTypes, variantBase, variantImmune }` so variants battle correctly.

**Abilities (forward-compat):** there is no ability *battle system* yet — `ability`
is `null` today and nothing consumes it. But `pvpSerializeMon` and `buildBattleMon`
both pass it through, so once abilities are implemented on party mons they will flow
into normal **and** PvP battles automatically (the Lv-50 snapshot won't strip them).
Implementing the ability mechanics themselves is a separate, larger task.

## Lv-50 normalization
`buildPvpMon(slot)` = `buildGymMon`-style but force `level:50`, IVs 31, preserving
variant fields (variantBase/types/immune). Reuse `buildMonBase(def,50,ivs,nature,variantBase)`.

## Async flow
1. `postPvpTeam()` — write your current team (normalized) + rating to `/pvpPool/{uid}`.
2. `loadPvpBoard()` — list other entries (browsable, like trade board).
3. `quickMatch()` — pick a random entry near your rating.
4. Challenge → reconstruct opponent slots → `startMultiBattle(theirTeam, theirName, mode)` (existing engine, AI-driven), with PvP flag.
5. On result → `recordPvpResult(win)` updates the acceptor's rating + `/leaderboards/pvp`,
   and deposits a `/pvpMailbox/{challengerUID}/{challengeId}` note for the offline poster.
6. `drainPvpMailbox()` (on login + when opening the PvP screen) mirrors each pending
   note onto the challenger's own rating/record (zero-sum: their delta = −acceptor's),
   then clears the note and deletes the finished challenge.

## Real-time flow (host-authoritative)
1. `createRoom(passcode, public)` → `/pvpRooms/{id}` with hostTeam; host waits.
2. `joinRoom(id, passcode)` → guest writes guestTeam; status→active.
3. Host runs the battle engine; each turn: guest writes its move to `turn.guestMove`,
   host reads, resolves both moves, writes new `state` + log; guest renders from `state`.
4. Disconnect/timeout handling; on end → both `recordPvpResult`.
5. `public:true` rooms are listed for spectators (read-only state render).

## UI
- New **PvP** screen/tab: mode toggle (Async / Live Room), board list, "Quick Match",
  "Gauntlet", "Create Room" (passcode + public toggle), "Join Room" (id + passcode),
  rating display (also shows 🏟️ gauntlet best).
- Reuse trade-board card styling; reuse battle screen for the actual fights.

## Rating (gap-driven curve)
Everyone starts at `PVP_BASE_RATING = 1000`. The amount a result moves your
rating is a **single continuous curve** of the rating gap — no flat tiers and no
"upset" special-casing. Close matches move you a little; the further apart the
ratings, the more a result in the *harder* direction swings.
```
// Magnitude of a WIN by gap = oppRating - myRating (+ = opponent rated higher),
// (gap, delta) breakpoints linearly interpolated (PVP_WIN_CURVE in online.js):
[-49,10] [0,16] [49,22] [100,30] [200,36] [300,42] [449,48] [599,58] [799,68] [999,75] [1199,80]
// A loss is the mirror against the opposite gap:  L(gap) = -W(-gap)
delta = pvpRatingDelta(myRating, oppRating, won)   // online.js
```
Swings @1000 (gap = opp − me):
- **Win:** beat much weaker → +10 · even → +16 · slightly higher (gap 49) → +22 ·
  +100 → +30 · +300 → +42 · +500 → +51 · +1000 → +75 · capped at +80.
- **Loss (mirror):** lose to much stronger → −10 · even → −16 · lose to someone
  100 below → −30 · 300 below → −42 · 1000 below → −75 · capped at −80.

Beating a higher-rated player is **not** treated as a special "upset" — it just
sits further along the same curve. Tune by editing `PVP_WIN_CURVE` in `online.js`.

**Async two-sided reconciliation:** only the acceptor is online, so their rating
updates immediately (using the opponent's rating stored on the challenge). The
acceptor also deposits a **mailbox note** (`/pvpMailbox/{challengerUID}/{challengeId}`)
holding the inputs the challenger needs; `drainPvpMailbox()` applies the mirrored
delta on the challenger's next login (and on opening the PvP screen). Because the
curve mirror is `L(gap) = −W(−gap)`, the exchange is exactly zero-sum.

**Where it's shown:** ⭐ PvP Rating leaderboard tab; post-battle popup
("Rating +48 → 1048"); and a rating banner header on the PvP screen
(`renderPvpRatingBanner` → "Your rating: ⭐ N · W–L").

## Modes roadmap (decided "both eventually")
- **1v1** — shipped (Phase A, async vs AI).
- **2v2** — *async Doubles vs AI* first (reuse `startMultiBattle` "double" + the
  `isPvP` Lv-50 normalization; must add the same no-XP / opponent-name guards the
  single path got in `handleEnemyFainted`, in the multi-battle faint path ~`game.js:2640-2712`).
  Then *live 2-human tag* in the live phase.
- **FFA** — *async Royale vs AI snapshots* (3–4 teams, last team standing; requires
  teaching the engine to handle **>2 sides** — the real work). Then *live multiplayer FFA*.
- **Gauntlet** ✅ — fight up to `GAUNTLET_MAX` (8) posted teams back-to-back; the run
  ends on your first loss and scores the number of consecutive **clears**. Reuses the
  1v1 battle path (`startGauntlet` → `gauntletLaunchNext` → `startPvpBattle({gauntlet:true})`
  → `advanceGauntlet` from `endBattle` → `finishGauntlet`). Deliberately **does not**
  touch ladder rating or the mailbox — it's a separate survival track stored as
  `G.pvpGauntletBest` with its own `pvp_gauntlet` leaderboard.

## Build phases
- **Phase A:** ✅ Lv-50 normalization + async 1v1 (post/board/quick-match/accept) +
  gap-driven rating curve + challenger rating **mailbox** (two-sided reconciliation) +
  `pvp_rating` leaderboard + PvP screen with rating banner + **Gauntlet** survival mode
  (`pvp_gauntlet` leaderboard). *Unverified pending real Firebase + playtest.*
- **Phase B:** ✅ async **Doubles (2v2)** — independent `pvp_doubles_rating` ladder +
  saved **PvP team loadouts** (6/format, posted & battled with). Also fixed
  `pvpSerializeMon` serializing posted-team moves as `[undefined]`.
- **Phase C:** ✅ async **FFA Royale** — isolated N-side engine (`startFfaBattle`,
  `#screen-ffa`): 3-4 sides, full teams (1 active + bench), true royale (everyone
  targets anyone, last side standing). Reuses `calcDamage`/`applyMoveEffect`; pulls
  2-3 open posted teams as AI sides; self-contained `pvp_ffa_rating` ladder (👑).
- **Phase D:** ✅ real-time — **D1**: type-aware live damage, passcode + public
  rooms, public spectating, per-client zero-sum **rating** (was coins-only and
  host-only). **D2**: **live 2v2 + live FFA** via a unified host-authoritative
  N-seat engine (`createMultiLiveRoom`/`resolveMultiLiveTurn`): one human per seat,
  alliances per mode, missing-move AI fill + resolve guard; 2v2 → doubles ladder,
  FFA → ffa ladder.

Each phase committed incrementally; **all flagged UNVERIFIED** until real Firebase
credentials + playtest (and live 2v2/FFA need multiple simultaneous real clients).

## Turn timer (all PvP/online modes)
60s per turn, **auto-picks** a random legal move (+ valid target) on expiry.
Shared `startTurnTimer`/`clearTurnTimer` (key-guarded so live re-renders don't
reset mid-turn; `showScreen` clears globally). Async battle screen + Gauntlet hook
`showBattleMainActions`/`showMultiMovePanel` gated on `isPvP`; async FFA hooks the
turn loop; live modes auto-submit on expiry **plus** a host-side disconnect safety
net (`scheduleLiveHostTimeout`, ~65s) that force-resolves with AI-fill when a
seat's client is gone. Countdown turns red + pulses in the last 10s.

## Parity upgrades (post-spec)
- **Live mechanical parity:** live 1v1/2v2/FFA now run the **real `calcDamage`**
  (phys/spec split, crit, held items, exact formula, full type chart, STAB, variant
  immunity). `buildLiveTeam` serializes the Lv-50 PvP stat block; host rebuilds a
  calcDamage-ready mon each turn. *Remaining:* live doesn't persist stat stages /
  statuses across turns (each turn's exchange is full-fidelity; no carry-over).
- **FFA polish:** battle music (`rival_battle` for any PvP context), hit shake/flash
  + faint fade on side cards.
- **FFA depth:** end-of-turn `tickStatus` (residual DoT/effects), a **switch** menu,
  and a heal-item **bag** (matches async PvP: catch off, bag/switch on).

## Known limitations / follow-ups (post-playtest)
- Live still doesn't persist stat stages / statuses across turns (per-turn exchange
  is full-fidelity); add per-mon status/stage carry-over for full live parity.
- FFA bag is limited to `heal` items (the meaningful battle subset); X-items/revives
  are out of scope.
- Live multi-seat has no in-band turn **countdown UI** for *other* seats — only the
  acting client sees its own timer; the host safety net still covers disconnects.
