"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessages } from "@/utils/api-error";
import { useCreateShort } from "../hooks/use-create-short";
import { ImageUploadField } from "./image-upload-field";
import { VideoUploadField } from "./video-upload-field";

interface FieldErrors {
  title?: string;
}

const SHORT_MAX_DURATION_SECONDS = 90;

export function AdminShortForm() {
  const router = useRouter();
  const createShort = useCreateShort();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [dialog, setDialog] = useState<{
    variant: "success" | "error";
    title: string;
    description?: string;
  } | null>(null);

  const videoMissing = !hasVideo;

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && !videoMissing;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    createShort.mutate(
      {
        title: title.trim(),
        videoId,
        content: content.trim() || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
      },
      {
        onSuccess: () => setDialog({ variant: "success", title: "Short created successfully!" }),
        onError: (err) =>
          setDialog({
            variant: "error",
            title: "Failed to create short",
            description: getApiErrorMessages(err).join(" "),
          }),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
      <div>
        <Label required>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <Label>Content (optional)</Label>
        <p className="mb-2 text-xs text-white/50">Caption shown below the title on the feed.</p>
        <Textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>

      <div>
        <Label>Thumbnail (optional)</Label>
        <p className="mb-2 text-xs text-white/50">
          If not uploaded, a thumbnail will be auto-generated from the video.
        </p>
        <ImageUploadField
          label="Thumbnail"
          previewUrl={thumbnailUrl}
          onUploaded={setThumbnailUrl}
        />
      </div>

      <div>
        <Label required>Video (max 1 minute 30 seconds)</Label>
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
            You must upload a video before creating the short.
          </p>
        )}
      </div>

      <Button type="submit" disabled={createShort.isPending || videoMissing}>
        {createShort.isPending ? "Saving..." : "Create Short"}
      </Button>

      <AlertDialog
        open={dialog !== null}
        variant={dialog?.variant ?? "success"}
        title={dialog?.title ?? ""}
        description={dialog?.description}
        onConfirm={() => {
          const wasSuccess = dialog?.variant === "success";
          setDialog(null);
          if (wasSuccess) router.push(ROUTES.adminShorts);
        }}
      />
    </form>
  );
}
