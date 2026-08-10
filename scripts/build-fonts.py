#!/usr/bin/env python3
"""Subsets Styrene A to the glyphs the site uses and writes WOFF2.

The OTFs shipped as-is were 277 KB of render-ready desktop font for a site that
writes German with a handful of arrows and typographic marks. Subsetting to that
coverage and compressing with Brotli is the same typeface at a fraction of the
transfer.

Licensing note: this converts and subsets a commercial typeface for webfont
delivery. Confirm the Styrene A licence covers webfont use before shipping —
the OTFs were already being served publicly, but that is not the same as
permission.

Run:  npm run build:fonts
Needs: pip install fonttools brotli
"""
from __future__ import annotations

import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / "public/fonts"
SOURCE_DIR = ROOT / "assets/fonts"

FACES = [
    ("StyreneA-Regular.otf", "StyreneA-Regular.woff2"),
    ("StyreneA-Bold.otf", "StyreneA-Bold.woff2"),
]

# German plus the marks the interface actually sets: arrows for navigation and
# links, the middot used as a metadata separator, the multiplication sign the
# dialog closes with, and the arrow the skip link and rails point with.
UNICODES = ",".join(
    [
        "U+0000-00FF",  # Latin-1: German umlauts, ß, the guillemets
        "U+0100-017F",  # Latin Extended-A, for names that need it
        "U+2010-2027",  # dashes, quotes, ellipsis, dagger
        "U+2030-205E",  # per mille, primes, bullet operator
        "U+20AC",  # €
        "U+2190-2199",  # ← ↑ → ↓ ↗ ↘
        "U+2212",  # −
        "U+00D7",  # ×
        "U+FEFF",
    ]
)


def build() -> None:
    if not SOURCE_DIR.exists():
        sys.exit(f"Missing font masters: {SOURCE_DIR}")

    FONT_DIR.mkdir(parents=True, exist_ok=True)

    for source_name, target_name in FACES:
        source = SOURCE_DIR / source_name
        target = FONT_DIR / target_name
        if not source.exists():
            sys.exit(f"Missing font master: {source}")

        font = TTFont(str(source))
        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = ["kern", "liga", "clig", "calt", "ccmp", "locl"]
        options.name_IDs = ["*"]
        options.notdef_outline = True
        options.recalc_bounds = True
        options.drop_tables += ["DSIG"]

        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
        subsetter.subset(font)
        font.flavor = "woff2"
        font.save(str(target))
        font.close()

        before = source.stat().st_size
        after = target.stat().st_size
        print(
            f"{target_name:<26} {before / 1024:7.1f} KiB otf  →  "
            f"{after / 1024:6.1f} KiB woff2  ({100 - after / before * 100:.0f}% smaller)"
        )


if __name__ == "__main__":
    build()
