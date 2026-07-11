"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { MovieCard } from "@/components/movie/movie-card";
import { useSearchMovies } from "../hooks/use-search-movies";

export function SearchView() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const { data: movies, isFetching } = useSearchMovies(query);

  return (
    <div className="space-y-6 px-4 py-8 sm:px-8">
      <div className="relative max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm phim, series..."
          className="pl-10"
        />
      </div>

      {isFetching && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {!isFetching && movies && movies.length === 0 && query.trim() && (
        <p className="text-white/50">Không tìm thấy kết quả cho "{query}".</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
        {movies?.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
