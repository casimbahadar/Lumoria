// Shared harness for the world-map dev tools in this folder.
//
// Launches headless Chromium (via Playwright), loads the game's index.html from a
// locally-served copy of the repo, puts the game into a chosen state, and renders the
// world map. Returns { browser, page } so callers can screenshot or read the DOM.
//
// Environment overrides (defaults match the managed remote execution environment this
// was built in; adjust if your paths differ):
//   MAP_BASE_URL   - where the repo is served (default http://127.0.0.1:8123)
//   PW_MODULE      - path to the Playwright module (default /opt/node22/lib/node_modules/playwright)
//   CHROME_PATH    - path to the Chromium binary (default /opt/pw-browsers/chromium-1194/chrome-linux/chrome)
//
// You must serve the repo root first, e.g.:  python3 -m http.server 8123

const PW_MODULE = process.env.PW_MODULE || "/opt/node22/lib/node_modules/playwright";
const CHROME_PATH = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE_URL = process.env.MAP_BASE_URL || "http://127.0.0.1:8123";

let chromium;
try { ({ chromium } = require(PW_MODULE)); }
catch { ({ chromium } = require("playwright")); }  // fall back to a locally-installed playwright

// mode: "ngplus" (post-game, fully lit) or "base" (first playthrough, NG+/champion areas hidden).
// badges: how many badges the player holds (controls road lighting). Defaults light everything.
async function launchMap({ mode = "ngplus", badges, scale = 4, location = "seedvale" } = {}) {
  const ng = mode === "ngplus";
  const badgeCount = badges != null ? badges : (ng ? 25 : 20);

  const browser = await chromium.launch({ executablePath: CHROME_PATH, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 }, deviceScaleFactor: scale });
  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
  await page.goto(BASE_URL + "/index.html", { waitUntil: "load" });
  await page.waitForFunction(() => typeof renderWorldMap === "function");
  await page.evaluate(({ ng, badgeCount, location }) => {
    G = newGameState("T", 7);
    G.badges = Array.from({ length: badgeCount }, (_, i) => "b" + i);
    G.championDefeated = ng;
    G.ngPlusCount = ng ? 1 : 0;
    G.defeatedLeaders = ng ? ["umbra_shade"] : [];
    G.location = location;
    showScreen("screen-main");
    renderWorldMap();
  }, { ng, badgeCount, location });
  await page.waitForTimeout(600);
  return { browser, page };
}

// Bounding box of the #world-map element (for clipped/zoomed screenshots).
async function mapBox(page) {
  return page.locator("#world-map").boundingBox();
}

module.exports = { launchMap, mapBox, BASE_URL };
