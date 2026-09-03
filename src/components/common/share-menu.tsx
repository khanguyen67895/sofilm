"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FacebookIcon, TiktokIcon, YoutubeIcon } from "./social-icons";
import { cn } from "@/utils/cn";

type CopyPlatform = "tiktok" | "youtube";

const COPY_RESET_MS = 2000;

interface ShareMenuProps {
  /** Defaults to `window.location.href` at click time. */
  url?: string;
  /** `"pill"` matches the glass `Button` used on the movie action bar,
   * `"inline"` matches the plain text-link style of a comment's action row. */
  variant?: "pill" | "inline";
  /** Runs before the menu opens — pass `(open) => requireAuth(open, "...")`
   * to gate sharing behind sign-in, matching the rest of this action row.
   * Opens unconditionally when omitted. */
  onOpenGuard?: (open: () => void) => void;
  className?: string;
}

/** Facebook has a real "share this URL" web intent (`sharer.php`), so that
 * one opens an actual share popup. TikTok and YouTube don't expose any
 * equivalent for sharing an arbitrary outside link into a user's feed —
 * those just copy the link and say so, rather than pretending to hand off
 * to an app that has nothing to receive it. */
export function ShareMenu({ url, variant = "pill", onOpenGuard, className }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<CopyPlatform | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  function resolveUrl() {
    return url ?? window.location.href;
  }

  function handleTriggerClick() {
    const openMenu = () => setOpen((o) => !o);
    if (onOpenGuard) onOpenGuard(openMenu);
    else openMenu();
  }

  function shareToFacebook() {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolveUrl())}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=580,height=470");
    setOpen(false);
  }

  async function copyForPlatform(platform: CopyPlatform) {
    await navigator.clipboard.writeText(resolveUrl());
    setCopied(platform);
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopied(null), COPY_RESET_MS);
  }

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      {variant === "pill" ? (
        <Button
          variant="secondary"
          size="sm"
          className="w-9 px-0 normal-case sm:w-auto sm:px-4"
          onClick={handleTriggerClick}
        >
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </Button>
      ) : (
        <button
          type="button"
          onClick={handleTriggerClick}
          className="flex items-center gap-2 hover:text-white"
        >
          <Share2 size={20} /> Share
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 z-30 mt-2 w-44 space-y-1 rounded-xl border border-white/10 bg-neutral-900 p-1.5 shadow-2xl"
          >
            <button
              type="button"
              onClick={shareToFacebook}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/90 hover:bg-white/10"
            >
              <FacebookIcon className="size-4 shrink-0" /> Facebook
            </button>
            <button
              type="button"
              onClick={() => copyForPlatform("tiktok")}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/90 hover:bg-white/10"
            >
              {copied === "tiktok" ? (
                <Check size={16} className="shrink-0 text-brand" />
              ) : (
                <TiktokIcon className="size-4 shrink-0" />
              )}
              {copied === "tiktok" ? "Đã copy!" : "TikTok"}
            </button>
            <button
              type="button"
              onClick={() => copyForPlatform("youtube")}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/90 hover:bg-white/10"
            >
              {copied === "youtube" ? (
                <Check size={16} className="shrink-0 text-brand" />
              ) : (
                <YoutubeIcon className="size-4 shrink-0" />
              )}
              {copied === "youtube" ? "Đã copy!" : "YouTube"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
