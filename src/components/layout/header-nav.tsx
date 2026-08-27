"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.category, label: "Category" },
  { href: ROUTES.shorts, label: "Short" },
];

export function HeaderNav({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === ROUTES.home ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "font-heading relative pb-2 text-base font-normal transition-colors",
              isActive ? "text-brand" : "text-white/80 hover:text-white"
            )}
          >
            {link.label}
            {isActive && (
              <motion.span
                layoutId="header-nav-underline"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-x-0 -bottom-px h-px bg-brand"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
