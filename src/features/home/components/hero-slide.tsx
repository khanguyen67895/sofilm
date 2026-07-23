"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { HeroItem } from "@/types/movie";
import { useHeroTextReveal } from "../hooks/use-hero-text-reveal";

/** Desktop-only — mobile uses `HeroMobileOverlay` instead (see HeroBanner).
 * The backdrop/poster image itself lives in `HeroCards` (it's the element
 * that morphs between full-bleed and thumbnail). This component only owns
 * what sits *on top* of that stage for the active item: an optional video
 * layer that fades in once the card has settled, the darkening gradients,
 * and the title/description/CTA reveal (see `useHeroTextReveal` — ported
 * from the timed-cards reference's roll-up-then-slide-up cadence). */
export function HeroSlide({ item }: { item: HeroItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scopeRef, titleRef, descRef, ctaRef } = useHeroTextReveal(item.id);

  // The declarative `autoPlay` attribute is unreliable here — Chromium's
  // autoplay gate can reject it silently (no error, just stays paused) when
  // the element mounts post-hydration rather than from static markup.
  // Calling `.play()` imperatively once data is ready is the same fix
  // VideoPlayer already relies on for the movie-detail player.
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [item.videoUrl]);

  return (
    <>
      {item.videoUrl && (
        <motion.video
          key={item.videoUrl}
          ref={videoRef}
          src={item.videoUrl}
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute inset-0 z-5 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 z-10 bg-linear-to-r from-black/85 via-black/20 to-transparent" />

      <div ref={scopeRef} className="absolute bottom-28 left-8 z-20 max-w-md space-y-4 lg:max-w-lg">
        <div className="overflow-hidden">
          <h1
            ref={titleRef}
            className="text-5xl leading-tight font-extrabold text-white uppercase"
          >
            {item.title}
          </h1>
        </div>
        {item.description && (
          <p ref={descRef} className="line-clamp-3 text-base text-white/80">
            {item.description}
          </p>
        )}
        {item.slug && (
          <div ref={ctaRef} className="flex gap-3">
            <Link href={ROUTES.movie(item.slug)}>
              <Button size="lg">
                <Play size={18} /> Watch Now
              </Button>
            </Link>
            <Link href={ROUTES.movie(item.slug)}>
              <Button variant="secondary" size="lg">
                <Info size={18} /> More Info
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
