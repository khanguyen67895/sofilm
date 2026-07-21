"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

/** Fades/slides its children in on every route change.
 *
 * This used to be an `AnimatePresence` keyed on `pathname`, unmounting the
 * old page and mounting a new one. That broke specifically on Back/Forward
 * (popstate) navigation to an already-visited path: Next's router can swap
 * `children` for the restored page while Framer Motion is still mid-way
 * through animating out the *previous* keyed element (its own exit
 * animation never actually completes), leaving the new page's content
 * sitting inside that still-exiting wrapper — frozen at a partial exit
 * opacity/transform. The data loaded fine; it was just never shown.
 *
 * Avoiding that requires never unmounting/remounting the wrapper at all.
 * There's a single persistent `motion.div` here — on every pathname change
 * we imperatively reset it to the "just entered" state and animate it back
 * to visible, while `{children}` swaps underneath via ordinary React
 * reconciliation (which Next handles correctly regardless of Framer
 * Motion). Fails safe too: if this effect ever didn't run, the div simply
 * keeps whatever state it last had — never a stuck-invisible page.
 */
export function RouteFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const controls = useAnimation();

  useEffect(() => {
    controls.set({ opacity: 0, y: 12 });
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeInOut" } });
  }, [pathname, controls]);

  return <motion.div animate={controls}>{children}</motion.div>;
}
