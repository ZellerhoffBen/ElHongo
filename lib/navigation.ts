export type NavItem = {
  href: string;
  label: string;
};

/**
 * Single source of truth for the header's linked destinations.
 *
 * The wordmark is no longer one of them: it is the link home, as every other
 * site on the web has taught visitors to expect. `Profil` is not here either —
 * it opens a dialog rather than navigating, so the header renders it as a
 * named button beside these links instead of disguising it as a place.
 */
export const navItems: NavItem[] = [
  { href: "/", label: "Atelier" },
  { href: "/archive", label: "Archiv" },
];

/**
 * The archive owns every project view, including the legacy `/work/*` routes
 * that redirect into it, so those paths must keep the Archiv link current.
 *
 * Everything else must match exactly. Treating "not the archive" as "the
 * homepage" told a visitor on a 404 that they were in the Atelier.
 */
export const isNavItemActive = (item: NavItem, pathname: string): boolean => {
  if (item.href === "/archive") {
    return pathname.startsWith("/archive") || pathname.startsWith("/work");
  }

  return pathname === item.href;
};
