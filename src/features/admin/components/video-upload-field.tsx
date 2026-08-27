"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useVideoUpload } from "../hooks/use-video-upload";

interface VideoUploadFieldProps {
  hasVideo: boolean;
  onUploaded: (result: { videoId: string; videoUrl?: string }) => void;
  /** Rejects the file client-side (before spending any upload bandwidth) if
   * its duration exceeds this — used to cap Shorts at ~90s. */
  maxDurationSeconds?: number;
}

function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video duration."));
    };
    video.src = url;
  });
}

function formatMaxDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m <= 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export function VideoUploadField({ hasVideo, onUploaded, maxDurationSeconds }: VideoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, status } = useVideoUpload();
  const [durationError, setDurationError] = useState<string>();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDurationError(undefined);

    if (maxDurationSeconds) {
      try {
        const duration = await readVideoDuration(file);
        if (duration > maxDurationSeconds) {
          setDurationError(
            `Video must be shorter than ${formatMaxDuration(maxDurationSeconds)} (this video is ${Math.round(duration)}s long).`
          );
          e.target.value = "";
          return;
        }
      } catch {
        // Duration unreadable client-side (unsupported codec, etc.) — don't
        // block the upload over a check we can't actually perform.
      }
    }

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
        {hasVideo ? "Replace Video" : "Upload Video"}
      </Button>
      <AnimatePresence mode="wait">
        {durationError ? (
          <motion.p
            key="duration-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-500"
          >
            {durationError}
          </motion.p>
        ) : isBusy ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Progress value={status === "completing" ? 100 : progress * 100} />
          </motion.div>
        ) : status === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-xs text-green-500"
          >
            <CheckCircle2 size={14} /> Upload successful
          </motion.p>
        ) : status === "error" ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-500"
          >
            Failed to upload video. Please try again.
          </motion.p>
        ) : (
          hasVideo && (
            <motion.p
              key="has-video"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1 text-xs text-white/50"
            >
              <CheckCircle2 size={14} /> Đã có video
            </motion.p>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
