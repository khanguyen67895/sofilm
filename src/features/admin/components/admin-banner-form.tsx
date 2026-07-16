"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import type { Banner } from "@/types/banner";
import { useCreateBanner } from "../hooks/use-create-banner";
import { useUpdateBanner } from "../hooks/use-update-banner";
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
  const [order, setOrder] = useState(banner ? String(banner.order) : "0");
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [videoId, setVideoId] = useState(banner?.videoId ?? "");
  const [hasVideo, setHasVideo] = useState(Boolean(banner?.videoId));

  const isPending = createBanner.isPending || updateBanner.isPending;
  const videoMissing = !hasVideo;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (videoMissing) return;

    const payload = {
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
