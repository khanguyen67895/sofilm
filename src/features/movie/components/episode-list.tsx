"use client";

import { cn } from "@/utils/cn";
import { usePlayerStore } from "@/store/player.store";
import type { Episode } from "@/types/movie";

export function EpisodeList({
  slug,
  episodes,
}: {
  slug: string;
  episodes: Episode[];
}) {
  const { currentEpisode, play } = usePlayerStore();

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {episodes.map((ep) => (
        <button
          key={ep.id}
          type="button"
          onClick={() => play(slug, ep.episodeNumber)}
          className={cn(
            "rounded-md border border-white/15 py-2 text-sm font-medium text-white/80 transition-colors hover:border-red-500 hover:text-white",
            currentEpisode === ep.episodeNumber &&
              "border-red-500 bg-red-600/20 text-white"
          )}
        >
          {ep.episodeNumber}
        </button>
      ))}
    </div>
  );
}
