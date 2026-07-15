"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { usePlayerStore } from "@/store/player.store";
import type { Episode } from "@/types/movie";

interface EpisodeSidebarProps {
  slug: string;
  title: string;
  episodes: Episode[];
}

export function EpisodeSidebar({ slug, title, episodes }: EpisodeSidebarProps) {
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const play = usePlayerStore((s) => s.play);

  return (
    <div className="flex h-full max-h-125 flex-col rounded-lg bg-white/5 lg:max-h-full">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Danh Sách Tập</h3>
      </div>
      <div className="scrollbar-none flex-1 space-y-1 overflow-y-auto p-2">
        {episodes.map((ep) => {
          const isActive = currentEpisode === ep.episodeNumber;
          return (
            <motion.button
              key={ep.id}
              type="button"
              onClick={() => play(slug, ep.episodeNumber)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-white/10",
                isActive && "bg-brand/15"
              )}
            >
              <div
                className={cn(
                  "relative h-10 w-16 shrink-0 overflow-hidden rounded bg-white/10",
                  isActive && "ring-2 ring-brand"
                )}
              >
                {ep.thumbnail && (
                  <Image src={ep.thumbnail} alt={ep.title} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <span
                className={cn(
                  "truncate text-xs",
                  isActive ? "font-medium text-brand" : "text-white/80"
                )}
              >
                {title} - Tập {ep.episodeNumber}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
