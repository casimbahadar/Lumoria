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
```
A PvP team slot stores `{ monsterId, level:50, moves, nature, ivs(31), shiny, variant, variantTypes, variantBase, variantImmune }` so variants battle correctly.

## Lv-50 normalization
`buildPvpMon(slot)` = `buildGymMon`-style but force `level:50`, IVs 31, preserving
variant fields (variantBase/types/immune). Reuse `buildMonBase(def,50,ivs,nature,variantBase)`.

## Async flow
1. `postPvpTeam()` — write your current team (normalized) + rating to `/pvpPool/{uid}`.
2. `loadPvpBoard()` — list other entries (browsable, like trade board).
3. `quickMatch()` — pick a random entry near your rating.
4. Challenge → reconstruct opponent slots → `startMultiBattle(theirTeam, theirName, mode)` (existing engine, AI-driven), with PvP flag.
5. On result → `recordPvpResult(win)` updates Elo-ish rating + `/leaderboards/pvp`.

## Real-time flow (host-authoritative)
1. `createRoom(passcode, public)` → `/pvpRooms/{id}` with hostTeam; host waits.
2. `joinRoom(id, passcode)` → guest writes guestTeam; status→active.
3. Host runs the battle engine; each turn: guest writes its move to `turn.guestMove`,
   host reads, resolves both moves, writes new `state` + log; guest renders from `state`.
4. Disconnect/timeout handling; on end → both `recordPvpResult`.
5. `public:true` rooms are listed for spectators (read-only state render).

## UI
- New **PvP** screen/tab: mode toggle (Async / Live Room), board list, "Quick Match",
  "Create Room" (passcode + public toggle), "Join Room" (id + passcode), rating display.
- Reuse trade-board card styling; reuse battle screen for the actual fights.

## Build phases
- **Phase A:** data layer + Lv-50 normalization + async battle (post/board/quick-match/challenge) + PvP rating/leaderboard + screen.
- **Phase B:** passcode room create/join + host-authoritative live turn-sync + public spectating.

Each phase committed incrementally; flagged UNVERIFIED until real Firebase + playtest.
