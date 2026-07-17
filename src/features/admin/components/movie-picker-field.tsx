"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { useDebounce } from "@/hooks/use-debounce";
import { movieService } from "@/services/movie/movie.service";
import type { Movie } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

export interface PickedMovie {
  id: string;
  title: string;
  poster?: string;
}

interface MoviePickerFieldProps {
  selectedMovie: PickedMovie | null;
  onSelect: (movie: PickedMovie | null) => void;
}

/** Search-and-attach an already-uploaded movie by title — used to link a
 * banner (or anything else that needs it) to a movie so its Watch Now/More
 * Info actions have somewhere to go. Reuses the public title search endpoint
 * rather than the admin paginated list, since that one has no search/filter
 * of its own and listing every movie in a plain <select> doesn't scale. */
export function MoviePickerField({ selectedMovie, onSelect }: MoviePickerFieldProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const searchActive = debouncedQuery.trim().length > 1;

  const { data: results, isFetching } = useQuery({
    queryKey: ["admin", "movie-picker", debouncedQuery],
    queryFn: () => movieService.search(debouncedQuery),
    enabled: searchActive,
  });

  if (selectedMovie) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/5 p-2">
        <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-white/5">
          <Image
            src={resolveImageSrc(selectedMovie.poster, PLACEHOLDER_IMAGE)}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <p className="flex-1 truncate text-sm text-white">{selectedMovie.title}</p>
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-label="Bỏ gắn phim"
          className="text-white/50 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm phim theo tên để gắn..."
      />
      {searchActive && (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-white/15 bg-black shadow-xl">
          {isFetching ? (
            <div className="flex items-center justify-center py-4">
              <Spinner />
            </div>
          ) : results && results.length > 0 ? (
            results.map((movie: Movie) => (
              <button
                key={movie.id}
                type="button"
                onClick={() => {
                  onSelect({ id: movie.id, title: movie.title, poster: movie.poster });
                  setQuery("");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/10"
              >
                <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded bg-white/5">
                  <Image
                    src={resolveImageSrc(movie.poster, PLACEHOLDER_IMAGE)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="truncate text-sm text-white">{movie.title}</span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-white/50">Không tìm thấy phim.</p>
          )}
        </div>
      )}
    </div>
  );
}
