"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { Movie, MovieType } from "@/types/movie";
import { useCreateMovie } from "../hooks/use-create-movie";
import { useUpdateMovie } from "../hooks/use-update-movie";
import { AdminEpisodeManager } from "./admin-episode-manager";
import { VideoUploadField } from "./video-upload-field";

interface AdminMovieFormProps {
  mode: "create" | "edit";
  movie?: Movie;
}

export function AdminMovieForm({ mode, movie }: AdminMovieFormProps) {
  const router = useRouter();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie(movie?.id ?? "");

  const [title, setTitle] = useState(movie?.title ?? "");
  const [slug, setSlug] = useState(movie?.slug ?? "");
  const [description, setDescription] = useState(movie?.description ?? "");
  const [poster, setPoster] = useState(movie?.poster ?? "");
  const [backdrop, setBackdrop] = useState(movie?.backdrop ?? "");
  const [type, setType] = useState<MovieType>(movie?.type ?? "MOVIE");
  const [releaseDate, setReleaseDate] = useState(movie?.releaseDate ?? "");
  const [duration, setDuration] = useState(movie?.duration ? String(movie.duration) : "");
  const [isPremium, setIsPremium] = useState(movie?.isPremium ?? false);
  const [videoId, setVideoId] = useState(movie?.videoId ?? "");
  const [hasVideo, setHasVideo] = useState(Boolean(movie?.videoUrl));

  const isPending = createMovie.isPending || updateMovie.isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title,
      slug: slug || undefined,
      description: description || undefined,
      poster: poster || undefined,
      backdrop: backdrop || undefined,
      type,
      releaseDate: releaseDate || undefined,
      duration: duration ? Number(duration) : undefined,
      isPremium,
      videoId: type === "MOVIE" ? videoId || undefined : undefined,
    };

    if (mode === "create") {
      createMovie.mutate(payload, {
        onSuccess: (created) => router.push(ROUTES.adminMovieEdit(created.id)),
      });
    } else if (movie) {
      updateMovie.mutate(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          placeholder="Tên phim"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Slug (tuỳ chọn)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <Input
          placeholder="URL Poster"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          className="sm:col-span-2"
        />
        <Input
          placeholder="URL Backdrop"
          value={backdrop}
          onChange={(e) => setBackdrop(e.target.value)}
          className="sm:col-span-2"
        />
        <textarea
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="h-auto w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-500 sm:col-span-2"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MovieType)}
          className="h-10 rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-red-500"
        >
          <option value="MOVIE">Phim Lẻ</option>
          <option value="SERIES">Phim Bộ</option>
        </select>
        <Input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Thời lượng (phút)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
          />
          Nội dung Premium
        </label>
      </div>

      {type === "MOVIE" && (
        <div>
          <h3 className="font-heading mb-2 text-sm tracking-wide text-white/80 uppercase">
            Video
          </h3>
          <VideoUploadField
            hasVideo={hasVideo}
            onUploaded={({ videoId: newVideoId }) => {
              setVideoId(newVideoId);
              setHasVideo(true);
            }}
          />
        </div>
      )}

      {type === "SERIES" &&
        (mode === "edit" && movie ? (
          <AdminEpisodeManager movieId={movie.id} episodes={movie.episodes ?? []} />
        ) : (
          <p className="text-sm text-white/50">Lưu phim trước, sau đó thêm các tập.</p>
        ))}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang lưu..." : mode === "create" ? "Tạo Phim" : "Lưu Thay Đổi"}
      </Button>
    </form>
  );
}
