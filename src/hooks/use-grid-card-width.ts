"use client";

import { useEffect, useState } from "react";

/** Matches `gap-4`/`gap-x-4` (1rem) — the column gap both the scroll rows
 * (MovieRow/TrendingRow) and AllMoviesSection's grid use. */
const GAP_PX = 16;

/** Reproduces the column width `grid-cols-[repeat(auto-fill,minmax(min,1fr))]`
 * computes for a given container width: as many `min`-wide (+gap) columns as
 * fit, then the leftover space split evenly across them via `1fr`. Used so
 * MovieRow/TrendingRow's fixed-width scroll cards render at the exact same
 * pixel width AllMoviesSection's fluid grid does, without touching that grid
 * (its container must share the same horizontal padding for the two to
 * actually line up — they do, both use the shared row padding). */
function computeCardWidth(containerWidth: number, min: number) {
  if (containerWidth <= 0) return min;
  const columns = Math.max(1, Math.floor((containerWidth + GAP_PX) / (min + GAP_PX)));
  return (containerWidth - (columns - 1) * GAP_PX) / columns;
}

export function useGridCardWidth(containerRef: React.RefObject<HTMLElement | null>, min: number) {
  const [width, setWidth] = useState(min);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(computeCardWidth(entry.contentRect.width, min));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, min]);

  return width;
}
