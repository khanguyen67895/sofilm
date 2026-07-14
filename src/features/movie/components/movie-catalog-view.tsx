"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/common/reveal";
import { MovieGrid } from "@/components/movie/movie-grid";
import { useMovieCatalog } from "../hooks/use-movie-catalog";

export function MovieCatalogView() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMovieCatalog();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:gap-4 sm:px-8 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-2/3 w-full" />
        ))}
      </div>
    );
  }

  const movies = data.pages.flatMap((page) => page.items);

  return (
    <div className="py-8">
      <Reveal>
        <h1 className="mb-6 px-4 text-2xl font-bold text-white sm:px-8">
          All Movies
        </h1>
      </Reveal>
      <MovieGrid
        movies={movies}
        isFetchingMore={isFetchingNextPage}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
        }}
      />
    </div>
  );
}
