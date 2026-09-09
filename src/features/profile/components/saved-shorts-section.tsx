"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ROUTES } from "@/constants/routes";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { resolveImageSrc } from "@/utils/image";
import { useSavedShorts } from "../hooks/use-saved-shorts";

export function SavedShortsSection() {
  const { data: savedShorts, isLoading, isError, refetch } = useSavedShorts();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Video đã lưu</h2>

      {isError ? (
        <ErrorState title="Couldn't load your saved videos." onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-9/16 w-full" />
          ))}
        </div>
      ) : savedShorts && savedShorts.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 lg:grid-cols-6">
          {savedShorts.map((short) => (
            <Link
              key={short.id}
              href={ROUTES.short(short.id)}
              className="group relative aspect-9/16 w-full overflow-hidden rounded-lg bg-white/5"
            >
              <Image
                src={resolveImageSrc(short.thumbnail, PLACEHOLDER_IMAGE)}
                alt={short.title}
                fill
                sizes="200px"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <Play size={22} className="fill-white text-white" />
              </div>
              <p className="absolute inset-x-0 bottom-0 line-clamp-2 bg-linear-to-t from-black/80 to-transparent p-1.5 text-[11px] text-white">
                {short.title}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved videos yet"
          description="Tap the bookmark icon on a short you like to save it here."
        />
      )}
    </div>
  );
}
