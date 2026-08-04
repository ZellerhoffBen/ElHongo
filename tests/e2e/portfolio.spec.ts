import { expect, test } from "@playwright/test";

test("renders the one-page portfolio without layout or runtime errors", async ({
  page,
}, testInfo) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Jonas Aellig");
  await expect(page.locator('#arbeiten a[href^="/archive#"]')).toHaveCount(3);
  await expect(page.getByRole("navigation", { name: "Kontaktmöglichkeiten" })).toBeVisible();
  await expect(page.locator('#kontakt a[href="mailto:jonas.aellig@test.ch"]')).toBeVisible();
  await expect(
    page.locator('#kontakt a[href="https://www.instagram.com/elhongo666/"]'),
  ).toBeVisible();
  await expect(page.locator("#kontakt")).not.toContainText(/LinkedIn|Printify/);
  await expect(page.getByText("Nach unten wird es schlimmer.")).toHaveCount(0);
  await expect(page.getByText(/Freie Arbeiten, Aufträge/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Index/i })).toHaveCount(0);

  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.75, 500);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 80));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(300);

  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    brokenImages: [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  }));

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.brokenImages).toEqual([]);
  expect(runtimeErrors).toEqual([]);

  await page.evaluate(() => window.scrollTo(0, 0));

  await page.screenshot({
    path: testInfo.outputPath("homepage.png"),
    fullPage: true,
  });
});

test("builds the opening as three calm screen-height chapters", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const panels = page.locator(".home-snap-panel");
  await expect(panels).toHaveCount(3);

  if (testInfo.project.name === "desktop") {
    const metrics = await page.evaluate(() => {
      const header = document.querySelector("header");
      const panelElements = [...document.querySelectorAll(".home-snap-panel")];

      return {
        viewportHeight: window.innerHeight,
        expectedHeight: window.innerHeight - (header?.getBoundingClientRect().height ?? 0),
        heights: panelElements.map((panel) => panel.getBoundingClientRect().height),
        overflows: panelElements.map(
          (panel) => panel.scrollHeight > panel.clientHeight + 1,
        ),
        snapType: getComputedStyle(document.documentElement).scrollSnapType,
      };
    });

    for (const height of metrics.heights) {
      expect(Math.abs(height - metrics.expectedHeight)).toBeLessThanOrEqual(1);
    }
    expect(metrics.overflows).toEqual([false, false, false]);
    expect(metrics.snapType).toContain("y");

    for (let index = 0; index < 3; index += 1) {
      await panels.nth(index).evaluate((panel) =>
        panel.scrollIntoView({ behavior: "auto", block: "start" }),
      );
      await expect
        .poll(
          () => panels.nth(index).evaluate((panel) => panel.getBoundingClientRect().top),
          { timeout: 2_000 },
        )
        .toBeCloseTo(metrics.viewportHeight - metrics.expectedHeight, 0);
      await page.screenshot({
        path: testInfo.outputPath(`home-chapter-${index + 1}.png`),
        fullPage: false,
      });
    }
  } else {
    const snapType = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollSnapType,
    );
    expect(snapType).toBe("none");
  }
});

test("keeps navigation aligned with the two-page structure", async ({ page }) => {
  await page.goto("/");

  const atelierLink = page.getByRole("link", { name: "Atelier", exact: true });
  await expect(atelierLink).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Arbeiten", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Kontakt", exact: true })).toHaveCount(0);

  const archiveLink = page.getByRole("link", { name: "Archiv", exact: true });
  await archiveLink.click();
  await expect(page).toHaveURL(/\/archive$/);
  await expect(archiveLink).toHaveAttribute("aria-current", "page");
});

test("redirects legacy project pages into the archive", async ({ page }) => {
  for (const slug of ["sine2000", "fatguy", "trommel"]) {
    await page.goto(`/work/${slug}`);
    await expect(page).toHaveURL(new RegExp(`/archive#${slug}$`));
    await expect(page.locator("#project-title")).toBeVisible();
  }
});

test("folds the old overview routes into the one-page portfolio", async ({ page }) => {
  for (const [route, section] of [
    ["/about", "el-hongo"],
    ["/service", "kontakt"],
  ]) {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`#${section}$`));
  }

  await page.goto("/work");
  await expect(page).toHaveURL(/\/archive$/);
});

test("opens archive entries from a clear register", async ({ page }, testInfo) => {
  await page.goto("/archive");
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { level: 1, name: "Archiv" })).toBeVisible();
  await expect(page.locator('button[aria-pressed]')).toHaveCount(6);

  const archiveLink = page.getByRole("link", { name: "Archiv", exact: true });
  await expect(archiveLink).toHaveAttribute("aria-current", "page");

  await page.screenshot({
    path: testInfo.outputPath("archive-register.png"),
    fullPage: false,
  });

  const fatGuyRow = page.getByRole("button", { name: /02 FAT GUY/ });
  if (testInfo.project.name === "desktop") {
    await fatGuyRow.hover();
    await page
      .getByRole("button", { name: "FAT GUY ansehen", exact: true })
      .click();
  } else {
    await fatGuyRow.click();
  }
  await expect(page).toHaveURL(/\/archive#fatguy$/);
  await expect(fatGuyRow).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#project-title")).toContainText("FAT GUY");
  await page.waitForTimeout(700);

  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);

  await page.screenshot({
    path: testInfo.outputPath("archive-project.png"),
    fullPage: false,
  });
});

test("opens every archive entry without broken interaction or artwork", async ({
  page,
}) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.goto("/archive");

  for (const project of [
    { number: "01", id: "sine2000", title: "SINE 2000" },
    { number: "02", id: "fatguy", title: "FAT GUY" },
    { number: "03", id: "trommel", title: "TROMMEL" },
    { number: "04", id: "wimmelbilder", title: "WIMMELBILDER" },
    { number: "05", id: "figuren", title: "FIGUREN" },
    { number: "06", id: "beobachtungen", title: "BEOBACHTUNGEN" },
  ]) {
    const row = page.getByRole("button", {
      name: new RegExp(`${project.number} ${project.title}`),
    });

    await row.click();
    await expect(page).toHaveURL(new RegExp(`/archive#${project.id}$`));
    await expect(row).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#project-title")).toHaveText(project.title);

    const leadImage = page.locator("#project-view img").first();
    await leadImage.scrollIntoViewIfNeeded();
    await expect(leadImage).toBeVisible();
    await expect
      .poll(() => leadImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );

  expect(hasHorizontalOverflow).toBe(false);
  expect(runtimeErrors).toEqual([]);
});
