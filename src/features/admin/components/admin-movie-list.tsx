"use client";

import { useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { useAdminMovies } from "../hooks/use-admin-movies";

export function AdminMovieList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminMovies(page);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-white/10 rounded-md border border-white/10">
        {data?.items.map((movie) => (
          <Link
            key={movie.id}
            href={ROUTES.adminMovieEdit(movie.id)}
            className="flex items-center justify-between px-4 py-3 hover:bg-white/5"
          >
            <div>
              <p className="text-sm font-medium text-white">{movie.title}</p>
              <p className="text-xs text-white/50">
                {movie.type === "SERIES" ? "Phim Bộ" : "Phim Lẻ"}
                {movie.isPremium ? " · Premium" : ""}
              </p>
            </div>
          </Link>
        ))}
        {data?.items.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-white/50">Chưa có phim nào.</p>
        )}
      </div>

      {data && (
        <div className="flex items-center justify-between text-sm text-white/60">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            Trước
          </button>
          <span>Trang {data.page}</span>
          <button
            type="button"
            disabled={!data.hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
