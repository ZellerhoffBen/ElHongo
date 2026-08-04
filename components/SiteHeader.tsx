"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const archiveIsActive =
    pathname.startsWith("/archive") || pathname.startsWith("/work");

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--site-header-offset)] items-center justify-between border-b border-black bg-[var(--paper)] px-5 text-[11px] font-bold uppercase leading-none tracking-[0.18em] text-black sm:px-7 sm:text-xs">
      <Link
        href="/"
        className="nav-mark"
      >
        EL HONGO
      </Link>

      <nav aria-label="Hauptnavigation" className="flex items-center gap-5 sm:gap-8">
        <Link
          href="/"
          aria-current={!archiveIsActive ? "page" : undefined}
          className="nav-link"
        >
          Atelier
        </Link>
        <Link
          href="/archive"
          aria-current={archiveIsActive ? "page" : undefined}
          className="nav-link"
        >
          Archiv
        </Link>
      </nav>
    </header>
  );
}
