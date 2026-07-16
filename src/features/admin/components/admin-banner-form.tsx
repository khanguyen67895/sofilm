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
import { VideoUploadField } from "./video-upload-field";

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
  const [title, setTitle] = useState(banner?.title ?? "");
  const [order, setOrder] = useState(banner ? String(banner.order) : "0");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [videoId, setVideoId] = useState(banner?.videoId ?? "");
  const [hasVideo, setHasVideo] = useState(Boolean(banner?.videoId));
  const [errors, setErrors] = useState<{ movieId?: string }>({});

  const isPending = createBanner.isPending || updateBanner.isPending;
  const videoMissing = !hasVideo;

  function validate(): boolean {
    const nextErrors: typeof errors = {};
    if (!movieId) nextErrors.movieId = "Vui lòng chọn phim cho banner này.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && !videoMissing;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      movieId,
      title: title.trim() || undefined,
      videoId,
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
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
      <div>
        <Label required>Phim</Label>
        <Select
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
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
        <Label required>Video Hero</Label>
        <p className="mb-2 text-xs text-white/50">
          Hero trang chủ tự động phát video này — giống trailer.
        </p>
        <VideoUploadField
          hasVideo={hasVideo}
          onUploaded={({ videoId: newVideoId }) => {
            setVideoId(newVideoId);
            setHasVideo(true);
          }}
        />
        {videoMissing && (
          <p className="mt-2 text-xs text-red-500">
            Bắt buộc phải tải video lên trước khi tạo banner.
          </p>
        )}
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

      <Button type="submit" disabled={isPending || videoMissing}>
        {isPending ? "Đang lưu..." : mode === "create" ? "Tạo Banner" : "Lưu Thay Đổi"}
      </Button>
    </form>
  );
}
