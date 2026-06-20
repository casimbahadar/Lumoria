// Detect map name-label collisions by reading the actual rendered bounding boxes from
// the DOM (the reliable way — eyeballing the map misses sub-pixel touches). Reports:
//   1. label <-> label overlaps (two names covering each other)
//   2. label <-> marker overlaps (a name sitting on a *different* area's icon)
//
//   node scripts/map/check-overlaps.js [ngplus|base]
//
// Exit code is non-zero if any overlap is found, so it can gate a label change.
// To fix an overlap, pin the offending area to a clear side in LABEL_POS (js/game.js).
//
// Prereq: serve the repo root, e.g.  python3 -m http.server 8123

const { launchMap } = require("./lib");

(async () => {
  const mode = (process.argv[2] || "ngplus").toLowerCase();
  const { browser, page } = await launchMap({ mode });

  const data = await page.evaluate(() => {
    const map = document.getElementById("world-map").getBoundingClientRect();
    const pct = (l, t) => [Math.round((l - map.left) / map.width * 100), Math.round((t - map.top) / map.height * 100)];
    const labels = [...document.querySelectorAll(".map-loc-label")].map((el) => {
      const r = el.getBoundingClientRect();
      return { text: el.textContent.trim(), x: r.left, y: r.top, r: r.right, b: r.bottom,
        cx: (r.left + r.right) / 2, cy: (r.top + r.bottom) / 2 };
    });
    const marks = [...document.querySelectorAll(".map-location")].map((el) => {
      const r = el.getBoundingClientRect();
      const [px, py] = pct((r.left + r.right) / 2, (r.top + r.bottom) / 2);
      return { x: r.left, y: r.top, r: r.right, b: r.bottom, px, py };
    });
    return { labels, marks };
  });
  await browser.close();

  const ov = (a, c) => !(a.r <= c.x || c.r <= a.x || a.b <= c.y || c.b <= a.y);

  const llHits = [];
  for (let i = 0; i < data.labels.length; i++)
    for (let j = i + 1; j < data.labels.length; j++)
      if (ov(data.labels[i], data.labels[j])) llHits.push([data.labels[i].text, data.labels[j].text]);

  const lmHits = [];
  for (const l of data.labels)
    for (const m of data.marks) {
      if (!ov(l, m)) continue;
      const ownMarker = l.cx > m.x && l.cx < m.r && l.cy > m.y && l.cy < m.b; // label centred on its own icon
      if (!ownMarker) lmHits.push(`${JSON.stringify(l.text)} over marker at map(${m.px},${m.py})`);
    }

  console.log(`[${mode}] ${data.labels.length} labels`);
  console.log(`label<->label overlaps: ${llHits.length}`);
  llHits.forEach((h) => console.log("  " + JSON.stringify(h[0]) + " <-> " + JSON.stringify(h[1])));
  console.log(`label<->marker overlaps: ${lmHits.length}`);
  lmHits.forEach((h) => console.log("  " + h));

  process.exit(llHits.length + lmHits.length > 0 ? 1 : 0);
})();
