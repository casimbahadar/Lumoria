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

Postgame-type filter (user spec 2026-05-24): combos containing any postgame
type (Aether, Crystal, Primal, Chrono, Stellar) are excluded from the
flagship-eligible tables, because every postgame combo lands at most 2
Forgotten Lumori standalones (max 2 entries; well under the ordinary
2-families-+-1-standalone = 3-entries cap, so flagship status is moot).

Reads TYPE_CHART from js/data.js. Re-run after chart changes.
"""
import re
from itertools import combinations
from pathlib import Path

CHART_FILE = Path(__file__).resolve().parent.parent / "js" / "data.js"
TOP_N = 20
IMMUNITY_DEF_WEIGHT = 8.0
POSTGAME_TYPES = {"Aether", "Crystal", "Primal", "Chrono", "Stellar"}


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


def offense_counts(combo, chart, types):
    """Per-defender-type matchup counts when this combo is the attacker.
    Best STAB applies for dual: max(mult_A, mult_B). Returns counts of
    SE (>1), Neutral (==1), Resisted (<1, >0), Immune (==0)."""
    se = ne = res = imm = 0
    for d in types:
        mults = [chart[c].get(d, 1) for c in combo]
        mult = max(mults) if len(combo) > 1 else mults[0]
        if mult == 0:
            imm += 1
        elif mult < 1:
            res += 1
        elif mult == 1:
            ne += 1
        else:
            se += 1
    return {"se": se, "ne": ne, "res": res, "imm": imm}


def defense_counts(combo, chart, types):
    """Per-attacker-type matchup counts when this combo is the defender.
    Dual stacks multiplicatively: mult_A × mult_B. Returns counts of
    Weak (>1), Neutral (==1), Resisted (<1, >0), Immune (==0)."""
    wk = ne = res = imm = 0
    for x in types:
        incoming = 1.0
        for d in combo:
            incoming *= chart[x].get(d, 1)
        if incoming == 0:
            imm += 1
        elif incoming < 1:
            res += 1
        elif incoming == 1:
            ne += 1
        else:
            wk += 1
    return {"wk": wk, "ne": ne, "res": res, "imm": imm}


def fmt(combo):
    return "/".join(combo) if len(combo) > 1 else combo[0] + " (mono)"


def is_flagship_eligible(combo):
    """A combo is flagship-eligible only if none of its types are postgame-restricted."""
    return not any(t in POSTGAME_TYPES for t in combo)


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
    # Columns: # | Combo | Off SE/Res/Imm | Def Wk/Res/Imm | Off-Score | Def-Score
    # Scores retained as the ranking key; counts surfaced as the readable signal.
    print("=" * 96)
    print(title)
    print("=" * 96)
    print(f"{'#':>3}  {'Combo':28}  "
          f"{'O-SE':>5} {'O-Res':>5} {'O-Imm':>5}  "
          f"{'D-Wk':>5} {'D-Res':>5} {'D-Imm':>5}  "
          f"{'OffSc':>6} {'DefSc':>6}")
    print("-" * 96)
    for i, r in enumerate(rows, 1):
        oc = r["off_counts"]
        dc = r["def_counts"]
        print(f"{i:>3}  {fmt(r['combo']):28}  "
              f"{oc['se']:>5} {oc['res']:>5} {oc['imm']:>5}  "
              f"{dc['wk']:>5} {dc['res']:>5} {dc['imm']:>5}  "
              f"{r['off']:>6.2f} {r['def']:>6.2f}")
    print()


def main():
    chart = parse_chart()
    types = sorted(chart.keys())
    print(f"Loaded {len(types)} types from {CHART_FILE}")
    print(f"Types: {', '.join(types)}\n")
    print(f"Postgame-restricted (excluded from flagship-eligible tables): {', '.join(sorted(POSTGAME_TYPES))}\n")

    combos = [(t,) for t in types] + [tuple(sorted(c)) for c in combinations(types, 2)]
    print(f"Total combos analyzed: {len(combos)} ({len(types)} mono + {len(combos) - len(types)} dual)")

    rows = []
    for c in combos:
        off = offense_score(c, chart, types)
        defn = defense_score(c, chart, types)
        rows.append({
            "combo": c, "off": off, "def": defn, "total": off + defn,
            "off_counts": offense_counts(c, chart, types),
            "def_counts": defense_counts(c, chart, types),
        })

    flagship_rows = [r for r in rows if is_flagship_eligible(r["combo"])]
    print(f"Flagship-eligible combos (no postgame types): {len(flagship_rows)}\n")

    avg_off = sum(r["off"] for r in flagship_rows) / len(flagship_rows)
    avg_def = sum(r["def"] for r in flagship_rows) / len(flagship_rows)
    print(f"Mean offense score (eligible): {avg_off:.2f}  |  Mean defense score (eligible): {avg_def:.2f}\n")

    print_table(f"FLAGSHIP-ELIGIBLE — STRONGEST OFFENSE (top {TOP_N}, ties included)",
                rank_with_ties(flagship_rows, "off", TOP_N, reverse=True))
    print_table(f"FLAGSHIP-ELIGIBLE — WEAKEST OFFENSE (bottom {TOP_N}, ties included)",
                rank_with_ties(flagship_rows, "off", TOP_N, reverse=False))
    print_table(f"FLAGSHIP-ELIGIBLE — STRONGEST DEFENSE (top {TOP_N}, ties included)",
                rank_with_ties(flagship_rows, "def", TOP_N, reverse=True))
    print_table(f"FLAGSHIP-ELIGIBLE — WEAKEST DEFENSE (bottom {TOP_N}, ties included)",
                rank_with_ties(flagship_rows, "def", TOP_N, reverse=False))
    print_table(f"FLAGSHIP-ELIGIBLE — STRONGEST COMBINED off+def (top {TOP_N}, ties included)",
                rank_with_ties(flagship_rows, "total", TOP_N, reverse=True))
    print_table(f"FLAGSHIP-ELIGIBLE — WEAKEST COMBINED off+def (bottom {TOP_N}, ties included)",
                rank_with_ties(flagship_rows, "total", TOP_N, reverse=False))


if __name__ == "__main__":
    main()
