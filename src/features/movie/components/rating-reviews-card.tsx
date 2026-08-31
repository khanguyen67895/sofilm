"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRatingInput } from "@/components/ui/star-rating-input";
import { Textarea } from "@/components/ui/textarea";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { formatViews } from "@/utils/format";
import { useReviewSummary } from "../hooks/use-review-summary";
import { useSubmitReview } from "../hooks/use-submit-review";

const STAR_KEYS = ["5", "4", "3", "2", "1"] as const;

/** Renders `average` as full/half/empty stars (e.g. 4.7 → 4 full + 1 half),
 * matching the Figma "Rating & Reviews" summary, which shows a genuine half
 * icon for any fractional average rather than just dimming past a rounded
 * threshold. */
function AverageStars({ average, size }: { average: number; size: number }) {
  const height = Math.round((size * 16) / 17);
  const full = Math.floor(average);
  const hasHalf = average - full > 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => {
        if (n <= full) {
          return <RatingStarIcon key={n} width={size} height={height} />;
        }
        if (n === full + 1 && hasHalf) {
          return (
            <span key={n} className="relative inline-block" style={{ width: size, height }}>
              <RatingStarIcon width={size} height={height} className="absolute inset-0 opacity-25" />
              <span className="absolute inset-0 w-1/2 overflow-hidden">
                <RatingStarIcon width={size} height={height} />
              </span>
            </span>
          );
        }
        return <RatingStarIcon key={n} width={size} height={height} className="opacity-25" />;
      })}
    </div>
  );
}

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

  return (
    <div className="flex flex-col gap-12 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl leading-7 font-normal text-[#f2f2f2]">Rating & Reviews</h3>
        <p className="text-[64px] leading-[72px] font-semibold text-white">{average.toFixed(1)}</p>
        <AverageStars average={average} size={20} />
        <p className="text-sm leading-5 font-light text-[#cfcfcf]">
          {formatViews(summary?.total ?? 0)} reviews
        </p>
      </div>

      <div className="flex w-full flex-col gap-3.5">
        {STAR_KEYS.map((star) => (
          <div key={star} className="flex w-full items-center gap-4">
            <div className="flex items-center gap-0.5">
              <span className="w-3 text-center text-sm leading-5 text-white">{star}</span>
              <RatingStarIcon width={14} height={13} />
            </div>
            <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-[#121211]">
              <div className="h-full bg-brand" style={{ width: `${summary?.breakdown[star] ?? 0}%` }} />
            </div>
            <span className="w-8 text-sm leading-5 font-light text-white">
              {summary?.breakdown[star] ?? 0}%
            </span>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3 border-t border-white/10 pt-6">
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
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!myRating || submitReview.isPending}
            >
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
            {submitReview.isError && (
              <p className="text-xs text-red-500">Failed to submit review. Please try again.</p>
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
