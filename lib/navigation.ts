export type NavItem = {
  href: string;
  label: string;
};

/** Single source of truth for the header navigation. */
export const navItems: NavItem[] = [
  { href: "/", label: "Atelier" },
  { href: "/archive", label: "Archiv" },
];

/**
 * The archive owns every project view, including the legacy `/work/*` routes
 * that redirect into it, so those paths must keep the Archiv link current.
 */
export const isNavItemActive = (item: NavItem, pathname: string): boolean => {
  const archiveIsActive =
    pathname.startsWith("/archive") || pathname.startsWith("/work");

  return item.href === "/archive" ? archiveIsActive : !archiveIsActive;
};
