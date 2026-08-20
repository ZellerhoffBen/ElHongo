/**
 * One guard per audit finding, named by its identifier.
 *
 * These are not general coverage — each test exists because the 8 August 2026
 * audit found the behaviour broken, and is written to fail again the same way.
 */
import { expect, test } from "@playwright/test";
import { hasHorizontalOverflow, isNarrow, trackRequests } from "./helpers";

test("F01 — the homepage hero ships modern formats, not raw megabyte PNGs", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const hero = page.locator("picture img").first();
  await expect
    .poll(() => hero.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);

  const chosen = await hero.evaluate((image: HTMLImageElement) => image.currentSrc);
  expect(chosen).toMatch(/\/hero\/artwork-\d+\.[0-9a-f]{8}\.(avif|webp|png)$/);

  // Only one full-size layer is fetched at high priority; the old build shipped
  // two 2 MB PNGs and marked both.
  const highPriority = await page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLImageElement>("img")].filter(
        (image) => image.fetchPriority === "high",
      ).length,
  );
  expect(highPriority).toBe(1);

  const heroBytes = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((entry) => entry.name.includes("/hero/"))
      .reduce(
        (total, entry) => total + ((entry as PerformanceResourceTiming).encodedBodySize || 0),
        0,
      ),
  );
  // Budget: the whole three-layer composition, well inside the 1 MB the audit
  // asked for. It was 4.12 MB.
  expect(heroBytes).toBeLessThan(700 * 1024);
});

test("F02 — the archive never downloads homepage artwork", async ({ page }) => {
  const requests = trackRequests(page);

  await page.goto("/archive");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  expect(requests.filter((url) => url.includes("/hero/"))).toEqual([]);
});

test("F03 + F13 — featured plates are captioned links into their projects", async ({
  page,
}) => {
  await page.goto("/");

  const rail = page.getByRole("region", { name: "Ausgewählte Blätter" });
  const cards = rail.getByRole("link");
  await expect(cards).toHaveCount(3);

  // Every plate names its project and leads to it — the audit found three
  // untitled, unlinked figures.
  const destinations = await cards.evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).getAttribute("href")),
  );
  expect(destinations.every((href) => href?.startsWith("/archive/"))).toBe(true);
  expect(new Set(destinations).size).toBe(3);

  for (const card of await cards.all()) {
    await expect(card.locator("figcaption")).not.toBeEmpty();
  }

  if (isNarrow(page)) {
    // The cropped rail is deliberately self-evident on mobile: artwork only,
    // without a counter or arrow controls competing with the plates.
    await expect(page.getByRole("button", { name: "Nächstes Blatt" })).toHaveCount(0);
    await expect(page.getByText(/Ausgewählte Blätter\s*01 \/ 03/)).toHaveCount(0);
  }

  await cards.first().click();
  await expect(page).toHaveURL(/\/archive\/[a-z0-9-]+$/);
});

test("F04 — the mobile first screen states who this is and what they do", async ({
  page,
}) => {
  test.skip(!isNarrow(page), "Desktop already shows the identity block first.");

  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const geometry = (locator: ReturnType<typeof page.locator>) =>
    locator.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, viewport: window.innerHeight };
    });

  // What answers F04 is the hero's height, not a caption above it: at 46svh
  // the drawing can no longer take the whole first screen, so the name lockup
  // opens on it. A running head above the artwork used to carry this too, but
  // it sat on top of the work — the one thing the first screen is for.
  const name = await geometry(page.getByRole("heading", { level: 1 }));
  expect(name.top).toBeLessThan(name.viewport);
});

test("F05 — the wordmark goes home", async ({ page }) => {
  await page.goto("/archive/fat-guy");

  const wordmark = page.getByRole("link", { name: /EL HONGO/ });
  await expect(wordmark).toHaveAttribute("href", "/");
  await wordmark.click();
  await expect(page).toHaveURL(/\/$/);

  // …and the profile is now a control that says what it does.
  await expect(
    page
      .getByRole("navigation", { name: "Hauptnavigation" })
      .getByRole("button", { name: "Profil", exact: true }),
  ).toBeVisible();
});

test("F06 — plates enlarge, page, close and restore focus", async ({ page }) => {
  await page.goto("/archive/sine-2000");
  await page.evaluate(() => document.fonts.ready);

  const firstPlate = page.locator("#project-view figure button").first();
  await firstPlate.scrollIntoViewIfNeeded();
  await firstPlate.click();

  const viewer = page.getByRole("dialog", { name: /SINE 2000 — Bild 01 von 08/ });
  await expect(viewer).toBeVisible();
  await expect(viewer.getByText("01 / 08")).toBeVisible();

  await viewer.getByRole("button", { name: "Nächstes Bild" }).click();
  await expect(page.getByRole("dialog", { name: /Bild 02 von 08/ })).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog", { name: /Bild 03 von 08/ })).toBeVisible();

  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog", { name: /Bild 02 von 08/ })).toBeVisible();

  // Background is inert while the viewer owns the screen.
  expect(
    await page.evaluate(() => getComputedStyle(document.documentElement).overflow),
  ).toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(firstPlate).toBeFocused();
});

test("F07 — every project route carries its own metadata", async ({ page }) => {
  const titles = new Set<string>();
  const ogTitles = new Set<string>();
  const images = new Set<string>();

  for (const slug of ["sine-2000", "fat-guy", "trommel"]) {
    const response = await page.goto(`/archive/${slug}`);
    expect(response?.status()).toBe(200);

    const head = await page.evaluate(() => ({
      title: document.title,
      canonical: document
        .querySelector('link[rel="canonical"]')
        ?.getAttribute("href"),
      ogTitle: document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content"),
      ogImage: document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content"),
      twitterCard: document
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute("content"),
      jsonLd: document.querySelector('script[type="application/ld+json"]')?.textContent,
    }));

    expect(head.canonical).toContain(`/archive/${slug}`);
    expect(head.ogImage).toContain(`/og/${slug}.png`);
    expect(head.twitterCard).toBe("summary_large_image");
    expect(JSON.parse(head.jsonLd ?? "{}")["@type"]).toBe("VisualArtwork");

    // Distinct, not six copies of one archive document.
    expect(titles.has(head.title), head.title).toBe(false);
    expect(ogTitles.has(head.ogTitle ?? ""), head.ogTitle ?? "no og:title").toBe(false);
    expect(images.has(head.ogImage ?? ""), head.ogImage ?? "no og:image").toBe(false);
    titles.add(head.title);
    ogTitles.add(head.ogTitle ?? "");
    images.add(head.ogImage ?? "");
  }
});

test("F09 — the profile dialog closes with Escape and returns focus", async ({
  page,
}) => {
  await page.goto("/");

  const trigger = page
    .getByRole("navigation", { name: "Hauptnavigation" })
    .getByRole("button", { name: "Profil", exact: true });
  const dialog = page.getByRole("dialog", { name: "Jonas Aellig" });

  await trigger.click();
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("F09 — pointer dismissal restores focus without a stuck focus box", async ({
  page,
}) => {
  await page.goto("/");

  const trigger = page
    .getByRole("navigation", { name: "Hauptnavigation" })
    .getByRole("button", { name: "Profil", exact: true });

  await trigger.click();
  await page.getByRole("button", { name: "Profil schliessen" }).click();

  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("data-return-focus", "silent");
  expect(await trigger.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
    "none",
  );
});

test("F10 — the hero is one described picture, not three unnamed layers", async ({
  page,
}) => {
  await page.goto("/");

  const heroFigure = page.locator("figure").filter({ has: page.locator("picture") }).first();
  await expect(heroFigure.locator("figcaption")).toContainText(/Stacheldraht/);

  // Each layer is an implementation detail and must stay out of the a11y tree.
  const layers = heroFigure.locator("img");
  expect(await layers.count()).toBe(3);
  for (const layer of await layers.all()) {
    await expect(layer).toHaveAttribute("aria-hidden", "true");
    await expect(layer).toHaveAttribute("alt", "");
  }
});

test("F11 — utility type is legible and survives 200% zoom", async ({ page }) => {
  await page.goto("/archive/wimmelbilder");
  await page.evaluate(() => document.fonts.ready);

  const smallest = await page.evaluate(() => {
    const labels = [...document.querySelectorAll<HTMLElement>(".kicker, .btn, nav a")];
    return Math.min(
      ...labels
        .filter((element) => element.offsetParent !== null)
        .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    );
  });
  expect(smallest).toBeGreaterThanOrEqual(11);

  // 200% zoom, emulated by halving the viewport: nothing may escape sideways.
  const viewport = page.viewportSize();
  if (viewport) {
    await page.setViewportSize({
      width: Math.round(viewport.width / 2),
      height: Math.round(viewport.height / 2),
    });
    await page.waitForTimeout(300);
    expect(await hasHorizontalOverflow(page)).toBe(false);
    await page.setViewportSize(viewport);
  }
});

test("F14 — crawl and share metadata exist", async ({ page, request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const slug of ["sine-2000", "fat-guy", "trommel", "beobachtungen"]) {
    expect(xml).toContain(`/archive/${slug}`);
  }

  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.status()).toBe(200);

  await page.goto("/");
  const head = await page.evaluate(() => ({
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ogImage: document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content"),
    jsonLd: document.querySelector('script[type="application/ld+json"]')?.textContent,
  }));

  expect(head.canonical).toBeTruthy();
  expect(head.ogImage).toContain("/og/default.png");
  expect(JSON.parse(head.jsonLd ?? "{}")["@type"]).toBe("Person");
});

test("F15 — fonts are WOFF2 and static assets are cacheable", async ({ request }) => {
  const font = await request.get("/fonts/StyreneA-Bold.woff2");
  expect(font.status()).toBe(200);
  expect(Number(font.headers()["content-length"])).toBeLessThan(60 * 1024);
  expect(font.headers()["cache-control"]).toContain("immutable");
});

test("F17 — the favicon exists", async ({ request }) => {
  for (const path of ["/favicon.ico", "/icon.png", "/apple-icon.png"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});

test("F18 — unknown routes get the site's own 404", async ({ page }) => {
  const response = await page.goto("/dieses-blatt-gibt-es-nicht");
  expect(response?.status()).toBe(404);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Dieses Blatt");
  await expect(page.getByText("This page could not be found")).toHaveCount(0);

  await page.getByRole("link", { name: /Archiv/ }).first().click();
  await expect(page).toHaveURL(/\/archive$/);
});
