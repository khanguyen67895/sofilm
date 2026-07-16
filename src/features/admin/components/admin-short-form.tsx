"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { useAdminMovies } from "../hooks/use-admin-movies";
import { useCreateShort } from "../hooks/use-create-short";
import { VideoUploadField } from "./video-upload-field";

interface FieldErrors {
  title?: string;
  movieSlug?: string;
}

const SHORT_MAX_DURATION_SECONDS = 90;

export function AdminShortForm() {
  const router = useRouter();
  const { data: moviePage } = useAdminMovies(1);
  const createShort = useCreateShort();

  const [title, setTitle] = useState("");
  const [movieSlug, setMovieSlug] = useState("");
  const [videoId, setVideoId] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const videoMissing = !hasVideo;

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    if (!title.trim()) nextErrors.title = "Bắt buộc phải nhập tiêu đề.";
    if (!movieSlug) nextErrors.movieSlug = "Vui lòng chọn phim gắn với video ngắn này.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && !videoMissing;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    createShort.mutate(
      { title: title.trim(), videoId, movieSlug },
      { onSuccess: () => router.push(ROUTES.adminShorts) }
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
      <div>
        <Label required>Tiêu đề</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <Label required>Phim</Label>
        <Select
          value={movieSlug}
          onChange={(e) => setMovieSlug(e.target.value)}
          aria-invalid={Boolean(errors.movieSlug)}
        >
          <option value="">— Chọn phim —</option>
          {moviePage?.items.map((movie) => (
            <option key={movie.id} value={movie.slug}>
              {movie.title}
            </option>
          ))}
        </Select>
        {errors.movieSlug && <p className="mt-1 text-xs text-red-500">{errors.movieSlug}</p>}
      </div>

      <div>
        <Label required>Video (tối đa 1 phút 30 giây)</Label>
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
            Bắt buộc phải tải video lên trước khi tạo video ngắn.
          </p>
        )}
      </div>

      <Button type="submit" disabled={createShort.isPending || videoMissing}>
        {createShort.isPending ? "Đang lưu..." : "Tạo Video Ngắn"}
      </Button>
    </form>
  );
}
