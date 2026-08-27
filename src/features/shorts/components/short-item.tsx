"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatViews } from "@/utils/format";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { movieService } from "@/services/movie/movie.service";
import type { Short } from "@/types/shorts";
import { resolveImageSrc } from "@/utils/image";

const DOUBLE_TAP_MS = 300;

export function ShortItem({ short }: { short: Short }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);

  const [isLiked, setIsLiked] = useState(short.isLiked);
  const [likes, setLikes] = useState(short.likes);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showPlayState, setShowPlayState] = useState(false);
  const [progress, setProgress] = useState(0);
  const [burstHeart, setBurstHeart] = useState(false);
  const [likeError, setLikeError] = useState(false);

  // Active-only playback — play only once this item is meaningfully in view,
  // pause the moment it scrolls away (Virtuoso's overscan can keep neighbors
  // mounted, so autoPlay alone would play several videos at once).
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Browsers check the `muted` *property* at the exact moment play() is
    // invoked to allow autoplay without a user gesture. React commits the
    // `muted` JSX prop but some browsers still evaluate the very first
    // play() call before that's reliably reflected, which silently rejects
    // the promise and makes the video look like it needs a tap to start.
    // Setting it imperatively here guarantees it's true before we ever
    // call play() below.
    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {});
          setIsPaused(false);
        } else {
          video.pause();
          setIsPaused(true);
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function flashPlayState() {
    setShowPlayState(true);
    window.setTimeout(() => setShowPlayState(false), 450);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
    flashPlayState();
  }

  function toggleLike() {
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
    setLikeError(false);

    const request = wasLiked
      ? movieService.unlikeShort(short.id)
      : movieService.likeShort(short.id);

    request.catch(() => {
      setIsLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
      setLikeError(true);
      window.setTimeout(() => setLikeError(false), 2500);
    });
  }

  function handleVideoTap() {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_MS) {
      if (!isLiked) toggleLike();
      setBurstHeart(true);
      window.setTimeout(() => setBurstHeart(false), 700);
    } else {
      togglePlay();
    }
    lastTapRef.current = now;
  }

  async function handleShare() {
    const url = short.movieSlug
      ? `${window.location.origin}${ROUTES.movie(short.movieSlug)}`
      : window.location.href;
    if (navigator.share) {
      navigator.share({ title: short.title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-dvh w-full items-center justify-center snap-start bg-black"
    >
      {/* The actual "card" — full-bleed on phones (where the viewport already
       * is roughly 9:16, matching every native shorts/reels app), but capped
       * to a centered vertical card on wider screens instead of stretching
       * edge-to-edge like a phone video blown up across a desktop window —
       * same treatment YouTube Shorts/TikTok/Reels use on desktop web. */}
      <div className="relative h-full w-full overflow-hidden bg-black sm:aspect-9/16 sm:h-[92dvh] sm:w-auto sm:rounded-2xl sm:shadow-2xl">
        <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-white/20">
          <div
            className="h-full bg-white transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <video
          ref={videoRef}
          src={short.videoUrl || undefined}
          poster={resolveImageSrc(short.thumbnail, PLACEHOLDER_IMAGE)}
          className="h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onClick={handleVideoTap}
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (video.duration)
              setProgress((video.currentTime / video.duration) * 100);
          }}
        />

        <AnimatePresence>
          {showPlayState && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="rounded-full bg-black/40 p-5">
                {isPaused ? (
                  <Play size={36} className="fill-white text-white" />
                ) : (
                  <Pause size={36} className="fill-white text-white" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {burstHeart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0, scale: 1.4 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <Heart
                size={110}
                className="fill-brand text-brand drop-shadow-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {likeError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white"
            >
              Action failed, please try again.
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted((m) => !m);
          }}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className="absolute inset-x-0 bottom-0 space-y-1 bg-linear-to-t from-black/90 to-transparent p-4 pb-8">
          {short.movieSlug ? (
            <Link
              href={ROUTES.movie(short.movieSlug)}
              className="text-sm font-semibold text-white"
            >
              {short.title}
            </Link>
          ) : (
            <p className="text-sm font-semibold text-white">{short.title}</p>
          )}
          {short.content && (
            <p className="line-clamp-2 text-xs text-white/70">
              {short.content}
            </p>
          )}
        </div>

        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            whileTap={{ scale: 0.8 }}
            className="flex flex-col items-center gap-1 text-white"
          >
            <motion.span
              key={isLiked ? "liked" : "unliked"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Heart
                size={26}
                className={cn(isLiked && "fill-red-600 text-red-600")}
              />
            </motion.span>
            <span className="text-xs">{formatViews(likes)}</span>
          </motion.button>

          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 text-white"
          >
            <MessageCircle size={26} />
            <span className="text-xs">{formatViews(short.comments)}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void handleShare();
            }}
            className="flex flex-col items-center gap-1 text-white"
          >
            <Share2 size={24} />
            <span className="text-xs">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
