"use client";

import { useRef, type ChangeEvent } from "react";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useVideoUpload } from "../hooks/use-video-upload";

interface VideoUploadFieldProps {
  hasVideo: boolean;
  onUploaded: (result: { videoId: string; videoUrl?: string }) => void;
}

export function VideoUploadField({ hasVideo, onUploaded }: VideoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, status } = useVideoUpload();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    onUploaded(result);
    e.target.value = "";
  }

  const isBusy = status === "uploading" || status === "completing";

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isBusy}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud size={16} />
        {hasVideo ? "Thay Video" : "Tải Video Lên"}
      </Button>
      {isBusy && <Progress value={status === "completing" ? 100 : progress * 100} />}
      {status === "done" && (
        <p className="flex items-center gap-1 text-xs text-green-500">
          <CheckCircle2 size={14} /> Tải lên thành công
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500">Tải video thất bại. Vui lòng thử lại.</p>
      )}
      {hasVideo && status === "idle" && (
        <p className="flex items-center gap-1 text-xs text-white/50">
          <CheckCircle2 size={14} /> Đã có video
        </p>
      )}
    </div>
  );
}
