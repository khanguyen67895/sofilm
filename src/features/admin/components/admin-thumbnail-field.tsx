"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isValidImageSrc } from "@/utils/image";
import { useGenerateThumbnail } from "../hooks/use-generate-thumbnail";
import { VideoUploadField } from "./video-upload-field";

interface AdminThumbnailFieldProps {
  videoId: string;
  hasVideo: boolean;
  thumbnailUrl?: string;
  onVideoUploaded: (result: { videoId: string; videoUrl?: string }) => void;
  onThumbnailGenerated: (url: string) => void;
}

/** Video-service processes the raw upload asynchronously (a queued job, not
 * instant), so "Tạo Thumbnail" enqueues that job and polls until it lands —
 * see useGenerateThumbnail. Replaces manual Poster/Backdrop URL entry for
 * type=MOVIE: one uploaded video is the single source for both. */
export function AdminThumbnailField({
  videoId,
  hasVideo,
  thumbnailUrl,
  onVideoUploaded,
  onThumbnailGenerated,
}: AdminThumbnailFieldProps) {
  const { generate, status, thumbnailUrl: generatedUrl } = useGenerateThumbnail();
  const previewUrl = generatedUrl ?? thumbnailUrl;

  useEffect(() => {
    if (generatedUrl) onThumbnailGenerated(generatedUrl);
  }, [generatedUrl, onThumbnailGenerated]);

  return (
    <div className="space-y-3">
      <VideoUploadField hasVideo={hasVideo} onUploaded={onVideoUploaded} />

      {hasVideo && (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={status === "generating"}
            onClick={() => generate(videoId)}
          >
            {status === "generating" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Đang tạo Thumbnail...
              </>
            ) : (
              <>
                <Wand2 size={16} /> {previewUrl ? "Tạo Lại Thumbnail" : "Tạo Thumbnail"}
              </>
            )}
          </Button>
          {status === "error" && (
            <span className="text-xs text-red-500">Tạo thumbnail thất bại, thử lại.</span>
          )}
        </div>
      )}

      {isValidImageSrc(previewUrl) && (
        <div className="relative h-32 w-56 overflow-hidden rounded-md bg-white/5">
          <Image src={previewUrl} alt="Xem trước thumbnail" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
