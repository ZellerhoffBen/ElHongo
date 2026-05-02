# Archive Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/archive`: a single-page, tab-switching gallery of nine art projects, each rendered in its own visually-distinct layout, switched via a sticky chip bar with a film-splice cut transition.

**Architecture:** A client-rendered page at `app/archive/page.tsx` mounts an `ArchiveClient` that owns hash-based active-project state, dispatches to one of nine per-project layout components, and shares a chip bar and lightbox. Project metadata lives in a single registry `lib/archiveProjects.ts`. Each layout is its own component for independence and clarity.

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript · Tailwind · `next/image` · Vitest (pure logic only). No new dependencies.

**Notes:**
- The project is not currently a git repo — Task 0 initializes it. Skip if you already have version control sorted.
- Per-task commits are listed in case you want them; not strictly required for the build to work.
- Spec reference: [`docs/superpowers/specs/2026-05-02-archive-page-design.md`](../specs/2026-05-02-archive-page-design.md)
- Two corrections vs spec (decided after re-reading existing code):
  1. **Drop** the "archive header strip" — global SiteHeader already shows `EL HONGO` + nav.
  2. **Modify** SiteHeader: `mix-blend-difference` + white text so it stays legible over dark stages.

---

## File Structure

**Created:**
- `app/archive/ArchiveClient.tsx` — client root, owns hash + lightbox state, mounts ChipBar + Stage + Lightbox
- `components/archive/ChipBar.tsx` — sticky chip row, one chip per project
- `components/archive/Stage.tsx` — switch-statements over project id → renders correct Layout
- `components/archive/Landing.tsx` — default empty-state screen
- `components/archive/Lightbox.tsx` — full-screen image overlay, keyboard nav
- `components/archive/CutOverlay.tsx` — black overlay used during project transitions
- `components/archive/layouts/SineLayout.tsx`
- `components/archive/layouts/ChineseLayout.tsx`
- `components/archive/layouts/TrommelLayout.tsx`
- `components/archive/layouts/FatGuyLayout.tsx`
- `components/archive/layouts/PortraitLayout.tsx`
- `components/archive/layouts/BombLayout.tsx`
- `components/archive/layouts/WimmelLayout.tsx`
- `components/archive/layouts/LogosLayout.tsx`
- `components/archive/layouts/MiscLayout.tsx`
- `lib/archiveProjects.ts` — typed registry of all 9 projects
- `lib/useProjectHash.ts` — hook: reads/writes location.hash, returns active project id
- `lib/useProjectHash.test.ts`
- `lib/archiveProjects.test.ts`

**Modified:**
- `app/archive/page.tsx` — replace empty stub with `<ArchiveClient />` mount
- `components/SiteHeader.tsx` — switch blend mode + text color
- Move `/art/` → `/public/art/` (filesystem move, no code change to the images)

---

## Task 0: Initialize git (if needed)

**Files:** none (filesystem only)

- [ ] **Step 1: Check current state**

Run: `cd /Users/ben/Desktop/eye_website && git rev-parse --git-dir 2>&1 || echo "NO_GIT"`

If output ends with `NO_GIT`, continue to Step 2. If it prints a path, skip to Task 1.

- [ ] **Step 2: Initialize repo and commit current state**

```bash
cd /Users/ben/Desktop/eye_website
git init
git add -A
git commit -m "chore: initial snapshot of eye-follower site"
```

Expected: clean working tree, one initial commit.

---

## Task 1: Move art assets into public

The images currently live in `/art/<project>/*.png` outside the public dir, so Next.js can't serve them. Move them under `/public/art/`.

**Files:** filesystem move only.

- [ ] **Step 1: Move the directory**

Run: `cd /Users/ben/Desktop/eye_website && mv art public/art`

- [ ] **Step 2: Verify**

Run: `ls public/art/`
Expected output (alphabetical):
```
bombcomic  chinese  fatguy  logos  misc  portrait  sine2000  trommel  wimmelbilder
```

- [ ] **Step 3: Smoke-check one image is reachable**

Run: `npm run dev` (in a separate terminal). Open `http://localhost:3000/art/sine2000/sine2000-01.png` in a browser. You should see the scratchboard cityscape image.

Stop the dev server when verified.

- [ ] **Step 4: Commit**

```bash
git add public/art
git commit -m "feat: move art assets into public/art for Next.js serving"
```

---

## Task 2: Make SiteHeader legible over dark backgrounds

The existing header uses `mix-blend-multiply` with `text-zinc-950`, which becomes invisible on black stages. Switch to `mix-blend-difference` with white text — auto-inverts against any background.

**Files:**
- Modify: `components/SiteHeader.tsx`

- [ ] **Step 1: Edit the header**

Open `components/SiteHeader.tsx` and replace the `<header>` opening tag classes. Old:

```tsx
<header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-5 text-[11px] font-bold leading-none tracking-[0.18em] text-zinc-950 mix-blend-multiply sm:px-7 sm:py-6 sm:text-xs">
```

New:

```tsx
<header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-5 text-[11px] font-bold leading-none tracking-[0.18em] text-white mix-blend-difference sm:px-7 sm:py-6 sm:text-xs">
```

(Two changes only: `text-zinc-950` → `text-white`, `mix-blend-multiply` → `mix-blend-difference`.)

- [ ] **Step 2: Verify on home page**

Run: `npm run dev`. Open `http://localhost:3000`. The header should still render as black-on-white text (mix-blend-difference of white onto white gives black). Eye-follower drawing unchanged.

- [ ] **Step 3: Run the test suite**

Run: `npm test`
Expected: all existing tests pass.

- [ ] **Step 4: Commit**

```bash
git add components/SiteHeader.tsx
git commit -m "feat(header): use mix-blend-difference so header reads on dark backgrounds"
```

---

## Task 3: Project registry — types and data

Single source of truth for the 9 projects. Used by ChipBar, Stage, and individual layouts.

**Files:**
- Create: `lib/archiveProjects.ts`
- Create: `lib/archiveProjects.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/archiveProjects.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { archiveProjects } from "./archiveProjects";

describe("archiveProjects", () => {
  test("contains exactly 9 projects in the spec'd order", () => {
    const ids = archiveProjects.map((p) => p.id);
    expect(ids).toEqual([
      "sine2000",
      "chinese",
      "trommel",
      "fatguy",
      "portrait",
      "bomb",
      "wimmelbilder",
      "logos",
      "misc",
    ]);
  });

  test("project ids are unique", () => {
    const ids = archiveProjects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every image path resolves to a real file under public/", () => {
    const publicDir = join(process.cwd(), "public");
    for (const project of archiveProjects) {
      expect(project.images.length).toBeGreaterThan(0);
      for (const img of project.images) {
        const path = join(publicDir, img.replace(/^\//, ""));
        expect(existsSync(path), `missing: ${img}`).toBe(true);
      }
    }
  });

  test("every project has a non-empty label and caption", () => {
    for (const p of archiveProjects) {
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.caption.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- archiveProjects`
Expected: FAIL — `Cannot find module './archiveProjects'`.

- [ ] **Step 3: Implement the registry**

Create `lib/archiveProjects.ts`:

```ts
export type LayoutId =
  | "sine"
  | "chinese"
  | "trommel"
  | "fatguy"
  | "portrait"
  | "bomb"
  | "wimmel"
  | "logos"
  | "misc";

export type ArchiveProject = {
  id: string;
  label: string;
  layout: LayoutId;
  /** Tailwind / inline classes applied to this project's chip in the chip bar. */
  chipClassName: string;
  /** Image paths relative to the site root, e.g. /art/sine2000/sine2000-01.png */
  images: string[];
  caption: string;
};

const range = (prefix: string, n: number, ext = "png"): string[] =>
  Array.from({ length: n }, (_, i) =>
    `${prefix}-${String(i + 1).padStart(2, "0")}.${ext}`,
  );

export const archiveProjects: ArchiveProject[] = [
  {
    id: "sine2000",
    label: "SINE_2000",
    layout: "sine",
    chipClassName: "font-mono tracking-tight",
    images: range("sine2000", 8).map((f) => `/art/sine2000/${f}`),
    caption: "// SCRATCHBOARD · BERLIN, 2000 · 8 WORKS",
  },
  {
    id: "chinese",
    label: "Chinese",
    layout: "chinese",
    chipClassName: "font-serif italic",
    images: range("chineseguys", 2).map((f) => `/art/chinese/${f}`),
    caption: "pen on paper · 2 works",
  },
  {
    id: "trommel",
    label: "TROMMEL",
    layout: "trommel",
    chipClassName: "font-['Impact','Anton',sans-serif] tracking-normal",
    images: range("trommel", 3).map((f) => `/art/trommel/${f}`),
    caption: "TROMMEL · ACRYLIC ON DRUM HEAD · 3 PIECES",
  },
  {
    id: "fatguy",
    label: "FAT GUY",
    layout: "fatguy",
    chipClassName: "font-['Arial_Black',sans-serif] tracking-tight",
    images: range("fatguyfrontback", 2).map((f) => `/art/fatguy/${f}`),
    caption: "FAT GUY · FRONT / BACK",
  },
  {
    id: "portrait",
    label: "portrait",
    layout: "portrait",
    chipClassName: "font-serif font-light italic tracking-wide normal-case",
    images: range("portrait", 2).map((f) => `/art/portrait/${f}`),
    caption: "stippled ink on paper · untitled, untitled.",
  },
  {
    id: "bomb",
    label: "BOMB!",
    layout: "bomb",
    chipClassName: "font-['Impact','Anton',sans-serif] tracking-normal",
    images: range("comicbh", 4).map((f) => `/art/bombcomic/${f}`),
    caption: "BOMB! · 4 PANELS · TIK TIK TIK…",
  },
  {
    id: "wimmelbilder",
    label: "Wimmelbilder",
    layout: "wimmel",
    chipClassName: "font-serif normal-case",
    images: range("wimmelbilder", 7).map((f) => `/art/wimmelbilder/${f}`),
    caption: "WIMMELBILDER · INK + DIGITAL · 7 WORKS",
  },
  {
    id: "logos",
    label: "LOGOS",
    layout: "logos",
    chipClassName: "font-bold tracking-[0.18em]",
    images: range("logos", 2).map((f) => `/art/logos/${f}`),
    caption: "COMMERCIAL WORK · 2 IDENTITIES",
  },
  {
    id: "misc",
    label: "misc.",
    layout: "misc",
    chipClassName: "font-serif italic normal-case",
    images: range("misc", 24).map((f) => `/art/misc/${f}`),
    caption: "misc. — 24 things, in no particular order.",
  },
];

export const findProject = (id: string | null | undefined): ArchiveProject | null =>
  archiveProjects.find((p) => p.id === id) ?? null;
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- archiveProjects`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/archiveProjects.ts lib/archiveProjects.test.ts
git commit -m "feat(archive): add project registry with 9 entries and tests"
```

---

## Task 4: `useProjectHash` hook

Reads `window.location.hash`, normalizes it to a project id, listens for hashchange events, and exposes a setter that updates the URL via `pushState`.

**Files:**
- Create: `lib/useProjectHash.ts`
- Create: `lib/useProjectHash.test.ts`

- [ ] **Step 1: Write the failing test for the pure parser**

Create `lib/useProjectHash.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { parseProjectHash } from "./useProjectHash";

describe("parseProjectHash", () => {
  test("returns null for empty hash", () => {
    expect(parseProjectHash("")).toBeNull();
    expect(parseProjectHash("#")).toBeNull();
  });

  test("strips the leading # and returns the id", () => {
    expect(parseProjectHash("#sine2000")).toBe("sine2000");
    expect(parseProjectHash("#misc")).toBe("misc");
  });

  test("ignores unknown ids and returns null", () => {
    expect(parseProjectHash("#nope")).toBeNull();
    expect(parseProjectHash("#about")).toBeNull();
  });

  test("is case sensitive (project ids are lowercase)", () => {
    expect(parseProjectHash("#SINE2000")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- useProjectHash`
Expected: FAIL — `Cannot find module './useProjectHash'`.

- [ ] **Step 3: Implement the hook**

Create `lib/useProjectHash.ts`:

```ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { archiveProjects } from "./archiveProjects";

const validIds = new Set(archiveProjects.map((p) => p.id));

export function parseProjectHash(hash: string): string | null {
  if (!hash || hash === "#") return null;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  return validIds.has(id) ? id : null;
}

export function useProjectHash(): {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
} {
  const [activeId, setActiveIdState] = useState<string | null>(null);

  // Initial read + subscribe to hashchange
  useEffect(() => {
    const sync = () => setActiveIdState(parseProjectHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const setActiveId = useCallback((id: string | null) => {
    const nextHash = id ? `#${id}` : "";
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    if (nextUrl !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.pushState(null, "", nextUrl);
    }
    setActiveIdState(id);
  }, []);

  return { activeId, setActiveId };
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- useProjectHash`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/useProjectHash.ts lib/useProjectHash.test.ts
git commit -m "feat(archive): add useProjectHash with hash parsing and tests"
```

---

## Task 5: Lightbox component

Full-screen image overlay. Receives an array of image paths and an active index. Closes on Esc / outside click / × button. Left/right arrow keys (and on-screen arrows) navigate within the set.

**Files:**
- Create: `components/archive/Lightbox.tsx`

- [ ] **Step 1: Implement the component**

Create `components/archive/Lightbox.tsx`:

```tsx
"use client";

import { useEffect, useCallback } from "react";

type LightboxProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
};

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const next = useCallback(
    () => onIndexChange((index + 1) % images.length),
    [images.length, index, onIndexChange],
  );
  const prev = useCallback(
    () => onIndexChange((index - 1 + images.length) % images.length),
    [images.length, index, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, prev]);

  if (index < 0 || index >= images.length) return null;
  const src = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute right-5 top-5 text-3xl leading-none text-white/80 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-3xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            ›
          </button>
        </>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="max-h-[90vh] max-w-[92vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="pointer-events-none absolute bottom-5 left-0 right-0 text-center text-[11px] tracking-[0.18em] text-white/60">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
```

(We use a plain `<img>` rather than `next/image` here to avoid layout-shift issues with arbitrary aspect ratios at full-bleed display.)

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/archive/Lightbox.tsx
git commit -m "feat(archive): add Lightbox overlay component"
```

---

## Task 6: ChipBar component

Sticky row of project chips. Each chip shows the project label in its own per-project font class. Active chip inverts.

**Files:**
- Create: `components/archive/ChipBar.tsx`

- [ ] **Step 1: Implement**

Create `components/archive/ChipBar.tsx`:

```tsx
"use client";

import { archiveProjects } from "@/lib/archiveProjects";

type ChipBarProps = {
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function ChipBar({ activeId, onSelect }: ChipBarProps) {
  return (
    <nav
      aria-label="Archive projects"
      className="sticky top-12 z-10 flex flex-wrap gap-1.5 border-b border-black bg-white px-4 py-3 sm:top-16 sm:px-6"
    >
      {archiveProjects.map((p) => {
        const isActive = p.id === activeId;
        return (
          <button
            type="button"
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={[
              "border border-black px-2.5 py-1 text-[11px] uppercase tracking-[0.05em] transition-colors",
              isActive ? "bg-black text-white" : "bg-white text-black hover:bg-black/5",
              p.chipClassName,
            ].join(" ")}
            aria-pressed={isActive}
          >
            {p.label}
          </button>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/archive/ChipBar.tsx
git commit -m "feat(archive): add ChipBar with per-project chip typography"
```

---

## Task 7: Landing component

The default state shown when no project is selected.

**Files:**
- Create: `components/archive/Landing.tsx`

- [ ] **Step 1: Implement**

Create `components/archive/Landing.tsx`:

```tsx
export function Landing() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white">
      <p className="text-[11px] tracking-[0.4em] text-black/50">
        9 PROJECTS · PICK ONE
      </p>
    </div>
  );
}
```

(Quiet on purpose — SiteHeader already shows the EL HONGO wordmark, so the landing screen does not duplicate it.)

- [ ] **Step 2: Commit**

```bash
git add components/archive/Landing.tsx
git commit -m "feat(archive): add Landing default-state component"
```

---

## Task 8: CutOverlay component

A black overlay used during the project transition. Receives a `visible` prop. Pure presentational.

**Files:**
- Create: `components/archive/CutOverlay.tsx`

- [ ] **Step 1: Implement**

Create `components/archive/CutOverlay.tsx`:

```tsx
type CutOverlayProps = { visible: boolean };

export function CutOverlay({ visible }: CutOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-[5] bg-black transition-opacity",
        visible ? "opacity-100 duration-[60ms]" : "opacity-0 duration-[60ms]",
      ].join(" ")}
    />
  );
}
```

(Renders inside a `relative`-positioned stage container — see Task 10. That keeps the SiteHeader and the chip bar visible above the cut without juggling fixed positioning.)

- [ ] **Step 2: Commit**

```bash
git add components/archive/CutOverlay.tsx
git commit -m "feat(archive): add CutOverlay for film-splice transitions"
```

---

## Task 9: Stage dispatcher (with placeholder layouts)

Stage receives a project id, finds it in the registry, and renders the matching layout component. We start with a single placeholder rendering for all 9 layouts so the page works end-to-end before we build out each one.

**Files:**
- Create: `components/archive/Stage.tsx`

- [ ] **Step 1: Implement**

Create `components/archive/Stage.tsx`:

```tsx
"use client";

import { findProject, type ArchiveProject } from "@/lib/archiveProjects";

type StageProps = {
  projectId: string;
  onImageClick: (project: ArchiveProject, index: number) => void;
};

function PlaceholderLayout({ project }: { project: ArchiveProject }) {
  return (
    <div className="bg-white p-8">
      <p className="mb-4 font-mono text-xs tracking-[0.18em] text-black/60">
        {project.caption}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {project.images.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" className="aspect-square w-full object-cover" />
        ))}
      </div>
    </div>
  );
}

export function Stage({ projectId, onImageClick }: StageProps) {
  const project = findProject(projectId);
  if (!project) return null;
  void onImageClick;
  return <PlaceholderLayout project={project} />;
}
```

(`onImageClick` is plumbed through and will be wired up per layout in Tasks 11-19. The placeholder ignores it.)

- [ ] **Step 2: Commit**

```bash
git add components/archive/Stage.tsx
git commit -m "feat(archive): add Stage dispatcher with placeholder layout"
```

---

## Task 10: ArchiveClient + page mount

Wire everything together end-to-end. After this task the page works (with placeholder layouts) at `http://localhost:3000/archive`.

**Files:**
- Create: `app/archive/ArchiveClient.tsx`
- Modify: `app/archive/page.tsx`

- [ ] **Step 1: Create the client root**

Create `app/archive/ArchiveClient.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ChipBar } from "@/components/archive/ChipBar";
import { Stage } from "@/components/archive/Stage";
import { Landing } from "@/components/archive/Landing";
import { Lightbox } from "@/components/archive/Lightbox";
import { CutOverlay } from "@/components/archive/CutOverlay";
import { useProjectHash } from "@/lib/useProjectHash";
import { findProject, type ArchiveProject } from "@/lib/archiveProjects";

const CUT_HOLD_MS = 80;
const CUT_FADE_MS = 60;

export default function ArchiveClient() {
  const { activeId, setActiveId } = useProjectHash();
  const [displayedId, setDisplayedId] = useState<string | null>(activeId);
  const [cutting, setCutting] = useState(false);

  // Lightbox state — null when closed
  const [lightboxState, setLightboxState] = useState<{
    project: ArchiveProject;
    index: number;
  } | null>(null);

  const cutTimers = useRef<number[]>([]);

  // Drive the cut transition whenever activeId changes from displayedId
  useEffect(() => {
    if (activeId === displayedId) return;
    setCutting(true);
    const t1 = window.setTimeout(() => {
      setDisplayedId(activeId);
    }, CUT_FADE_MS);
    const t2 = window.setTimeout(() => {
      setCutting(false);
    }, CUT_FADE_MS + CUT_HOLD_MS);
    cutTimers.current.push(t1, t2);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [activeId, displayedId]);

  // Sync displayedId for the very first hash read
  useEffect(() => {
    if (displayedId === null && activeId !== null) {
      setDisplayedId(activeId);
    }
  }, [activeId, displayedId]);

  return (
    <main className="min-h-screen bg-white pt-12 sm:pt-16">
      <ChipBar activeId={activeId} onSelect={setActiveId} />
      <div className="relative">
        {displayedId && findProject(displayedId) ? (
          <Stage
            projectId={displayedId}
            onImageClick={(project, index) => setLightboxState({ project, index })}
          />
        ) : (
          <Landing />
        )}
        <CutOverlay visible={cutting} />
      </div>
      {lightboxState && (
        <Lightbox
          images={lightboxState.project.images}
          index={lightboxState.index}
          onClose={() => setLightboxState(null)}
          onIndexChange={(i) =>
            setLightboxState((s) => (s ? { ...s, index: i } : s))
          }
        />
      )}
    </main>
  );
}
```

z-index map (so the corrections above make sense at a glance):
- `Lightbox` — z-40 (top of everything)
- `SiteHeader` — z-20 (existing, fixed at top)
- `ChipBar` — z-10 (sticky just below header)
- `CutOverlay` — z-[5] inside the stage's `relative` container (sits over Stage but below ChipBar/SiteHeader)
- `Stage` — default z (under the cut overlay when active)
```

- [ ] **Step 2: Mount it from the route**

Replace `app/archive/page.tsx` entirely:

```tsx
import ArchiveClient from "./ArchiveClient";

export default function ArchivePage() {
  return <ArchiveClient />;
}
```

- [ ] **Step 3: Run dev server and verify end-to-end**

Run: `npm run dev`
Open `http://localhost:3000/archive` — landing screen ("9 PROJECTS · PICK ONE") visible.
Click any chip — placeholder grid for that project renders. Black flash visible during the swap. URL updates to `/archive#<id>`.
Reload the page with hash in URL — same project still loads.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/archive/ArchiveClient.tsx app/archive/page.tsx
git commit -m "feat(archive): wire ArchiveClient end-to-end with cut transition"
```

---

## Task 11: SineLayout — black bleed, equal-size 2-col grid, mono caption

Per the spec: every panel the same size — these are comic pages.

**Files:**
- Create: `components/archive/layouts/SineLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/SineLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function SineLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <p className="mb-6 font-mono text-[11px] tracking-[0.05em] text-white/55">
          {project.caption}
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {project.images.map((src, i) => (
            <button
              type="button"
              key={src}
              onClick={() => onImageClick(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden border border-zinc-800 bg-black"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-opacity group-hover:opacity-90"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire it into Stage**

Replace the contents of `components/archive/Stage.tsx`:

```tsx
"use client";

import { findProject, type ArchiveProject } from "@/lib/archiveProjects";
import { SineLayout } from "./layouts/SineLayout";

type StageProps = {
  projectId: string;
  onImageClick: (project: ArchiveProject, index: number) => void;
};

function PlaceholderLayout({
  project,
  onImageClick,
}: {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
}) {
  return (
    <div className="bg-white p-8">
      <p className="mb-4 font-mono text-xs tracking-[0.18em] text-black/60">
        {project.caption}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {project.images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className="aspect-square w-full cursor-pointer object-cover"
            onClick={() => onImageClick(i)}
          />
        ))}
      </div>
    </div>
  );
}

export function Stage({ projectId, onImageClick }: StageProps) {
  const project = findProject(projectId);
  if (!project) return null;
  const handle = (i: number) => onImageClick(project, i);

  switch (project.layout) {
    case "sine":
      return <SineLayout project={project} onImageClick={handle} />;
    default:
      return <PlaceholderLayout project={project} onImageClick={handle} />;
  }
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`. Open `http://localhost:3000/archive#sine2000`. Black bleed, 2-column grid with equal-size panels, mono caption at top. Clicking any panel opens lightbox. Esc closes.

- [ ] **Step 4: Commit**

```bash
git add components/archive/layouts/SineLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): SineLayout — black-bleed equal-panel grid"
```

---

## Task 12: ChineseLayout — cream background, two side-by-side, italic serif caption

**Files:**
- Create: `components/archive/layouts/ChineseLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/ChineseLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function ChineseLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-[#f4efe6] py-16">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-8 md:grid-cols-2 md:gap-16">
        {project.images.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => onImageClick(i)}
            className="block w-full"
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </button>
        ))}
      </div>
      <p className="mt-12 text-center font-serif text-[11px] italic text-black/55">
        {project.caption}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Stage**

In `components/archive/Stage.tsx`, add the import:

```tsx
import { ChineseLayout } from "./layouts/ChineseLayout";
```

And add the case (just above `default:`):

```tsx
case "chinese":
  return <ChineseLayout project={project} onImageClick={handle} />;
```

- [ ] **Step 3: Verify**

Run: `npm run dev`. `http://localhost:3000/archive#chinese`. Cream background, two large drawings side-by-side, italic serif caption underneath.

- [ ] **Step 4: Commit**

```bash
git add components/archive/layouts/ChineseLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): ChineseLayout — cream background, side-by-side serif"
```

---

## Task 13: TrommelLayout — black, three centered photos with spotlight halo

**Files:**
- Create: `components/archive/layouts/TrommelLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/TrommelLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function TrommelLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-[900px] px-6 pb-24 pt-12">
        <p className="mb-12 text-center font-['Impact','Anton',sans-serif] text-sm tracking-[0.18em] text-white">
          {project.caption}
        </p>
        <div className="flex flex-col items-center gap-20">
          {project.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onImageClick(i)}
              className="relative block w-full max-w-[640px]"
            >
              {/* spotlight halo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -m-32"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)",
                }}
              />
              <div className="relative aspect-square w-full">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Stage**

Add import + case:

```tsx
import { TrommelLayout } from "./layouts/TrommelLayout";
// ...
case "trommel":
  return <TrommelLayout project={project} onImageClick={handle} />;
```

- [ ] **Step 3: Verify**

`http://localhost:3000/archive#trommel`. Pitch black, drum photos stacked vertically, soft halo behind each.

- [ ] **Step 4: Commit**

```bash
git add components/archive/layouts/TrommelLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): TrommelLayout — spotlit drums on black"
```

---

## Task 14: FatGuyLayout — dark green, two side-by-side, Arial Black title top-left

**Files:**
- Create: `components/archive/layouts/FatGuyLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/FatGuyLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function FatGuyLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-[#0e2a1c]">
      <h2 className="px-6 pt-8 font-['Arial_Black',sans-serif] text-3xl tracking-tight text-white sm:text-5xl">
        {project.caption}
      </h2>
      <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
        {project.images.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => onImageClick(i)}
            className="relative block aspect-[3/4] w-full overflow-hidden"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Stage**

```tsx
import { FatGuyLayout } from "./layouts/FatGuyLayout";
// ...
case "fatguy":
  return <FatGuyLayout project={project} onImageClick={handle} />;
```

- [ ] **Step 3: Verify**

`#fatguy`. Forest-green background, big Arial Black title, two large images.

- [ ] **Step 4: Commit**

```bash
git add components/archive/layouts/FatGuyLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): FatGuyLayout — green field with bulged title"
```

---

## Task 15: PortraitLayout — vast white, two small images, fragile italic serif

**Files:**
- Create: `components/archive/layouts/PortraitLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/PortraitLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function PortraitLayout({ project, onImageClick }: Props) {
  return (
    <div className="min-h-[80vh] bg-white">
      <div className="mx-auto max-w-[1100px] px-8 pt-32">
        <h2 className="mb-24 text-center font-serif text-3xl font-light italic tracking-tight">
          portrait, untitled.
        </h2>
        <div className="flex flex-wrap justify-center gap-32">
          {project.images.map((src, i) => (
            <button
              type="button"
              key={src}
              onClick={() => onImageClick(i)}
              className="block"
              style={{
                marginTop: i % 2 === 0 ? "0px" : "120px",
              }}
            >
              <div className="relative h-[240px] w-[180px]">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
        <p className="mt-32 text-center font-serif text-[11px] italic text-black/45">
          {project.caption}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Stage**

```tsx
import { PortraitLayout } from "./layouts/PortraitLayout";
// ...
case "portrait":
  return <PortraitLayout project={project} onImageClick={handle} />;
```

- [ ] **Step 3: Verify**

`#portrait`. Vast empty whitespace, two small thumbnails offset vertically, fragile italic title.

- [ ] **Step 4: Commit**

```bash
git add components/archive/layouts/PortraitLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): PortraitLayout — cathedral whitespace"
```

---

## Task 16: BombLayout — newsprint background with grain, comic-strip stack

**Files:**
- Create: `components/archive/layouts/BombLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/BombLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

const grainSvg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
       <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter>
       <rect width='100%' height='100%' filter='url(#n)' opacity='0.6'/>
     </svg>`,
  );

export function BombLayout({ project, onImageClick }: Props) {
  return (
    <div className="relative bg-[#f0e7d4]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${grainSvg}")`,
          backgroundSize: "160px 160px",
          opacity: 0.06,
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative mx-auto max-w-[720px] px-6 py-12">
        <div className="flex flex-col gap-1">
          {project.images.map((src, i) => (
            <button
              type="button"
              key={src}
              onClick={() => onImageClick(i)}
              className="relative block w-full border-4 border-black"
            >
              <div className="relative aspect-[3/4] w-full bg-black">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="720px"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-right font-['Impact','Anton',sans-serif] text-sm italic tracking-wider">
          {project.caption}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Stage**

```tsx
import { BombLayout } from "./layouts/BombLayout";
// ...
case "bomb":
  return <BombLayout project={project} onImageClick={handle} />;
```

- [ ] **Step 3: Verify**

`#bomb`. Newsprint background with subtle grain, four panels stacked with hard black borders, Impact caption bottom-right.

- [ ] **Step 4: Commit**

```bash
git add components/archive/layouts/BombLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): BombLayout — newsprint + grain + comic-strip stack"
```

---

## Task 17: WimmelLayout — mustard background, full-bleed strips

**Files:**
- Create: `components/archive/layouts/WimmelLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/WimmelLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

/**
 * Splits the images into rows of 3 or 4 alternating, full-bleed strips.
 */
function chunkAlternating(images: string[]): string[][] {
  const rows: string[][] = [];
  let i = 0;
  let take = 3;
  while (i < images.length) {
    rows.push(images.slice(i, i + take));
    i += take;
    take = take === 3 ? 4 : 3;
  }
  return rows;
}

export function WimmelLayout({ project, onImageClick }: Props) {
  const rows = chunkAlternating(project.images);
  let runningIndex = 0;

  return (
    <div className="bg-[#f3d77e]">
      <div className="flex flex-col">
        {rows.map((row, rIdx) => {
          const startIndex = runningIndex;
          runningIndex += row.length;
          return (
            <div key={rIdx} className="flex w-full">
              {row.map((src, j) => {
                const idx = startIndex + j;
                return (
                  <button
                    type="button"
                    key={src}
                    onClick={() => onImageClick(idx)}
                    className="relative block flex-1 border-r-2 border-black last:border-r-0"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes={`${100 / row.length}vw`}
                        className="object-cover"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between bg-black px-6 py-3 font-serif text-[12px] tracking-wide text-white">
        <span>{project.caption}</span>
        <span aria-hidden="true">↓ ↓ ↓</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Stage**

```tsx
import { WimmelLayout } from "./layouts/WimmelLayout";
// ...
case "wimmel":
  return <WimmelLayout project={project} onImageClick={handle} />;
```

- [ ] **Step 3: Verify**

`#wimmelbilder`. Mustard background, edge-to-edge horizontal strips alternating 3/4-up, black caption bar at bottom.

- [ ] **Step 4: Commit**

```bash
git add components/archive/layouts/WimmelLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): WimmelLayout — full-bleed mustard strips"
```

---

## Task 18: LogosLayout — clean white brand-book

**Files:**
- Create: `components/archive/layouts/LogosLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/LogosLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

const meta = [
  { client: "HOOP DREAMS BASKETBALL CAMP", year: "2023" },
  { client: "—", year: "—" },
];

export function LogosLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1100px] px-8 py-16">
        <p className="mb-12 text-[11px] tracking-[0.18em] text-black/55">
          {project.caption}
        </p>
        <div className="flex flex-col gap-16">
          {project.images.map((src, i) => (
            <div
              key={src}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-[2fr_1fr]"
            >
              <button
                type="button"
                onClick={() => onImageClick(i)}
                className="relative block w-full bg-zinc-50 p-12"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-contain"
                  />
                </div>
              </button>
              <dl className="text-[11px] tracking-[0.12em] text-black/70">
                <dt className="text-black/40">CLIENT</dt>
                <dd className="mb-4 font-bold text-black">
                  {meta[i]?.client ?? "—"}
                </dd>
                <dt className="text-black/40">YEAR</dt>
                <dd className="text-black">{meta[i]?.year ?? "—"}</dd>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Stage**

```tsx
import { LogosLayout } from "./layouts/LogosLayout";
// ...
case "logos":
  return <LogosLayout project={project} onImageClick={handle} />;
```

- [ ] **Step 3: Verify**

`#logos`. Clean, formal white page; logo on a zinc plate with metadata to the right.

- [ ] **Step 4: Commit**

```bash
git add components/archive/layouts/LogosLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): LogosLayout — clean brand-book layout"
```

---

## Task 19: MiscLayout — pinboard collage with seeded random rotation

24 images, scattered, slight rotation. Seeded so the arrangement is consistent across visits.

**Files:**
- Create: `components/archive/layouts/MiscLayout.tsx`
- Modify: `components/archive/Stage.tsx`

- [ ] **Step 1: Create the layout**

Create `components/archive/layouts/MiscLayout.tsx`:

```tsx
import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

// Seeded PRNG (mulberry32) — deterministic across renders.
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const cellsPerRow = 4;
const cellHeight = 300; // px

export function MiscLayout({ project, onImageClick }: Props) {
  const rng = mulberry32(424242);
  const items = project.images.map((src, i) => {
    const rotate = (rng() * 8 - 4).toFixed(2); // ±4°
    const widthPct = 60 + Math.floor(rng() * 35); // 60–95%
    const offsetX = (rng() * 30 - 15).toFixed(1); // ±15%
    const offsetY = (rng() * 30 - 15).toFixed(1); // ±15%
    return { src, i, rotate, widthPct, offsetX, offsetY };
  });

  const rows = Math.ceil(items.length / cellsPerRow);

  return (
    <div className="bg-[#efeae0]">
      <div className="px-4 py-10">
        <p className="mb-6 text-center font-serif text-[12px] italic text-black/55">
          {project.caption}
        </p>
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${cellsPerRow}, 1fr)`,
            gridAutoRows: `${cellHeight}px`,
            minHeight: rows * cellHeight,
          }}
        >
          {items.map((it) => (
            <div
              key={it.src}
              className="relative flex items-center justify-center"
              style={{ transform: `translate(${it.offsetX}%, ${it.offsetY}%)` }}
            >
              <button
                type="button"
                onClick={() => onImageClick(it.i)}
                className="block shadow-[0_4px_18px_rgba(0,0,0,0.12)]"
                style={{
                  width: `${it.widthPct}%`,
                  transform: `rotate(${it.rotate}deg)`,
                }}
              >
                <div className="relative aspect-square w-full bg-white">
                  <Image
                    src={it.src}
                    alt=""
                    fill
                    sizes="25vw"
                    className="object-contain"
                  />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Stage**

```tsx
import { MiscLayout } from "./layouts/MiscLayout";
// ...
case "misc":
  return <MiscLayout project={project} onImageClick={handle} />;
```

- [ ] **Step 3: Remove the placeholder**

In `components/archive/Stage.tsx`, all 9 layouts now have cases. Replace the `default` branch:

```tsx
default:
  return null;
```

And delete the unused `PlaceholderLayout` function above. The full list of `case` statements should be: `sine`, `chinese`, `trommel`, `fatguy`, `portrait`, `bomb`, `wimmel`, `logos`, `misc`.

- [ ] **Step 4: Verify all 9 projects**

Run: `npm run dev`. Visit each in turn and confirm it renders + lightbox works:
- `http://localhost:3000/archive#sine2000`
- `http://localhost:3000/archive#chinese`
- `http://localhost:3000/archive#trommel`
- `http://localhost:3000/archive#fatguy`
- `http://localhost:3000/archive#portrait`
- `http://localhost:3000/archive#bomb`
- `http://localhost:3000/archive#wimmelbilder`
- `http://localhost:3000/archive#logos`
- `http://localhost:3000/archive#misc`

Also click chips to flip between them — black-cut visible each time. Confirm SiteHeader text stays legible against every background.

- [ ] **Step 5: Run all tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add components/archive/layouts/MiscLayout.tsx components/archive/Stage.tsx
git commit -m "feat(archive): MiscLayout — seeded collage; remove placeholder"
```

---

## Task 20: Mobile responsive pass

Verify and fix any layouts that overflow or feel cramped on mobile widths.

**Files:**
- Modify: any layout files where mobile is broken (likely `WimmelLayout.tsx`, `MiscLayout.tsx`, `FatGuyLayout.tsx`, `BombLayout.tsx`).

- [ ] **Step 1: Audit at 375px width**

Run: `npm run dev`. Open Chrome devtools → device toolbar → iPhone SE (375×667). Visit each project. Note any:
- Horizontal overflow
- Text too large for the viewport
- Images squashed beyond recognition
- Chip bar wrapping awkwardly

- [ ] **Step 2: Apply targeted fixes**

For any layout with issues, narrow the desktop styles using `md:` prefixes and provide a single-column mobile fallback. Common patterns:

In `WimmelLayout.tsx`, force a single-column strip on mobile by adding `flex-col md:flex-row` to the row `<div>`:

```tsx
<div key={rIdx} className="flex w-full flex-col md:flex-row">
```

In `MiscLayout.tsx`, reduce cells per row:

```tsx
const cellsPerRow = typeof window !== "undefined" && window.innerWidth < 720 ? 2 : 4;
```

(Note: this is only evaluated at first render; full responsiveness would require `useEffect` + resize listener. Acceptable in v1.)

In `FatGuyLayout.tsx`, the title size already uses `sm:text-5xl` — verify it doesn't overflow; if it does, add a smaller base size:

```tsx
className="px-6 pt-8 font-['Arial_Black',sans-serif] text-2xl tracking-tight text-white sm:text-5xl"
```

In `BombLayout.tsx`, max-width is already 720px which collapses gracefully. Should be fine.

For the chip bar — the wrapping is intentional and should look fine. If it gets too tall on mobile, consider `overflow-x-auto flex-nowrap` instead.

- [ ] **Step 3: Re-audit**

Repeat Step 1 at 375px width. Confirm everything reads.

- [ ] **Step 4: Commit**

```bash
git add components/archive/
git commit -m "feat(archive): mobile responsive adjustments"
```

---

## Task 21: Final QA pass

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: build succeeds. Note any warnings about images, type errors, or missing dependencies and fix before continuing.

- [ ] **Step 3: Manual smoke**

Run: `npm start` (after the build).

- Visit `/` — eye-follower works, header reads.
- Visit `/archive` — landing screen, chip bar.
- Click each chip — proper layout, black flash.
- Click any image — lightbox opens.
- Use ←/→ in lightbox — navigates within project.
- Esc — closes lightbox.
- Browser back/forward — moves through previously-viewed projects.
- Reload `/archive#bomb` — lands directly on bomb.
- Click EL HONGO in header — returns to `/`.
- Header readable on every project's background (especially black ones).

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: archive page complete"
```

---

## Self-review notes

Spec coverage check (each section of [the spec](../specs/2026-05-02-archive-page-design.md) → tasks):
- §2 Page anatomy → Tasks 6, 9, 10 (chip bar + stage + landing wired in ArchiveClient)
- §3 Default landing state → Task 7 (Landing). Note: deviates from spec — no large EL HONGO since SiteHeader already shows it.
- §4 Per-project treatments → Tasks 11–19 (one per project)
- §5 Transitions → Task 8 (CutOverlay) + Task 10 (timing in ArchiveClient)
- §6 Routing & state → Task 4 (useProjectHash)
- §7 Lightbox → Task 5
- §8 File layout → reflected in the File Structure section above
- §9 Typography → no font loading needed; system fallbacks used as the spec intended
- §10 Image handling → Task 1 (move) + every layout uses `next/image`
- §11 Mobile → Task 20
- §12 Out of scope → respected (no filtering, no per-image titles, no animations beyond the cut)
- §13 Testing → Task 3 (registry tests) + Task 4 (hash tests)

Deviations from spec, with reason:
- Dropped the "archive header strip" — global SiteHeader already does the same job.
- Modified SiteHeader (`mix-blend-difference` + white text) so it stays legible over dark project stages. Strict improvement on home page (visually identical).

No placeholders. Every code step contains the full code. Type names (`ArchiveProject`, `LayoutId`, hook return shape) are consistent across all tasks.
