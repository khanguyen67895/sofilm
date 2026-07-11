"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Clapperboard, Crown, User } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

const ITEMS = [
  { href: ROUTES.home, label: "Trang chủ", icon: Home },
  { href: ROUTES.search, label: "Tìm kiếm", icon: Search },
  { href: ROUTES.shorts, label: "Shorts", icon: Clapperboard },
  { href: ROUTES.subscription, label: "VIP", icon: Crown },
  { href: ROUTES.profile, label: "Cá nhân", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-14 items-center justify-around border-t border-white/10 bg-black/90 backdrop-blur-md md:hidden">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === ROUTES.home ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-col items-center gap-0.5 text-white/60",
              isActive && "text-white"
            )}
          >
            <Icon size={18} />
            <span className="text-[10px]">{label}</span>
            {isActive && (
              <motion.span
                layoutId="mobile-nav-active"
                className="absolute -top-1.5 h-1 w-1 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
