"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useCreateShort } from "../hooks/use-create-short";
import { VideoUploadField } from "./video-upload-field";

interface FieldErrors {
  title?: string;
}

const SHORT_MAX_DURATION_SECONDS = 90;

export function AdminShortForm() {
  const router = useRouter();
  const createShort = useCreateShort();

  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const videoMissing = !hasVideo;

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    if (!title.trim()) nextErrors.title = "Bắt buộc phải nhập tiêu đề.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && !videoMissing;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    createShort.mutate(
      { title: title.trim(), videoId },
      { onSuccess: () => router.push(ROUTES.adminShorts) }
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
      <div>
        <Label required>Tiêu đề</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <Label required>Video (tối đa 1 phút 30 giây)</Label>
        <VideoUploadField
          hasVideo={hasVideo}
          maxDurationSeconds={SHORT_MAX_DURATION_SECONDS}
          onUploaded={({ videoId: newVideoId }) => {
            setVideoId(newVideoId);
            setHasVideo(true);
          }}
        />
        {videoMissing && (
          <p className="mt-2 text-xs text-red-500">
            Bắt buộc phải tải video lên trước khi tạo video ngắn.
          </p>
        )}
      </div>

      <Button type="submit" disabled={createShort.isPending || videoMissing}>
        {createShort.isPending ? "Đang lưu..." : "Tạo Video Ngắn"}
      </Button>
    </form>
  );
}
