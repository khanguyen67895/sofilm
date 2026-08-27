"use client";

import { AnimatePresence } from "framer-motion";
import type { Episode } from "@/types/movie";
import { AdminEpisodeRow } from "./admin-episode-row";
import { AdminEpisodeAddForm } from "./admin-episode-add-form";

interface AdminEpisodeManagerProps {
  movieId: string;
  episodes: Episode[];
}

export function AdminEpisodeManager({ movieId, episodes }: AdminEpisodeManagerProps) {
  const sortedEpisodes = episodes.slice().sort((a, b) => a.episodeNumber - b.episodeNumber);

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-sm tracking-wide text-white/80 uppercase">
        Episode List
      </h3>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {sortedEpisodes.map((ep) => (
            <AdminEpisodeRow key={ep.id} movieId={movieId} episode={ep} />
          ))}
        </AnimatePresence>
        {episodes.length === 0 && <p className="text-sm text-white/50">No episodes yet.</p>}
      </div>

      <AdminEpisodeAddForm movieId={movieId} episodes={episodes} />
    </div>
  );
}
