"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { movieService } from "@/services/movie/movie.service";
import { cn } from "@/utils/cn";

interface LikeShareBarProps {
  movieId: string;
  isFavorite?: boolean;
  title: string;
}

export function LikeShareBar({ movieId, isFavorite, title }: LikeShareBarProps) {
  const [liked, setLiked] = useState(Boolean(isFavorite));

  function toggleLike() {
    const wasLiked = liked;
    setLiked(!wasLiked);

    const request = wasLiked
      ? movieService.removeFavorite(movieId)
      : movieService.addFavorite(movieId);

    request.catch(() => setLiked(wasLiked));
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={toggleLike}>
        <Heart size={16} className={cn(liked && "fill-brand text-brand")} />
        Like
      </Button>
      <Button variant="outline" size="sm" onClick={share}>
        <Share2 size={16} />
        Share
      </Button>
    </div>
  );
}
