"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, Clock, Crown, ListVideo, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { VideoPlayer } from "@/components/player/video-player";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { formatDuration, formatYear } from "@/utils/format";
import { cn } from "@/utils/cn";
import { resolveImageSrc } from "@/utils/image";
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
      <p className="leading-relaxed whitespace-pre-line text-[#f2f2f2]">
        {expanded || !overflows ? description : truncated}
        {overflows && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="ml-1 inline-flex items-center gap-1 align-middle text-sm font-medium text-[#999] hover:text-white"
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
  const router = useRouter();
  const { data: movie, isLoading, isError, refetch } = useMovieDetail(slug);
  const currentMovieSlug = usePlayerStore((s) => s.currentMovieSlug);
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const play = usePlayerStore((s) => s.play);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Portrait (9:16-ish) videos give the info column equal width instead of
  // the narrower fixed sidebar used for landscape video, matching the two
  // SOFIN Figma layouts. Unknown until the video's real metadata loads.
  const [isPortraitVideo, setIsPortraitVideo] = useState(false);

  // The right info panel is capped to the video column's rendered height so
  // it never grows the row when "See more" expands the description — CSS
  // grid's `auto` row track still sizes to an item's max-content height even
  // when that item has `overflow: hidden` (overflow only changes the
  // *minimum* size contribution, not the max-content one used for `auto`
  // tracks), so the cap has to come from an actual measured pixel height,
  // matching the measure-in-JS approach `MovieDescription` already uses
  // above. Only enforced at the `lg` breakpoint, where the two columns sit
  // side by side — below that they stack and should size naturally.
  const videoColumnRef = useRef<HTMLDivElement>(null);
  const [panelMaxHeight, setPanelMaxHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = videoColumnRef.current;
    if (!el) return;

    const mql = window.matchMedia("(min-width: 1024px)");
    function update() {
      setPanelMaxHeight(mql.matches ? el!.getBoundingClientRect().height : undefined);
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    mql.addEventListener("change", update);
    return () => {
      observer.disconnect();
      mql.removeEventListener("change", update);
    };
    // `videoColumnRef` only attaches once the loading skeleton is replaced
    // by the real layout, so this must re-run when that happens instead of
    // running once against a still-null ref.
  }, [isLoading]);

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
  const prevEpisode = sortedEpisodes
    ? [...sortedEpisodes].reverse().find((ep) => ep.episodeNumber < (activeEpisode?.episodeNumber ?? Infinity))
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
          "grid grid-cols-1 gap-6",
          isPortraitVideo ? "lg:grid-cols-2" : "lg:grid-cols-[6fr_4fr]"
        )}
      >
        {/* Left column — just the video. Its aspect ratio follows the
         * actual video (portrait or landscape) instead of a fixed box, so
         * this column's height/width is driven by the content, not the
         * other way around. `self-start` keeps it from being stretched by
         * CSS grid's default `align-items: stretch` to match the row height
         * — without it, this column's *rendered* height would just mirror
         * whatever the right panel happens to need, making it useless to
         * measure (a feedback loop: panelMaxHeight would echo the right
         * panel's own natural height back at it, never actually capping
         * anything). */}
        <div ref={videoColumnRef} className="space-y-2 self-start">
          <div className="relative">
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
                  onNextEpisode={nextEpisode ? () => play(movie.slug, nextEpisode.episodeNumber) : undefined}
                  onPrevEpisode={prevEpisode ? () => play(movie.slug, prevEpisode.episodeNumber) : undefined}
                  onAspectRatioChange={(ratio) => setIsPortraitVideo(ratio < 1)}
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

            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back"
              className="absolute top-2.5 left-2.5 z-20 flex size-8.5 items-center justify-center rounded-full bg-black/60 text-white/90 transition-colors hover:bg-black/80"
            >
              <X size={18} />
            </button>
          </div>

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

        {/* Right column — title, meta, actions, genres, description and the
         * episode list all live here, next to the video. `panelMaxHeight`
         * (measured off the video column above) pins this whole panel to the
         * video's height, with `overflow-y-auto` on the panel itself so
         * expanding the description scrolls the panel in place instead of
         * growing it or the page. */}
        <div
          className="flex flex-col gap-6 overflow-y-auto rounded-2xl bg-white/5 p-6"
          style={panelMaxHeight ? { height: panelMaxHeight } : undefined}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-3">
                <h1 className="font-display text-[28px] leading-9 font-semibold text-white sm:text-[32px] sm:leading-10">
                  {movie.title}
                </h1>

                {/* Below `sm`, the like/share icons sit on the rating/meta
                 * row, pinned to the right, matching the compact mobile
                 * design — the full pill buttons with text move to their own
                 * row (hidden below) once there's room at `sm` and up. */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4 text-base text-[#dbdbdb]">
                    <span className="flex items-center gap-1">
                      <RatingStarIcon width={16} height={15} /> {movie.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> {formatDuration(movie.duration)}
                    </span>
                    <span>{formatYear(movie.releaseDate)}</span>
                    {movie.isPremium && (
                      <span className="flex items-center gap-1 text-red-500">
                        <Crown size={16} /> VIP
                      </span>
                    )}
                  </div>
                  <div className="shrink-0 sm:hidden">
                    <LikeShareBar movie={movie} />
                  </div>
                </div>
              </div>

              <div className="hidden sm:block">
                <LikeShareBar movie={movie} />
              </div>
            </div>

            <motion.div
              className="flex flex-wrap gap-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {movie.genres.map((genre) => (
                <motion.span
                  key={genre}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  className="rounded-lg bg-[#2c2c2c] px-2 py-1 text-base text-[#dbdbdb]"
                >
                  {genre}
                </motion.span>
              ))}
            </motion.div>

            <MovieDescription description={movie.description} />
          </div>

          {hasEpisodes && isSidebarOpen && movie.episodes && (
            <EpisodeSidebar
              slug={movie.slug}
              episodes={movie.episodes}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      </div>

      <CommentSection
        movieId={movie.id}
        sidebar={<RatingReviewsCard movieId={movie.id} />}
        columnsClassName={isPortraitVideo ? "lg:grid-cols-2" : "lg:grid-cols-[6fr_4fr]"}
      />

      <SimilarMoviesSection slug={movie.slug} />
    </motion.div>
  );
}
