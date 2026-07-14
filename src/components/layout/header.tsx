"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { isChromeLessRoute, ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/use-hydrated";
import { HeaderNav } from "./header-nav";
import { HeaderSearch } from "./header-search";
import { HeaderActions } from "./header-actions";

export function Header() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  // `user` comes from a localStorage-persisted store, which is unavailable
  // during SSR — gate on hydration so the client's first render matches the
  // server's logged-out shape instead of hydration-mismatching.
  const mounted = useHydrated();

  if (isChromeLessRoute(pathname)) return null;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-transparent"
    >
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-8 lg:px-16">
        <Link href={ROUTES.home} className="shrink-0">
          <Image src="/image/ic_logo.png" alt="SOFILM" width={140} height={35} priority />
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <HeaderNav pathname={pathname} />
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <HeaderSearch />
          <HeaderActions avatar={mounted ? user?.avatar : undefined} />
        </div>
      </div>
    </motion.header>
  );
}
