"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import type { Banner } from "@/types/banner";
import { getApiErrorMessages } from "@/utils/api-error";
import { useCreateBanner } from "../hooks/use-create-banner";
import { useUpdateBanner } from "../hooks/use-update-banner";
import { ImageUploadField } from "./image-upload-field";
import { MoviePickerField, type PickedMovie } from "./movie-picker-field";
import { VideoUploadField } from "./video-upload-field";

interface AdminBannerFormProps {
  mode: "create" | "edit";
  banner?: Banner;
}

export function AdminBannerForm({ mode, banner }: AdminBannerFormProps) {
  const router = useRouter();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner(banner?.id ?? "");

  const [title, setTitle] = useState(banner?.title ?? "");
  const [content, setContent] = useState(banner?.content ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(banner?.thumbnailUrl ?? "");
  const [selectedMovie, setSelectedMovie] = useState<PickedMovie | null>(
    banner?.movie
      ? { id: banner.movie.id, title: banner.movie.title, poster: banner.movie.poster }
      : null
  );
  const [order, setOrder] = useState(banner ? String(banner.order) : "0");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [videoId, setVideoId] = useState(banner?.videoId ?? "");
  const [hasVideo, setHasVideo] = useState(Boolean(banner?.videoId));
  const [dialog, setDialog] = useState<{
    variant: "success" | "error";
    title: string;
    description?: string;
  } | null>(null);

  const isPending = createBanner.isPending || updateBanner.isPending;
  const videoMissing = !hasVideo;
  const movieMissing = !selectedMovie;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (videoMissing || movieMissing) return;

    const payload = {
      title: title.trim() || undefined,
      content: content.trim() || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      movieId: selectedMovie.id,
      videoId,
      order: Number(order) || 0,
      isActive,
    };

    const onSuccess = () =>
      setDialog({
        variant: "success",
        title: mode === "create" ? "Banner created successfully!" : "Banner updated successfully!",
      });
    const onError = (err: unknown) =>
      setDialog({
        variant: "error",
        title: mode === "create" ? "Failed to create banner" : "Failed to update banner",
        description: getApiErrorMessages(err).join(" "),
      });

    if (mode === "create") {
      createBanner.mutate(payload, { onSuccess, onError });
    } else if (banner) {
      updateBanner.mutate(payload, { onSuccess, onError });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
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
        <Label>Nội dung (tuỳ chọn)</Label>
        <p className="mb-2 text-xs text-white/50">
          Đoạn mô tả ngắn hiển thị dưới tiêu đề trên hero.
        </p>
        <Textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>

      <div>
        <Label>Thumbnail (tuỳ chọn)</Label>
        <p className="mb-2 text-xs text-white/50">
          Ảnh hiển thị trong lúc video hero đang tải.
        </p>
        <ImageUploadField
          label="Thumbnail"
          previewUrl={thumbnailUrl}
          onUploaded={setThumbnailUrl}
        />
      </div>

      <div>
        <Label required>Gắn phim</Label>
        <p className="mb-2 text-xs text-white/50">
          Bắt buộc chọn phim đã đăng — nút Watch Now / More Info trên hero sẽ dẫn thẳng tới phim này.
        </p>
        <MoviePickerField selectedMovie={selectedMovie} onSelect={setSelectedMovie} />
        {movieMissing && (
          <p className="mt-2 text-xs text-red-500">Bắt buộc phải chọn phim trước khi lưu banner.</p>
        )}
      </div>

      <div>
        <Label>Thứ tự hiển thị</Label>
        <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Đang hiển thị trên trang chủ
      </label>

      <Button type="submit" disabled={isPending || videoMissing || movieMissing}>
        {isPending ? "Đang lưu..." : mode === "create" ? "Tạo Banner" : "Lưu Thay Đổi"}
      </Button>

      <AlertDialog
        open={dialog !== null}
        variant={dialog?.variant ?? "success"}
        title={dialog?.title ?? ""}
        description={dialog?.description}
        onConfirm={() => {
          const wasSuccess = dialog?.variant === "success";
          setDialog(null);
          if (wasSuccess) router.push(ROUTES.adminBanners);
        }}
      />
    </form>
  );
}
