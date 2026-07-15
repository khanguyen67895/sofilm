"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import type { Banner } from "@/types/banner";
import { useAdminMovies } from "../hooks/use-admin-movies";
import { useCreateBanner } from "../hooks/use-create-banner";
import { useUpdateBanner } from "../hooks/use-update-banner";

interface AdminBannerFormProps {
  mode: "create" | "edit";
  banner?: Banner;
}

export function AdminBannerForm({ mode, banner }: AdminBannerFormProps) {
  const router = useRouter();
  const { data: moviePage } = useAdminMovies(1);
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner(banner?.id ?? "");

  const [movieId, setMovieId] = useState(banner?.movie?.id ?? "");
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "");
  const [title, setTitle] = useState(banner?.title ?? "");
  const [order, setOrder] = useState(banner ? String(banner.order) : "0");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [errors, setErrors] = useState<{ movieId?: string; imageUrl?: string }>({});

  const isPending = createBanner.isPending || updateBanner.isPending;

  function handleMovieChange(id: string) {
    setMovieId(id);
    const movie = moviePage?.items.find((m) => m.id === id);
    if (movie?.backdrop && !imageUrl) setImageUrl(movie.backdrop);
  }

  function validate(): boolean {
    const nextErrors: typeof errors = {};
    if (!movieId) nextErrors.movieId = "Vui lòng chọn phim cho banner này.";
    if (!imageUrl.trim()) nextErrors.imageUrl = "Bắt buộc phải có ảnh banner.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      movieId,
      imageUrl: imageUrl.trim(),
      title: title.trim() || undefined,
      order: Number(order) || 0,
      isActive,
    };

    if (mode === "create") {
      createBanner.mutate(payload, {
        onSuccess: () => router.push(ROUTES.adminBanners),
      });
    } else if (banner) {
      updateBanner.mutate(payload, {
        onSuccess: () => router.push(ROUTES.adminBanners),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <Label required>Phim</Label>
        <Select
          value={movieId}
          onChange={(e) => handleMovieChange(e.target.value)}
          aria-invalid={Boolean(errors.movieId)}
        >
          <option value="">— Chọn phim —</option>
          {moviePage?.items.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </Select>
        {errors.movieId && <p className="mt-1 text-xs text-red-500">{errors.movieId}</p>}
      </div>

      <div>
        <Label required>URL Ảnh Banner</Label>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          aria-invalid={Boolean(errors.imageUrl)}
        />
        {errors.imageUrl && <p className="mt-1 text-xs text-red-500">{errors.imageUrl}</p>}
      </div>

      <div>
        <Label>Tiêu đề (tuỳ chọn)</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label>Thứ tự hiển thị</Label>
        <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Đang hiển thị trên trang chủ
      </label>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang lưu..." : mode === "create" ? "Tạo Banner" : "Lưu Thay Đổi"}
      </Button>
    </form>
  );
}
