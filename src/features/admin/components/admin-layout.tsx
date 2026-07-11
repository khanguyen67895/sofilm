import Link from "next/link";
import type { ReactNode } from "react";
import { ROUTES } from "@/constants/routes";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <nav className="mb-8 flex items-center gap-6 border-b border-white/10 pb-4">
        <Link
          href={ROUTES.adminMovies}
          className="font-heading text-sm tracking-wide text-white/80 uppercase hover:text-white"
        >
          Quản Lý Phim
        </Link>
        <Link
          href={ROUTES.adminMovieNew}
          className="font-heading text-sm tracking-wide text-white/80 uppercase hover:text-white"
        >
          + Thêm Phim
        </Link>
      </nav>
      {children}
    </div>
  );
}
