"use client";

import { VirtuosoGrid } from "react-virtuoso";
import { MovieCard } from "./movie-card";
import { Spinner } from "@/components/ui/spinner";
import type { Movie } from "@/types/movie";

interface MovieGridProps {
  movies: Movie[];
  onEndReached?: () => void;
  isFetchingMore?: boolean;
}

export function MovieGrid({ movies, onEndReached, isFetchingMore }: MovieGridProps) {
  return (
    <div className="relative">
      <VirtuosoGrid
        useWindowScroll
        data={movies}
        endReached={onEndReached}
        listClassName="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:gap-4 sm:px-8 lg:grid-cols-6"
        itemContent={(_, movie) => <MovieCard movie={movie} />}
      />
      {isFetchingMore && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}
    </div>
  );
}
