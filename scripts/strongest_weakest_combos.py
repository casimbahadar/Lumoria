#!/usr/bin/env python3
"""
Compute strongest/weakest type combos under the current TYPE_CHART for flagship-typing
decisions. Mono + dual combos are ranked in the same lists.

Scoring (user spec 2026-05-24):
- Offense weight per defender cell = multiplier itself
  (4→4, 2→2, 1→1, 0.5→0.5, 0.25→0.25, 0→0)
- Defense weight per attacker cell = 1/incoming-multiplier
  (4→0.25, 2→0.5, 1→1, 0.5→2, 0.25→4)
  0× incoming (immunity) → sentinel weight 8 (treats immunity as 2× better than 0.25× resist)
- Dual offense: per defender, attacker picks best STAB → max(mult_A, mult_B)
- Dual defense: per attacker, types stack multiplicatively → mult_A × mult_B
- Tiebreak: list all combos tied with the cutoff entry

Reads TYPE_CHART from js/data.js. Re-run after chart changes.
"""
import re
from itertools import combinations
from pathlib import Path

CHART_FILE = Path(__file__).resolve().parent.parent / "js" / "data.js"
TOP_N = 20
IMMUNITY_DEF_WEIGHT = 8.0


def parse_chart():
    text = CHART_FILE.read_text()
    start = text.index("const TYPE_CHART = {")
    end = text.index("\n};", start)
    block = text[start:end]
    chart = {}
    row_re = re.compile(r"(\w+)\s*:\s*\{\s*([^}]*)\s*\}")
    for m in row_re.finditer(block):
        name = m.group(1)
        if name == "TYPE_CHART":
            continue
        cells = {}
        for cell in m.group(2).split(","):
            cell = cell.strip()
            if not cell:
                continue
            k, v = cell.split(":")
            cells[k.strip()] = float(v.strip())
        if len(cells) > 5:  # filter accidental small dicts
            chart[name] = cells
    return chart


def offense_score(combo, chart, types):
    total = 0.0
    for d in types:
        mults = [chart[c].get(d, 1) for c in combo]
        mult = max(mults) if len(combo) > 1 else mults[0]
        total += mult
    return total


def defense_score(combo, chart, types):
    total = 0.0
    for x in types:
        incoming = 1.0
        for d in combo:
            incoming *= chart[x].get(d, 1)
        total += IMMUNITY_DEF_WEIGHT if incoming == 0 else (1.0 / incoming)
    return total


def fmt(combo):
    return "/".join(combo) if len(combo) > 1 else combo[0] + " (mono)"


def rank_with_ties(rows, key_name, top_n=TOP_N, reverse=True):
    rows_sorted = sorted(rows, key=lambda r: r[key_name], reverse=reverse)
    if len(rows_sorted) <= top_n:
        return rows_sorted
    cutoff = rows_sorted[top_n - 1][key_name]
    result = []
    for r in rows_sorted:
        if len(result) < top_n or abs(r[key_name] - cutoff) < 1e-9:
            result.append(r)
        else:
            break
    return result


def print_table(title, rows):
    print("=" * 84)
    print(title)
    print("=" * 84)
    print(f"{'#':>3}  {'Combo':30}  {'Off':>8}  {'Def':>8}  {'Total':>8}")
    print("-" * 84)
    for i, r in enumerate(rows, 1):
        print(f"{i:>3}  {fmt(r['combo']):30}  {r['off']:>8.2f}  {r['def']:>8.2f}  {r['total']:>8.2f}")
    print()


def main():
    chart = parse_chart()
    types = sorted(chart.keys())
    print(f"Loaded {len(types)} types from {CHART_FILE}")
    print(f"Types: {', '.join(types)}\n")

    combos = [(t,) for t in types] + [tuple(sorted(c)) for c in combinations(types, 2)]
    print(f"Total combos analyzed: {len(combos)} ({len(types)} mono + {len(combos) - len(types)} dual)\n")

    rows = []
    for c in combos:
        off = offense_score(c, chart, types)
        defn = defense_score(c, chart, types)
        rows.append({"combo": c, "off": off, "def": defn, "total": off + defn})

    avg_off = sum(r["off"] for r in rows) / len(rows)
    avg_def = sum(r["def"] for r in rows) / len(rows)
    print(f"Mean offense score: {avg_off:.2f}  |  Mean defense score: {avg_def:.2f}\n")

    print_table(f"STRONGEST OFFENSE (top {TOP_N}, ties included)",
                rank_with_ties(rows, "off", TOP_N, reverse=True))
    print_table(f"WEAKEST OFFENSE (bottom {TOP_N}, ties included)",
                rank_with_ties(rows, "off", TOP_N, reverse=False))
    print_table(f"STRONGEST DEFENSE (top {TOP_N}, ties included)",
                rank_with_ties(rows, "def", TOP_N, reverse=True))
    print_table(f"WEAKEST DEFENSE (bottom {TOP_N}, ties included)",
                rank_with_ties(rows, "def", TOP_N, reverse=False))
    print_table(f"STRONGEST COMBINED off+def (top {TOP_N}, ties included)",
                rank_with_ties(rows, "total", TOP_N, reverse=True))
    print_table(f"WEAKEST COMBINED off+def (bottom {TOP_N}, ties included)",
                rank_with_ties(rows, "total", TOP_N, reverse=False))


if __name__ == "__main__":
    main()
