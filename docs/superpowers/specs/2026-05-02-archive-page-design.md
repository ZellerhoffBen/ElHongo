# Archive Page — Design Spec

**Date:** 2026-05-02
**Page:** `/archive`
**Artist handle:** EL HONGO

## 1. Concept

The archive is a single-page, tab-switching view of nine projects. A persistent chip bar at the top lets the visitor jump between projects; the stage below it **mutates per project** — background color, layout grid, typography, caption tone all change. Each project lives in its own visual world but shares the same skeleton.

The brutality comes from contrast: cathedral whitespace next to scratchboard black, fragile italic next to bulged Impact, two pictures next to twenty-four. Cuts between projects are instant, with a brief black flash — like a film reel splice.

## 2. Page anatomy

```
┌──────────────────────────────────────────────────────┐
│ [SiteHeader — existing, mix-blend-multiply overlay]  │  global, untouched
├──────────────────────────────────────────────────────┤
│ EL HONGO ─────────────────── ARCHIVE                 │  archive header strip
├──────────────────────────────────────────────────────┤
│ SINE_2000 · Chinese · TROMMEL · FAT GUY · …          │  chip bar (sticky)
├──────────────────────────────────────────────────────┤
│                                                      │
│              S T A G E   (per-project)               │  swaps on chip click
│                                                      │
└──────────────────────────────────────────────────────┘
```

- **Site header** — the existing `SiteHeader` overlay stays as-is.
- **Archive header strip** — wordmark `EL HONGO` left, label `ARCHIVE` right. Styrene A. Black on white. Bottom border 1px solid black.
- **Chip bar** — sticky to top below the archive strip. Each chip is a project name in its own typeface (see §4). 1px black border. Active chip inverts (black bg, white text).
- **Stage** — fills the rest of the viewport. Renders a per-project layout component.

## 3. Default landing state

When a visitor arrives at `/archive` with no project hash in the URL, the stage shows a landing screen:
- `EL HONGO` rendered very large (Styrene A Black, ~200px) — same wordmark as the strip but blown up.
- Subtitle `9 PROJECTS · PICK ONE` in small letter-spaced Styrene A.
- White background. The chip bar above is the only call to action.

Selecting any chip swaps the stage to that project. Clicking the small `EL HONGO` in the archive strip returns to the landing state (clears the hash).

## 4. Per-project treatments

Nine projects, each with a defined treatment. Listed in chip-bar order.

### 4.1 SINE 2000 (8 works, scratchboard B&W cityscapes)
- **Chip font**: monospace (e.g. JetBrains Mono / system mono), label `SINE_2000`
- **Stage background**: pitch black (`#000`)
- **Layout**: uniform 2-column grid. Every panel the same size — these are comic pages and must read at full fidelity. No hero, no asymmetry. (Per user direction.)
- **Caption**: monospace, `// SCRATCHBOARD · BERLIN, 2000 · 8 WORKS`, color `#888`, top of stage.
- **Click**: image opens lightbox.

### 4.2 CHINESE (2 works, sparse line drawings of two old men)
- **Chip font**: Times New Roman italic, label `Chinese`
- **Stage background**: cream / off-white (`#f4efe6`)
- **Layout**: two large images side-by-side, generous gutters. Centered horizontally.
- **Caption**: italic serif, very small, bottom-center: `pen on paper · 2 works`
- **Click**: lightbox.

### 4.3 TROMMEL (3 works, photographs of painted drums on black)
- **Chip font**: Impact / Anton, label `TROMMEL`
- **Stage background**: pitch black (`#000`)
- **Layout**: three photographs centered, each in their own row, generous vertical breathing. Each image sits inside a soft radial-gradient halo (white at 4% center → transparent at edges, ~600px radius) — looks spotlit on the black.
- **Caption**: heavy white sans, `TROMMEL · ACRYLIC ON DRUM HEAD · 3 PIECES`, top.
- **Click**: lightbox.

### 4.4 FAT GUY (2 works, grotesque cartoon, yellow on green/black)
- **Chip font**: Arial Black expanded, label `FAT GUY`
- **Stage background**: dark forest green (`#0e2a1c`) — pulled from the actual artwork
- **Layout**: two large images side by side, full-height. No padding around them.
- **Caption**: very large, top-left, white, Arial Black, `FAT GUY · FRONT / BACK`. Tight tracking. The label feels like a wrestling belt.
- **Click**: lightbox.

### 4.5 PORTRAIT (2 works, delicate stippled portraits)
- **Chip font**: Times New Roman 300, label `portrait` (lowercase)
- **Stage background**: pure white
- **Layout**: vast empty space. Two images, small (max 220px wide), placed off-center as if hung in a museum. Lots of margin. The brutality is the contrast — coming from a black-bleed project into this is a cathedral.
- **Caption**: italic serif, very small, set at the bottom: `stippled ink on paper · untitled, untitled.`
- **Click**: lightbox.

### 4.6 BOMB (4 works, 'TIK TIK' bomb-comic strip)
- **Chip font**: Impact, label `BOMB!` (with exclamation)
- **Stage background**: aged newsprint (`#f0e7d4`) with a paper-grain SVG noise overlay at ~6% opacity, `mix-blend-multiply`.
- **Layout**: comic-strip stack — 4 panels stacked vertically with hard 4px black borders between them, full width up to a max-width of 720px, centered.
- **Caption**: Impact, slanted slightly, bottom-right: `BOMB! · 4 PANELS · TIK TIK TIK…`
- **Click**: lightbox.

### 4.7 WIMMELBILDER (7 works, dense colorful crowd scenes)
- **Chip font**: Times New Roman, label `Wimmelbilder`
- **Stage background**: mustard yellow (`#f3d77e`) — pulled from artwork
- **Layout**: full-bleed horizontal strips; 2 strips visible at a time, each with 3-4 images side by side, cropped flush. No padding, no gutters. User scrolls down to see remaining strips.
- **Caption**: black bar at the very bottom of each strip section, white serif: `WIMMELBILDER · INK + DIGITAL · 7 WORKS`
- **Click**: lightbox.

### 4.8 LOGOS (2 works, clean commercial logos)
- **Chip font**: Styrene A bold (the only project that reverts to the site default font, deliberately) — label `LOGOS`
- **Stage background**: pure white, generous padding
- **Layout**: brand-book style. Each logo on its own white plate with metadata listed beside it (client, year). Quiet, formal.
- **Caption**: small Styrene A, top: `COMMERCIAL WORK · 2 IDENTITIES`
- **Purpose**: the deliberate quiet/clean note in the otherwise brutal sequence — proves the artist also does formal commercial work.
- **Click**: lightbox.

### 4.9 MISC (24 works, varied cartoon characters / sketches)
- **Chip font**: Times New Roman italic, label `misc.`
- **Stage background**: a slightly off-white linen / paper texture
- **Layout**: pin-board / collage. All 24 images placed at varying sizes (between 120px and 320px wide), rotated by small random angles (±4°), overlapping slightly, scattered across a tall canvas. Looks like a studio wall. Random but seeded — same arrangement every visit.
- **Caption**: handwritten-style serif, italic, scattered at bottom: `misc. — 24 things, in no particular order.`
- **Click**: lightbox; in lightbox, images can be navigated forward/back.

## 5. Transitions

Switching projects:
1. Current stage fades to black over 60ms.
2. Black holds for ~80ms (the cut).
3. New stage appears instantly (no fade-in).

Total ~140ms. Feels like a film splice. The chip bar and header do not animate — only the stage swaps.

## 6. Routing & state

- URL hash drives selection: `/archive` = landing; `/archive#sine2000` = sine project active.
- Hash changes do not trigger a Next.js page reload. State is owned by the client component.
- The chip click handler updates the hash via `history.pushState`; a `hashchange` listener updates the active project.
- Browser back/forward navigates between previously-viewed projects.

## 7. Lightbox

A shared overlay component:
- Triggered by clicking any image in any project layout.
- Black backdrop at 95% opacity.
- Shows the image at max-viewport size. Closes on outside-click, `Esc`, or click on a small × in the corner.
- Left/right arrow keys (and on-screen arrows) navigate within the current project's image set.
- Reuses the same component across all 9 projects.

## 8. Architecture (file layout)

```
app/archive/
  page.tsx                     // server component, renders ArchiveClient
  ArchiveClient.tsx            // client root: header strip + chip bar + stage
components/archive/
  ChipBar.tsx                  // renders chips, handles selection
  Stage.tsx                    // dispatches to the active project layout
  Lightbox.tsx                 // shared image overlay
  ArchiveHeaderStrip.tsx       // EL HONGO + ARCHIVE label
  Landing.tsx                  // big EL HONGO + "9 projects · pick one"
  layouts/
    SineLayout.tsx
    ChineseLayout.tsx
    TrommelLayout.tsx
    FatGuyLayout.tsx
    PortraitLayout.tsx
    BombLayout.tsx
    WimmelLayout.tsx
    LogosLayout.tsx
    MiscLayout.tsx
lib/
  archiveProjects.ts           // single source of truth: project list + metadata
  useProjectHash.ts            // hash <-> active project state
public/art/                    // moved from /art
  sine2000/, chinese/, …       // PNGs as-is
```

### `lib/archiveProjects.ts` shape

```ts
type ArchiveProject = {
  id: string;            // 'sine2000', 'chinese', ...
  label: string;         // chip label, exact casing
  chipFontClass: string; // Tailwind / CSS class for chip styling
  images: string[];      // paths under /art/<id>/
  caption: string;
  layoutComponent: keyof LayoutMap; // e.g. 'sine'
}
export const archiveProjects: ArchiveProject[] = [ … 9 entries … ];
```

### Why one component per project layout

Each project has a meaningfully different visual structure (different grids, backgrounds, type rules). A single configurable layout would either be massively conditional or restrictive. Independent components keep each layout simple to read, easy to tune, and easy to throw away if the artist wants to redesign one project later.

## 9. Typography assets

- **Styrene A**: already loaded via `@font-face` in `app/globals.css`. Continues as the site/UI font.
- **Times New Roman, Impact, Arial Black, system monospace**: use system fallbacks (no extra loading). They're available cross-platform and contribute to the "found type" / brutalist feel — using web-safe ugly fonts is itself part of the aesthetic.
- No new web fonts. Keeps the page fast and the font palette deliberate.

## 10. Image handling

- All images move from `/art` → `/public/art` (one-time move, kept in git).
- All images use `next/image` with `sizes` calibrated per layout.
- Original PNGs are large (some folders ~40MB+). Next.js auto-generates optimized variants on request — no manual resizing needed.
- Lightbox uses the original full-resolution image (priority load on click).

## 11. Mobile

Desktop-first. On mobile (< 720px):
- Chip bar becomes a horizontally scrollable strip (overflow-x: auto).
- Per-project layouts collapse to single-column where they're multi-column.
- Specific simplifications:
  - Wimmelbilder: full-width single column instead of strips.
  - Misc: collage rotation reduced (±2°), images scaled down.
  - Sine, fatguy, chinese: single-column.
- Black-cut transition still applies.

## 12. Out of scope

- No filtering / search / sorting — chip bar is the only navigation.
- No per-image titles or year metadata in v1 (only project-level captions). Easy to add later via the `archiveProjects` registry.
- No animations beyond the cut transition. No parallax, scroll effects, hover effects beyond the chip's invert state.
- No CMS — project list is hardcoded in `archiveProjects.ts`.

## 13. Testing

Unit tests (Vitest, no jsdom) for:
- `useProjectHash` — hash parsing, default-to-landing, invalid id falls back to landing.
- `archiveProjects` — id uniqueness, every project has at least one image path that exists in `/public/art/`.

Visual / manual verification:
- Each of the 9 layouts renders without overflow at 1440×900 and 375×667.
- Chip switching with hash updates browser URL.
- Lightbox open/close + keyboard nav works in each project.
- Cut transition visible on chip switch.
