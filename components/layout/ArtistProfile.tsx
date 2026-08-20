"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { focusOpener, useReturnFocus } from "@/components/useReturnFocus";
import { ARROW_RIGHT, ARROW_UP_RIGHT } from "@/lib/glyphs";

const path = [
  {
    year: "2024",
    stage: "Gymnasium",
    place: "LG Rämibühl, Zürich",
  },
  {
    year: "2025",
    stage: "Propädeutikum",
    place: "ZHdK, Zürich",
  },
  {
    year: "2027",
    stage: "Illustration",
    place: "Hamburg",
  },
];

type ProfileContextValue = {
  open: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * The dialog is mounted once for the whole site so that any number of triggers
 * can open it. `showModal` supplies the focus trap and the inert background;
 * focus return is handled by `useReturnFocus`, because WebKit does not.
 */
export function ArtistProfileProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { remember, restore } = useReturnFocus();

  const open = useCallback(() => {
    remember();
    dialogRef.current?.showModal();
  }, [remember]);

  const close = useCallback(
    (focusVisible = false) => {
      dialogRef.current?.close();
      restore({ focusVisible });
    },
    [restore],
  );

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
      <ArtistProfileDialog dialogRef={dialogRef} onClose={close} />
    </ProfileContext.Provider>
  );
}

function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("Profile triggers must be rendered inside ArtistProfileProvider");
  }
  return context;
}

/**
 * The named header control.
 *
 * The wordmark used to do this job, which meant the one element every visitor
 * expects to be Home was an About button instead. The action now says what it
 * is and sits with the other navigation.
 */
export function ProfileNavTrigger({ className }: { className?: string }) {
  const { open } = useProfile();

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-controls="artist-profile"
      className={["border-0 bg-transparent", className ?? ""].join(" ")}
      onClick={(event) => {
        focusOpener(event);
        open();
      }}
    >
      <span className="nav-underline">Profil</span>
    </button>
  );
}

/**
 * Discoverable second entry point, in the flow of the homepage identity block.
 */
export function ProfileLink({ className }: { className?: string }) {
  const { open } = useProfile();

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-controls="artist-profile"
      className={["btn btn-primary", className ?? ""].join(" ")}
      onClick={(event) => {
        focusOpener(event);
        open();
      }}
    >
      Profil <span aria-hidden="true">{ARROW_UP_RIGHT}</span>
    </button>
  );
}

function ArtistProfileDialog({
  dialogRef,
  onClose,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onClose: (focusVisible?: boolean) => void;
}) {
  return (
    <dialog
      ref={dialogRef}
      id="artist-profile"
      aria-labelledby="artist-profile-title"
      aria-describedby="artist-profile-copy"
      className="profile-dialog tone-paper text-ink"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        // Native <dialog> already treats Escape as a close request, but which
        // engine honours it — and whether a synthetic key event counts — varies.
        // Cancelling the default and closing here gives every browser, and every
        // test harness, exactly one deterministic path.
        event.preventDefault();
        onClose(true);
      }}
    >
      <div className="profile-dialog-body bg-paper">
        {/* Record header. The name lives in the identity plate below, so this
            strip only says what kind of entry this is. */}
        <div className="flex min-h-11 items-stretch justify-between border-b border-ink">
          <div className="flex items-center px-5 sm:px-6">
            <span className="kicker text-fg-faint">Profil</span>
          </div>
          <button
            type="button"
            aria-label="Profil schliessen"
            className="profile-close flex min-h-11 shrink-0 items-center gap-2 border-l border-ink bg-paper px-4 kicker text-ink"
            onClick={() => onClose(false)}
          >
            <span>Schliessen</span>
            <span aria-hidden="true" className="text-lg font-normal leading-none">×</span>
          </button>
        </div>

        <div className="grid md:grid-cols-[19rem_minmax(0,1fr)]">
          {/*
            Identity plate. Ink tone, so the dialog carries the same paper/ink
            duality as the spreads and the selected register row. The portrait is
            a mounted rectangular plate — the site has no circles anywhere else.
          */}
          <aside className="tone-ink flex items-stretch border-b border-ink bg-surface text-fg md:flex-col md:border-b-0 md:border-r">
            <figure className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden border-r border-rule-soft bg-wash sm:w-28 md:aspect-[4/3] md:w-full md:border-b md:border-r-0">
              <Image
                src="/jonas_portrait.png"
                alt="Porträt von Jonas Aellig"
                fill
                priority
                sizes="(min-width: 768px) 304px, 112px"
                className="object-cover object-[center_26%]"
              />
            </figure>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:gap-5 sm:p-6 md:gap-8 md:p-7">
              <div className="min-w-0">
                <h2
                  id="artist-profile-title"
                  className="text-display-sm uppercase"
                >
                  <span className="block">Jonas</span>
                  <span className="block">Aellig</span>
                </h2>
                <p className="kicker mt-3 text-fg-faint sm:mt-4">aka EL HONGO</p>
              </div>
              <p className="kicker text-fg-faint">Zürich {ARROW_RIGHT} Hamburg</p>
            </div>
          </aside>

          {/* Both columns are anchored top and bottom: portrait/locator on the
              ink side, note/path on the paper side. */}
          <div className="flex flex-col p-4 [container-type:inline-size] sm:p-6 md:p-8">
            {/* The auto margin sits here, not on the path section, so the
                minimum gap survives when there is no slack to absorb. */}
            <section className="md:mb-auto">
              <p className="kicker text-fg-faint">Notiz zur Person</p>
              <p
                id="artist-profile-copy"
                className="mt-3 max-w-[42ch] text-sm leading-[1.45] normal-case sm:mt-4 sm:text-body-lg"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur sit amet risus eget mauris posuere interdum. Nunc
                vulputate, neque at viverra tincidunt, justo lacus sodales
                risus, vitae malesuada libero lorem sed erat.
              </p>
            </section>

            <section
              aria-labelledby="artist-profile-path"
              className="mt-5 border-t border-ink pt-4 sm:mt-section-sm sm:pt-5 md:pt-6"
            >
              <h3 id="artist-profile-path" className="kicker">
                Weg
              </h3>

              <ol className="path-list mt-4 sm:mt-5">
                {path.map((item, index) => {
                  const isCurrent = index === path.length - 1;

                  return (
                    <li
                      key={item.year}
                      className="path-step relative min-w-0 pt-3 sm:pt-5"
                    >
                      <span
                        aria-hidden="true"
                        className={[
                          "absolute -top-[3px] left-0 h-1.5 w-1.5",
                          isCurrent ? "bg-accent" : "bg-fg",
                        ].join(" ")}
                      />
                      <time className="block text-lg font-bold leading-none tracking-[-0.04em]">
                        {item.year}
                      </time>
                      <p className="kicker mt-2 [overflow-wrap:anywhere] text-fg-faint">{item.stage}</p>
                      <p className="mt-1.5 text-[11px] font-bold normal-case leading-tight [overflow-wrap:anywhere]">
                        {item.place}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </dialog>
  );
}
