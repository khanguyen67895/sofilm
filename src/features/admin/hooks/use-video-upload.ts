"use client";

import { useCallback, useState } from "react";
import { videoService } from "@/services/video/video.service";

export type VideoUploadStatus = "idle" | "uploading" | "completing" | "done" | "error";

export function useVideoUpload() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<VideoUploadStatus>("idle");

  const upload = useCallback(async (file: File) => {
    setStatus("uploading");
    setProgress(0);
    try {
      const { videoId, uploadUrl } = await videoService.requestUploadUrl({
        filename: file.name,
        contentType: file.type,
      });

      await videoService.uploadToS3(uploadUrl, file, setProgress);

      setStatus("completing");
      const video = await videoService.completeUpload(videoId);

      setStatus("done");
      return { videoId, videoUrl: video.hlsMasterPlaylistUrl };
    } catch (err) {
      setStatus("error");
      throw err;
    }
  }, []);

  return { upload, progress, status };
}
