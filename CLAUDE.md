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
