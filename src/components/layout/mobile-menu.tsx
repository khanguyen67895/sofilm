"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Clapperboard, Home, LayoutGrid, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/utils/cn";
import { SearchIcon } from "./header-icons";

const NAV_ITEMS = [
  { href: ROUTES.home, label: "Home", icon: Home },
  { href: ROUTES.category, label: "Category", icon: LayoutGrid },
  { href: ROUTES.shorts, label: "Shorts", icon: Clapperboard },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/** Dropdown panel anchored under the header on mobile — a search field on
 * top, the three primary nav links in the middle (active one pilled in
 * brand), and auth actions pinned to the bottom (Log In / Sign Up for
 * guests, Sign Out once signed in). Replaces the old bottom tabbar. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearSession = useAuthStore((s) => s.clearSession);
  // `isAuthenticated` comes from a localStorage-persisted store, unavailable
  // during SSR — gate on hydration so the first client render matches the
  // server's logged-out shape instead of hydration-mismatching.
  const mounted = useHydrated();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    onClose();
    router.push(q ? `${ROUTES.search}?q=${encodeURIComponent(q)}` : ROUTES.search);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="pointer-events-auto fixed inset-0 z-40 bg-black/60 md:hidden"
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto absolute inset-x-4 top-full z-50 mt-2 space-y-4 rounded-3xl border border-brand/30 bg-black/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <form
              onSubmit={handleSearch}
              className="flex h-12 items-center justify-between gap-2 rounded-full bg-white/5 px-4"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Searching for movies..."
                className="font-heading h-full w-full bg-transparent text-sm font-light text-white outline-none placeholder:text-white/40"
              />
              <button type="submit" aria-label="Search" className="shrink-0">
                <SearchIcon width={18} height={18} />
              </button>
            </form>

            <div className="border-t border-white/10" />

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = href === ROUTES.home ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-brand/15 text-brand" : "text-white/90 hover:bg-white/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                        isActive ? "border-brand/50 bg-brand/15 text-brand" : "border-white/15 text-white/70"
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10" />

            {mounted && isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  clearSession();
                  onClose();
                }}
              >
                <LogOut size={16} /> Sign Out
              </Button>
            ) : (
              <div className="flex gap-3">
                <Link href={ROUTES.login} className="flex-1" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href={ROUTES.register} className="flex-1" onClick={onClose}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
