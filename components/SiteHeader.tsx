"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileTrigger } from "@/components/ArtistProfile";
import { isNavItemActive, navItems } from "@/lib/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="page-x tone-paper fixed inset-x-0 top-0 z-50 flex h-[var(--site-header-offset)] items-stretch justify-between border-b border-ink bg-paper kicker text-ink">
      {/* Hit areas fill the header height — the label is 11px, the target is 56px. */}
      <ProfileTrigger className="nav-mark -ml-2 flex items-center px-2" />

      <nav aria-label="Hauptnavigation" className="flex items-stretch">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isNavItemActive(item, pathname) ? "page" : undefined}
            className="nav-link flex items-center px-3 last:-mr-2 sm:px-4"
          >
            <span className="nav-underline">{item.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
