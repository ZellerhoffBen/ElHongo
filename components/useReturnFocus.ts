"use client";

import { useCallback, useRef } from "react";

/**
 * Returns focus to whatever opened a modal.
 *
 * Chromium and Firefox do this themselves when a `<dialog>` closes. WebKit does
 * not — on macOS and iOS Safari the caret is dropped on `<body>`, so a keyboard
 * user who dismisses the profile or the plate viewer restarts from the top of
 * the document. This closes that gap without fighting the engines that already
 * get it right: if focus was already restored, `restore` does nothing.
 *
 * Pair it with `focusOpener` on the trigger — Safari also does not focus a
 * `<button>` when it is clicked, so without that there is nothing to return to.
 */
export function useReturnFocus() {
  const openerRef = useRef<HTMLElement | null>(null);

  const remember = useCallback(() => {
    const active = document.activeElement;
    openerRef.current =
      active instanceof HTMLElement && active !== document.body ? active : null;
  }, []);

  const restore = useCallback(() => {
    const opener = openerRef.current;
    openerRef.current = null;

    if (!opener?.isConnected) return;
    if (document.activeElement === opener) return;

    opener.focus({ preventScroll: true });
  }, []);

  return { remember, restore };
}

/** Makes the clicked control the focus target, on every engine. */
export const focusOpener = (event: { currentTarget: HTMLElement }) =>
  event.currentTarget.focus({ preventScroll: true });
