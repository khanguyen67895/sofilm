"use client";

import { MovieCard } from "@/components/movie/movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimilarMovies } from "../hooks/use-similar-movies";

export function SimilarMoviesSection({ slug }: { slug: string }) {
  const { data: movies, isLoading } = useSimilarMovies(slug);

  if (!isLoading && (!movies || movies.length === 0)) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Similar Movies</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-3/5 w-full" />)
          : movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
}
