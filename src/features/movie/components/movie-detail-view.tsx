"use client";

import { motion } from "framer-motion";
import { Star, Clock, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/player/video-player";
import { formatDuration, formatYear } from "@/utils/format";
import { usePlayerStore } from "@/store/player.store";
import { useMovieDetail } from "../hooks/use-movie-detail";
import { EpisodeList } from "./episode-list";
import { PremiumGate } from "./premium-gate";

export function MovieDetailView({ slug }: { slug: string }) {
  const { data: movie, isLoading } = useMovieDetail(slug);
  const currentMovieSlug = usePlayerStore((s) => s.currentMovieSlug);
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);

  if (isLoading || !movie) {
    return (
      <div className="space-y-4 px-4 py-8 sm:px-8">
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const activeEpisode =
    currentMovieSlug === movie.slug
      ? (movie.episodes?.find((ep) => ep.episodeNumber === currentEpisode) ?? movie.episodes?.[0])
      : movie.episodes?.[0];

  const canWatch = !movie.isPremium || movie.hasAccess;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 px-4 py-8 sm:px-8"
    >
      {canWatch ? (
        <VideoPlayer
          src={activeEpisode?.videoUrl ?? movie.videoUrl ?? ""}
          poster={movie.backdrop}
        />
      ) : (
        <PremiumGate backdrop={movie.backdrop} />
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {movie.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {movie.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {formatDuration(movie.duration)}
            </span>
            <span>{formatYear(movie.releaseDate)}</span>
            {movie.isPremium && (
              <span className="flex items-center gap-1 text-red-500">
                <Crown size={14} /> VIP
              </span>
            )}
          </div>
          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          >
            {movie.genres.map((genre) => (
              <motion.span
                key={genre}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
              >
                {genre}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <Button>Yêu Thích</Button>
      </div>

      <p className="max-w-3xl text-white/70">{movie.description}</p>

      {movie.episodes && movie.episodes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Danh Sách Tập</h2>
          <EpisodeList slug={movie.slug} episodes={movie.episodes} />
        </div>
      )}
    </motion.div>
  );
}
