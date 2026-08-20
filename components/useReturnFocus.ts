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

  const restore = useCallback(
    ({ focusVisible = true }: { focusVisible?: boolean } = {}) => {
      const opener = openerRef.current;
      openerRef.current = null;

      if (!opener?.isConnected) return;

      // Safari can classify programmatically restored focus as `:focus-visible`
      // even when a pointer closed the dialog. Keep the focus itself for
      // accessibility, but silence its ring until the user moves away. Keyboard
      // dismissals retain the normal, visible focus treatment.
      if (focusVisible) {
        delete opener.dataset.returnFocus;
      } else {
        opener.dataset.returnFocus = "silent";
        opener.addEventListener(
          "blur",
          () => delete opener.dataset.returnFocus,
          { once: true },
        );
      }

      // Native dialog implementations may already have returned focus by the
      // time this runs. The marker above must still be applied in that case.
      if (document.activeElement === opener) return;

      opener.focus({ preventScroll: true });
    },
    [],
  );

  return { remember, restore };
}

/** Makes the clicked control the focus target, on every engine. */
export const focusOpener = (event: { currentTarget: HTMLElement }) =>
  event.currentTarget.focus({ preventScroll: true });
