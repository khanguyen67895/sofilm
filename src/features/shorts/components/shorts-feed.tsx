"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/common/empty-state";
import { useEnsureBackFallback } from "@/hooks/use-ensure-back-fallback";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { ShortItem } from "./short-item";

// How many items on each side of the active one keep their video source
// attached (hls.js loading/buffering) — everything further away just shows
// its poster image. The feed itself is a plain scroll-snap container (see
// below), not virtualized, so this is the only thing keeping a 20-item feed
// from opening 20 concurrent HLS streams at once.
const PRELOAD_RADIUS = 1;

export function ShortsFeed() {
  useEnsureBackFallback();
  const { data: shorts, isLoading, isError } = useShortsFeed();
  // Deep-link from the profile's saved-shorts grid ("/shorts?id=...") — jump
  // straight to that item instead of always starting at the top of the feed.
  // Only covers the newest 50 shorts the feed itself fetches; an older saved
  // short simply won't be found here (findIndex falls back to -1 → 0).
  const initialShortId = useSearchParams().get("id");
  // A plain native-scroll container rather than react-virtuoso: Virtuoso
  // positions its item wrappers with `position: absolute` for virtualization,
  // which CSS `scroll-snap-align` doesn't reliably apply to — every browser
  // needs the snapped element to be a normal-flow child of the scroll
  // container. That mismatch is why swiping here didn't snap cleanly between
  // videos. A short feed page is small (20 items, see the backend's default
  // page size), so plain unvirtualized DOM nodes cost nothing — the only
  // thing that actually needs limiting is which items load real video
  // (PRELOAD_RADIUS above), not how many `<div>`s exist.
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const didInitialScroll = useRef(false);
  const wheelLockedRef = useRef(false);

  useEffect(() => {
    if (!shorts || shorts.length === 0 || didInitialScroll.current) return;
    didInitialScroll.current = true;
    const index = initialShortId
      ? Math.max(0, shorts.findIndex((s) => s.id === initialShortId))
      : 0;
    setActiveIndex(index);
    const scroller = scrollerRef.current;
    if (scroller && index > 0) scroller.scrollTop = index * scroller.clientHeight;
  }, [shorts, initialShortId]);

  // A mouse wheel sends small, discrete deltas — against `scroll-snap-type:
  // mandatory` that reads as "stuck": each tick is rarely enough distance to
  // carry the snap past its threshold, so the view springs right back and
  // scrolling looks broken. Touch swipes don't have this problem (one
  // gesture easily covers a full viewport height), which is why this only
  // shows up on desktop. The fix every wheel-driven TikTok/Douyin-style feed
  // uses: intercept the wheel and page exactly one video per gesture
  // ourselves instead of letting the browser's native snap-scroll handle it.
  // Needs a real (non-React) listener — React's synthetic `onWheel` is
  // passive by default, so `preventDefault()` inside it is silently ignored.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function handleWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) < 2) return;
      e.preventDefault();
      if (wheelLockedRef.current) return;
      wheelLockedRef.current = true;
      scroller!.scrollBy({ top: (e.deltaY > 0 ? 1 : -1) * scroller!.clientHeight, behavior: "smooth" });
      window.setTimeout(() => {
        wheelLockedRef.current = false;
      }, 650);
    }

    scroller.addEventListener("wheel", handleWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", handleWheel);
  }, [shorts]);

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientHeight === 0) return;
    const index = Math.round(scroller.scrollTop / scroller.clientHeight);
    setActiveIndex((current) => (current === index ? current : index));
  }

  function goTo(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ top: direction * scroller.clientHeight, behavior: "smooth" });
  }

  return (
    <div className="relative h-dvh w-full bg-black">

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-dvh items-center justify-center"
        >
          <Spinner />
        </motion.div>
      ) : isError || !shorts ? (
        <div className="flex h-dvh flex-col items-center justify-center gap-2 text-center text-white/70">
          <p>Couldn&apos;t load shorts.</p>
          <p className="text-sm text-white/40">Please try again later.</p>
        </div>
      ) : shorts.length === 0 ? (
        <div className="flex h-dvh items-center justify-center">
          <EmptyState
            title="No shorts yet"
            description="New videos are on the way — check back soon!"
          />
        </div>
      ) : (
        <>
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            style={{ height: "100dvh" }}
            className="snap-y snap-mandatory overflow-y-scroll scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {shorts.map((short, index) => (
              <ShortItem
                key={short.id}
                short={short}
                preload={Math.abs(index - activeIndex) <= PRELOAD_RADIUS}
              />
            ))}
          </div>

          {/* Prev/next controls — desktop only, mirrors the up/down arrow
           * pair every other shorts platform (TikTok/Douyin/Reels web)
           * shows next to the feed, since a mouse has no swipe gesture.
           * Two standalone circular buttons (not a joined pill) to match
           * that reference UI, each independently clickable/disableable. */}
          <div className="pointer-events-none absolute top-1/2 right-6 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
            <button
              type="button"
              aria-label="Previous video"
              disabled={activeIndex === 0}
              onClick={() => goTo(-1)}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 disabled:opacity-30 disabled:hover:bg-black/40"
            >
              <ChevronUp size={22} />
            </button>
            <button
              type="button"
              aria-label="Next video"
              disabled={activeIndex === shorts.length - 1}
              onClick={() => goTo(1)}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 disabled:opacity-30 disabled:hover:bg-black/40"
            >
              <ChevronDown size={22} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
