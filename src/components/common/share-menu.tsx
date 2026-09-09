"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Link2, Mail, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { SITE_CONFIG } from "@/constants/config";
import { TelegramIcon, WhatsappIcon, XSocialIcon, ZaloIcon } from "./social-icons";
import { cn } from "@/utils/cn";

const COPY_RESET_MS = 2000;

interface ShareMenuProps {
  /** Defaults to `window.location.href` at click time. */
  url?: string;
  /** Defaults to the current document title. Used as the pre-filled text for
   * platforms that accept one (WhatsApp, Telegram, X, Email). */
  title?: string;
  /** `"pill"` matches the glass `Button` used on the movie action bar,
   * `"inline"` matches the plain text-link style of a comment's action row,
   * `"rail"` matches the vertical icon+count stack of the shorts action rail. */
  variant?: "pill" | "inline" | "rail";
  /** Runs before the menu opens — pass `(open) => requireAuth(open, "...")`
   * to gate sharing behind sign-in, matching the rest of this action row.
   * Opens unconditionally when omitted. */
  onOpenGuard?: (open: () => void) => void;
  /** Fired after a share completes (a platform popup opened, or the link was
   * copied) — lets the caller record a share count without ShareMenu needing
   * to know anything about what it's sharing. */
  onShared?: () => void;
  /** `"rail"` variant only — the count shown under the icon. */
  shareCount?: number;
  className?: string;
}

type PlatformIcon = ComponentType<{ size?: number; className?: string }>;

interface Platform {
  key: string;
  label: string;
  /** Real brand artwork (already a full circular badge, like the footer's
   * social icons) — takes priority over `icon` when present. */
  image?: string;
  icon?: PlatformIcon;
  bgClassName: string;
  /** `"popup"` opens a real share intent in a new window; `"copy"` copies
   * the link instead, for platforms with no public web share intent
   * (Messenger requires a registered Facebook app id we don't have). */
  kind: "popup" | "copy" | "mailto";
}

const PLATFORMS: Platform[] = [
  { key: "copy", label: "Copy link", icon: Link2, bgClassName: "bg-white/15", kind: "copy" },
  { key: "facebook", label: "Facebook", image: "/image/ic_face.png", bgClassName: "bg-[#1877F2]", kind: "popup" },
  { key: "messenger", label: "Messenger", image: "/image/ic_mes.png", bgClassName: "bg-[#0084FF]", kind: "copy" },
  { key: "zalo", label: "Zalo", icon: ZaloIcon, bgClassName: "bg-[#0068FF]", kind: "popup" },
  { key: "whatsapp", label: "WhatsApp", icon: WhatsappIcon, bgClassName: "bg-[#25D366]", kind: "popup" },
  { key: "telegram", label: "Telegram", icon: TelegramIcon, bgClassName: "bg-[#26A5E4]", kind: "popup" },
  { key: "twitter", label: "X", icon: XSocialIcon, bgClassName: "bg-black ring-1 ring-white/20", kind: "popup" },
  { key: "email", label: "Email", icon: Mail, bgClassName: "bg-neutral-600", kind: "mailto" },
];

function shareHref(key: string, url: string, title: string): string {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  switch (key) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "zalo":
      return `https://sp.zalo.me/plugin/share?u=${u}`;
    case "whatsapp":
      return `https://wa.me/?text=${t}%20${u}`;
    case "telegram":
      return `https://t.me/share/url?url=${u}&text=${t}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    case "email":
      return `mailto:?subject=${t}&body=${u}`;
    default:
      return url;
  }
}

/** Full share sheet — a grid of platform icons rather than a plain text
 * list, so it reads the same as the native/in-app share sheets users
 * already know (Facebook, Messenger, Zalo, ...). Renders through a portal
 * into `document.body`: every call site sits deep inside `RouteFade`
 * (`app/layout.tsx`'s `PageTransition`), whose `motion.div` animates `y` —
 * a non-zero CSS `transform` on an ancestor turns it into the containing
 * block for `position: fixed` descendants, so without the portal this sheet
 * would anchor to that (page-content-height) box instead of the viewport
 * and land off-screen on any page taller than one screen. */
export function ShareMenu({
  url,
  title,
  variant = "pill",
  onOpenGuard,
  onShared,
  shareCount,
  className,
}: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const mounted = useHydrated();
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function resolveUrl() {
    return url ?? window.location.href;
  }

  function resolveTitle() {
    return title ?? document.title ?? SITE_CONFIG.name;
  }

  function handleTriggerClick() {
    const openMenu = () => setOpen(true);
    if (onOpenGuard) onOpenGuard(openMenu);
    else openMenu();
  }

  async function handlePlatformClick(platform: Platform) {
    if (platform.kind === "copy") {
      await navigator.clipboard.writeText(resolveUrl());
      setCopied(platform.key);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopied(null), COPY_RESET_MS);
      onShared?.();
      return;
    }

    const href = shareHref(platform.key, resolveUrl(), resolveTitle());
    if (platform.kind === "mailto") {
      window.open(href, "_self");
    } else {
      window.open(href, "_blank", "noopener,noreferrer,width=580,height=520");
    }
    setOpen(false);
    onShared?.();
  }

  return (
    <>
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
      ) : variant === "rail" ? (
        <button
          type="button"
          onClick={handleTriggerClick}
          className={cn("flex flex-col items-center gap-1 text-white", className)}
        >
          <Share2 size={24} />
          <span className="text-xs">{shareCount !== undefined ? shareCount : "Share"}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleTriggerClick}
          className={cn("flex items-center gap-2 hover:text-white", className)}
        >
          <Share2 size={20} /> Share
        </button>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-100 bg-black/60"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 32, stiffness: 320 }}
                  role="dialog"
                  aria-modal="true"
                  className="fixed inset-x-0 bottom-0 z-100 rounded-t-2xl bg-neutral-900 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-2xl sm:pb-4"
                >
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <p className="text-sm font-semibold text-white">Share</p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="text-white/60 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-y-4 px-4 py-3">
                    {PLATFORMS.map((platform) => {
                      const isCopied = copied === platform.key;
                      const Icon = platform.icon;
                      return (
                        <button
                          key={platform.key}
                          type="button"
                          onClick={() => handlePlatformClick(platform)}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <span
                            className={cn(
                              "relative flex size-12 items-center justify-center overflow-hidden rounded-full text-white",
                              isCopied ? "bg-brand" : platform.bgClassName
                            )}
                          >
                            {isCopied ? (
                              <Check size={22} />
                            ) : platform.image ? (
                              <Image src={platform.image} alt="" fill sizes="48px" className="object-contain" />
                            ) : (
                              Icon && <Icon size={22} />
                            )}
                          </span>
                          <span className="text-center text-[11px] text-white/80">
                            {isCopied ? "Copied!" : platform.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
