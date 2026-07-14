"use client";

import { motion } from "framer-motion";
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
      {episodes.map((ep) => {
        const isActive = currentEpisode === ep.episodeNumber;
        return (
          <motion.button
            key={ep.id}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => play(slug, ep.episodeNumber)}
            className={cn(
              "relative rounded-md border border-white/15 py-2 text-sm font-medium text-white/80 transition-colors hover:border-red-500 hover:text-white",
              isActive && "text-white"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="episode-active-bg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-md border border-red-500 bg-red-600/20"
              />
            )}
            <span className="relative">{ep.episodeNumber}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
