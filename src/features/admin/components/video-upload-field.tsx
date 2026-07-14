"use client";

import { useRef, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence mode="wait">
        {isBusy ? (
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
            <CheckCircle2 size={14} /> Tải lên thành công
          </motion.p>
        ) : status === "error" ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-500"
          >
            Tải video thất bại. Vui lòng thử lại.
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
