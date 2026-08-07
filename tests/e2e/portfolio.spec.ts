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
  await expect(page.locator("#jonas, #weg")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { level: 2, name: "Jonas Aellig", exact: true }),
  ).toBeHidden();
  await expect(page.getByAltText("Porträt von Jonas Aellig")).toBeHidden();
  await expect(page.getByText("VEGL-Preis", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Drei Projekte", { exact: true })).toHaveCount(0);
  await expect(page.locator('#arbeiten a[href^="/archive#"]')).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Kontaktmöglichkeiten" })).toBeVisible();
  await expect(page.locator('#kontakt a[href="mailto:jonas.aellig@test.ch"]')).toBeVisible();
  await expect(
    page.locator('#kontakt a[href="https://www.instagram.com/elhongo666/"]'),
  ).toBeVisible();
  await expect(page.locator("#kontakt")).not.toContainText(/LinkedIn|Printify/);
  await expect(page.getByText("Nach unten wird es schlimmer.")).toHaveCount(0);
  await expect(page.getByText(/Freie Arbeiten, Aufträge/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Index/i })).toHaveCount(0);

  const profileTrigger = page.getByRole("button", {
    name: "EL HONGO",
    exact: true,
  });
  const profileDialog = page.getByRole("dialog", { name: "Jonas Aellig" });
  await profileTrigger.click();
  await expect(profileDialog).toBeVisible();
  await expect(
    profileDialog.getByRole("heading", { level: 2, name: "Jonas Aellig" }),
  ).toBeVisible();
  const profilePortrait = profileDialog.getByAltText("Porträt von Jonas Aellig");
  await expect(profilePortrait).toBeVisible();
  await expect
    .poll(() =>
      profilePortrait.evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(profileDialog.getByText("LG Rämibühl, Zürich")).toBeVisible();
  await expect(profileDialog.getByText("ZHdK, Zürich")).toBeVisible();
  await expect(profileDialog.getByText("Hamburg", { exact: true })).toBeVisible();
  await expect(profileDialog).not.toContainText("VEGL-Preis");
  if (testInfo.project.name === "desktop") {
    const profileGeometry = await page.evaluate(() => {
      const dialog = document.querySelector<HTMLDialogElement>("#artist-profile");
      const identity = dialog?.querySelector("aside");
      const title = dialog?.querySelector("#artist-profile-title");
      const dialogRect = dialog?.getBoundingClientRect();
      const identityRect = identity?.getBoundingClientRect();
      const titleRect = title?.getBoundingClientRect();

      return {
        width: dialogRect?.width ?? 0,
        identityRight: identityRect?.right ?? 0,
        titleRight: titleRect?.right ?? 0,
      };
    });

    expect(profileGeometry.width).toBeLessThanOrEqual(900);
    expect(profileGeometry.titleRight).toBeLessThanOrEqual(
      profileGeometry.identityRight - 20,
    );
  }
  expect(
    await page.evaluate(() => getComputedStyle(document.documentElement).overflow),
  ).toBe("hidden");
  await page.screenshot({
    path: testInfo.outputPath("profile-dialog.png"),
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await expect(profileDialog).toBeHidden();
  await expect(profileTrigger).toBeFocused();

  const currentSection = page.locator("#aktuell");
  await expect(
    currentSection.getByRole("heading", { name: "Status Tinnitus" }),
  ).toBeVisible();
  await expect(
    currentSection.locator('time[datetime="2026-10-20T18:00:00+02:00"]'),
  ).toHaveText("20.10.2026 · 18:00");
  await expect(currentSection.getByText("Musterstrasse 6 · 8006 Zürich")).toBeVisible();
  await expect(
    currentSection.getByRole("heading", { name: "Randwelten" }),
  ).toBeVisible();
  await expect(currentSection.getByText("Abschlussprojekt Propädeutikum")).toBeVisible();
  await expect(currentSection.locator("a, button")).toHaveCount(0);
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

  for (const alt of [
    "Ausstellungsplakat Status Tinnitus",
    "Präsentation des Projekts Randwelten an der ZHdK",
  ]) {
    const image = currentSection.getByAltText(alt);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
      .toBeGreaterThan(0);
  }

  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.75, 500);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 80));
    }
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(900);

  await expect(page.locator("#kontakt")).toBeVisible();
  const reachedPageBottom = await page.evaluate(
    () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2,
  );
  expect(reachedPageBottom).toBe(true);

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

test("builds the homepage as two screen-height chapters", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const panels = page.locator(".home-snap-panel");
  await expect(panels).toHaveCount(2);

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

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.mouse.wheel(0, 160);
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(30);

    for (let index = 0; index < 2; index += 1) {
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

  await page.getByRole("button", { name: "EL HONGO", exact: true }).click();
  const profileDialog = page.getByRole("dialog", { name: "Jonas Aellig" });
  await expect(profileDialog).toBeVisible();
  await expect(page).toHaveURL(/\/archive$/);
  await profileDialog.getByRole("button", { name: "Profil schliessen" }).click();
  await expect(profileDialog).toBeHidden();
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

  const archiveSnapType = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollSnapType,
  );
  if (testInfo.project.name === "desktop") {
    expect(archiveSnapType).toContain("y");
  } else {
    expect(archiveSnapType).toBe("none");
  }

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

  await expect(page.getByText("Nächstes Projekt", { exact: true })).toHaveCount(0);
  const registerButtons = page.getByRole("button", { name: /Zum Register/ });
  await expect(registerButtons).toHaveCount(2);
  await registerButtons.last().scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath("archive-bottom.png"),
    fullPage: false,
  });

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(700);
  await expect(page.locator("#kontakt")).toBeVisible();
  const reachedPageBottom = await page.evaluate(
    () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2,
  );
  expect(reachedPageBottom).toBe(true);

  await registerButtons.last().scrollIntoViewIfNeeded();
  await registerButtons.last().click();
  await expect(page.getByRole("heading", { level: 1, name: "Archiv" })).toBeVisible();
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
