# Lumoria Launch Plan

> Living document. Owner: solo dev. Last redraft: 2026-05-18.

## A note up front

This plan is split into two tiers on purpose.

**Tier 0** is the commitment — a small set of items that constitute a credible
commercial launch and that one person can actually finish around a job, a
marriage, and a child. It does **not** lower the bar on the game itself.
Lumoria can ship as a polished, content-rich, paid product on Tier 0 alone.
What Tier 0 cuts is the surrounding operational sprawl that publishers and
marketing teams normally handle.

**Tier 1** is the roadmap — everything worth considering *after* Tier 0
launches and reveals whether there is an audience. Nothing in Tier 1 is a
commitment. Items move from Tier 1 to "doing" only when the evidence
(player count, revenue, free time) supports the cost.

The two-tier structure is the most important thing in this document. If a
new idea arrives, ask which tier it belongs in before adding it. Most ideas
belong in Tier 1.

---

## Reality check

- **Solo developer, no team, no publisher.**
- **Family-first time budget:** evenings and partial weekends, with weeks
  where nothing ships.
- **First commercial release.** Reputation is zero, mailing list is zero,
  community is zero. That's the default starting point; it is not a problem
  to be solved before launch.
- **Game itself is the strongest asset.** Time spent on the game beats
  almost all time spent on launch ops, especially for a first release. When
  in doubt between "polish the game" and "do a marketing thing", polish the
  game.

What this constraint means in practice:

- The launch is a checklist, not a campaign.
- Multi-platform is post-launch, not launch-day.
- "Quiet launch" is the expected outcome and is fine. A first-release game
  that 30 people buy is a foundation, not a failure.

---

## Tier 0 — Minimum Viable Launch (commitments)

This is the short list. Everything here is required before launch. Nothing
else is.

### QA gate

1. **Stable on the two browsers most players use:** Chrome and Firefox,
   desktop. Mobile browser is bonus.
2. **Save data survives a version bump.** Loading an old save into a new
   build either works or migrates cleanly. No silent corruption.
3. **Forgotten / post-game gating audit.** Verify no Forgotten Lumori
   (id ≥ 408) leaks into pre-quest encounter tables. Verify Aether,
   Fighting, Crystal, Primal, and Ghost types appear only on Forgotten
   ids.
4. **One play-through end-to-end** without restart, on a fresh save, by
   the dev. Note every friction point; fix the P0s, defer the rest.
5. **Friends-and-family beta, 5-10 people, 1-2 weeks.** Informal. Discord
   or email. Bug reports go in a single Google Doc or Notion page. No
   formal program, no NDAs, no rotating builds.

### Legal & ownership minimum

6. **USPTO TESS trademark search** on "Lumoria" for goods/services class
   9 (downloadable games) and class 41 (online games). 30 minutes, free.
   If a clear conflict appears, decide rename vs. proceed *now*, not
   post-launch.
7. **Domain registered.** `lumoria.game` or `.com` if available, otherwise
   the cleanest available variant. ~$15/yr. This also nails the name down
   before press/sharing.

### Distribution

8. **One storefront: itch.io.** Free to set up. Configure:
   - Game page with description, screenshots, trailer embed
   - Pricing (see Pricing decision point below)
   - Refund policy text
   - Build uploaded via `butler` CLI so future patches are one command
   - Optional: GitHub Pages mirror as a free fallback / dev-log target

### Marketing minimum

9. **One trailer, 30-60 seconds.** OBS for capture, DaVinci Resolve (free)
   or CapCut for editing. Music: one royalty-free track from a clearly
   licensed source. Done is better than polished.
10. **One launch-day post, three places:**
    - itch.io page goes live
    - One thread on Bluesky and/or Twitter/X (whichever you already use)
    - One Reddit post to r/PokemonFanGames or r/IndieDev (pick one;
      cross-post only if the first lands well)

### Day-1 support minimum

11. **One reachable channel** with a pinned "known issues" message.
    Discord server is ideal because it doubles as the community space;
    email is acceptable. No support rotation, no SLA, no live ops.
    Respond when you can; set expectations on the pinned message.

### Pricing decision point (deferred — decide 2-4 weeks before launch)

Pricing is **not** decided in this document. Decide it after the
friends-and-family beta, when you have a realistic sense of game length
and polish. Frame the decision with these inputs:

- **Game length / content density.** Hours of meaningful play.
- **Comparables on itch.io.** Indie mons-likes / RPGMaker-tier games
  typically land at $0 (PWYW), $4.99, $9.99, or $14.99.
- **Your stance on accessibility vs. signal.** A non-zero price signals
  "this is a real product"; PWYW with a suggested price signals "try it,
  pay if you liked it." Both are valid first-release postures.
- **Launch-discount room.** Whatever the steady-state price is, plan a
  10-20% launch-week discount. itch.io supports this natively.

Recommended decision date: **T-21 days from launch.** Earlier is fine.
Later means trailer/marketing assets can't reference the price.

This plan deliberately does **not** pre-commit to free, PWYW, or a
specific dollar amount. It commits to *making the decision on schedule
with the right inputs.*

---

## Tier 1 — Roadmap (options, not commitments)

Everything below is parked. Move items into "doing" only when Tier 0 has
shipped *and* there is concrete evidence (sales, player feedback, free
time) that justifies the cost. Items are listed roughly in order of
likely payoff for a first-release indie game.

### Wider QA

- Full browser matrix: Safari desktop, Safari iOS, Chrome Android, Edge
- Performance budgets on low-end mobile devices
- Accessibility audit: contrast ratios, keyboard navigation, text scaling
- Localization scaffolding (even just string externalization, no
  translation yet)

### Fuller legal / IP clearance

- Pokémon-adjacency audit by an IP-aware indie-game lawyer (~$200-400 for
  a one-page consultation). Inputs: name list, sprite originality,
  move-name overlap, type-chart distinctiveness.
- WIPO Global Brand Database search (international trademark)
- LLC or sole-proprietorship formation for payment-receiving entity.
  **Recommended trigger:** revenue passes the threshold where personal
  liability or tax complexity matters (varies by jurisdiction; in the US,
  roughly when annual game revenue exceeds a few thousand dollars).
- Terms of service / privacy policy if any analytics or account features
  are added
- Music and asset licensing paper trail

### Additional platforms

- **Desktop wrap via Tauri** (Win/Mac/Linux). Smaller bundle than
  Electron, single binary, Rust toolchain learning curve. Code-signing
  certificates: ~$100-300/yr if pursued.
- **Mobile wrap via Capacitor** (iOS + Android). Apple Developer:
  $99/yr. Google Play: $25 one-time. Store-listing assets, screenshots
  at required resolutions, content rating questionnaires.
- **Steam via Steam Direct.** $100 one-time fee per game, ~30-day
  review window, Steamworks SDK integration for achievements/cloud
  saves. Worth doing only after the web version has shown demand.
- **Consoles** (Switch via Nintendo, Xbox via ID@Xbox, PlayStation via
  PlayStation Partners). All require application + approval and are
  realistic only with a track record or publisher partnership. Treat
  as a 1-3 year horizon, not a launch concern.

### Community-from-zero pre-launch campaign

- Discord server stood up 60-90 days pre-launch
- Weekly dev log: TIGSource, r/IndieDev, r/PokemonFanGames,
  r/gamedev Screenshot Saturday
- Bluesky / Mastodon (gamedev.lgbt instance) / TikTok presence
- Newsletter (Buttondown free tier or similar)

### Press outreach

- Press list assembly: Indie Game Mag, Rock Paper Shotgun, PC Gamer
  indie desk, key YouTube creators and Twitch streamers in the
  monster-collector / fan-game niche
- Embargoed key drops via itch.io
- Follow-up cadence (one polite ping, then drop it)

Note: for a first-release solo game with no prior coverage, press
hit-rate is realistically <5%. Worth doing only after the game has
some organic visibility.

### Formal soft launch / closed beta

- Recruitment via Discord / forums (vs. just friends and family)
- Time-boxed 2-3 weeks with structured feedback (forms, weekly builds,
  changelog discipline)
- Exit criteria: defined bug-severity gates before opening hard launch

### Post-launch content roadmap

- Patch cadence target (e.g. bi-weekly hotfixes for month 1, monthly
  thereafter)
- Content drops: Forgotten quest line, NG+ polish, additional regions
- Review monitoring: itch.io comments, Steam reviews when applicable
- Metrics: DAU, retention D1/D7, paid conversion if applicable, refund
  rate
- Sale calendar (Steam summer/winter sales, itch.io bundles)

---

## Appendix A — Decision points & timing

Decisions deliberately deferred, with recommended timing:

| Decision                          | Recommended decision date | Inputs needed                          |
|-----------------------------------|---------------------------|----------------------------------------|
| Final game name (post-TM search)  | T-90 days                 | TESS search result                     |
| Pricing model + amount            | T-21 days                 | Beta feedback, game-length estimate    |
| Launch date                       | T-30 days (lock)          | Tier 0 checklist completion forecast   |
| Discord vs. email as support hub  | T-21 days                 | Whether a Discord exists by then       |
| Trailer cut/version               | T-14 days                 | Final build assets, music licensed     |

## Appendix B — Tier 0 checklist (printable)

```
[ ]  1. Chrome + Firefox desktop stable
[ ]  2. Save migration verified across version bump
[ ]  3. Forgotten gating audit clean (id ≥ 408 + 5 post-game types)
[ ]  4. Dev end-to-end play-through, P0s fixed
[ ]  5. Friends-and-family beta complete (5-10 people, 1-2 weeks)
[ ]  6. USPTO TESS search done, name cleared or rename decided
[ ]  7. Domain registered
[ ]  8. itch.io page configured, butler upload working
[ ]  9. Trailer cut, 30-60s, uploaded
[ ] 10. Launch-day post drafted for itch / Bluesky / one subreddit
[ ] 11. Support channel pinned with known-issues message
[ ] PRICING DECISION made (by T-21 days)
[ ] LAUNCH DATE locked (by T-30 days)
```

If every box above is ticked, you are ready to ship a commercial first
release. Anything not on this list is Tier 1 and can wait.

---

## Appendix C — What this document deliberately excludes

To keep this honest, here's what was considered and consciously left out
of Tier 0:

- Press embargoes and review-copy distribution
- Influencer / streamer outreach campaign
- Pre-launch trailer drops, wishlist campaigns
- Closed beta with structured testing program
- Multi-platform launch (desktop / mobile / Steam)
- LLC formation
- Paid advertising
- Localization
- Day-1 patch readiness drills

All of these are legitimate. None of them are the difference between a
first-release indie game finding 30 players or 300 players. The game,
the storefront, and one honest launch post do most of that work. The
rest is leverage you earn after release 1.
