# Project rules for Claude Code

## Always confirm before acting

**Always ask explicit user confirmation before proceeding with any change, edit, rewrite, retype, rename, commit, push, branch operation, hook adjustment, agent spawn, or any other action that modifies repo state, configuration, or external systems.**

This applies even when:
- A change seems "obvious" or follows naturally from prior work.
- The user has approved a related step (approval is per-step, not transitive).
- The change is small (one-line lore edit, emoji swap, single field change).
- An agent's research output suggests an action.

The pattern to follow:
1. **Propose** the change in writing — what file, what fields, before vs. after.
2. **Wait** for the user to say "approve" / "yes" / "proceed" or supply edits.
3. **Apply** only the approved change. If the proposal had multiple options or sub-decisions, treat each as a separate ask.

If unsure whether a step counts as "modifying state", ask. Cost of asking = small. Cost of unauthorized action = large (lost work, broken trust).

**Exceptions (no confirmation needed):**
- Read-only operations: `Read`, `Grep`, `Bash` for inspection (`ls`, `git status`, `git diff`, `cat`, `grep`).
- Running validation scripts whose output is purely informational (e.g. `python3 scripts/analyze_current.py`).
- Updating a working `TodoWrite` list (internal progress tracking, not file edits).

Everything else asks first.

## Other persistent context

- `TODO.md` "ACTIVE WORK" section is the source of truth for in-progress tasks. Update it in real time as items get checked off.
- `.claude-batching` marker file is present → the global stop-hook tolerates uncommitted changes. Commits are batched per TODO section, not per change.
- See `rename_lumori.md` for the naming rules and `scripts/analyze_current.py` for cap-2 validation.

## Context-window checkpoints

Proactively notify the user when the session's context window crosses each of these thresholds: **50%, 75%, 90%, and 98%**. Surface a one-line warning at each threshold so the user can decide whether to commit, save state, or wrap up before context exhaustion.

Example format: `⚠️ Context at 75% — consider committing recent work.`

### 98% threshold — special guidance

When context reaches 98%, do NOT just warn and continue. Stop active work and present a structured recommendation block so the user can decide how to keep the session going past context exhaustion. Format:

```
🚨 Context at 98% — cannot continue at full fidelity. Options to keep going:

1. Compact (use Claude Code's /compact command)
   - Pros: instant; preserves conversation; auto-summarizes older messages
   - Cons: loses some fidelity; may miss subtle in-flight context
   - Best for: when current task is well-bounded and resumable from a summary

2. Commit + handoff to fresh session
   - Pros: clean slate; full fidelity; explicit handoff doc preserves state
   - Cons: requires you to restart and re-prime; loses "in the moment" context
   - Best for: when current task is partially done and you'd rather make a clean break

3. Targeted file save + selective unload
   - Pros: keeps the active task alive while shedding finished side-context
   - Cons: requires Claude to decide what to save; some loss of prior work
   - Best for: when there's one critical in-flight artifact (audit, plan, draft)

4. Wrap up + push (recommended if work is at a natural break)
   - Pros: nothing lost, end on a green commit, resume tomorrow fresh
   - Cons: stops momentum
   - Best for: when current sub-task is complete or near-complete

Specific recommendation for the *current* work-in-progress:
[Claude inserts a tailored recommendation here based on what's actively in flight,
 e.g. "Your audit is 6/7 batches done — save batch 7 to taxonomy.md, commit, then
 /compact and resume from the saved file. Option 1 + 3 hybrid."]

What would you like to do?
```

Always tailor the "Specific recommendation" line to what's actually in flight — don't just list options abstractly. The user picks the path; Claude executes.

### Between 90% and 98%

At the 90% warning, also surface a brief preview of the 98% options so the user has time to plan:

`⚠️ Context at 90% — recommend wrapping current sub-task and committing soon. At 98% I'll prompt you with full handoff options (compact, fresh session, etc.).`

## Post-game typing restriction

**Aether, Crystal, Primal, Chrono, and Stellar are post-game typings reserved for Forgotten Lumori (id ≥ 408).** When proposing typings for any Lumori with id < 408, never recommend or include any of these five types — they belong to the Forgotten/post-game roster only.

Suggestion lists, type-pivot proposals, and "pristine combo" recommendations for non-Forgotten ids must exclude all five.

When a pre-408 Lumori already has one of these types in current data (legacy), do not auto-strip it — surface it for user discussion only.
