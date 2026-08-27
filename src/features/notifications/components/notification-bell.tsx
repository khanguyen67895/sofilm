"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationIcon } from "@/components/layout/header-icons";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { resolveImageSrc } from "@/utils/image";
import { formatRelativeDate } from "@/utils/format";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useNotifications } from "../hooks/use-notifications";

const LAST_SEEN_KEY = "sofilm_notifications_last_seen_at";

/** Shared empty state for the dropdown — guest (not signed in) and
 * signed-in-but-nothing-yet both get the same illustration + bold headline,
 * just with a different supporting line underneath. */
function NotificationEmptyState({ subtitle }: { subtitle: string }) {
  return (
    <div className="m-4 flex flex-col items-center gap-3 rounded-xl bg-white/5 px-6 py-10 text-center">
      <Image
        src="/image/ic_notice_detail.png"
        alt=""
        width={80}
        height={80}
        className="h-16 w-16"
      />
      <p className="font-heading text-base font-bold text-white">Chưa có thông báo mới</p>
      <p className="text-sm text-white/50">{subtitle}</p>
    </div>
  );
}

export function NotificationBell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data } = useNotifications();
  const notifications = data ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reads localStorage on every render once hydrated instead of mirroring it
  // into state via an effect — avoids a synchronous setState-in-effect while
  // still matching the server's render (0) until the client has hydrated.
  const mounted = useHydrated();
  const lastSeenAt = mounted ? Number(localStorage.getItem(LAST_SEEN_KEY) ?? 0) : 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasUnread = notifications.some(
    (n) => new Date(n.createdAt).getTime() > lastSeenAt
  );

  function toggleOpen() {
    setIsOpen((wasOpen) => {
      if (!wasOpen) localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
      return !wasOpen;
    });
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative block"
      >
        <NotificationIcon width={46} height={46} className="h-8 w-8 sm:h-11.5 sm:w-11.5" />
        {hasUnread && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-black" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-xl border border-brand/40 bg-black/95 shadow-2xl backdrop-blur-xl sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-96 sm:max-w-[90vw]"
          >
            <div className="border-b border-white/10 px-4 py-3">
              <h3 className="font-heading text-sm font-semibold text-white uppercase">
                Notification
              </h3>
            </div>

            <div className="scrollbar-none max-h-96 overflow-y-auto">
              {!isAuthenticated ? (
                <NotificationEmptyState subtitle="Đăng nhập để xem thông báo cá nhân của bạn." />
              ) : notifications.length === 0 ? (
                <NotificationEmptyState subtitle="Thông báo của bạn sẽ xuất hiện tại đây." />
              ) : (
                notifications.map((n) => {
                  const isUnread = new Date(n.createdAt).getTime() > lastSeenAt;
                  const row = (
                    <div className="flex gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-b-0 hover:bg-white/5">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white/10">
                        <Image
                          src={resolveImageSrc(n.metadata?.thumbnail, PLACEHOLDER_IMAGE)}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-white/40">
                          {formatRelativeDate(n.createdAt)}
                        </p>
                        <p className="truncate text-sm font-semibold text-white">{n.title}</p>
                        <p className="line-clamp-1 text-xs text-white/50">{n.body}</p>
                      </div>
                      {isUnread && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                      )}
                    </div>
                  );

                  return n.metadata?.link ? (
                    <Link key={n.id} href={n.metadata.link} onClick={() => setIsOpen(false)}>
                      {row}
                    </Link>
                  ) : (
                    <div key={n.id}>{row}</div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
