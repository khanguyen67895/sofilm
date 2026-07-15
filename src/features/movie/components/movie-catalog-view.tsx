"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MovieCard } from "@/components/movie/movie-card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/utils/cn";
import { useGenres } from "../hooks/use-genres";
import { useCatalogPage } from "../hooks/use-catalog-page";

export function MovieCatalogView() {
  const { data: genres } = useGenres();
  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string>();
  const [page, setPage] = useState(1);

  const genreIndex = genres?.findIndex((g) => g.slug === selectedGenreSlug) ?? -1;
  const genreBucket =
    selectedGenreSlug && genres && genreIndex >= 0
      ? { slug: selectedGenreSlug, index: genreIndex, count: genres.length }
      : undefined;

  const { data, isLoading } = useCatalogPage(page, genreBucket);

  function selectGenre(slug: string | undefined) {
    setSelectedGenreSlug(slug);
    setPage(1);
  }

  function goToPage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-8 pb-8">
      <div className="relative -mt-20 overflow-hidden pt-28 pb-10">
        <Image
          src="/image/ic_bg_category.jfif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />

        <Reveal className="relative space-y-6 px-4 text-center sm:px-8">
          <h1 className="font-heading text-3xl font-bold text-white uppercase">Categories</h1>

          <div className="scrollbar-none flex flex-wrap items-center justify-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => selectGenre(undefined)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                !selectedGenreSlug
                  ? "bg-brand text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              )}
            >
              All
            </button>
            {genres?.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => selectGenre(genre.slug)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  selectedGenreSlug === genre.slug
                    ? "bg-brand text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {isLoading || !data ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4 sm:grid-cols-3 sm:px-8 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-2/3 w-full" />
          ))}
        </div>
      ) : (
        <motion.div
          key={page + (selectedGenreSlug ?? "all")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-x-4 gap-y-8 px-4 sm:grid-cols-3 sm:px-8 md:grid-cols-4 lg:grid-cols-6"
        >
          {data.items.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
