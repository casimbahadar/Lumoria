#!/usr/bin/env python3
"""
Moveset utilization audit for js/data.js

For each of the types in MOVES_DATA, count learners per move and report:
  - Orphan moves (0 learnset users) — candidates for (a) assign / (b) promote
    to exclusive / (c) remove from MOVES_DATA as dead code.
  - Near-orphan moves (1-2 learnset users) — verify intentional signature
    vs needing wider distribution.

Primary metric = learnset count from MONSTERS_DATA[id].learnset.
Trainer-hardcoded usage (encounter blocks' moves:[...]) is tracked separately
and annotated on orphans to distinguish "dead code" from "trainer-only" cases.

See TODO.md "🎯 Moveset utilization audit".
"""
import re
from pathlib import Path
from collections import defaultdict

DATA_JS = Path(__file__).resolve().parent.parent / "js" / "data.js"
text = DATA_JS.read_text()

# ---------- Parse MOVES_DATA ----------
moves_start = text.find("const MOVES_DATA = {")
assert moves_start >= 0, "MOVES_DATA block not found"
# Find the closing of the MOVES_DATA block — first "^};" after start
moves_end_match = re.search(r'^\};', text[moves_start:], re.MULTILINE)
moves_end = moves_start + moves_end_match.start()
moves_block = text[moves_start:moves_end]

moves = {}
mpat = re.compile(r'^\s*(\w+):\s*\{\s*name:"([^"]+)",\s*type:"(\w+)"', re.MULTILINE)
for m in mpat.finditer(moves_block):
    k = m.group(1)
    moves[k] = {"key": k, "name": m.group(2), "type": m.group(3)}

# ---------- Parse MONSTERS_DATA learnsets ----------
mons_start = text.find("const MONSTERS_DATA = {")
assert mons_start >= 0, "MONSTERS_DATA block not found"
mons_text = text[mons_start:]

# Split per-id block by finding each "  N: { id:N,"
id_starts = [(int(m.group(2)), m.start()) for m in re.finditer(r'^\s*(\d+):\s*\{\s*id:(\d+),', mons_text, re.MULTILINE)]

learnset_users = defaultdict(set)
for i, (mid, pos) in enumerate(id_starts):
    next_pos = id_starts[i+1][1] if i+1 < len(id_starts) else len(mons_text)
    block = mons_text[pos:next_pos]
    ls_match = re.search(r'learnset:\s*\[', block)
    if not ls_match:
        continue
    # Balanced-bracket extraction starting just after the opening [
    start = ls_match.end()
    depth = 1
    j = start
    while j < len(block) and depth:
        c = block[j]
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
        j += 1
    learnset_str = block[start:j-1]
    for move_key in re.findall(r'"([a-z][a-z0-9_]*)"', learnset_str):
        learnset_users[move_key].add(mid)

# ---------- Parse trainer/encounter moves:[...] arrays ----------
trainer_users = defaultdict(set)
tpat = re.compile(r'monsterId:\s*(\d+),\s*level:\s*\d+,\s*moves:\s*\[([^\]]+)\]')
for m in tpat.finditer(text):
    mid = int(m.group(1))
    for k in re.findall(r'"([a-z][a-z0-9_]*)"', m.group(2)):
        trainer_users[k].add(mid)

# ---------- Tally ----------
type_summary = defaultdict(lambda: {"total":0, "orphan":0, "near":0, "ok":0, "moves":[]})
for k, info in moves.items():
    learn = len(learnset_users.get(k, set()))
    trainer = len(trainer_users.get(k, set()))
    bucket = "orphan" if learn == 0 else ("near" if learn <= 2 else "ok")
    s = type_summary[info["type"]]
    s["total"] += 1
    s[bucket] += 1
    s["moves"].append({
        "key": k, "name": info["name"], "learn": learn, "trainer": trainer,
    })

# ---------- Report: per-type table ----------
print(f"MOVES_DATA: {len(moves)} moves across {len(type_summary)} types")
print(f"Learnset users tracked across {sum(len(v) for v in learnset_users.values())} learnset references")
print()
print("=" * 80)
print(f"{'Type':<12} {'Total':>6} {'Orphan':>7} {'Near(1-2)':>10} {'OK(3+)':>7} {'%Used':>7}")
print("=" * 80)
totals = {"total":0, "orphan":0, "near":0, "ok":0}
for t in sorted(type_summary.keys()):
    s = type_summary[t]
    used = s["near"] + s["ok"]
    pct = (used / s["total"] * 100) if s["total"] else 0
    print(f"{t:<12} {s['total']:>6} {s['orphan']:>7} {s['near']:>10} {s['ok']:>7} {pct:>6.0f}%")
    for key in ("total", "orphan", "near", "ok"):
        totals[key] += s[key]
print("-" * 80)
used = totals["near"] + totals["ok"]
pct = (used / totals["total"] * 100) if totals["total"] else 0
print(f"{'TOTAL':<12} {totals['total']:>6} {totals['orphan']:>7} {totals['near']:>10} {totals['ok']:>7} {pct:>6.0f}%")
print()

# ---------- Orphan list ----------
print("=" * 80)
print("ORPHAN MOVES (0 learnset users)")
print("  [T]=also referenced in trainer moves:[...] hardcode (intentional vs dead)")
print("=" * 80)
for t in sorted(type_summary.keys()):
    orphans = [m for m in type_summary[t]["moves"] if m["learn"] == 0]
    if not orphans:
        continue
    print(f"\n  {t} ({len(orphans)} orphans):")
    for m in sorted(orphans, key=lambda x: x["key"]):
        tag = f"  [T:{m['trainer']}]" if m["trainer"] else ""
        print(f"    {m['key']:<26} \"{m['name']}\"{tag}")

# ---------- Near-orphan list ----------
print()
print("=" * 80)
print("NEAR-ORPHAN MOVES (1-2 learnset users)")
print("=" * 80)
for t in sorted(type_summary.keys()):
    nears = [m for m in type_summary[t]["moves"] if 1 <= m["learn"] <= 2]
    if not nears:
        continue
    print(f"\n  {t} ({len(nears)} near-orphans):")
    for m in sorted(nears, key=lambda x: (x["learn"], x["key"])):
        ls_ids = sorted(learnset_users.get(m["key"], set()))
        ls_str = ",".join(str(x) for x in ls_ids)
        tag = f"  [T:{m['trainer']}]" if m["trainer"] else ""
        print(f"    {m['key']:<26} \"{m['name']}\"  ({m['learn']} learner{'s' if m['learn']>1 else ''}: #{ls_str}){tag}")

# ---------- Summary footer ----------
print()
print(f"Per-type summary: {totals['orphan']} orphans + {totals['near']} near-orphans = {totals['orphan']+totals['near']} moves to review")
