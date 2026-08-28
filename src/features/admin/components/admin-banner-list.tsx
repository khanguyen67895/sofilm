"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/error-state";
import { ROUTES } from "@/constants/routes";
import type { Banner } from "@/types/banner";
import { isValidImageSrc } from "@/utils/image";
import { useAdminBanners } from "../hooks/use-admin-banners";
import { useDeleteBanner } from "../hooks/use-delete-banner";
import { useUpdateBanner } from "../hooks/use-update-banner";

function BannerRow({ banner, onDeleted }: { banner: Banner; onDeleted: () => void }) {
  const updateBanner = useUpdateBanner(banner.id);
  const deleteBanner = useDeleteBanner();

  function handleDelete() {
    const label = banner.title || banner.movie?.title || "this banner";
    if (!window.confirm(`Delete "${label}"? This action cannot be undone.`)) return;
    deleteBanner.mutate(banner.id, { onSuccess: onDeleted });
  }

  return (
    <div className="flex flex-col gap-1.5 border-b border-white/10 px-4 py-3 last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-white/5">
          {isValidImageSrc(banner.thumbnailUrl ?? banner.imageUrl ?? banner.movie?.backdrop) && (
            <Image
              src={(banner.thumbnailUrl ?? banner.imageUrl ?? banner.movie?.backdrop) as string}
              alt={banner.title ?? ""}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {banner.title || banner.movie?.title || "Banner"}
          </p>
          <p className="text-xs text-white/50">Order {banner.order}</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input
            type="checkbox"
            className="accent-brand"
            checked={banner.isActive}
            onChange={(e) => updateBanner.mutate({ isActive: e.target.checked })}
          />
          Visible
        </label>
        <Link
          href={ROUTES.adminBannerEdit(banner.id)}
          className="text-xs text-white/60 hover:text-white"
        >
          Edit
        </Link>
        <button
          type="button"
          aria-label="Delete banner"
          disabled={deleteBanner.isPending}
          onClick={handleDelete}
          className="text-white/40 hover:text-red-500 disabled:opacity-40"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {(updateBanner.isError || deleteBanner.isError) && (
        <p className="text-xs text-red-500">
          {updateBanner.isError
            ? "Failed to update banner. Please try again."
            : "Failed to delete banner. Please try again."}
        </p>
      )}
    </div>
  );
}

export function AdminBannerList() {
  const { data: banners, isLoading, isError, refetch } = useAdminBanners();
  const [showDeleted, setShowDeleted] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-white">Homepage Hero</h2>
        <Link href={ROUTES.adminBannerNew}>
          <Button size="sm">+ Add Banner</Button>
        </Link>
      </div>

      {isError ? (
        <ErrorState title="Failed to load banners." onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/10 rounded-md border border-white/10">
          {banners?.map((banner) => (
            <BannerRow
              key={banner.id}
              banner={banner}
              onDeleted={() => setShowDeleted(true)}
            />
          ))}
          {banners?.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-white/50">No banners yet.</p>
          )}
        </div>
      )}

      <AlertDialog
        open={showDeleted}
        variant="success"
        title="Banner deleted successfully!"
        onConfirm={() => setShowDeleted(false)}
      />
    </div>
  );
}
