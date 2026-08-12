/**
 * F20 — placeholder copy.
 *
 * The strings on the site are still lorem ipsum and a test email, so the audit's
 * real risk is not the words: it is that nobody knows whether the layout
 * survives the words that replace them. German sets long, and this site is built
 * from compressed display type in narrow columns.
 *
 * These tests swap in worst-case real-length German at runtime and assert the
 * page still holds together. They are a standing guard, not a one-off: when the
 * production copy lands, this is what says whether it fits.
 */
import { expect, test } from "@playwright/test";
import { hasHorizontalOverflow } from "./helpers";

/** Real German at the lengths this content type actually reaches. */
const LONG = {
  tagline:
    "Illustrator und Zeichner in Zürich, derzeit Studierender im Bachelorstudiengang Illustration an der Hochschule für Angewandte Wissenschaften Hamburg.",
  heading: "Zwischenpräsentationsdokumentation",
  featureTitle: "Sonderausstellungseröffnung",
  detailValue: "Kunsthochschulzwischenpräsentationsraum 4b, Musterstrasse 118",
  paragraph:
    "Eine fortlaufende Serie von Zeichnungen über Nachbarschaften, Randfiguren und die Architektur dazwischen, entstanden zwischen 2023 und 2026 in Zürich, Hamburg und unterwegs. Die Blätter entstehen meist in einem Zug, ohne Vorzeichnung.",
  email: "jonas.aellig.illustration@sehr-langer-domainname-beispiel.ch",
};

/** Replaces text in place and waits for layout to settle. */
async function retype(
  page: import("@playwright/test").Page,
  replacements: [selector: string, text: string][],
) {
  await page.evaluate((entries) => {
    for (const [selector, text] of entries) {
      for (const element of document.querySelectorAll(selector)) {
        element.textContent = text;
      }
    }
  }, replacements);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
}

/** Nothing may spill out of the box that owns it. */
async function assertContained(
  page: import("@playwright/test").Page,
  childSelector: string,
  containerSelector: string,
) {
  const escapes = await page.evaluate(
    ({ childSelector, containerSelector }) =>
      [...document.querySelectorAll(childSelector)]
        .map((child) => {
          const container = child.closest(containerSelector);
          if (!container) return null;
          const childBox = child.getBoundingClientRect();
          const containerBox = container.getBoundingClientRect();
          const overflowRight = childBox.right - containerBox.right;
          const overflowLeft = containerBox.left - childBox.left;
          return overflowRight > 1 || overflowLeft > 1
            ? `${child.textContent?.slice(0, 24)}… right:+${overflowRight.toFixed(1)} left:+${overflowLeft.toFixed(1)}`
            : null;
        })
        .filter(Boolean),
    { childSelector, containerSelector },
  );

  expect(escapes, `${childSelector} escaped ${containerSelector}`).toEqual([]);
}

test("F20 — the homepage holds worst-case German copy", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  await retype(page, [
    ["#el-hongo p.text-lead", LONG.tagline],
    ["#auswahl-title", LONG.heading],
    ["#aktuell article h2", LONG.featureTitle],
    ["#aktuell dd", LONG.detailValue],
    ['#kontakt a[href^="mailto:"] span:last-of-type', LONG.email],
  ]);

  expect(await hasHorizontalOverflow(page)).toBe(false);
  await assertContained(page, "#aktuell article h2", "article");
  await assertContained(page, "#aktuell dd", "dl");
  await assertContained(page, "#auswahl-title", "section");

  // The intro panel is a fixed-height chapter on desktop; long copy must not
  // make it scroll internally.
  const introOverflows = await page.evaluate(() => {
    const panel = document.querySelector(".home-snap-panel");
    return panel ? panel.scrollHeight > panel.clientHeight + 1 : false;
  });
  expect(introOverflows).toBe(false);
});

test("F20 — a project page holds worst-case German copy", async ({ page }) => {
  await page.goto("/archive/beobachtungen");
  await page.evaluate(() => document.fonts.ready);

  await retype(page, [
    ["#project-title", LONG.heading],
    ["#project-view header p.text-lead-sm", LONG.paragraph],
  ]);

  expect(await hasHorizontalOverflow(page)).toBe(false);
  await assertContained(page, "#project-title", "header");

  // The register carries the longest single words on the site.
  await retype(page, [['nav[aria-label="Archivregister"] strong', LONG.heading]]);
  expect(await hasHorizontalOverflow(page)).toBe(false);
  await assertContained(page, 'nav[aria-label="Archivregister"] strong', "a");
});

test("F20 — the profile dialog holds worst-case German copy", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Hauptnavigation" })
    .getByRole("button", { name: "Profil", exact: true })
    .click();
  await expect(page.getByRole("dialog", { name: "Jonas Aellig" })).toBeVisible();

  await retype(page, [
    ["#artist-profile-copy", LONG.paragraph],
    ["#artist-profile .path-step p:last-of-type", "Hochschule für Angewandte Wissenschaften, Hamburg"],
  ]);

  await assertContained(page, "#artist-profile-copy", "section");
  const dialogOverflows = await page.evaluate(() => {
    const dialog = document.querySelector<HTMLDialogElement>("#artist-profile");
    return dialog ? dialog.scrollWidth > dialog.clientWidth + 1 : false;
  });
  expect(dialogOverflows).toBe(false);
});

test("F20 — the placeholder email never reaches metadata or structured data", async ({
  page,
}) => {
  // It is fine as visible contact copy while the site is a work in progress.
  // It is not fine baked into a share card or a Person record that outlives it.
  for (const route of ["/", "/archive", "/archive/fat-guy"]) {
    await page.goto(route);
    const leaked = await page.evaluate(() => {
      const head = document.head.innerHTML;
      const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((node) => node.textContent ?? "")
        .join(" ");
      return {
        head: head.includes("test.ch"),
        jsonLd: jsonLd.includes("test.ch"),
      };
    });

    expect(leaked.head, `${route} <head>`).toBe(false);
    expect(leaked.jsonLd, `${route} JSON-LD`).toBe(false);
  }
});
