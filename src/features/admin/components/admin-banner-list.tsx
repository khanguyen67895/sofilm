"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import type { Banner } from "@/types/banner";
import { useAdminBanners } from "../hooks/use-admin-banners";
import { useDeleteBanner } from "../hooks/use-delete-banner";
import { useUpdateBanner } from "../hooks/use-update-banner";

function BannerRow({ banner }: { banner: Banner }) {
  const updateBanner = useUpdateBanner(banner.id);
  const deleteBanner = useDeleteBanner();

  return (
    <div className="flex items-center gap-4 border-b border-white/10 px-4 py-3 last:border-b-0">
      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-white/5">
        {banner.imageUrl && (
          <Image src={banner.imageUrl} alt={banner.title ?? ""} fill className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {banner.title || banner.movie?.title || "Banner"}
        </p>
        <p className="text-xs text-white/50">Thứ tự {banner.order}</p>
      </div>
      <label className="flex items-center gap-2 text-xs text-white/70">
        <input
          type="checkbox"
          className="accent-brand"
          checked={banner.isActive}
          onChange={(e) => updateBanner.mutate({ isActive: e.target.checked })}
        />
        Hiển thị
      </label>
      <Link
        href={ROUTES.adminBannerEdit(banner.id)}
        className="text-xs text-white/60 hover:text-white"
      >
        Sửa
      </Link>
      <button
        type="button"
        aria-label="Xoá banner"
        onClick={() => deleteBanner.mutate(banner.id)}
        className="text-white/40 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export function AdminBannerList() {
  const { data: banners, isLoading } = useAdminBanners();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-white">Hero Trang Chủ</h2>
        <Link href={ROUTES.adminBannerNew}>
          <Button size="sm">+ Thêm Banner</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/10 rounded-md border border-white/10">
          {banners?.map((banner) => (
            <BannerRow key={banner.id} banner={banner} />
          ))}
          {banners?.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-white/50">Chưa có banner nào.</p>
          )}
        </div>
      )}
    </div>
  );
}
