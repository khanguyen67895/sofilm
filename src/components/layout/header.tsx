"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";
import { useHydrated } from "@/hooks/use-hydrated";
import { HeaderNav } from "./header-nav";
import { HeaderSearch } from "./header-search";
import { HeaderActions } from "./header-actions";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  // `user` comes from a localStorage-persisted store, which is unavailable
  // during SSR — gate on hydration so the client's first render matches the
  // server's logged-out shape instead of hydration-mismatching.
  const mounted = useHydrated();
  const isMobileMenuOpen = useUiStore((s) => s.isMobileNavOpen);
  const toggleMobileMenu = useUiStore((s) => s.toggleMobileNav);

  // Auth and the admin CMS still render their own chrome-less shells.
  // Shorts keeps the header (users need a way back to the rest of the
  // site) but as a floating overlay instead of sticky-in-flow — the feed
  // is a sequence of exact 100dvh cards, so a header that consumes real
  // layout height would push every card 80px past the viewport.
  if (pathname.startsWith("/auth/") || pathname.startsWith(ROUTES.admin)) return null;
  const isShorts = pathname.startsWith(ROUTES.shorts);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={
        isShorts
          ? "pointer-events-none fixed inset-x-0 top-0 z-50 bg-linear-to-b from-black/70 to-transparent"
          : "sticky top-0 z-50 bg-transparent"
      }
    >
      <div className="relative flex h-20 items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8 lg:px-16">
        {/* On /shorts the header itself is pointer-events-none (so empty
         * gaps let clicks fall through to the video's own mute button and
         * tap-to-play beneath) — only these three interactive clusters
         * opt back in with pointer-events-auto. No-op on every other route,
         * where the header was already fully interactive. */}
        <Link href={ROUTES.home} className="pointer-events-auto shrink-0">
          <Image
            src="/image/ic_logo.png"
            alt="SOFILM"
            width={140}
            height={35}
            priority
            className="h-7 w-auto sm:h-9"
          />
        </Link>

        <div className="pointer-events-auto hidden flex-1 justify-center md:flex">
          <HeaderNav pathname={pathname} />
        </div>

        <div className="pointer-events-auto flex items-center gap-2 sm:gap-6">
          <HeaderSearch />
          <HeaderActions avatar={mounted ? user?.avatar : undefined} />
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 shrink-0 items-center justify-center md:hidden"
          >
            {isMobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Image src="/image/ic_sidebar_menu.png" alt="" width={48} height={48} />
            )}
          </button>
        </div>

        <MobileMenu open={isMobileMenuOpen} onClose={() => toggleMobileMenu()} />
      </div>
    </motion.header>
  );
}
