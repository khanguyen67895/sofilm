"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { formatDuration } from "@/utils/format";
import { usePlayerStore } from "@/store/player.store";
import type { Episode } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

interface EpisodeSidebarProps {
  slug: string;
  title: string;
  episodes: Episode[];
  onClose?: () => void;
}

export function EpisodeSidebar({ slug, title, episodes, onClose }: EpisodeSidebarProps) {
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const play = usePlayerStore((s) => s.play);

  return (
    <div className="flex h-98.25 flex-col self-start rounded-lg border border-white/15 bg-black/40 backdrop-blur-xl lg:h-156.75 lg:sticky lg:top-8">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Episode List</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close episode list"
            className="text-white/50 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
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
                <Image
                  src={resolveImageSrc(ep.thumbnail, PLACEHOLDER_IMAGE)}
                  alt={ep.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
                {ep.duration > 0 && (
                  <span className="absolute bottom-0.5 left-0.5 rounded bg-black/70 px-1 text-[9px] leading-tight text-white">
                    {formatDuration(ep.duration)}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "truncate text-xs",
                  isActive ? "font-medium text-brand" : "text-white/80"
                )}
              >
                {title} - Episode {ep.episodeNumber}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
