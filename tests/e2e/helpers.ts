import type { Page } from "@playwright/test";

/** Where the layout switches from stacked/rail to the desktop spread. */
export const DESKTOP_BREAKPOINT = 1024;

export const isNarrow = (page: Page) =>
  (page.viewportSize()?.width ?? DESKTOP_BREAKPOINT) < DESKTOP_BREAKPOINT;

/** Records every URL the page requests, for asserting what a route does *not* load. */
export function trackRequests(page: Page) {
  const urls: string[] = [];
  page.on("request", (request) => urls.push(request.url()));
  return urls;
}

/** Collects runtime errors and console errors so a test can assert a clean run. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

/** Scrolls the whole document so lazy images and sticky bars are exercised. */
export async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.75, 500);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 60));
    }
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
}

export const hasHorizontalOverflow = (page: Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
