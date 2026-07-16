"use client";

import { ImageUploadField } from "./image-upload-field";
import { VideoUploadField } from "./video-upload-field";

interface AdminThumbnailFieldProps {
  hasVideo: boolean;
  thumbnailUrl?: string;
  onVideoUploaded: (result: { videoId: string; videoUrl?: string }) => void;
  onThumbnailUploaded: (url: string) => void;
}

/** Replaces manual Poster/Backdrop URL entry for type=MOVIE: one uploaded
 * video plus one uploaded thumbnail image are the single source for both. */
export function AdminThumbnailField({
  hasVideo,
  thumbnailUrl,
  onVideoUploaded,
  onThumbnailUploaded,
}: AdminThumbnailFieldProps) {
  return (
    <div className="space-y-3">
      <VideoUploadField hasVideo={hasVideo} onUploaded={onVideoUploaded} />

      {hasVideo && (
        <ImageUploadField
          label="Thumbnail"
          previewUrl={thumbnailUrl}
          onUploaded={onThumbnailUploaded}
        />
      )}
    </div>
  );
}
