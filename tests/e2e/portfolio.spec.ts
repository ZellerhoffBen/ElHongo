import { expect, test } from "@playwright/test";
import {
  hasHorizontalOverflow,
  isNarrow,
  scrollThroughPage,
  trackErrors,
} from "./helpers";

test("renders the homepage without layout or runtime errors", async ({ page }) => {
  const runtimeErrors = trackErrors(page);

  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Jonas Aellig");
  await expect(page.getByRole("navigation", { name: "Kontaktmöglichkeiten" })).toBeVisible();
  await expect(page.locator('#kontakt a[href="mailto:jonas.aellig@test.ch"]')).toBeVisible();
  await expect(
    page.locator('#kontakt a[href="https://www.instagram.com/elhongo666/"]'),
  ).toBeVisible();

  const currentSection = page.locator("#aktuell");
  await expect(
    currentSection.getByRole("heading", { name: "Status Tinnitus" }),
  ).toBeVisible();
  await expect(
    currentSection.locator('time[datetime="2026-10-20T18:00:00+02:00"]'),
  ).toHaveText("20.10.2026 · 18:00");
  await expect(
    currentSection.getByRole("heading", { name: "Randwelten" }),
  ).toBeVisible();

  const currentTitlesStayInsideTheirPanels = await currentSection
    .locator("article h2")
    .evaluateAll((titles) =>
      titles.every((title) => {
        const titleRect = title.getBoundingClientRect();
        const articleRect = title.closest("article")?.getBoundingClientRect();
        return Boolean(articleRect && titleRect.right <= articleRect.right + 1);
      }),
    );
  expect(currentTitlesStayInsideTheirPanels).toBe(true);

  await scrollThroughPage(page);
  await page.waitForTimeout(600);

  await expect(page.locator("#kontakt")).toBeVisible();

  const brokenImages = await page.evaluate(() =>
    [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  );

  expect(brokenImages).toEqual([]);
  expect(await hasHorizontalOverflow(page)).toBe(false);
  expect(runtimeErrors).toEqual([]);
});

test("builds the homepage as two screen-height chapters", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const panels = page.locator(".home-snap-panel");
  await expect(panels).toHaveCount(2);

  if (isNarrow(page)) {
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollSnapType,
      ),
    ).toBe("none");
    return;
  }

  const metrics = await page.evaluate(() => {
    const header = document.querySelector("header");
    const panelElements = [...document.querySelectorAll(".home-snap-panel")];

    return {
      expectedHeight:
        window.innerHeight - (header?.getBoundingClientRect().height ?? 0),
      heights: panelElements.map((panel) => panel.getBoundingClientRect().height),
      overflows: panelElements.map(
        (panel) => panel.scrollHeight > panel.clientHeight + 1,
      ),
      snapAlignments: panelElements.map(
        (panel) => getComputedStyle(panel).scrollSnapAlign,
      ),
      snapType: getComputedStyle(document.documentElement).scrollSnapType,
    };
  });

  for (const height of metrics.heights) {
    expect(Math.abs(height - metrics.expectedHeight)).toBeLessThanOrEqual(1);
  }
  expect(metrics.overflows).toEqual([false, false]);
  expect(metrics.snapAlignments).toEqual(["none", "start"]);
  expect(metrics.snapType).toContain("y");
});

test("keeps navigation aligned with the two-page structure", async ({ page }) => {
  await page.goto("/");

  const atelierLink = page.getByRole("link", { name: "Atelier", exact: true });
  await expect(atelierLink).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Arbeiten", exact: true })).toHaveCount(0);

  const archiveLink = page.getByRole("link", { name: "Archiv", exact: true });
  await archiveLink.click();
  await expect(page).toHaveURL(/\/archive$/);
  await expect(archiveLink).toHaveAttribute("aria-current", "page");

  await page
    .getByRole("navigation", { name: "Hauptnavigation" })
    .getByRole("button", { name: "Profil", exact: true })
    .click();
  const profileDialog = page.getByRole("dialog", { name: "Jonas Aellig" });
  await expect(profileDialog).toBeVisible();
  await expect(page).toHaveURL(/\/archive$/);
  await profileDialog.getByRole("button", { name: "Profil schliessen" }).click();
  await expect(profileDialog).toBeHidden();
});

test("redirects the pre-route project URLs onto their slugs", async ({ page }) => {
  for (const [legacy, slug] of [
    ["/work/sine2000", "sine-2000"],
    ["/work/fatguy", "fat-guy"],
    ["/work/trommel", "trommel"],
    ["/work/wimmelbilder", "wimmelbilder"],
  ]) {
    await page.goto(legacy);
    await expect(page).toHaveURL(new RegExp(`/archive/${slug}$`));
    await expect(page.locator("#project-title")).toBeVisible();
  }

  // Hash fragments never reach the server, so the client resolves them.
  await page.goto("/archive#fatguy");
  await expect(page).toHaveURL(/\/archive\/fat-guy$/);

  await page.goto("/work");
  await expect(page).toHaveURL(/\/archive$/);
});

test("folds the old overview routes into the one-page portfolio", async ({ page }) => {
  for (const [route, section] of [
    ["/about", "el-hongo"],
    ["/service", "kontakt"],
  ]) {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`#${section}$`));
  }
});

test("opens archive entries from a clear register", async ({ page }) => {
  await page.goto("/archive");
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { level: 1, name: "Archiv" })).toBeVisible();

  const register = page.getByRole("navigation", { name: "Archivregister" });
  await expect(register.getByRole("link")).toHaveCount(6);
  const hasMobileRegister = (page.viewportSize()?.width ?? 640) < 640;

  if (hasMobileRegister) {
    await expect(register.getByRole("link", { name: /01 SINE 2000/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(page.locator("#project-title")).toHaveText("SINE 2000");
    await expect(page).toHaveURL(/\/archive$/);
  }

  const archiveSnapType = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollSnapType,
  );
  if (isNarrow(page)) {
    expect(archiveSnapType).toBe("none");
  } else {
    expect(archiveSnapType).toContain("y");
  }

  const fatGuyRow = register.getByRole("link", { name: /02 FAT GUY/ });
  if (isNarrow(page)) {
    await fatGuyRow.click();
  } else {
    await fatGuyRow.hover();
    await page.getByRole("link", { name: "FAT GUY ansehen", exact: true }).click();
  }

  await expect(page).toHaveURL(/\/archive\/fat-guy$/);
  await expect(register.getByRole("link", { name: /02 FAT GUY/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.locator("#project-title")).toContainText("FAT GUY");
  await page.waitForTimeout(500);

  expect(await hasHorizontalOverflow(page)).toBe(false);

  const registerButtons = page.getByRole("button", { name: /Zum Register/ });
  await expect(registerButtons).toHaveCount(hasMobileRegister ? 1 : 2);
  await registerButtons.last().scrollIntoViewIfNeeded();
  await registerButtons.last().click();
  await expect(page.getByRole("heading", { level: 1, name: "Archiv" })).toBeVisible();
});

test("opens every archive entry without broken interaction or artwork", async ({
  page,
}) => {
  const runtimeErrors = trackErrors(page);
  await page.goto("/archive");

  for (const project of [
    { number: "01", slug: "sine-2000", title: "SINE 2000" },
    { number: "02", slug: "fat-guy", title: "FAT GUY" },
    { number: "03", slug: "trommel", title: "TROMMEL" },
    { number: "04", slug: "wimmelbilder", title: "WIMMELBILDER" },
    { number: "05", slug: "figuren", title: "FIGUREN" },
    { number: "06", slug: "beobachtungen", title: "BEOBACHTUNGEN" },
  ]) {
    const row = page
      .getByRole("navigation", { name: "Archivregister" })
      .getByRole("link", { name: new RegExp(`${project.number} ${project.title}`) });

    await row.click();
    await expect(page).toHaveURL(new RegExp(`/archive/${project.slug}$`));
    await expect(row).toHaveAttribute("aria-current", "page");
    await expect(page.locator("#project-title")).toHaveText(project.title);

    const leadImage = page.locator("#project-view img").first();
    await leadImage.scrollIntoViewIfNeeded();
    await expect
      .poll(() => leadImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);
  }

  expect(await hasHorizontalOverflow(page)).toBe(false);
  expect(runtimeErrors).toEqual([]);
});
