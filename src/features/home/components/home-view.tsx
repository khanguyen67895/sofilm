"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { MovieRow } from "@/components/movie/movie-row";
import { ROUTES } from "@/constants/routes";
import { useHomeRows } from "../hooks/use-home-rows";
import { useHeroBanners } from "../hooks/use-hero-banners";
import { useTrending } from "../hooks/use-trending";
import { useLatestMovies } from "../hooks/use-latest-movies";
import { useMoviesPreview } from "../hooks/use-movies-preview";
import { HeroBanner } from "./hero-banner";
import { TrendingRow } from "./trending-row";
import { AllMoviesSection } from "./all-movies-section";

export function HomeView() {
  const { data: rows, isLoading: isRowsLoading, isError: isRowsError, refetch } = useHomeRows();
  const { data: heroBanners } = useHeroBanners();
  const { data: latestMovies } = useLatestMovies(10);
  const { data: trending } = useTrending();
  const { data: preview } = useMoviesPreview();

  if (isRowsError) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-24 text-center">
        <p className="text-white/70">Không thể tải dữ liệu trang chủ.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium text-brand hover:underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

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

  const heroItems =
    heroBanners && heroBanners.length > 0 ? heroBanners : (latestMovies ?? []);
  const nonEmptyRows = rows.filter((row) => row.movies.length > 0);
  const hasTrending = Boolean(trending && trending.length > 0);
  const hasPreview = Boolean(preview && preview.length > 0);

  if (
    heroItems.length === 0 &&
    nonEmptyRows.length === 0 &&
    !hasTrending &&
    !hasPreview
  ) {
    return (
      <EmptyState
        title="Chưa có phim nào"
        description="Phim mới đang được tải lên, quay lại sau bạn nhé!"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-10 pb-16"
    >
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}
      <div className="space-y-10">
        {nonEmptyRows.map((row) => (
          <MovieRow key={row.id} row={row} viewAllHref={ROUTES.category} />
        ))}
        {hasTrending && <TrendingRow movies={trending!} />}
        {hasPreview && <AllMoviesSection movies={preview!} />}
      </div>
    </motion.div>
  );
}
