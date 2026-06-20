// Verify every map area is reachable from the start town, so a connection edit never
// strands an area. Runs the BFS *inside the page* using the game's own connsOf() helper,
// so it honours the live NG+-only edge overrides (NG_PLUS_ADD_EDGES / NG_PLUS_HIDE_EDGES
// in js/game.js) without duplicating them here.
//
//   node scripts/map/check-reachability.js          # checks both base and ngplus
//   node scripts/map/check-reachability.js ngplus   # one mode only
//
// Exit code is non-zero if anything is unreachable.
//
// Prereq: serve the repo root, e.g.  python3 -m http.server 8123

const { launchMap } = require("./lib");

async function check(mode) {
  const { browser, page } = await launchMap({ mode });
  const res = await page.evaluate(() => {
    const start = "seedvale";
    const has = (id) => WORLD_DATA[id] && WORLD_DATA[id].mapPos;
    const adj = {};
    for (const id in WORLD_DATA) {
      if (!has(id)) continue;
      (adj[id] = adj[id] || new Set());
      for (const c of connsOf(id)) { if (!has(c)) continue; adj[id].add(c); (adj[c] = adj[c] || new Set()).add(id); }
    }
    const seen = new Set([start]); const q = [start];
    while (q.length) { const x = q.shift(); for (const n of (adj[x] || [])) if (!seen.has(n)) { seen.add(n); q.push(n); } }
    const all = Object.keys(adj);
    return { total: all.length, reached: seen.size, unreached: all.filter((id) => !seen.has(id)) };
  });
  await browser.close();
  const ok = res.unreached.length === 0;
  console.log(`[${mode}] ${res.reached}/${res.total} reachable` +
    (ok ? "  OK" : `  UNREACHABLE: ${res.unreached.join(", ")}`));
  return ok;
}

(async () => {
  const modes = process.argv[2] ? [process.argv[2].toLowerCase()] : ["base", "ngplus"];
  let ok = true;
  for (const m of modes) ok = (await check(m)) && ok;
  process.exit(ok ? 0 : 1);
})();
