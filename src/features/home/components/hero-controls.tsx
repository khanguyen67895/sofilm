"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { cn } from "@/utils/cn";
import type { HeroItem } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

interface HeroControlsProps {
  items: HeroItem[];
  activeIndex: number;
  onGoTo: (index: number) => void;
}

export function HeroControls({ items, activeIndex, onGoTo }: HeroControlsProps) {
  return (
    <div className="absolute right-4 bottom-10 flex w-[calc(100%-2rem)] max-w-md flex-col items-end gap-3 sm:right-8 sm:bottom-12 sm:w-auto">
      <div className="scrollbar-none flex w-full justify-end gap-2 overflow-x-auto">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onGoTo(index)}
            className={cn(
              "relative h-16 w-12 shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-14",
              index !== activeIndex && "opacity-60 hover:opacity-100"
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
              <motion.div
                layoutId="hero-thumb-ring"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-md border-2 border-brand"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            onClick={() => onGoTo(activeIndex - 1)}
            aria-label="Phim trước"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={16} />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onGoTo(activeIndex + 1)}
            aria-label="Phim tiếp theo"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>

        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-white/70">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
