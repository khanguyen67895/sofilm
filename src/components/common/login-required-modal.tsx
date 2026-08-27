"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useUiStore } from "@/store/ui.store";

/** Global "please log in" popup — triggered by useRequireAuth() whenever a
 * guest attempts a login-only action (upgrade, premium video, comment,
 * like, share, ...). Unlike the old home-auth-gate this is dismissable
 * (backdrop click / X / Escape) since browsing stays open to guests; only
 * the specific gated action is blocked. */
export function LoginRequiredModal() {
  const isOpen = useUiStore((s) => s.isLoginPromptOpen);
  const message = useUiStore((s) => s.loginPromptMessage);
  const close = useUiStore((s) => s.closeLoginPrompt);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-required-title"
          onClick={close}
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 text-center"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="space-y-1.5">
              <h2
                id="login-required-title"
                className="font-heading text-xl font-bold tracking-wide text-white uppercase"
              >
                Login <span className="text-brand">Required</span>
              </h2>
              <p className="text-sm text-white/60">
                {message ?? "Log in or create an account to continue."}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href={ROUTES.login} className="w-full" onClick={close}>
                <Button className="w-full">Log In</Button>
              </Link>
              <Link href={ROUTES.register} className="w-full" onClick={close}>
                <Button variant="outline" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
