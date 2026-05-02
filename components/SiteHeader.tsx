import Link from "next/link";
import { mainNavigation } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-5 text-[11px] font-bold leading-none tracking-[0.18em] text-white mix-blend-difference sm:px-7 sm:py-6 sm:text-xs">
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
