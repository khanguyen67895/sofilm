"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Movie, MovieType } from "@/types/movie";
import { AdminEpisodeManager } from "./admin-episode-manager";
import { VideoUploadField } from "./video-upload-field";

interface AdminMovieVideoSectionProps {
  type: MovieType;
  mode: "create" | "edit";
  movie?: Movie;
  hasVideo: boolean;
  onVideoUploaded: (result: { videoId: string; videoUrl?: string }) => void;
}

export function AdminMovieVideoSection({
  type,
  mode,
  movie,
  hasVideo,
  onVideoUploaded,
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
          <VideoUploadField hasVideo={hasVideo} onUploaded={onVideoUploaded} />
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
            <p className="text-sm text-white/50">Lưu phim trước, sau đó thêm các tập.</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
