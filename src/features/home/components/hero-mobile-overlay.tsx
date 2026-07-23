"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { gsap, useGSAP } from "@/lib/gsap";
import type { HeroItem } from "@/types/movie";
import { cn } from "@/utils/cn";
import { resolveImageSrc } from "@/utils/image";
import { useHeroTextReveal } from "../hooks/use-hero-text-reveal";
import { HeroSlideNumber } from "./hero-slide-number";

interface HeroMobileOverlayProps {
  items: HeroItem[];
  activeIndex: number;
  onGoTo: (index: number) => void;
}

/** Mobile-only hero — replaces HeroCards/HeroSlide/HeroControls (the desktop
 * reels-morph treatment) with a single flex-col stack: title → description →
 * CTAs → scrub controls → thumbnail strip. Each block reserves its own space
 * in normal flow instead of every piece guessing its own fixed bottom-offset
 * independently, which is what let the text and the controls/thumbnails
 * overlap on real content (longer titles/descriptions) before. */
export function HeroMobileOverlay({ items, activeIndex, onGoTo }: HeroMobileOverlayProps) {
  const active = items[activeIndex];
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scopeRef, titleRef, descRef, ctaRef } = useHeroTextReveal(active.id);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(progressRef.current, {
        width: `${((activeIndex + 1) / items.length) * 100}%`,
        duration: 0.6,
        ease: "sine.inOut",
      });
    },
    { dependencies: [activeIndex, items.length], scope: progressRef }
  );

  // See HeroSlide (desktop counterpart) — the declarative `autoPlay`
  // attribute can be silently rejected by Chromium's autoplay gate when the
  // element mounts post-hydration; play() imperatively instead.
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [active.videoUrl]);

  return (
    <>
      {active.videoUrl ? (
        <motion.video
          key={active.videoUrl}
          ref={videoRef}
          src={active.videoUrl}
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={resolveImageSrc(active.poster || active.backdrop, PLACEHOLDER_IMAGE)}
              alt={active.title}
              fill
              sizes="100vw"
              priority
              quality={90}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      )}

      <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-black/60 to-black/10" />

      <div className="absolute inset-x-4 bottom-4 z-20 flex flex-col gap-4">
        <div ref={scopeRef} className="space-y-3">
          <div className="overflow-hidden">
            <h1
              ref={titleRef}
              className="text-3xl leading-tight font-extrabold text-white uppercase"
            >
              {active.title}
            </h1>
          </div>
          {active.description && (
            <p ref={descRef} className="line-clamp-3 text-sm text-white/80">
              {active.description}
            </p>
          )}
          {active.slug && (
            <div ref={ctaRef} className="flex gap-3">
              <Link href={ROUTES.movie(active.slug)}>
                <Button size="md">
                  <Play size={16} /> Watch Now
                </Button>
              </Link>
              <Link href={ROUTES.movie(active.slug)}>
                <Button variant="secondary" size="md">
                  <Info size={16} /> More Info
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onGoTo(activeIndex - 1)}
            aria-label="Phim trước"
            className="flex shrink-0"
          >
            <Image src="/image/ic_left.png" alt="" width={32} height={32} />
          </button>
          <button
            type="button"
            onClick={() => onGoTo(activeIndex + 1)}
            aria-label="Phim tiếp theo"
            className="flex shrink-0"
          >
            <Image src="/image/ic_right.png" alt="" width={32} height={32} />
          </button>

          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <div ref={progressRef} className="h-full w-0 bg-brand" />
          </div>
          <HeroSlideNumber
            activeIndex={activeIndex}
            total={items.length}
            className="h-8 w-8"
            itemClassName="!h-8 !text-2xl"
          />
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onGoTo(index)}
              className={cn(
                "relative h-20 w-14 shrink-0 overflow-hidden rounded-md",
                index !== activeIndex && "opacity-60"
              )}
            >
              <Image
                src={resolveImageSrc(item.poster || item.backdrop, PLACEHOLDER_IMAGE)}
                alt={item.title}
                fill
                sizes="56px"
                className="object-cover"
              />
              {index === activeIndex && (
                <span className="absolute inset-0 rounded-md border-2 border-brand" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
