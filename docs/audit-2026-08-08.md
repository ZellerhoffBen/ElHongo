# elhongo.ch — Full Website Audit

**Audit date:** 8 August 2026  
**Scope:** Homepage (`/`), archive (`/archive`), project-selection flow, profile dialog, unknown-route behavior, responsive states, frontend delivery, metadata and automated quality checks.  
**Method:** Rendered and interaction testing in the Codex in-app browser at desktop and narrow/mobile widths; keyboard checks; DOM/semantic inspection; HTTP/header checks; Lighthouse mobile runs for both primary routes and a desktop run for the homepage. Safari and Firefox were not available in the requested browser surface, so cross-engine conclusions are risk assessments, not verified compatibility claims.

![Homepage desktop](</Users/stat/Documents/Codex/2026-08-08/audit-brief-elhongo-ch-objective-conduct/outputs/elhongo-lighthouse-home-desktop.jpg>)

![Homepage mobile](</Users/stat/Documents/Codex/2026-08-08/audit-brief-elhongo-ch-objective-conduct/outputs/elhongo-lighthouse-home.jpg>)

![Archive mobile](</Users/stat/Documents/Codex/2026-08-08/audit-brief-elhongo-ch-objective-conduct/outputs/elhongo-lighthouse-archive.jpg>)

## 1. Executive Summary

The site has a clear visual identity but is not yet a convincing portfolio product. On desktop, the opening split composition quickly communicates the name and occupation. On mobile, the artwork consumes most of the first screen and the actual identity and positioning arrive later. More importantly, the homepage presents work but gives visitors almost no useful way to understand it or continue into it: the three featured pieces have no titles, captions or links, while the archive is a separate destination with no contextual bridge.

The design is strongest when treated as an editorial poster system: heavy Styrene typography, thin rules, off-white stock, black fields and a restrained yellow accent. It is weakest where a website needs to behave like a website. The brand/name control opens a profile modal instead of going home; “Atelier” is an ambiguous homepage label; artwork is often display-only; the profile modal does not close with Escape; and long project galleries offer no enlargement, next-project path or durable project page.

The technical baseline is mixed. Semantic HTML, server rendering, responsive sizing, descriptive alt text on most works, focus styling, a skip link, clean layout stability and low main-thread blocking are all solid. The homepage delivery is unacceptable: Lighthouse measured **22.9 s mobile LCP**, **12.1 s Speed Index** and **4,475 KiB transferred**. Two raw 2038×2000 PNG layers account for about **4.12 MB** and Lighthouse estimates **3,798 KiB** in image savings. A globally placed preload also downloads a **2.06 MB homepage hero PNG on `/archive`**, where it is not rendered.

Highest priorities:

1. Replace the raw hero layers with responsive AVIF/WebP assets and scope hero preloads to the homepage.
2. Make featured work navigable and contextual; give every archive project a durable route or equivalent shareable detail view.
3. Fix the navigation model: name/wordmark should return home; “Profile/About” should be an explicit control.
4. Improve mobile first-screen clarity and artwork viewing, including enlargement.
5. Fix modal keyboard behavior and complete launch metadata/assets.

## 2. Findings

### F01 — Homepage mobile performance is catastrophically poor

- **Issue:** The opening artwork is assembled from two unoptimized 2038×2000 PNGs (`background_white_eye.png` at 2,060,324 bytes and `vordergrund_mask.png` at 2,058,791 bytes), both fetched at high priority.
- **Where:** Homepage hero, all viewport sizes; worst under mobile throttling.
- **Why it matters:** Lighthouse mobile measured **LCP 22.9 s**, **Speed Index 12.1 s**, **TTI 22.9 s**, performance **64/100**, and **4,475 KiB** total transfer. This is not a marginal optimization problem; visitors on ordinary mobile connections can stare at an incomplete hero for tens of seconds.
- **Severity:** **Critical**
- **Recommendation:** Export each layer as AVIF/WebP with transparent WebP/AVIF where required; provide `srcset`/`sizes`; target the actual maximum rendered size; test whether the foreground/background can be flattened on devices that do not need the eye interaction. Do not mark both full-size layers high priority. Establish a homepage mobile budget of roughly <1 MB initial transfer and LCP <2.5 s at the Lighthouse mobile profile.
- **Responsible:** **Engineering**

### F02 — The archive downloads a 2 MB homepage image it never displays

- **Issue:** `/mask_test/background_white_eye.png` is preloaded globally from the shared layout/head.
- **Where:** `/archive` and likely every route using the shared layout.
- **Why it matters:** The archive transfers **2,630 KiB** in the mobile run; approximately 2.06 MB of that is a homepage-only image. It wastes bandwidth, battery and cache space and makes the archive look much heavier than its visible content.
- **Severity:** **High**
- **Recommendation:** Move the preload into homepage-specific metadata/rendering, or remove it and let the actual responsive image request establish priority. Verify the archive network waterfall contains no hero mask assets.
- **Responsible:** **Engineering**

### F03 — The homepage does not turn viewing into exploration

- **Issue:** “Ausgewählte Blätter” contains three images, but the figures are not links or buttons and have no visible titles, dates, media or project associations.
- **Where:** Homepage featured-art rail.
- **Why it matters:** This is the main portfolio failure. A visitor can look but cannot answer “what is this?” or continue to related work. The archive link is the only route forward and provides no connection to the selected piece.
- **Severity:** **High**
- **Recommendation:** Make each feature a real link to its project/detail location. Add concise visible metadata: title/project, year and medium/category. Preserve the sparse art direction, but expose the information on or immediately below the card. Do not rely on alt text as a caption.
- **Responsible:** **Design + Engineering**

### F04 — The mobile first screen delays the basic identity message

- **Issue:** Mobile stacks a large artwork before the name and occupation. In the Lighthouse viewport, the first screen is almost entirely the drawing; the identity block starts near the bottom, and “Illustrator…” is below it.
- **Where:** Homepage below the desktop breakpoint.
- **Why it matters:** The small header wordmark is not enough to explain whose site this is or what they do. A first-time visitor gets visual tone immediately but professional context late.
- **Severity:** **High**
- **Recommendation:** On mobile, introduce a compact identity line before or over the artwork, reduce the artwork’s initial height, or bring the name/occupation into the first viewport. Keep the work dominant; the requirement is comprehension, not a conventional marketing hero.
- **Responsible:** **Design**

### F05 — The wordmark behaves contrary to a core navigation convention

- **Issue:** “EL HONGO” in the fixed header is a button that opens the profile dialog. It does not return to the homepage. The separate “Profil” button on the homepage opens the same dialog.
- **Where:** Global header on both routes.
- **Why it matters:** Visitors reasonably expect the name/wordmark to be Home. On the archive page this makes returning home less predictable, while duplicating an about action under two unrelated labels.
- **Severity:** **High**
- **Recommendation:** Make the wordmark a link to `/`. Add a clearly named `Profil` or `Info` control beside the primary navigation. If the wordmark must open the profile for conceptual reasons, provide an equally explicit `Home` control and label the wordmark’s function accessibly and visually; the current behavior is too surprising.
- **Responsible:** **Design + Engineering**

### F06 — Archive work has no proper detail-view capability

- **Issue:** Project images are static figures. There is no zoom/lightbox, full-resolution view, image-level metadata or focused viewing mode.
- **Where:** Active project section on `/archive`.
- **Why it matters:** Detailed illustration is reduced to the viewport width on mobile. The site supports browsing a list but not actually inspecting the work—the core task of an artist portfolio.
- **Severity:** **High**
- **Recommendation:** Add an accessible click/tap-to-enlarge viewer with next/previous controls, Escape-to-close, swipe support, focus trapping and a visible image counter. Preserve a direct link to the original/project context. Avoid loading full-resolution files until requested.
- **Responsible:** **Design + Engineering**

### F07 — Hash-only project states are weak portfolio URLs

- **Issue:** Project selection updates hashes such as `/archive#fatguy` and direct hash loading works, but every project remains one archive document with the same title/description and no project-specific social preview.
- **Where:** Archive project selection.
- **Why it matters:** Projects cannot earn distinct search results, metadata, analytics landing-page data or high-quality social shares. Hash fragments are not sent to the server and cannot produce project-specific metadata.
- **Severity:** **Medium**
- **Recommendation:** Use real routes such as `/archive/fat-guy` or `/work/fat-guy`, while retaining the fast register transition. Each route should have a unique title, description, canonical URL and social image. If the single-page model is non-negotiable, accept the SEO/share limitation and at least update document title/history client-side.
- **Responsible:** **Both**


### F09 — The profile dialog cannot be dismissed with Escape

- **Issue:** Both a locator-level Escape keypress and a browser-level Escape keypress left the native `<dialog>` open. Clicking the close button works and restores focus to the opener.
- **Where:** Profile dialog opened from the header or homepage.
- **Why it matters:** Escape is expected dialog behavior and a key accessibility requirement. Keyboard users are forced to tab back to the close control.
- **Severity:** **Medium**
- **Recommendation:** Do not prevent the native `cancel` behavior, or handle `cancel` by closing the dialog and restoring focus. Add an automated interaction test: open → Escape → dialog closed → focus returned to the invoking control.
- **Responsible:** **Engineering**

### F10 — The hero artwork has no accessible description

- **Issue:** The three image layers that create the opening artwork all use empty `alt` attributes, and the surrounding figure has no caption or accessible name.
- **Where:** Homepage hero figure.
- **Why it matters:** The opening visual is meaningful portfolio content, not merely decoration. Screen-reader users get the identity text but no information about the work occupying half the desktop hero and most of the mobile first screen. Lighthouse scores 100 because empty `alt` is syntactically valid; that automated pass does not make the content decision correct.
- **Severity:** **Medium**
- **Recommendation:** Mark the implementation layers `aria-hidden="true"` and give the composed figure one accessible name/description via a visually hidden `<figcaption>` or `aria-labelledby`. Avoid repeating the same description on all three layers.
- **Responsible:** **Design + Engineering**

### F11 — Utility typography is over-compressed

- **Issue:** Navigation, labels and metadata frequently render at **10 px** with heavy tracking and uppercase styling. The main hero uses an intentionally compressed line height; on mobile the name block is forceful but visually congested.
- **Where:** Header, archive metadata, event labels, counters and hero identity.
- **Why it matters:** The style is distinctive, but small utility text becomes effortful on high-density mobile screens and for low-vision users. Touch targets generally pass because containers are larger; legibility is the problem.
- **Severity:** **Medium**
- **Recommendation:** Raise critical navigation/metadata text to 11–12 px minimum, reduce tracking at small sizes, and test at 200% browser zoom. Keep the display compression for the name, but add enough leading to prevent glyph collisions in narrow languages/content variants.
- **Responsible:** **Design**

### F12 — “Atelier” is attractive language but weak information architecture

- **Issue:** The homepage is labeled “Atelier,” while its actual content is identity, selected work and current activity. There is no top-level “Info/Profile” item, even though profile content is important.
- **Where:** Global navigation.
- **Why it matters:** “Atelier” suggests a studio/process page rather than Home/Selected/Current. With only two items it is learnable, but not immediately clear to a first-time visitor.
- **Severity:** **Medium**
- **Recommendation:** Either rename it to a clearer term (`Home`, `Aktuell`, `Auswahl`) or make the page live up to “Atelier” with visible process/current-studio content. Add an explicit `Profil`/`Info` item rather than hiding that action behind the wordmark.
- **Responsible:** **Design**

### F13 — The featured horizontal rail lacks orientation and context

- **Issue:** The selected-work rail is visually cropped/horizontally scrollable at narrow widths, but it has no visible instruction, progress, labels or keyboard-oriented control.
- **Where:** Homepage “Ausgewählte Blätter” region.
- **Why it matters:** Cropping can suggest more content, but it is not enough for every user. The rail reads as visual texture instead of an intentional, navigable selection.
- **Severity:** **Medium**
- **Recommendation:** Combine real linked cards with a subtle `1/3` indicator or visible next edge, preserve native horizontal touch scrolling, and offer keyboard-operable previous/next controls if content extends beyond the viewport. Do not add a heavy carousel UI.
- **Responsible:** **Both**

### F14 — Search basics pass automated checks but launch metadata is incomplete

- **Issue:** Titles and descriptions exist and pages are crawlable, but there is no canonical link, Open Graph/Twitter metadata, structured data, sitemap or `robots.txt`. `robots.txt` and `sitemap.xml` return branded-layout 404 responses.
- **Where:** Global metadata and both audited routes.
- **Why it matters:** Lighthouse reports SEO 100 because its audit is narrow. The site will produce weak link previews, gives crawlers no sitemap, and cannot clearly declare preferred URLs.
- **Severity:** **Medium**
- **Recommendation:** Add canonical URLs, `og:title`, `og:description`, `og:image`, `og:url`, Twitter card metadata, a valid `robots.txt`, XML sitemap and relevant `Person`/`VisualArtwork` JSON-LD. Project routes should supply project-specific values.
- **Responsible:** **Engineering**, with copy/image input from **Design**

### F15 — Font and static-asset delivery wastes repeat-visit bandwidth

- **Issue:** Two OTF font files total 277,316 source bytes, and inspected static public assets return `cache-control: public, max-age=0, must-revalidate` rather than long-lived immutable caching.
- **Where:** Sitewide Styrene fonts and public image assets.
- **Why it matters:** OTF is heavier than web-subset WOFF2 and revalidation adds avoidable latency on repeat visits. The font choice itself is not the problem; delivery is.
- **Severity:** **Medium**
- **Recommendation:** Subset required glyphs into WOFF2, retain `font-display: swap`, preload only the above-fold weight actually needed, and serve versioned public assets with a long immutable cache policy. Confirm licensing permits webfont conversion/subsetting.
- **Responsible:** **Engineering**

### F16 — The homepage prefetches code for a route the user may not visit

- **Issue:** The homepage network trace included the archive page chunk before navigation, consistent with automatic route prefetching.
- **Where:** Homepage global navigation.
- **Why it matters:** The chunk is small relative to the image problem, but it adds work during an already overloaded initial load.
- **Severity:** **Low**
- **Recommendation:** Fix image delivery first. Then consider disabling or delaying archive prefetch on constrained connections if field data shows value; do not micro-optimize this ahead of the 4 MB hero.
- **Responsible:** **Engineering**

### F17 — Missing favicon creates a visible console/network error

- **Issue:** `/favicon.ico` returns 404; Lighthouse’s only best-practices failure is the resulting console/network error.
- **Where:** All routes.
- **Why it matters:** It is a trivial but conspicuous sign of incomplete production setup and produces a broken browser-tab identity.
- **Severity:** **Low**
- **Recommendation:** Add favicon ICO/PNG/SVG assets plus Apple touch icon and manifest metadata.
- **Responsible:** **Both**

### F18 — Unknown routes fall back to the generic Next.js 404

- **Issue:** Nonexistent routes show the framework-default “404: This page could not be found” content inside the global shell.
- **Where:** Any invalid URL, including current `/robots.txt`, `/sitemap.xml` and `/favicon.ico` requests.
- **Why it matters:** It breaks the otherwise specific art direction and offers no route back to work.
- **Severity:** **Low**
- **Recommendation:** Build a custom, minimal 404 with links to Atelier, Archive and Profile. Keep it light; this does not need to become a design exercise.
- **Responsible:** **Both**

### F19 — Cross-browser confidence is unproven around the riskiest features

- **Issue:** The implementation uses native `<dialog>`, CSS `:has()`, container queries, dynamic viewport units, scroll snapping and scripted focus/scroll behavior. Chromium rendering was stable, but Safari and Firefox were not tested in the requested browser surface.
- **Where:** Profile dialog, mobile viewport sizing, homepage/archive snap layouts and archive state changes.
- **Why it matters:** These are exactly the features most likely to differ in focus behavior, viewport resizing and scroll positioning, particularly iOS Safari with the browser chrome and on-screen orientation changes.
- **Severity:** **Medium**
- **Recommendation:** Add a release matrix covering current Safari macOS, iOS Safari, Firefox, Chrome Android and keyboard-only desktop. Test dialog open/close/focus, hash deep links, back/forward, orientation change, reduced motion, 200% zoom, horizontal rail scrolling and 20-image gallery navigation.
- **Responsible:** **Engineering / QA**

### F20 — Placeholder content is a release blocker, not merely a copy task

- **Issue:** Visible copy includes “Whatever du hier hinschreiben willst,” lorem ipsum, a test email and sample address/date data.
- **Where:** Hero, current items, profile and archive descriptions/contact details.
- **Why it matters:** You identified this as WIP, so it is not evidence that the design concept failed. It is still impossible to evaluate final hierarchy, wrapping, credibility and translation robustness until real content is in place.
- **Severity:** **High before launch**
- **Recommendation:** Replace placeholders early enough to re-test layout at 320 px, 390 px, tablet and wide desktop. Use worst-case real lengths, not short dummy strings. Treat the email, venue data and dates as functional production data with owners and expiry/update rules.
- **Responsible:** **Design/content + Engineering**

## 3. Creative Web Design Assessment

### Visual concept and art direction

The concept is coherent: an editorial catalogue/poster language rather than a neutral white-cube portfolio. The split hero, hard rules, off-white ground, black archive state and yellow selection marker form one recognisable system. This is the site’s main asset.

The problem is that the concept currently carries too much of the product. The homepage is composed to make an impression, not to help a visitor understand bodies of work, relationships between pieces or what to do next. It feels intentional as a poster and under-resolved as an interface.

### Typography

Styrene gives the site a specific voice and pairs well with the grid. The large name lockup is memorable. The system is overused at the small end: 10 px uppercase, expanded tracking and bold weight appear in navigation, counters and metadata where clarity matters more than texture. The display line-height is aggressively compressed; it works for the short fixed name but is brittle for real or translated text.

### Composition and layout system

Desktop hero composition is strong and immediately legible. The archive register is the most successful interface: clear rows, visible active state, category/count metadata and useful thumbnails. Mobile stacking is mechanically responsive but not strategically re-composed; the artwork wins the entire first screen and context follows. The current-content sections are spacious, but the experience risks becoming a sequence of oversized panels rather than a hierarchy of choices.

### Motion and interaction

Scroll snapping is limited to `proximity` and disabled under reduced-motion preference, which is the right restraint. The eye/hero treatment adds character if it remains responsive and does not cost 4 MB. The more important interactions are under-designed: the brand opens a modal, featured art is inert and project images cannot be enlarged. Motion is not the weak point; interaction meaning is.

### Distinctiveness and consistency

The site is visually distinctive and internally consistent. It avoids the generic masonry-grid portfolio. That distinction should be preserved. Consistency breaks at behavior level: a wordmark behaves like About, a northeast arrow suggests navigation but opens a modal, and visible art does not reliably behave as a path to more art.

### Interface–artwork relationship

The monochrome system mostly supports the drawings and the archive’s black active state creates useful contrast. Large type sometimes competes with the work—especially in the hero and current sections—but the bigger issue is lack of context, not visual competition. Art is treated as graphic material more often than as a body of work with names, series and detail.

### Experimentation versus usability

The experiment is worth keeping: editorial typography, the split hero, the register and restrained accent all work. The conventions being broken do not add equivalent value. Making the wordmark non-home, hiding About behind it, delaying identity on mobile and rendering featured pieces inert are usability costs without a strong conceptual payoff.

**Creative verdict:** **6/10 in the current build.** The art direction is above the implementation of the experience. With clearer navigation, linked/contextual work, better mobile composition and disciplined interaction semantics, the same concept could become a strong portfolio without becoming conventional.

## 4. Technical Assessment

### Measured results

| Route/profile | Performance | Accessibility | Best practices | SEO | FCP | LCP | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Homepage, Lighthouse mobile | 64 | 100 | 96 | 100 | 1.9 s | **22.9 s** | 0 | 4,475 KiB |
| Homepage, Lighthouse desktop | 80 | 100 | 96 | 100 | 0.3 s | **3.8 s** | 0.017 | 4,529 KiB |
| Archive, Lighthouse mobile | 100 | 100 | 96 | 100 | 1.0 s | 1.4 s | 0.002 | 2,630 KiB |

These are controlled lab results, not field Core Web Vitals. The archive performance score is misleadingly flattering: its visible LCP is fast, but the page still downloads a wasted 2.06 MB homepage asset and Lighthouse reports 7.5 s TTI.

### What is technically solid

- Pages return HTTP 200 and are server-rendered; primary content exists in initial HTML.
- `<html lang="de">`, one main landmark, labeled navigation, skip link, headings, articles, `dl`/`dt`/`dd`, `<time>`, visible focus outlines and large interactive containers are present.
- Archive selection exposes `aria-pressed`, updates the URL hash, supports direct hash loading and moves focus to the selected content region.
- Most artwork uses descriptive German alt text and responsive Next Image output in AVIF.
- Main-thread blocking is low (10–20 ms TBT) and layout stability is good.
- No broken primary internal routes or runtime console errors were found apart from the missing favicon.
- Reduced-motion CSS disables smooth scrolling and scroll snapping.

### What must change

- The two raw hero PNG layers dominate network and LCP; responsive image optimization is mandatory.
- The hero preload is incorrectly global and pollutes `/archive`.
- Image-detail viewing is absent.
- Profile dialog Escape handling is broken.
- Webfont/static cache delivery is under-optimized.
- Metadata, social previews, crawl support files and project-specific URLs are incomplete.
- Cross-engine regression testing is required for dialog, scroll snap and viewport behavior.

## 5. Prioritized Action Plan

### Quick wins

| Rank | Action | Expected impact | Effort |
|---:|---|---|---|
| 1 | Scope/remove the global hero preload so `/archive` stops downloading the 2.06 MB PNG | Very high bandwidth improvement on archive | **S** — <0.5 day |
| 2 | Add favicon/touch icons; remove the 404 console error | Production polish; clean diagnostics | **S** — <0.5 day |
| 3 | Restore native Escape dismissal for the profile dialog and add a regression test | Accessibility and predictable interaction | **S** — <0.5 day |
| 4 | Make the header wordmark link to `/`; add an explicit Profile/Info control | Major navigation clarity improvement | **S–M** — 0.5–1 day |
| 5 | Add canonical, Open Graph/Twitter tags, `robots.txt` and sitemap | Better sharing/crawl hygiene | **S–M** — 0.5–1 day |
| 6 | Increase small navigation/metadata type to 11–12 px and verify 200% zoom | Readability with minimal visual change | **S–M** — 0.5–1 day |
| 7 | Give the composed hero figure one accessible description | Screen-reader parity | **S** — <0.5 day |

### High-impact improvements

| Rank | Action | Expected impact | Effort |
|---:|---|---|---|
| 1 | Re-export and responsively deliver hero layers; flatten on low-capability/mobile variants if appropriate | Reduces mobile LCP from unusable toward acceptable; saves ~3.8 MB | **M** — 1–3 days |
| 2 | Turn featured homepage pieces into titled links to project/detail views | Converts the homepage from poster to usable portfolio | **M** — 1–3 days |
| 3 | Recompose the mobile hero so identity and occupation appear in the first viewport | Faster comprehension and stronger professional positioning | **M** — 1–2 design days + implementation |
| 4 | Add accessible image enlargement with next/previous and lazy full-resolution loading | Materially improves the core artwork-viewing task | **M–L** — 3–6 days |
| 5 | Add previous/next project navigation and a compact in-gallery switch path | Faster archive exploration | **M** — 1–2 days |
| 6 | Convert/subset fonts to WOFF2 and configure immutable asset caching | Faster repeat visits and lower font cost | **M** — 1–2 days |
| 7 | Replace real content, then run narrow-width and long-copy QA | Credibility and layout correctness | **M**, content-dependent |

### Larger redesign/development tasks

| Rank | Action | Expected impact | Effort |
|---:|---|---|---|
| 1 | Introduce real project routes with project-specific metadata while retaining the archive register as navigation | Durable sharing, SEO, analytics and clearer IA | **L** — 1–2 weeks |
| 2 | Refine the homepage content model: identity → selected projects → current activity → contact, with explicit cross-links | Resolves the gap between art direction and portfolio utility | **L** — 1–2 weeks design + build |
| 3 | Build and automate a cross-browser/device test matrix | Prevents regressions in dialog, scroll, hash and viewport behavior | **M–L** — 3–7 days initial setup |
| 4 | Establish media/content tooling: derivative generation, metadata schema, image budgets and expiring event data | Makes the site maintainable as the archive grows | **L** — 1–2 weeks |

## Release bar

Do not treat the site as launch-ready until all Critical/High items are resolved, placeholders are replaced, the homepage mobile LCP is below 2.5 s in repeatable tests, the archive no longer downloads homepage media, the profile closes with Escape, every featured item leads somewhere meaningful, and at least Safari/iOS Safari/Firefox/Chrome Android have passed the focused test matrix.
