"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Clock, Crown, ListVideo } from "lucide-react";
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

const DESCRIPTION_CLAMP_LINES = 5;

/** Descriptions are long enough that showing them in full pushes the video
 * player/episode list way down the page — clamps to 5 lines with a "See
 * more" toggle instead, matching the design. Skips the toggle for anything
 * short enough it's unlikely to actually overflow 5 lines.
 *
 * Two earlier approaches both broke on descriptions formatted as short,
 * blank-line-separated fields (e.g. "Title: ...\n\nTagline: ...\n\nGenre:
 * ..."), because `whitespace-pre-line` makes each of those short lines its
 * own clamp "line" — the box's bottom edge ends up well below the actual
 * last dense line of text:
 *  - A `float`-based trick docks at the *first* line of its containing
 *    block, not wherever the clamp cuts off.
 *  - Anchoring a button to the clamped block's own bottom-right corner
 *    lands at the *box's* bottom-right, which is only adjacent to the real
 *    text when the last visible line happens to run the full width.
 *
 * So instead of clamping with CSS at all, this measures in JS: render an
 * invisible clone at the real rendered width, binary-search the longest
 * prefix of the text that still fits within 5 lines' height, and render
 * that prefix + "See more" as plain inline content — the button then just
 * naturally flows right after wherever the truncated text ends, exactly
 * like any other inline element, on both dense paragraphs and short
 * multi-field descriptions alike. */
function MovieDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measureEl = measureRef.current;
    if (!container || !measureEl) return;

    function measure() {
      const width = container!.clientWidth;
      if (width <= 0) return;
      measureEl!.style.width = `${width}px`;

      const lineHeight = parseFloat(getComputedStyle(measureEl!).lineHeight) || 24;
      const maxHeight = lineHeight * DESCRIPTION_CLAMP_LINES + 1;

      measureEl!.textContent = description;
      if (measureEl!.scrollHeight <= maxHeight) {
        setTruncated(null);
        return;
      }

      let lo = 0;
      let hi = description.length;
      let best = 0;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        measureEl!.textContent = `${description.slice(0, mid)}…`;
        if (measureEl!.scrollHeight <= maxHeight) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      setTruncated(`${description.slice(0, best).trimEnd()}…`);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [description]);

  const overflows = truncated !== null;

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 -z-10 leading-relaxed whitespace-pre-line"
      />
      <p className="leading-relaxed whitespace-pre-line text-white/70">
        {expanded || !overflows ? description : truncated}
        {overflows && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="ml-1 inline-flex items-center gap-1 align-middle text-sm font-medium text-brand hover:underline"
          >
            {expanded ? "See less" : "See more"}
            <ChevronDown size={14} className={cn(expanded && "rotate-180")} />
          </button>
        )}
      </p>
    </div>
  );
}

export function MovieDetailView({ slug }: { slug: string }) {
  useEnsureBackFallback();
  const { data: movie, isLoading, isError, refetch } = useMovieDetail(slug);
  const currentMovieSlug = usePlayerStore((s) => s.currentMovieSlug);
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const play = usePlayerStore((s) => s.play);
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
  // Sorted so "next" is always the next-highest episode number, regardless
  // of the order the API returns them in.
  const sortedEpisodes = movie.episodes
    ? [...movie.episodes].sort((a, b) => a.episodeNumber - b.episodeNumber)
    : undefined;
  const nextEpisode = sortedEpisodes
    ? sortedEpisodes.find((ep) => ep.episodeNumber > (activeEpisode?.episodeNumber ?? 0))
    : undefined;

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
                  onEnded={nextEpisode ? () => play(movie.slug, nextEpisode.episodeNumber) : undefined}
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

          <MovieDescription description={movie.description} />

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
