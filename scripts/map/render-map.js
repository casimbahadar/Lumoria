// Render a high-res screenshot of the world map.
//
//   node scripts/map/render-map.js [ngplus|base] [outfile.png] [badges]
//
// Examples:
//   node scripts/map/render-map.js ngplus /tmp/map_ngplus.png
//   node scripts/map/render-map.js base   /tmp/map_base.png
//   node scripts/map/render-map.js base   /tmp/map_b1.png   1     # base map at 1 badge
//
// Prereq: serve the repo root, e.g.  python3 -m http.server 8123

const { launchMap } = require("./lib");

(async () => {
  const mode = (process.argv[2] || "ngplus").toLowerCase();
  const out = process.argv[3] || `/tmp/lumoria_map_${mode}.png`;
  const badges = process.argv[4] != null ? Number(process.argv[4]) : undefined;

  const { browser, page } = await launchMap({ mode, badges });
  await page.locator("#world-map").screenshot({ path: out });
  await browser.close();
  console.log(`Rendered ${mode} map -> ${out}`);
})();
