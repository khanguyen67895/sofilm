"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { usePlayerStore } from "@/store/player.store";
import type { Episode } from "@/types/movie";

interface EpisodeSidebarProps {
  slug: string;
  episodes: Episode[];
  onClose?: () => void;
}

export function EpisodeSidebar({ slug, episodes, onClose }: EpisodeSidebarProps) {
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const play = usePlayerStore((s) => s.play);

  return (
    <div className="w-full overflow-hidden rounded-3xl border-[0.6px] border-[#5d5d5d]/60">
      <div className="flex items-center justify-between border-b-[0.6px] border-[#5d5d5d]/60 p-4">
        <h3 className="font-display text-xl font-semibold text-white">Episode List</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close episode list"
            className="text-white/50 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {episodes.map((ep) => {
          const isActive = currentEpisode === ep.episodeNumber;
          return (
            <motion.button
              key={ep.id}
              type="button"
              onClick={() => play(slug, ep.episodeNumber)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-xl px-4 py-2.5 text-base transition-colors",
                isActive ? "bg-brand/16 text-brand" : "bg-white/5 text-white hover:bg-white/10"
              )}
            >
              Episode {ep.episodeNumber}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
