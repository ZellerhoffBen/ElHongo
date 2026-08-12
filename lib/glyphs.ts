/**
 * Arrows, each followed by U+FE0E — the text presentation selector.
 *
 * These code points have no colour of their own, but iOS treats them as
 * emoji candidates and substitutes Apple Color Emoji when the page font has
 * no glyph for them. The site's hairline arrows then arrive on iPhones as fat
 * blue-and-white system emoji: the one platform most visitors are on is the
 * one that breaks the typography. U+FE0E asks for the text glyph explicitly,
 * so every engine renders the same drawn arrow.
 *
 * Import these rather than typing the bare character — a literal `↗` in JSX
 * looks correct in the editor and on the desktop browser, which is exactly
 * what makes the iOS regression easy to reintroduce.
 */
export const ARROW_UP_RIGHT = "↗︎";
export const ARROW_DOWN_RIGHT = "↘︎";
export const ARROW_UP = "↑︎";
export const ARROW_RIGHT = "→︎";
export const ARROW_LEFT = "←︎";
