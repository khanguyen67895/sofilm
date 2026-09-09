"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth.store";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { formatRelativeDate } from "@/utils/format";
import { useShortComments } from "../hooks/use-short-comments";
import { useSubmitShortComment } from "../hooks/use-submit-short-comment";

interface ShortCommentsSheetProps {
  shortId: string;
  commentsCount: number;
  open: boolean;
  onClose: () => void;
}

/** TikTok-style comments panel — slides up from the bottom over the video
 * (which keeps playing behind it), rather than navigating away. Guests can
 * read the list; posting is gated by useRequireAuth(), same precedent as
 * the movie CommentSection's handlePost(). */
export function ShortCommentsSheet({
  shortId,
  commentsCount,
  open,
  onClose,
}: ShortCommentsSheetProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useShortComments(shortId);
  const submitComment = useSubmitShortComment(shortId);
  const requireAuth = useRequireAuth();
  const user = useAuthStore((s) => s.user);

  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const comments = data?.pages.flatMap((page) => page.items) ?? [];

  function handlePost() {
    if (!text.trim()) return;
    requireAuth(
      () => submitComment.mutate(text.trim(), { onSuccess: () => setText("") }),
      "Sign in to comment."
    );
  }

  function handleInputFocus() {
    requireAuth(() => inputRef.current?.focus(), "Sign in to comment.");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/60"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            className="absolute inset-x-0 bottom-0 z-40 flex h-[70%] flex-col rounded-t-2xl bg-neutral-950"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-white">Comments ({commentsCount})</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close comments"
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : comments.length === 0 ? (
                <p className="py-10 text-center text-sm text-white/50">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <div className="space-y-4 py-2">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <Avatar src={c.user.avatar} name={c.user.displayName} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-semibold text-white">
                            {c.user.displayName}
                          </span>
                          <span className="text-xs text-white/40">
                            {formatRelativeDate(c.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-white/80">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  {hasNextPage && (
                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="text-xs text-white/50 hover:text-white"
                      >
                        {isFetchingNextPage ? "Loading..." : "Load more"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-white/10 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <Avatar src={user?.avatar} name={user?.name} size={32} />
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={handleInputFocus}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePost();
                }}
                placeholder="Add a comment..."
                className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={handlePost}
                disabled={!text.trim() || submitComment.isPending}
                aria-label="Post comment"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
