#!/usr/bin/env python3
"""Outline a product name in Bricolage Grotesque 700 and store it for the logo generator.

    python3 scripts/set-wordmark.py "Kept"          # updates brand/src/wordmark.json + brand/brand.json
    python3 scripts/set-wordmark.py "Kept" --out /tmp/wm.json   # write elsewhere (no changes to the repo)

Then run `node scripts/sync-brand.mjs` to regenerate every logo file.
Needs: pip install fonttools brotli
"""
import json, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
FONT = os.path.join(ROOT, "preview/fonts/bricolage-grotesque.woff2")
SIZE, TRACK = 44, -0.018  # px, em

def outline(text):
    f = instancer.instantiateVariableFont(TTFont(FONT), {"wght": 700, "opsz": 40})
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    missing = [c for c in text if ord(c) not in cmap]
    if missing:
        sys.exit(f"The font has no glyph for: {''.join(missing)}")
    sc, x, d = SIZE / upm, 0.0, ""
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs, ntos=lambda v: ("%.2f" % v).rstrip("0").rstrip("."))
        gs[g].draw(TransformPen(pen, (sc, 0, 0, -sc, x, 0)))
        d += pen.getCommands()
        x += gs[g].width * sc + TRACK * SIZE
    asc = max((lambda b: b.bounds[3] if b.bounds else 0)(_b(gs, cmap, c)) for c in text) / upm
    return d, round(x - TRACK * SIZE, 1), round(asc, 3)

def _b(gs, cmap, ch):
    bp = BoundsPen(gs); gs[cmap[ord(ch)]].draw(bp); return bp

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    name = args[0]
    word = name.lower()  # the wordmark is set in lowercase
    d, w, asc = outline(word)
    data = {"font": f"Bricolage Grotesque 700, opsz 40, tracking {TRACK}em, outlined at size {SIZE}",
            "text": word, "size": SIZE, "width": w, "d": d}
    out = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else os.path.join(ROOT, "brand/src/wordmark.json")
    json.dump(data, open(out, "w"))
    if "--out" not in sys.argv:
        json.dump({"name": name}, open(os.path.join(ROOT, "brand/brand.json"), "w"), indent=2)
        open(os.path.join(ROOT, "brand/brand.json"), "a").write("\n")
    print(f"{name}: wordmark {w}px wide, tallest letter {asc}em -> {out}")
