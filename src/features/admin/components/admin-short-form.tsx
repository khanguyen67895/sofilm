"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import type { AdminShortItem } from "@/types/shorts";
import { getApiErrorMessages } from "@/utils/api-error";
import { useCreateShort } from "../hooks/use-create-short";
import { useUpdateShort } from "../hooks/use-update-short";
import { ImageUploadField } from "./image-upload-field";
import { VideoUploadField } from "./video-upload-field";

interface FieldErrors {
  title?: string;
}

interface AdminShortFormProps {
  mode: "create" | "edit";
  short?: AdminShortItem;
}

const SHORT_MAX_DURATION_SECONDS = 90;

export function AdminShortForm({ mode, short }: AdminShortFormProps) {
  const router = useRouter();
  const createShort = useCreateShort();
  const updateShort = useUpdateShort(short?.id ?? "");

  const [title, setTitle] = useState(short?.title ?? "");
  const [content, setContent] = useState(short?.content ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(short?.thumbnail ?? "");
  const [videoId, setVideoId] = useState("");
  const [hasVideo, setHasVideo] = useState(Boolean(short?.videoUrl));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [dialog, setDialog] = useState<{
    variant: "success" | "error";
    title: string;
    description?: string;
  } | null>(null);

  const isPending = createShort.isPending || updateShort.isPending;
  // A create needs a freshly uploaded video attached; editing already has one
  // from the original short unless the admin explicitly replaces it.
  const videoMissing = mode === "create" && !hasVideo;

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && !videoMissing;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const onSuccess = () =>
      setDialog({
        variant: "success",
        title: mode === "create" ? "Short created successfully!" : "Short updated successfully!",
      });
    const onError = (err: unknown) =>
      setDialog({
        variant: "error",
        title: mode === "create" ? "Failed to create short" : "Failed to update short",
        description: getApiErrorMessages(err).join(" "),
      });

    if (mode === "create") {
      createShort.mutate(
        {
          title: title.trim(),
          videoId,
          content: content.trim() || undefined,
          thumbnailUrl: thumbnailUrl || undefined,
        },
        { onSuccess, onError }
      );
    } else if (short) {
      updateShort.mutate(
        {
          title: title.trim(),
          content: content.trim() || undefined,
          thumbnailUrl: thumbnailUrl || undefined,
          videoId: videoId || undefined,
        },
        { onSuccess, onError }
      );
    }
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
        <Label required={mode === "create"}>Video (max 1 minute 30 seconds)</Label>
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

      <Button type="submit" disabled={isPending || videoMissing}>
        {isPending ? "Saving..." : mode === "create" ? "Create Short" : "Save Changes"}
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
