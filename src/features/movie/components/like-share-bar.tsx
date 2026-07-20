"use client";

import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoriteIds } from "@/hooks/use-favorite-ids";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import { useRequireAuth } from "@/hooks/use-require-auth";
import type { Movie } from "@/types/movie";
import { cn } from "@/utils/cn";

export function LikeShareBar({ movie }: { movie: Movie }) {
  const liked = Boolean(useFavoriteIds().data?.has(movie.id));
  const toggleFavorite = useToggleFavorite();
  const requireAuth = useRequireAuth();

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: movie.title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-9 px-0 sm:w-auto sm:px-4"
        onClick={() =>
          requireAuth(
            () => toggleFavorite.mutate({ movie, isFavorite: liked }),
            "Đăng nhập để thích phim này."
          )
        }
      >
        <Heart size={16} className={cn(liked && "fill-brand text-brand")} />
        <span className="hidden sm:inline">Like</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-9 px-0 sm:w-auto sm:px-4"
        onClick={() => requireAuth(share, "Đăng nhập để chia sẻ phim này.")}
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">Share</span>
      </Button>
      {toggleFavorite.isError && (
        <span className="text-xs text-red-500">Thao tác thất bại, vui lòng thử lại.</span>
      )}
    </div>
  );
}
