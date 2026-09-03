"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareMenu } from "@/components/common/share-menu";
import { useFavoriteIds } from "@/hooks/use-favorite-ids";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import { useRequireAuth } from "@/hooks/use-require-auth";
import type { Movie } from "@/types/movie";
import { cn } from "@/utils/cn";

export function LikeShareBar({ movie }: { movie: Movie }) {
  const liked = Boolean(useFavoriteIds().data?.has(movie.id));
  const toggleFavorite = useToggleFavorite();
  const requireAuth = useRequireAuth();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="secondary"
        size="sm"
        className="w-9 px-0 normal-case sm:w-auto sm:px-4"
        onClick={() =>
          requireAuth(
            () => toggleFavorite.mutate({ movie, isFavorite: liked }),
            "Sign in to like this movie."
          )
        }
      >
        <Heart size={16} className={cn(liked && "fill-brand text-brand")} />
        <span className="hidden sm:inline">Like</span>
      </Button>
      <ShareMenu
        variant="pill"
        onOpenGuard={(open) => requireAuth(open, "Sign in to share this movie.")}
      />
      {toggleFavorite.isError && (
        <span className="text-xs text-red-500">Action failed, please try again.</span>
      )}
    </div>
  );
}
