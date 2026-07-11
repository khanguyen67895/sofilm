"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

const NAV_LINKS = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.category, label: "Category" },
  { href: ROUTES.shorts, label: "Short" },
];

const DEFAULT_AVATAR = "https://picsum.photos/seed/sofilm-avatar/88/88";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `${ROUTES.search}?q=${encodeURIComponent(q)}` : ROUTES.search);
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-44 bg-linear-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute -top-16 left-1/3 -z-10 h-56 w-72 rounded-full bg-brand/20 blur-3xl" />

      <div className="flex h-20 items-center justify-between gap-4 px-4 backdrop-blur-sm sm:px-8 lg:px-16">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === ROUTES.home
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-heading border-b border-transparent pb-2 text-base font-normal text-white transition-colors",
                    isActive && "border-brand"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <form
            onSubmit={handleSearch}
            className="hidden h-11 w-56 items-center justify-between gap-2 rounded-3xl border border-white/10 bg-white/10 px-4 sm:flex lg:w-96"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Searching for movies..."
              className="font-heading h-full w-full bg-transparent text-sm font-light text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="shrink-0 text-white/60 transition-colors hover:text-white"
            >
              <Search size={18} />
            </button>
          </form>

          <Link href={ROUTES.subscription} className="hidden sm:block">
            <Button size="md">Upgrade</Button>
          </Link>

          <Link
            href={ROUTES.profile}
            aria-label="Tài khoản"
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-stone-300"
          >
            <Image
              src={user?.avatar || DEFAULT_AVATAR}
              alt="Avatar"
              fill
              sizes="44px"
              className="object-cover"
            />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
