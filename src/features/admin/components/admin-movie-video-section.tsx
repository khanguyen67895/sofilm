"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Movie, MovieType } from "@/types/movie";
import { AdminEpisodeManager } from "./admin-episode-manager";
import { AdminEpisodeQueueBuilder, type QueuedEpisode } from "./admin-episode-queue-builder";
import { AdminThumbnailField } from "./admin-thumbnail-field";

interface AdminMovieVideoSectionProps {
  type: MovieType;
  mode: "create" | "edit";
  movie?: Movie;
  videoId: string;
  hasVideo: boolean;
  thumbnailUrl?: string;
  onVideoUploaded: (result: { videoId: string; videoUrl?: string }) => void;
  onThumbnailGenerated: (url: string) => void;
  queuedEpisodes: QueuedEpisode[];
  onQueuedEpisodesChange: (episodes: QueuedEpisode[]) => void;
}

export function AdminMovieVideoSection({
  type,
  mode,
  movie,
  videoId,
  hasVideo,
  thumbnailUrl,
  onVideoUploaded,
  onThumbnailGenerated,
  queuedEpisodes,
  onQueuedEpisodesChange,
}: AdminMovieVideoSectionProps) {
  return (
    <AnimatePresence mode="wait">
      {type === "MOVIE" ? (
        <motion.div
          key="movie"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <h3 className="font-heading mb-2 text-sm tracking-wide text-white/80 uppercase">
            Video
          </h3>
          <AdminThumbnailField
            videoId={videoId}
            hasVideo={hasVideo}
            thumbnailUrl={thumbnailUrl}
            onVideoUploaded={onVideoUploaded}
            onThumbnailGenerated={onThumbnailGenerated}
          />
        </motion.div>
      ) : (
        <motion.div
          key="series"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {mode === "edit" && movie ? (
            <AdminEpisodeManager movieId={movie.id} episodes={movie.episodes ?? []} />
          ) : (
            <AdminEpisodeQueueBuilder episodes={queuedEpisodes} onChange={onQueuedEpisodesChange} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
