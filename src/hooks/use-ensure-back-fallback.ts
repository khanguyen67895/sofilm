import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * Every browsing context's session history starts with an implicit initial
 * `about:blank` entry (HTML spec) before any real navigation. So a movie or
 * shorts page opened as the very FIRST navigation in its tab — a shared
 * link, deep link, QR code, or typed URL, never routed through via an
 * in-app `<Link>` — leaves `history` as just `[about:blank, thisPage]`.
 * Pressing Back then has nowhere real to land: the browser navigates to
 * that phantom `about:blank` entry, leaving a blank tab.
 *
 * Synthesize a Home entry underneath the current one via raw
 * `history.replaceState`/`pushState` so Back lands on a real, same-origin
 * URL instead (this alone is enough to avoid the blank tab). But that entry
 * was never pushed through Next's router, so it carries none of the
 * internal state Next's App Router uses to know which RSC payload/route
 * tree an entry belongs to — landing on it via a normal `popstate`-driven
 * soft transition renders Home's shell with no data (empty hero, empty
 * rows, just header/footer). So instead of letting Next soft-transition
 * into it, force a full reload the one time `popstate` lands on that
 * specific forged entry — Home then loads exactly as it would from a fresh
 * visit, fully populated. No-op when there's already a real page behind
 * this one (`history.length > 2`, e.g. the user navigated here from Home
 * via a normal in-app click) — normal back navigation stays a fast soft
 * transition.
 */
export function useEnsureBackFallback() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.history.length > 2) return;
    if (pathname === ROUTES.home) return;

    const currentUrl = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", ROUTES.home);
    window.history.pushState(null, "", currentUrl);

    function handlePopState() {
      if (window.location.pathname === ROUTES.home) {
        window.location.reload();
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname]);
}
