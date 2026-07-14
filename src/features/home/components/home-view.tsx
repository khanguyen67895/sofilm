"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { MovieRow } from "@/components/movie/movie-row";
import { ROUTES } from "@/constants/routes";
import { useHomeRows } from "../hooks/use-home-rows";
import { useTrending } from "../hooks/use-trending";
import { useMoviesPreview } from "../hooks/use-movies-preview";
import { HeroBanner } from "./hero-banner";
import { TrendingRow } from "./trending-row";
import { AllMoviesSection } from "./all-movies-section";

export function HomeView() {
  const { data: rows, isLoading: isRowsLoading } = useHomeRows();
  const { data: trending } = useTrending();
  const { data: preview } = useMoviesPreview();

  if (isRowsLoading || !rows) {
    return (
      <div className="space-y-6 px-4 py-8 sm:px-8">
        <Skeleton className="h-[62vh] min-h-95 w-full" />
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-2/3 w-32 sm:w-40" />
          ))}
        </div>
      </div>
    );
  }

  const heroMovies = rows[0]?.movies.slice(0, 6) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-10 pb-16"
    >
      {heroMovies.length > 0 && <HeroBanner movies={heroMovies} />}
      <div className="space-y-10">
        {rows.map((row) => (
          <MovieRow key={row.id} row={row} viewAllHref={ROUTES.category} />
        ))}
        {trending && <TrendingRow movies={trending} />}
        {preview && <AllMoviesSection movies={preview} />}
      </div>
    </motion.div>
  );
}
