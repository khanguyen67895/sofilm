"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { MovieCard } from "@/components/movie/movie-card";
import { useSearchMovies } from "../hooks/use-search-movies";

export function SearchView() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const { data: movies, isFetching, isError, refetch } = useSearchMovies(query);

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
          placeholder="Search movies, series..."
          className="pl-10"
        />
      </div>

      <AnimatePresence mode="wait">
        {isFetching ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-6"
          >
            <Spinner />
          </motion.div>
        ) : isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2 py-6 text-center"
          >
            <p className="text-white/50">Search isn&apos;t available right now. Please try again.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm font-medium text-brand hover:underline"
            >
              Retry
            </button>
          </motion.div>
        ) : movies && movies.length === 0 && query.trim() ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-white/50"
          >
            No results found for &quot;{query}&quot;.
          </motion.p>
        ) : (
          <motion.div
            key={query}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6"
          >
            {movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
