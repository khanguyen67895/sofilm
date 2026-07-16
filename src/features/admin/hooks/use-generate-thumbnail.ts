"use client";

import { useCallback, useRef, useState } from "react";
import { videoService } from "@/services/video/video.service";

export type ThumbnailStatus = "idle" | "generating" | "done" | "error";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 30; // ~60s before giving up

export function useGenerateThumbnail() {
  const [status, setStatus] = useState<ThumbnailStatus>("idle");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>();
  const cancelledRef = useRef(false);

  const generate = useCallback(async (videoId: string) => {
    cancelledRef.current = false;
    setStatus("generating");
    setThumbnailUrl(undefined);

    try {
      await videoService.generateThumbnail(videoId);

      for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        if (cancelledRef.current) return;

        const video = await videoService.getById(videoId);
        if (video.status === "READY" && video.thumbnailUrl) {
          setThumbnailUrl(video.thumbnailUrl);
          setStatus("done");
          return;
        }
        if (video.status === "FAILED") {
          setStatus("error");
          return;
        }
      }
      setStatus("error");
    } catch {
      if (!cancelledRef.current) setStatus("error");
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
  }, []);

  return { generate, cancel, status, thumbnailUrl };
}
