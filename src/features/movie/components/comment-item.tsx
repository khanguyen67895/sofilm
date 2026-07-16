"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { cn } from "@/utils/cn";
import { formatRelativeDate } from "@/utils/format";
import { useToggleReviewLike } from "../hooks/use-toggle-review-like";
import type { Review } from "@/types/review";

interface CommentItemProps {
  movieId: string;
  review: Review;
  onReply?: () => void;
}

export function CommentItem({ movieId, review, onReply }: CommentItemProps) {
  const toggleLike = useToggleReviewLike(movieId);
  const [liked, setLiked] = useState(review.likedByMe);
  const [likesCount, setLikesCount] = useState(review.likesCount);

  function handleLike() {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((c) => (wasLiked ? c - 1 : c + 1));

    toggleLike.mutate(review.id, {
      onError: () => {
        setLiked(wasLiked);
        setLikesCount((c) => (wasLiked ? c + 1 : c - 1));
      },
    });
  }

  return (
    <div className="flex gap-3 border-b border-white/5 py-4 last:border-b-0">
      <Avatar src={review.user.avatar} name={review.user.displayName} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-white">{review.user.displayName}</span>
          <span className="text-xs text-white/40">{formatRelativeDate(review.createdAt)}</span>
        </div>

        {review.rating != null && (
          <div className="mt-0.5 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <RatingStarIcon
                key={n}
                width={12}
                height={11}
                className={cn(n > Math.round(review.rating ?? 0) && "opacity-25")}
              />
            ))}
          </div>
        )}

        {review.comment && <p className="mt-2 text-sm text-white/80">{review.comment}</p>}

        <div className="mt-2 flex items-center gap-4 text-xs text-white/50">
          <button
            type="button"
            onClick={handleLike}
            className={cn("flex items-center gap-1 hover:text-white", liked && "text-brand")}
          >
            <Heart size={13} className={cn(liked && "fill-brand")} /> {likesCount} Likes
          </button>
          <button type="button" onClick={onReply} className="flex items-center gap-1 hover:text-white">
            <MessageCircle size={13} /> Reply
          </button>
          <button type="button" className="flex items-center gap-1 hover:text-white">
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
