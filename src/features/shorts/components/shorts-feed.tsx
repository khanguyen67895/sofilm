"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/common/empty-state";
import { useEnsureBackFallback } from "@/hooks/use-ensure-back-fallback";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { ShortItem } from "./short-item";

export function ShortsFeed() {
  useEnsureBackFallback();
  const { data: shorts, isLoading, isError } = useShortsFeed();
  // The actual scrollable element Virtuoso renders internally — grabbed via
  // scrollerRef instead of VirtuosoHandle.scrollToIndex(), because Virtuoso's
  // own index-based scroll math fights the CSS `snap-y snap-mandatory` this
  // feed relies on for the swipe gesture (it can compute an offset that
  // lands mid-snap, so the button visibly does nothing). A plain native
  // scrollBy() of one viewport height plays nicely with scroll-snap instead.
  const scrollerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
          <Virtuoso
            scrollerRef={(ref) => {
              scrollerRef.current = ref instanceof HTMLElement ? ref : null;
            }}
            style={{ height: "100dvh" }}
            data={shorts}
            className="scrollbar-none snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
            itemContent={(_, short) => <ShortItem short={short} />}
            rangeChanged={(range) => setActiveIndex(range.startIndex)}
          />

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
