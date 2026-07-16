"use client";

import { useCallback, useState } from "react";
import { imageService } from "@/services/image/image.service";

export type ImageUploadStatus = "idle" | "uploading" | "done" | "error";

export function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ImageUploadStatus>("idle");

  const upload = useCallback(async (file: File) => {
    setStatus("uploading");
    setProgress(0);
    try {
      const { uploadUrl, publicUrl } = await imageService.requestUploadUrl({
        filename: file.name,
        contentType: file.type,
      });

      await imageService.uploadToS3(uploadUrl, file, setProgress);

      setStatus("done");
      return publicUrl;
    } catch (err) {
      setStatus("error");
      throw err;
    }
  }, []);

  return { upload, progress, status };
}
