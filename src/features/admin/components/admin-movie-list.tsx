"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { resolveImageSrc } from "@/utils/image";
import { useAdminMovies } from "../hooks/use-admin-movies";
import { useDeleteMovie } from "../hooks/use-delete-movie";

const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function AdminMovieList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminMovies(page);
  const deleteMovie = useDeleteMovie();

  function handleDelete(e: React.MouseEvent, id: string, title: string) {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Xoá phim "${title}"? Hành động này không thể hoàn tác.`)) {
      deleteMovie.mutate(id);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-white">Danh Sách Phim</h2>
        <Link href={ROUTES.adminMovieNew}>
          <Button size="sm">
            <PlusCircle size={16} /> Đăng Phim Mới
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/10 rounded-md border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              variants={{ show: { transition: { staggerChildren: 0.04 } } }}
            >
              {data?.items.map((movie) => (
                <motion.div key={movie.id} variants={ROW_VARIANTS}>
                  <Link
                    href={ROUTES.adminMovieEdit(movie.id)}
                    className="flex items-center gap-4 border-b border-white/10 px-4 py-3 transition-colors last:border-b-0 hover:bg-white/5"
                  >
                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-white/5">
                      <Image
                        src={resolveImageSrc(movie.poster, PLACEHOLDER_IMAGE)}
                        alt={movie.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{movie.title}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/70">
                          {movie.type === "SERIES" ? "Phim Bộ" : "Phim Lẻ"}
                        </span>
                        {movie.isPremium && (
                          <span className="rounded-md bg-brand/15 px-2 py-0.5 text-[11px] text-brand">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={`Xoá phim ${movie.title}`}
                      disabled={deleteMovie.isPending}
                      onClick={(e) => handleDelete(e, movie.id, movie.title)}
                      className="shrink-0 text-white/40 hover:text-red-500 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </Link>
                </motion.div>
              ))}
              {data?.items.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-white/50">Chưa có phim nào.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {data && (
        <div className="flex items-center justify-between text-sm text-white/60">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="transition-opacity disabled:opacity-40"
          >
            Trước
          </button>
          <span>Trang {data.page}</span>
          <button
            type="button"
            disabled={!data.hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="transition-opacity disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
