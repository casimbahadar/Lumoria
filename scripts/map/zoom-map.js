// Render a zoomed-in crop of the world map, given a region in map-percent coordinates
// (0-100 on both axes, matching WORLD_DATA mapPos). Handy for QA-ing a specific cluster.
//
//   node scripts/map/zoom-map.js <x> <y> <w> <h> [ngplus|base] [outfile.png]
//
// Example — zoom the Stellaris / Abyssal Trench corridor on the NG+ map:
//   node scripts/map/zoom-map.js 56 46 30 32 ngplus /tmp/zoom.png
//
// Prereq: serve the repo root, e.g.  python3 -m http.server 8123

const { launchMap, mapBox } = require("./lib");

(async () => {
  const [x, y, w, h] = process.argv.slice(2, 6).map(Number);
  const mode = (process.argv[6] || "ngplus").toLowerCase();
  const out = process.argv[7] || "/tmp/map_zoom.png";
  if ([x, y, w, h].some((n) => Number.isNaN(n))) {
    console.error("usage: node scripts/map/zoom-map.js <x> <y> <w> <h> [ngplus|base] [out.png]  (coords in 0-100 map %)");
    process.exit(1);
  }

  const { browser, page } = await launchMap({ mode });
  const box = await mapBox(page);
  await page.screenshot({ path: out, clip: {
    x: box.x + box.width * (x / 100), y: box.y + box.height * (y / 100),
    width: box.width * (w / 100), height: box.height * (h / 100),
  } });
  await browser.close();
  console.log(`Zoom (${x},${y} ${w}x${h}) of ${mode} map -> ${out}`);
})();
