"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import type { HeroItem } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

export function HeroSlide({ item }: { item: HeroItem }) {
  const backdropSrc = resolveImageSrc(item.backdrop, PLACEHOLDER_IMAGE);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          {item.videoUrl ? (
            <video
              key={item.videoUrl}
              src={item.videoUrl}
              poster={backdropSrc}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={backdropSrc}
              alt={item.title}
              fill
              priority
              sizes="100vw"
              quality={90}
              className="object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/20 to-transparent" />

      <motion.div
        key={`${item.id}-content`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-32 left-4 max-w-sm space-y-4 sm:bottom-28 sm:left-8 sm:max-w-md lg:max-w-lg"
      >
        <h1 className="text-3xl leading-tight font-extrabold text-white uppercase sm:text-5xl">
          {item.title}
        </h1>
        {item.description && (
          <p className="line-clamp-3 text-sm text-white/80 sm:text-base">{item.description}</p>
        )}
        {item.slug && (
          <div className="flex gap-3">
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
          </div>
        )}
      </motion.div>
    </>
  );
}
