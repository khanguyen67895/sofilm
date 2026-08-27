"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Crown, ListVideo } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { VideoPlayer } from "@/components/player/video-player";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { formatDuration, formatYear } from "@/utils/format";
import { cn } from "@/utils/cn";
import { resolveImageSrc } from "@/utils/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEnsureBackFallback } from "@/hooks/use-ensure-back-fallback";
import { usePlayerStore } from "@/store/player.store";
import { useMovieDetail } from "../hooks/use-movie-detail";
import { EpisodeSidebar } from "./episode-sidebar";
import { PremiumGate } from "./premium-gate";
import { LikeShareBar } from "./like-share-bar";
import { RatingReviewsCard } from "./rating-reviews-card";
import { CommentSection } from "./comment-section";
import { SimilarMoviesSection } from "./similar-movies-section";

export function MovieDetailView({ slug }: { slug: string }) {
  useEnsureBackFallback();
  const { data: movie, isLoading, isError, refetch } = useMovieDetail(slug);
  const currentMovieSlug = usePlayerStore((s) => s.currentMovieSlug);
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Below `lg`, the episode list isn't a floating sidebar next to the video —
  // it's an inline card stacked between the description and Rating & Reviews
  // (see render below), matching the mobile design.
  const isDesktopLayout = useMediaQuery("(min-width: 1024px)");

  if (isError) {
    return <ErrorState title="Unable to load movie details." onRetry={() => refetch()} />;
  }

  if (isLoading || !movie) {
    return (
      <div className="space-y-4 px-6 py-8 sm:px-8 lg:px-20">
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
  const hasEpisodes = Boolean(movie.episodes && movie.episodes.length > 0);
  const videoSrc = activeEpisode?.videoUrl ?? movie.videoUrl ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 px-6 py-8 sm:px-8 lg:px-20"
    >
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          hasEpisodes && isSidebarOpen && isDesktopLayout && "lg:grid-cols-[1fr_300px]"
        )}
      >
        {/* Left column — video and everything under it stay confined to the
         * player's own width instead of spanning the full page, so the
         * episode sidebar reads as a sidebar next to all of it, not just the
         * video. */}
        <div className="space-y-8">
          <div className="space-y-2">
            {canWatch ? (
              videoSrc ? (
                // Keyed by src so switching episodes fully remounts the
                // player — its internal playback/scrubber state (currentTime,
                // duration, buffered) resets for free instead of briefly
                // showing the previous episode's progress.
                <VideoPlayer
                  key={videoSrc}
                  src={videoSrc}
                  poster={resolveImageSrc(activeEpisode?.thumbnail || movie?.backdrop, PLACEHOLDER_IMAGE)}
                />
              ) : (
                <div className="flex h-65 w-full items-center justify-center rounded-lg bg-black sm:h-156.75">
                  <EmptyState
                    title="No video yet"
                    description="Content is being updated — check back soon!"
                  />
                </div>
              )
            ) : (
              <PremiumGate backdrop={movie?.backdrop} />
            )}

            {hasEpisodes && !isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white"
              >
                <ListVideo size={16} /> Episode List
              </button>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{movie.title}</h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <RatingStarIcon width={14} height={13} /> {movie.rating}
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
              <div className="shrink-0">
                <LikeShareBar movie={movie} />
              </div>
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
                  className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
                >
                  {genre}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <p className="leading-relaxed whitespace-pre-line text-white/70">{movie.description}</p>

          {/* Below `lg`, the episode list renders inline here (between the
           * description and Rating & Reviews) instead of as a sidebar. */}
          {!isDesktopLayout && hasEpisodes && isSidebarOpen && movie.episodes && (
            <EpisodeSidebar
              slug={movie.slug}
              title={movie.title}
              episodes={movie.episodes}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}

          <RatingReviewsCard movieId={movie.id} />

          <CommentSection movieId={movie.id} />
        </div>

        {/* Right column (`lg` and up only) — episode sidebar, naturally
         * shorter than the left column's full content stack. */}
        {isDesktopLayout && hasEpisodes && isSidebarOpen && movie.episodes && (
          <EpisodeSidebar
            slug={movie.slug}
            title={movie.title}
            episodes={movie.episodes}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      <SimilarMoviesSection slug={movie.slug} />
    </motion.div>
  );
}
