"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { MovieCard } from "@/components/movie/movie-card";
import { useFavorites } from "../hooks/use-favorites";

export function FavoritesSection() {
  const { data: favorites, isLoading, isError, refetch } = useFavorites();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Favorites</h2>

      {isError ? (
        <ErrorState title="Couldn't load your favorites." onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-2/3 w-full" />
          ))}
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorites yet"
          description="Tap the heart icon on a movie you like to save it here."
        />
      )}
    </div>
  );
}
