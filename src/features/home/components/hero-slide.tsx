"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { HeroItem } from "@/types/movie";

/** Title → description → CTA reveal one after another instead of fading in
 * as a single block — same cadence as the timed-card hero this is based on. */
const CONTENT_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/** The backdrop/poster image itself lives in `HeroCards` now (it's the
 * element that morphs between full-bleed and thumbnail). This component only
 * owns what sits *on top* of that stage for the active item: an optional
 * video layer that fades in once the card has settled, the darkening
 * gradients, and the staggered title/description/CTA text. */
export function HeroSlide({ item }: { item: HeroItem }) {
  return (
    <>
      {item.videoUrl && (
        <motion.video
          key={item.videoUrl}
          src={item.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 z-10 bg-linear-to-r from-black/85 via-black/20 to-transparent" />

      <motion.div
        key={`${item.id}-content`}
        variants={CONTENT_VARIANTS}
        initial="hidden"
        animate="show"
        className="absolute bottom-32 left-4 z-20 max-w-sm space-y-4 sm:bottom-28 sm:left-8 sm:max-w-md lg:max-w-lg"
      >
        <motion.h1
          variants={ITEM_VARIANTS}
          className="text-3xl leading-tight font-extrabold text-white uppercase sm:text-5xl"
        >
          {item.title}
        </motion.h1>
        {item.description && (
          <motion.p
            variants={ITEM_VARIANTS}
            className="line-clamp-3 text-sm text-white/80 sm:text-base"
          >
            {item.description}
          </motion.p>
        )}
        {item.slug && (
          <motion.div variants={ITEM_VARIANTS} className="flex gap-3">
            <Link href={ROUTES.watch(item.slug)}>
              <Button size="lg">
                <Play size={18} /> Watch Now
              </Button>
            </Link>
            <Link href={ROUTES.movie(item.slug)}>
              <Button variant="secondary" size="lg">
                <Info size={18} /> More Info
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
