#!/usr/bin/env python3
"""Renders review sheets of every plate in `public/art/`.

Why this exists: several plates are screen captures of a social carousel rather
than exports of the drawing, with the pagination dots — and on some, the
next/previous chevron — baked into the pixels. `sine2000-01.png` carries eight
dots at native resolution around y=1540, plus a chevron disc on the right edge.
At column width these read as specks. The enlarged viewer shows them for what
they are.

Automated detection was tried and abandoned: the dots are small, low-contrast
and sit on drawings that contain plenty of dotted passages of their own, so a
threshold strict enough to avoid false alarms missed confirmed captures. This
puts the plates in front of a person instead, which is the only judgement that
has been reliable.

Two sheets are written to `test-results/artwork/`:
  bands.png   the bottom 12% of every plate, where the dot strip sits
  edges.png   the left and right middles, where the chevrons sit

Run:  npm run check:artwork
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "public/art"
OUT_DIR = ROOT / "test-results/artwork"

CELL_WIDTH = 460
LABEL_HEIGHT = 15
COLUMNS = 2


def sheet(files: list[Path], crop, cell_height: int, target: Path) -> None:
    rows = (len(files) + COLUMNS - 1) // COLUMNS
    canvas = Image.new(
        "RGB",
        (COLUMNS * CELL_WIDTH, rows * (cell_height + LABEL_HEIGHT)),
        (232, 232, 232),
    )
    draw = ImageDraw.Draw(canvas)

    for index, path in enumerate(files):
        image = Image.open(path).convert("RGB")
        tile = crop(image).resize((CELL_WIDTH, cell_height), Image.LANCZOS)
        x = (index % COLUMNS) * CELL_WIDTH
        y = (index // COLUMNS) * (cell_height + LABEL_HEIGHT)
        canvas.paste(tile, (x, y + LABEL_HEIGHT))
        draw.text((x + 4, y + 2), f"{path.parent.name}/{path.stem}", fill=(0, 0, 0))

    target.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(target)
    print(f"{target.relative_to(ROOT)}  ({len(files)} plates)")


def bottom_band(image: Image.Image) -> Image.Image:
    width, height = image.size
    return image.crop((int(width * 0.25), int(height * 0.88), int(width * 0.75), height))


def side_edges(image: Image.Image) -> Image.Image:
    """Left and right middles, stitched, where a carousel puts its chevrons."""
    width, height = image.size
    top, bottom = int(height * 0.38), int(height * 0.62)
    strip_width = int(width * 0.12)

    left = image.crop((0, top, strip_width, bottom))
    right = image.crop((width - strip_width, top, width, bottom))
    joined = Image.new("RGB", (left.width + right.width + 6, left.height), (232, 0, 0))
    joined.paste(left, (0, 0))
    joined.paste(right, (left.width + 6, 0))
    return joined


def main() -> None:
    files = sorted(ART_DIR.rglob("*.png"))
    if not files:
        raise SystemExit(f"No plates found under {ART_DIR}")

    sheet(files, bottom_band, 62, OUT_DIR / "bands.png")
    sheet(files, side_edges, 110, OUT_DIR / "edges.png")
    print(
        "\nReview both sheets. Any plate showing a row of evenly spaced dots, or a\n"
        "translucent chevron disc, needs re-exporting from the original —\n"
        "retouching someone's artwork is the artist's call, not the build's."
    )


if __name__ == "__main__":
    main()
