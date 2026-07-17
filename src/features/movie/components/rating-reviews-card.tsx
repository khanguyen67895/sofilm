"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRatingInput } from "@/components/ui/star-rating-input";
import { Textarea } from "@/components/ui/textarea";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { cn } from "@/utils/cn";
import { formatViews } from "@/utils/format";
import { useReviewSummary } from "../hooks/use-review-summary";
import { useSubmitReview } from "../hooks/use-submit-review";

const STAR_KEYS = ["5", "4", "3", "2", "1"] as const;

export function RatingReviewsCard({ movieId }: { movieId: string }) {
  const { data: summary } = useReviewSummary(movieId);
  const submitReview = useSubmitReview(movieId);

  const [myRating, setMyRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState("");

  function handleSubmit() {
    if (!myRating) return;
    submitReview.mutate(
      { rating: myRating, comment: comment.trim() || undefined },
      { onSuccess: () => setShowForm(false) }
    );
  }

  const average = summary?.average ?? 0;
  const roundedAverage = Math.round(average);

  return (
    <div className="grid gap-6 rounded-xl bg-white/5 p-6 sm:grid-cols-[1fr_1.5fr_auto]">
      <div>
        <h3 className="mb-3 text-lg font-semibold text-white">Rating & Reviews</h3>
        <p className="text-5xl font-bold text-white">{average.toFixed(1)}</p>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <RatingStarIcon
              key={n}
              width={16}
              height={16}
              className={cn(n > roundedAverage && "opacity-25")}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-white/50">{formatViews(summary?.total ?? 0)} reviews</p>
      </div>

      <div className="flex flex-col justify-center gap-1.5">
        {STAR_KEYS.map((star) => (
          <div key={star} className="flex items-center gap-2 text-xs text-white/70">
            <span className="flex w-8 items-center gap-1">
              <RatingStarIcon width={11} height={10} />
              {star}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-brand"
                style={{ width: `${summary?.breakdown[star] ?? 0}%` }}
              />
            </div>
            <span className="w-8 text-right">{summary?.breakdown[star] ?? 0}%</span>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3 rounded-lg bg-white/5 p-4 sm:w-48">
        <p className="text-sm font-medium text-white">Rate this movie</p>
        <StarRatingInput value={myRating} onChange={setMyRating} size={18} />
        {myRating > 0 && (
          <p className="text-xs text-white/50">
            Your rating: <span className="text-brand">{myRating}/5</span>
          </p>
        )}
        {showForm ? (
          <div className="space-y-2">
            <Textarea
              rows={3}
              placeholder="Chia sẻ cảm nhận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!myRating || submitReview.isPending}
            >
              {submitReview.isPending ? "Đang gửi..." : "Gửi Đánh Giá"}
            </Button>
            {submitReview.isError && (
              <p className="text-xs text-red-500">Gửi đánh giá thất bại. Vui lòng thử lại.</p>
            )}
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>
    </div>
  );
}
