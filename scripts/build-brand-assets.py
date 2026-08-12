#!/usr/bin/env python3
"""Generates the launch assets the site was missing: icons and social images.

Everything is drawn in Styrene A on the site's own paper/ink pair, so a link
preview or a browser tab reads as the same object as the page it points at.
Social images are composed per project from the archive records exported by
`scripts/export-project-manifest.mjs` — one image per route, not one for the
whole site.

Run:  npm run build:brand
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
APP = ROOT / "app"
OG_DIR = PUBLIC / "og"
ICON_DIR = PUBLIC / "icons"

PAPER = (247, 246, 241, 255)
INK = (10, 10, 10, 255)
ACCENT = (240, 200, 30, 255)
WHITE = (255, 255, 255, 255)

BOLD = ROOT / "assets/fonts/StyreneA-Bold.otf"
REGULAR = ROOT / "assets/fonts/StyreneA-Regular.otf"

OG_SIZE = (1200, 630)
ICON_SIZES = [16, 32, 48, 64, 128, 180, 192, 512]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def tracked_width(text: str, face: ImageFont.FreeTypeFont, tracking: float) -> float:
    """Width of `text` once per-character tracking is applied."""
    if not text:
        return 0.0
    return sum(face.getlength(char) for char in text) + tracking * (len(text) - 1)


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    face: ImageFont.FreeTypeFont,
    fill,
    tracking: float = 0.0,
    anchor: str = "ls",
) -> None:
    """PIL has no letter-spacing, and the type system here is built on it."""
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=face, fill=fill, anchor=anchor)
        x += face.getlength(char) + tracking


def fit_font(
    text: str, path: Path, box_width: int, start: int, tracking_em: float, minimum: int = 18
) -> ImageFont.FreeTypeFont:
    """Largest size at which the tracked string still fits the column."""
    size = start
    while size > minimum:
        face = font(path, size)
        if tracked_width(text, face, tracking_em * size) <= box_width:
            return face
        size -= 2
    return font(path, minimum)


def contain(image: Image.Image, box: tuple[int, int]) -> Image.Image:
    fitted = image.copy()
    fitted.thumbnail(box, Image.LANCZOS)
    return fitted


# --------------------------------------------------------------------------- #
# Icons
# --------------------------------------------------------------------------- #


def render_icon(size: int) -> Image.Image:
    """Paper `EH` on an ink ground.

    The wordmark itself is unreadable at 16px, so the icon carries its initials
    at the one weight the site uses for display type. No rounded corners and no
    gradient: the site has neither.
    """
    scale = 8
    canvas = Image.new("RGBA", (size * scale, size * scale), INK)
    draw = ImageDraw.Draw(canvas)
    edge = size * scale

    face = fit_font("EH", BOLD, int(edge * 0.74), int(edge * 0.62), -0.06)
    tracking = -0.06 * face.size
    width = tracked_width("EH", face, tracking)
    ascent, descent = face.getmetrics()
    cap = ascent - descent * 0.2

    draw_tracked(
        draw,
        ((edge - width) / 2, edge / 2 + cap / 2 - descent * 0.35),
        "EH",
        face,
        PAPER,
        tracking,
    )

    return canvas.resize((size, size), Image.LANCZOS)


def build_icons() -> None:
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    icons = {size: render_icon(size) for size in ICON_SIZES}

    for size in (192, 512):
        icons[size].save(ICON_DIR / f"icon-{size}.png")

    icons[180].save(APP / "apple-icon.png")
    icons[512].resize((512, 512), Image.LANCZOS).save(APP / "icon.png")

    # Multi-resolution ICO so the tab, the bookmark bar and the desktop
    # shortcut each pick a size that was drawn for them.
    icons[64].save(
        APP / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    print(f"icons        app/favicon.ico, app/icon.png, app/apple-icon.png, {ICON_DIR}/")


# --------------------------------------------------------------------------- #
# Social images
# --------------------------------------------------------------------------- #


def render_og(
    *, kicker: str, title: str, meta: str, artwork: Path | None, art_ground=WHITE
) -> Image.Image:
    """The split hero, redrawn at 1200x630.

    Type column left, work right, one hairline between them — the same
    composition the homepage opens with, so a shared link looks like the site.
    """
    canvas = Image.new("RGBA", OG_SIZE, PAPER)
    draw = ImageDraw.Draw(canvas)

    split = 660
    pad = 56
    column = split - pad * 2

    if artwork and artwork.exists():
        panel = Image.new("RGBA", (OG_SIZE[0] - split, OG_SIZE[1]), art_ground)
        art = contain(
            Image.open(artwork).convert("RGBA"),
            (OG_SIZE[0] - split - 72, OG_SIZE[1] - 72),
        )
        panel.alpha_composite(
            art,
            (
                (panel.width - art.width) // 2,
                (panel.height - art.height) // 2,
            ),
        )
        canvas.alpha_composite(panel, (split, 0))
        draw.line([(split, 0), (split, OG_SIZE[1])], fill=INK, width=3)

    kicker_face = font(BOLD, 20)
    draw_tracked(draw, (pad, pad + 20), kicker.upper(), kicker_face, INK, 0.14 * 20)
    draw.line([(pad, pad + 44), (split - pad, pad + 44)], fill=INK, width=2)

    # Title block, wrapped by words and shrunk until the longest line fits.
    words = title.upper().split()
    size = 116
    while size > 34:
        face = font(BOLD, size)
        tracking = -0.055 * size
        lines: list[str] = []
        current = ""
        for word in words:
            candidate = f"{current} {word}".strip()
            if tracked_width(candidate, face, tracking) <= column or not current:
                current = candidate
            else:
                lines.append(current)
                current = word
        if current:
            lines.append(current)

        line_height = size * 0.82
        if (
            all(tracked_width(line, face, tracking) <= column for line in lines)
            and len(lines) * line_height <= 300
        ):
            break
        size -= 6

    baseline = OG_SIZE[1] - pad - 74 - (len(lines) - 1) * line_height
    for line in lines:
        draw_tracked(draw, (pad, baseline), line, face, INK, tracking)
        baseline += line_height

    draw.rectangle(
        [pad, OG_SIZE[1] - pad - 46, pad + 34, OG_SIZE[1] - pad - 42], fill=ACCENT
    )
    meta_face = font(BOLD, 19)
    draw_tracked(
        draw, (pad, OG_SIZE[1] - pad - 12), meta.upper(), meta_face, INK, 0.14 * 19
    )

    draw.rectangle([0, 0, OG_SIZE[0] - 1, OG_SIZE[1] - 1], outline=INK, width=6)
    return canvas


def build_social(manifest: dict) -> None:
    if OG_DIR.exists():
        shutil.rmtree(OG_DIR)
    OG_DIR.mkdir(parents=True, exist_ok=True)

    site = manifest["site"]

    # The hero derivatives are content-addressed, so the fallback PNG is found
    # by shape rather than by a name that changes every rebuild.
    hero = next(iter(sorted((PUBLIC / "hero").glob("artwork-1280.*.png"))), None)

    default = render_og(
        kicker=f"{site['alias']} / Portfolio",
        title=site["artistName"],
        meta=f"{site['occupation']} · Illustration · Zeichnung",
        artwork=hero,
    )
    default.convert("RGB").save(OG_DIR / "default.png", optimize=True)

    for project in manifest["projects"]:
        meta = " · ".join(
            part
            for part in (
                project["kind"],
                project["year"],
                f"{project['imageCount']} Blätter",
            )
            if part
        )
        image = render_og(
            kicker=f"{site['alias']} / Archiv {project['number']}",
            title=project["title"],
            meta=meta,
            artwork=PUBLIC / project["cover"].lstrip("/"),
        )
        image.convert("RGB").save(OG_DIR / f"{project['slug']}.png", optimize=True)

    total = sum(path.stat().st_size for path in OG_DIR.glob("*.png"))
    print(
        f"social       {len(list(OG_DIR.glob('*.png')))} images in {OG_DIR}/ "
        f"({total / 1024:.0f} KiB)"
    )


def main() -> None:
    for path in (BOLD, REGULAR):
        if not path.exists():
            sys.exit(f"Missing font: {path}")

    manifest = json.loads(
        subprocess.run(
            [
                "node",
                "--no-warnings",
                "--import",
                "./scripts/register-ts-resolve.mjs",
                "scripts/export-project-manifest.mjs",
            ],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        ).stdout
    )

    build_icons()
    build_social(manifest)


if __name__ == "__main__":
    main()
