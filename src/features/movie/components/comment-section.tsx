"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/utils/cn";
import { useMovieReviews } from "../hooks/use-movie-reviews";
import { useReviewSummary } from "../hooks/use-review-summary";
import { useSubmitReview } from "../hooks/use-submit-review";
import { CommentItem } from "./comment-item";

/** Comments visible before "View all comments" is pressed — a small,
 * fixed-size peek rather than the paginated page size. */
const PREVIEW_COUNT = 3;

interface CommentSectionProps {
  movieId: string;
  sidebar?: ReactNode;
  /** Column split for the comment/sidebar row — pass the same split used by
   * the video/info row above so the comment input lines up with the video
   * player's width and the sidebar lines up with the info panel's width,
   * for both 16:9 and 9:16 videos. Defaults to the Figma-spec fixed split. */
  columnsClassName?: string;
}

export function CommentSection({
  movieId,
  sidebar,
  columnsClassName = "lg:grid-cols-[860px_1fr]",
}: CommentSectionProps) {
  const { data: summary } = useReviewSummary(movieId);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMovieReviews(movieId);
  const submitReview = useSubmitReview(movieId);
  const user = useAuthStore((s) => s.user);
  const requireAuth = useRequireAuth();

  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // The Figma spec's 62px avatar + 42px "Post" button don't leave enough
  // room on a narrow phone (the pill's other elements — avatar, paddings,
  // button — don't shrink below their own content size, so the row
  // overflows past the screen edge instead of the input just getting
  // cramped). Scale both down below `sm` where that spec was never tested.
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // Collapsed by default: the list caps to the Rating & Reviews card's own
  // rendered height (measured, not guessed) and shows only a peek of
  // comments, matching that sidebar card visually. "View all comments" lifts
  // both limits at once, same as the `panelMaxHeight` measure-in-JS pattern
  // `MovieDetailView` already uses for its own two-column row, but scoped
  // locally here since `sidebar` is just a rendered node, not something the
  // parent already measures for us.
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const mql = window.matchMedia("(min-width: 1024px)");
    function update() {
      setSidebarHeight(mql.matches ? el!.getBoundingClientRect().height : undefined);
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    mql.addEventListener("change", update);
    return () => {
      observer.disconnect();
      mql.removeEventListener("change", update);
    };
  }, []);

  const reviews = data?.pages.flatMap((page) => page.items) ?? [];
  const visibleReviews = expanded ? reviews : reviews.slice(0, PREVIEW_COUNT);
  const hasMoreToReveal = !expanded && (reviews.length > PREVIEW_COUNT || hasNextPage);

  function handleViewAll() {
    setExpanded(true);
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function handlePost() {
    if (!comment.trim()) return;
    requireAuth(
      () =>
        submitReview.mutate(
          { comment: comment.trim() },
          { onSuccess: () => setComment("") }
        ),
      "Sign in to comment."
    );
  }

  const postError = submitReview.isError && (
    <p className="text-xs text-red-500">Failed to post comment. Please try again.</p>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl leading-8 font-semibold text-white">
        Comment <span className="font-light text-[#cfcfcf]">({summary?.commentsCount ?? 0})</span>
      </h2>

      <div className={cn("grid grid-cols-1 gap-6 lg:items-start", columnsClassName)}>
        <div className="flex flex-col gap-3">
          <div className="flex w-full items-center gap-2 rounded-3xl bg-[rgba(242,242,242,0.1)] px-3 py-2 sm:gap-4 sm:px-4 sm:py-3.5">
            <Avatar src={user?.avatar} name={user?.name} size={isDesktop ? 62 : 40} />
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-2xl bg-[rgba(242,242,242,0.1)] py-2 pr-2 pl-3 sm:gap-4 sm:py-2.5 sm:pr-4 sm:pl-5">
              <input
                ref={inputRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePost();
                }}
                placeholder="Write a comment..."
                className="min-w-0 flex-1 bg-transparent text-sm font-light text-white outline-none placeholder:font-light placeholder:text-[#b2b2b2] sm:text-base"
              />
              <Button
                size={isDesktop ? "md" : "sm"}
                onClick={handlePost}
                disabled={!comment.trim() || submitReview.isPending}
              >
                Post
              </Button>
            </div>
          </div>
          {postError}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div
              ref={listRef}
              style={!expanded && sidebarHeight ? { maxHeight: sidebarHeight } : undefined}
              className={cn(!expanded && sidebarHeight && "overflow-y-auto")}
            >
              {visibleReviews.map((review) => (
                <CommentItem key={review.id} movieId={movieId} review={review} />
              ))}
              {reviews.length === 0 && (
                <p className="py-6 text-center text-sm text-white/50">No comments yet.</p>
              )}
            </div>
          )}

          {hasMoreToReveal && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={handleViewAll}>
                View all comments
              </Button>
            </div>
          )}

          {expanded && hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </div>

        <div ref={sidebarRef}>{sidebar}</div>
      </div>
    </div>
  );
}
