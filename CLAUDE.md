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

## Post-game typing restriction

**Aether, Fighting, Crystal, Primal, and Ghost are post-game typings reserved for Forgotten Lumori (id ≥ 408).** When proposing typings for any Lumori with id < 408, never recommend or include any of these five types — they belong to the Forgotten/post-game roster only.

Suggestion lists, type-pivot proposals, and "pristine combo" recommendations for non-Forgotten ids must exclude all five.

When a pre-408 Lumori already has one of these types in current data (legacy), do not auto-strip it — surface it for user discussion only.
