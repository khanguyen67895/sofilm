"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/use-hydrated";

/** How often to re-check the 24h admin session cap while a tab stays open —
 * doesn't need to be tighter than this, the mount-time check below already
 * catches a tab that was reopened after sitting expired. */
const SESSION_CHECK_INTERVAL_MS = 60_000;

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  // `isAuthenticated`/`isAdmin` come from a localStorage-persisted store,
  // which is unavailable during SSR — gate on hydration so the client's
  // first render matches the server's logged-out shape instead of
  // hydration-mismatching.
  const mounted = useHydrated();

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;

    function checkSessionAge() {
      if (useAuthStore.getState().isAdminSessionExpired()) {
        useAuthStore.getState().clearSession();
        router.replace(ROUTES.adminLogin);
      }
    }

    checkSessionAge();
    const id = window.setInterval(checkSessionAge, SESSION_CHECK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [mounted, isAuthenticated, router]);

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 px-4 py-20 text-center"
      >
        <p className="text-white/70">You need to sign in to access the admin panel.</p>
        <Link href={ROUTES.adminLogin}>
          <Button>Sign In</Button>
        </Link>
      </motion.div>
    );
  }

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 px-4 py-20 text-center"
      >
        <p className="text-white/70">You don&apos;t have permission to access this page.</p>
        <Link href={ROUTES.home}>
          <Button variant="outline">Back to Home</Button>
        </Link>
      </motion.div>
    );
  }

  return <>{children}</>;
}
