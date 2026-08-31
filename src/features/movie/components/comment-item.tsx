"use client";

import { useState } from "react";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { cn } from "@/utils/cn";
import { formatRelativeDate } from "@/utils/format";
import { useToggleReviewLike } from "../hooks/use-toggle-review-like";
import { useRequireAuth } from "@/hooks/use-require-auth";
import type { Review } from "@/types/review";

interface CommentItemProps {
  movieId: string;
  review: Review;
  onReply?: () => void;
}

export function CommentItem({ movieId, review, onReply }: CommentItemProps) {
  const toggleLike = useToggleReviewLike(movieId);
  const requireAuth = useRequireAuth();
  const [liked, setLiked] = useState(review.likedByMe);
  const [likesCount, setLikesCount] = useState(review.likesCount);

  function handleLike() {
    requireAuth(() => {
      const wasLiked = liked;
      setLiked(!wasLiked);
      setLikesCount((c) => (wasLiked ? c - 1 : c + 1));

      toggleLike.mutate(review.id, {
        onError: () => {
          setLiked(wasLiked);
          setLikesCount((c) => (wasLiked ? c + 1 : c - 1));
        },
      });
    }, "Sign in to like this comment.");
  }

  return (
    <div className="flex gap-3 border-b border-white/10 py-4 backdrop-blur-sm last:border-b-0">
      <Avatar src={review.user.avatar} name={review.user.displayName} size={62} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-lg leading-7 font-semibold text-white">{review.user.displayName}</span>
          <span className="text-sm leading-5 font-light text-[#cfcfcf]">
            {formatRelativeDate(review.createdAt)}
          </span>
        </div>

        {review.rating != null && (
          <div className="mt-1.5 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <RatingStarIcon
                key={n}
                width={20}
                height={19}
                className={cn(n > Math.round(review.rating ?? 0) && "opacity-25")}
              />
            ))}
          </div>
        )}

        {review.comment && (
          <p className="mt-1.5 text-base leading-6 font-light text-[#d1d5db]">{review.comment}</p>
        )}

        <div className="mt-2 flex items-center gap-4 text-sm leading-5 font-light text-[#d1d5db]">
          <button
            type="button"
            onClick={handleLike}
            className={cn("flex items-center gap-2 hover:text-white", liked && "text-brand")}
          >
            <ThumbsUp size={20} className={cn(liked && "fill-brand")} /> {likesCount} Likes
          </button>
          <button type="button" onClick={onReply} className="flex items-center gap-2 hover:text-white">
            <MessageCircle size={20} /> Reply
          </button>
          <button type="button" className="flex items-center gap-2 hover:text-white">
            <Share2 size={20} /> Share
          </button>
          {toggleLike.isError && (
            <span className="text-red-500">Action failed, please try again.</span>
          )}
        </div>
      </div>
    </div>
  );
}
