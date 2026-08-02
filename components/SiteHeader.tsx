"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mainNavigation } from "@/lib/navigation";
import { getNextSiteHeaderState } from "@/lib/siteHeaderVisibility";

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const previousYRef = useRef(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    previousYRef.current = window.scrollY;

    function syncHeaderVisibility() {
      const nextState = getNextSiteHeaderState({
        previousY: previousYRef.current,
        nextY: window.scrollY,
        hidden: hiddenRef.current,
      });

      previousYRef.current = nextState.previousY;

      if (hiddenRef.current !== nextState.hidden) {
        hiddenRef.current = nextState.hidden;
        setHidden(nextState.hidden);
        document.documentElement.dataset.siteHeaderHidden = String(
          nextState.hidden,
        );
      }
    }

    window.addEventListener("scroll", syncHeaderVisibility, { passive: true });
    syncHeaderVisibility();

    return () => {
      window.removeEventListener("scroll", syncHeaderVisibility);
      delete document.documentElement.dataset.siteHeaderHidden;
    };
  }, []);

  return (
    <header
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between bg-white px-5 py-5 text-[11px] font-bold leading-none tracking-[0.18em] text-black transition-transform duration-200 ease-out sm:px-7 sm:py-6 sm:text-xs",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      <Link
        href="/"
        className="pointer-events-auto nav-mark group"
        aria-label="EL HONGO home"
      >
        <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-px group-hover:skew-x-[-7deg]">
          EL HONGO
        </span>
      </Link>

      <nav
        aria-label="Main navigation"
        className="pointer-events-auto flex items-center gap-2 text-right sm:gap-3"
      >
        {mainNavigation.map((item, index) => (
          <span key={item.href} className="flex items-center gap-2 sm:gap-3">
            {index > 0 ? <span aria-hidden="true">|</span> : null}
            <Link href={item.href} className="nav-link">
              {item.label}
            </Link>
          </span>
        ))}
      </nav>
    </header>
  );
}
