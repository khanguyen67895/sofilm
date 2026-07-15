"use client";

import Link from "next/link";
import { Film, GalleryHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { useAdminMovies } from "../hooks/use-admin-movies";
import { useAdminBanners } from "../hooks/use-admin-banners";

export function AdminDashboardView() {
  const { data: moviePage, isLoading: isMoviesLoading } = useAdminMovies(1);
  const { data: banners, isLoading: isBannersLoading } = useAdminBanners();

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-lg text-white">Tổng Quan</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-md border border-white/10 p-5">
          <Film size={28} className="text-brand" />
          <div>
            <p className="text-xs text-white/50">Tổng số phim</p>
            {isMoviesLoading ? (
              <Skeleton className="mt-1 h-7 w-16" />
            ) : (
              <p className="text-2xl font-semibold text-white">{moviePage?.total ?? 0}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-white/10 p-5">
          <GalleryHorizontal size={28} className="text-brand" />
          <div>
            <p className="text-xs text-white/50">Banner Hero</p>
            {isBannersLoading ? (
              <Skeleton className="mt-1 h-7 w-16" />
            ) : (
              <p className="text-2xl font-semibold text-white">{banners?.length ?? 0}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={ROUTES.adminMovieNew}>
          <Button size="sm">
            <PlusCircle size={16} /> Đăng Phim Mới
          </Button>
        </Link>
        <Link href={ROUTES.adminBannerNew}>
          <Button variant="outline" size="sm">
            <GalleryHorizontal size={16} /> Thêm Banner Hero
          </Button>
        </Link>
      </div>
    </div>
  );
}
