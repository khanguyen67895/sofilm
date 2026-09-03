"use client";

import { useRef, useState } from "react";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { ShareMenu } from "@/components/common/share-menu";
import { cn } from "@/utils/cn";
import { formatRelativeDate } from "@/utils/format";
import { useToggleReviewLike } from "../hooks/use-toggle-review-like";
import { useSubmitReply } from "../hooks/use-submit-reply";
import { useRequireAuth } from "@/hooks/use-require-auth";
import type { Review } from "@/types/review";

interface CommentItemProps {
  movieId: string;
  review: Review;
  /** True for a reply rendered under its parent — hides the Reply action and
   * shrinks the layout, since replies are single-level (a reply can't itself
   * be replied to). */
  isReply?: boolean;
}

export function CommentItem({ movieId, review, isReply = false }: CommentItemProps) {
  const toggleLike = useToggleReviewLike(movieId);
  const submitReply = useSubmitReply(movieId);
  const requireAuth = useRequireAuth();
  const [liked, setLiked] = useState(review.likedByMe);
  const [likesCount, setLikesCount] = useState(review.likesCount);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef<HTMLInputElement>(null);

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

  function handleOpenReply() {
    requireAuth(() => {
      setShowReplyInput(true);
      requestAnimationFrame(() => replyInputRef.current?.focus());
    }, "Sign in to reply.");
  }

  function handlePostReply() {
    if (!replyText.trim()) return;
    submitReply.mutate(
      { commentId: review.id, text: replyText.trim() },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReplyInput(false);
        },
      }
    );
  }

  const avatarSize = isReply ? 44 : 62;

  return (
    <div className="flex gap-3 border-b border-white/10 py-4 backdrop-blur-sm last:border-b-0">
      <Avatar src={review.user.avatar} name={review.user.displayName} size={avatarSize} />
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
          {!isReply && (
            <button type="button" onClick={handleOpenReply} className="flex items-center gap-2 hover:text-white">
              <MessageCircle size={20} /> Reply
            </button>
          )}
          <ShareMenu
            variant="inline"
            onOpenGuard={(open) => requireAuth(open, "Sign in to share this comment.")}
          />
          {toggleLike.isError && (
            <span className="text-red-500">Action failed, please try again.</span>
          )}
        </div>

        {showReplyInput && (
          <div className="mt-3 flex items-center gap-2">
            <input
              ref={replyInputRef}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePostReply();
                if (e.key === "Escape") setShowReplyInput(false);
              }}
              placeholder={`Reply to ${review.user.displayName}...`}
              className="min-w-0 flex-1 rounded-full bg-[rgba(242,242,242,0.1)] px-4 py-2 text-sm font-light text-white outline-none placeholder:font-light placeholder:text-[#b2b2b2]"
            />
            <Button
              size="sm"
              onClick={handlePostReply}
              disabled={!replyText.trim() || submitReply.isPending}
            >
              Post
            </Button>
          </div>
        )}
        {submitReply.isError && (
          <p className="mt-1 text-xs text-red-500">Failed to post reply. Please try again.</p>
        )}

        {review.replies.length > 0 && (
          <div className="mt-3 space-y-1 border-l border-white/10 pl-4">
            {review.replies.map((reply) => (
              <CommentItem key={reply.id} movieId={movieId} review={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
