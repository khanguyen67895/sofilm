"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";
import { useMovieReviews } from "../hooks/use-movie-reviews";
import { useReviewSummary } from "../hooks/use-review-summary";
import { useSubmitReview } from "../hooks/use-submit-review";
import { CommentItem } from "./comment-item";

export function CommentSection({ movieId }: { movieId: string }) {
  const { data: summary } = useReviewSummary(movieId);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMovieReviews(movieId);
  const submitReview = useSubmitReview(movieId);
  const user = useAuthStore((s) => s.user);

  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const reviews = data?.pages.flatMap((page) => page.items) ?? [];

  function handlePost() {
    if (!comment.trim()) return;
    submitReview.mutate(
      { comment: comment.trim() },
      { onSuccess: () => setComment("") }
    );
  }

  const postError = submitReview.isError && (
    <p className="text-xs text-red-500">Đăng bình luận thất bại. Vui lòng thử lại.</p>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Comment ({summary?.commentsCount ?? 0})</h2>

      <div className="flex items-center gap-3">
        <Avatar src={user?.avatar} name={user?.name} size={36} />
        <input
          ref={inputRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handlePost();
          }}
          placeholder="Write a comment..."
          className="h-11 flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand"
        />
        <Button size="sm" onClick={handlePost} disabled={!comment.trim() || submitReview.isPending}>
          Post
        </Button>
      </div>
      {postError}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <CommentItem
              key={review.id}
              movieId={movieId}
              review={review}
              onReply={() => inputRef.current?.focus()}
            />
          ))}
          {reviews.length === 0 && (
            <p className="py-6 text-center text-sm text-white/50">Chưa có bình luận nào.</p>
          )}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  );
}
