#!/usr/bin/env node
// Regenerates the logo set from theme/tokens.css and checks contrast.
//   node scripts/sync-brand.mjs            # SVGs + contrast report (+ PNGs if playwright is installed)
//   node scripts/sync-brand.mjs --strict   # exit 1 if any text pair is below WCAG AA
// No dependencies. PNG export is skipped (with a note) unless `playwright` can be imported.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "theme/tokens.css"), "utf8");
const wm = JSON.parse(readFileSync(join(root, "brand/src/wordmark.json"), "utf8"));

// ---- tokens --------------------------------------------------------------
const tok = {};
for (const m of css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) tok[m[1]] ??= m[2].toLowerCase();
const need = ["ground-950", "ground-900", "ground-850", "ground-750", "ground-700", "chalk-100", "chalk-300", "chalk-500", "accent", "accent-deep", "accent-ink", "positive", "caution", "danger"];
const missing = need.filter((k) => !tok[k]);
if (missing.length) { console.error("tokens.css is missing hex values for: " + missing.join(", ")); process.exit(2); }

const INK = tok["ground-950"], TILE = tok["ground-900"], LINE = tok["ground-700"];
const CHALK = tok["chalk-100"], ACCENT = tok.accent, ACCENT_DEEP = tok["accent-deep"];

// ---- logo geometry -------------------------------------------------------
// Four counted strokes and a fifth struck across. A mask knocks the bars out around the diagonal.
const f = (n) => +n.toFixed(2);
function markBody(bar, strike, id, sw = 5.4, knock = 11.2) {
  const bars = [17, 26, 35, 44].map((x) => `<line x1="${x}" y1="14.5" x2="${x}" y2="49.5"/>`).join("");
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
    <rect width="64" height="64" fill="#fff"/>
    <line x1="8.5" y1="44.5" x2="55.5" y2="21.5" stroke="#000" stroke-width="${knock}" stroke-linecap="round"/>
  </mask>
  <g mask="url(#${id})" stroke="${bar}" stroke-width="${sw}" stroke-linecap="round">${bars}</g>
  <line x1="8.5" y1="44.5" x2="55.5" y2="21.5" stroke="${strike}" stroke-width="${sw}" stroke-linecap="round"/>`;
}
const svg64 = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Tally">\n  ${body}\n</svg>\n`;

function favicon() {
  const bars = [16.5, 26, 35.5, 45].map((x) => `<line x1="${x}" y1="13" x2="${x}" y2="51"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${TILE}"/>
  <mask id="kf" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64"><rect width="64" height="64" fill="#fff"/>
    <line x1="9" y1="46" x2="55" y2="20" stroke="#000" stroke-width="13.5" stroke-linecap="round"/></mask>
  <g mask="url(#kf)" stroke="${CHALK}" stroke-width="7.2" stroke-linecap="round">${bars}</g>
  <line x1="9" y1="46" x2="55" y2="20" stroke="${ACCENT}" stroke-width="7.2" stroke-linecap="round"/>
</svg>\n`;
}

function lockup(bar, strike, wordFill, id) {
  const size = wm.size, stem = 5.0, h = 0.708 * size * 1.2, pitch = 8.7, over = 4.6, B = h + 3;
  const x0 = 3 + over + stem / 2;
  const xs = [0, 1, 2, 3].map((i) => x0 + i * pitch);
  const y1 = B - h + stem / 2, y2 = B - stem / 2;
  const xa = xs[0] - over, xb = xs[3] + over;
  const ya = y2 - 0.14 * (y2 - y1), yb = ya - 0.6 * (y2 - y1);
  const knock = stem * 2.05;
  const markW = xb + stem / 2 + 3, tx = markW + 9;
  const W = tx + wm.width + 2, H = B + 0.22 * size + 2;
  const bars = xs.map((x) => `<line x1="${f(x)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y2)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(W)} ${f(H)}" role="img" aria-label="Tally">
  <mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${f(markW)}" height="${f(H)}"><rect width="${f(markW)}" height="${f(H)}" fill="#fff"/>
    <line x1="${f(xa)}" y1="${f(ya)}" x2="${f(xb)}" y2="${f(yb)}" stroke="#000" stroke-width="${f(knock)}" stroke-linecap="round"/></mask>
  <g mask="url(#${id})" stroke="${bar}" stroke-width="${stem}" stroke-linecap="round">${bars}</g>
  <line x1="${f(xa)}" y1="${f(ya)}" x2="${f(xb)}" y2="${f(yb)}" stroke="${strike}" stroke-width="${stem}" stroke-linecap="round"/>
  <path transform="translate(${f(tx)},${f(B)})" d="${wm.d}" fill="${wordFill}"/>
</svg>\n`;
}

const out = {
  "tally-mark.svg": svg64(markBody(CHALK, ACCENT, "k1")),
  "tally-mark-on-light.svg": svg64(markBody(INK, ACCENT_DEEP, "k2")),
  "tally-mark-on-accent.svg": svg64(markBody(INK, CHALK, "k3")),
  "tally-icon.svg": svg64(`<rect width="64" height="64" rx="15" fill="${TILE}"/>
  <rect x=".5" y=".5" width="63" height="63" rx="14.5" fill="none" stroke="${LINE}"/>
  ${markBody(CHALK, ACCENT, "k4")}`),
  "tally-icon-square.svg": svg64(`<rect width="64" height="64" fill="${TILE}"/>\n  ${markBody(CHALK, ACCENT, "k5")}`),
  "favicon.svg": favicon(),
  "tally-logo.svg": lockup(CHALK, ACCENT, CHALK, "k6"),
  "tally-logo-on-light.svg": lockup(INK, ACCENT_DEEP, INK, "k7"),
  "tally-wordmark.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${f(-wm.size * 0.78)} ${f(wm.width)} ${f(wm.size * 1.08)}" role="img" aria-label="Tally"><path d="${wm.d}" fill="${CHALK}"/></svg>\n`,
};
mkdirSync(join(root, "brand"), { recursive: true });
for (const [name, body] of Object.entries(out)) writeFileSync(join(root, "brand", name), body);
console.log(`wrote ${Object.keys(out).length} SVGs to brand/`);

// ---- contrast report -----------------------------------------------------
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const surfaces = ["ground-950", "ground-900", "ground-850", "ground-750"];
const texts = ["chalk-100", "chalk-300", "chalk-500", "accent", "positive", "caution", "danger"];
console.log("\ncontrast (WCAG AA text = 4.5)\n" + "".padEnd(12) + surfaces.map((s) => s.padStart(11)).join(""));
let bad = 0;
for (const t of texts) {
  let row = t.padEnd(12);
  for (const s of surfaces) {
    const r = ratio(tok[t], tok[s]);
    // ground-750 is only used for menus, where tertiary text never appears
    const exempt = s === "ground-750" && t === "chalk-500";
    const flag = r < 4.5 && !exempt ? "!" : " ";
    if (flag === "!") bad++;
    row += (r.toFixed(1) + flag).padStart(11);
  }
  console.log(row);
}
const ink = ratio(tok["accent-ink"], tok.accent);
console.log(`\nbutton text on brand (accent-ink on accent): ${ink.toFixed(1)}${ink < 4.5 ? " !" : ""}`);
if (ink < 4.5) bad++;
console.log(bad ? `\n${bad} pair(s) below 4.5:1 (marked !). Adjust lightness in theme/tokens.css.` : "\nAll text pairs pass AA.");

// ---- PNG exports (optional) ----------------------------------------------
try {
  const { chromium } = createRequire(import.meta.url)("playwright");
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  mkdirSync(join(root, "brand/png"), { recursive: true });
  const jobs = [["tally-icon.svg", "icon-512.png", 512, true], ["tally-icon.svg", "icon-192.png", 192, true], ["tally-icon-square.svg", "apple-touch-icon.png", 180, false], ["favicon.svg", "favicon-32.png", 32, true], ["favicon.svg", "favicon-16.png", 16, true]];
  for (const [src, name, size, transparent] of jobs) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${out[src]}`);
    await page.screenshot({ path: join(root, "brand/png", name), omitBackground: transparent });
    await page.close();
  }
  await browser.close();
  console.log(`wrote ${jobs.length} PNGs to brand/png/`);
} catch (e) {
  console.log("\nPNG export skipped (needs `playwright` + a Chromium; set CHROMIUM_PATH if needed). SVGs are up to date.");
}
if (process.argv.includes("--strict") && bad) process.exit(1);
