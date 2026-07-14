"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatViews } from "@/utils/format";
import { ROUTES } from "@/constants/routes";
import { movieService } from "@/services/movie/movie.service";
import type { Short } from "@/types/shorts";

export function ShortItem({ short }: { short: Short }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(short.isLiked);
  const [likes, setLikes] = useState(short.likes);

  function toggleLike() {
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    const request = wasLiked
      ? movieService.unlikeShort(short.id)
      : movieService.likeShort(short.id);

    request.catch(() => {
      setIsLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    });
  }

  return (
    <div className="relative flex h-[calc(100dvh-4rem)] w-full items-center justify-center bg-black snap-start">
      <video
        ref={videoRef}
        src={short.videoUrl}
        poster={short.thumbnail}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        autoPlay
        onClick={(e) => {
          const video = e.currentTarget;
          video.paused ? void video.play() : video.pause();
        }}
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent p-4">
        <Link href={ROUTES.movie(short.movieSlug)} className="text-sm font-semibold text-white">
          {short.title}
        </Link>
      </div>

      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
        <motion.button
          type="button"
          onClick={toggleLike}
          whileTap={{ scale: 0.8 }}
          className="flex flex-col items-center gap-1 text-white"
        >
          <motion.span
            key={isLiked ? "liked" : "unliked"}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Heart
              size={26}
              className={cn(isLiked && "fill-red-600 text-red-600")}
            />
          </motion.span>
          <span className="text-xs">{formatViews(likes)}</span>
        </motion.button>
        <button type="button" className="flex flex-col items-center gap-1 text-white">
          <MessageCircle size={26} />
          <span className="text-xs">{formatViews(short.comments)}</span>
        </button>
      </div>
    </div>
  );
}
