"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// A nav link that highlights itself when its page (or a sub-page) is open.
// Needs to run in the browser to know the current URL, hence "use client".
export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`whitespace-nowrap rounded-full px-2 py-1.5 text-sm sm:px-3 ${
        active ? "bg-surface-hover text-fg" : "text-muted hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}
