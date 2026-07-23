import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Ported from the "timed cards" hero reference (gist Ron015/c8723f94):
 * title rolls up out of a clipped box (yPercent 100 → 0) while description
 * and CTAs simply slide up + fade in underneath, each on its own staggered
 * delay — same cadence as the reference (title 0.15s, desc 0.3s, cta 0.35s).
 * Keyed on `key` (the active item's id) so it re-fires every slide change,
 * not just on mount. */
export function useHeroTextReveal(key: string) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });

      if (titleRef.current) {
        tl.fromTo(titleRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7 }, 0.15);
      }
      if (descRef.current) {
        tl.fromTo(descRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.3);
      }
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.35);
      }
    },
    { dependencies: [key], scope: scopeRef }
  );

  return { scopeRef, titleRef, descRef, ctaRef };
}
