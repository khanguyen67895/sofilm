"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Clapperboard, Crown, Home, LayoutGrid, Search, User } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

const ITEMS = [
  { href: ROUTES.home, label: "Trang chủ", icon: Home },
  { href: ROUTES.category, label: "Danh mục", icon: LayoutGrid },
  { href: ROUTES.search, label: "Tìm kiếm", icon: Search },
  { href: ROUTES.shorts, label: "Shorts", icon: Clapperboard },
  { href: ROUTES.subscription, label: "VIP", icon: Crown },
  { href: ROUTES.profile, label: "Cá nhân", icon: User },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/** Replaces the old bottom tabbar — navigation now lives behind the
 * hamburger button in the header instead of a persistent tab strip. A
 * dropdown panel anchored under the header, not a full-screen takeover, so
 * it stays consistent with how NotificationBell's panel already behaves. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-4 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
          >
            {ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === ROUTES.home ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white",
                    isActive && "bg-brand/15 text-brand"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
