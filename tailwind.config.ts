import type { Config } from "tailwindcss";

/**
 * Design tokens live in `app/globals.css` as custom properties so that a single
 * `data-tone` attribute can repaint a whole subtree (see `.tone-*` contexts).
 * Everything here is a thin alias over those properties — never a raw value.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        accent: "var(--accent)",
        surface: "var(--surface)",
        fg: {
          DEFAULT: "var(--fg)",
          muted: "var(--fg-muted)",
          faint: "var(--fg-faint)",
        },
        rule: {
          DEFAULT: "var(--rule)",
          soft: "var(--rule-soft)",
        },
        wash: "var(--wash)",
      },
      spacing: {
        // Vertical section rhythm. Replaces the ad-hoc py-4…py-28 sprawl.
        "section-sm": "2.5rem",
        section: "3.5rem",
        "section-lg": "5rem",
        "section-xl": "7rem",
      },
      fontSize: {
        // One coordinated ramp. Display sizes are viewport-height aware so a
        // full-height panel can never outgrow its own box on short laptops.
        // The site's single largest type: the hero name. The svh term only
        // engages on unusually short viewports, so on normal screens this is
        // exactly the width-driven scale (10.4vw, capped at 11rem).
        "display-hero": [
          "clamp(3.7rem, min(10.4vw, 18svh), 11rem)",
          { lineHeight: "0.74", letterSpacing: "-0.065em", fontWeight: "700" },
        ],
        // Page titles (Archiv).
        "display-xl": [
          "clamp(3.2rem, min(9vw, 15svh), 9rem)",
          { lineHeight: "0.72", letterSpacing: "-0.07em", fontWeight: "700" },
        ],
        "display-lg": [
          "clamp(3rem, min(8.5vw, 13svh), 9rem)",
          { lineHeight: "0.86", letterSpacing: "-0.06em", fontWeight: "700" },
        ],
        "display-md": [
          "clamp(2.6rem, 9.2cqw, 5.6rem)",
          { lineHeight: "0.83", letterSpacing: "-0.05em", fontWeight: "700" },
        ],
        // Names/titles inside contained surfaces (dialog, panels).
        "display-sm": [
          "clamp(2.3rem, 6vw, 3.1rem)",
          { lineHeight: "0.78", letterSpacing: "-0.06em", fontWeight: "700" },
        ],
        lead: [
          "clamp(1.35rem, min(3.4vw, 5.6svh), 3.4rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        "lead-sm": [
          "clamp(1.25rem, 2.2vw, 2.3rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" },
        ],
        body: [
          "0.875rem",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-lg": [
          "clamp(1rem, 1.3vw, 1.125rem)",
          { lineHeight: "1.45", letterSpacing: "-0.012em", fontWeight: "400" },
        ],
        kicker: [
          "var(--type-utility)",
          {
            lineHeight: "1.25",
            letterSpacing: "var(--track-utility)",
            fontWeight: "700",
          },
        ],
      },
      transitionTimingFunction: {
        edge: "cubic-bezier(0.2, 0, 0, 1)",
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translate3d(0, 0.75rem, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        "rise-in": "rise-in 320ms cubic-bezier(0.2, 0, 0, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
