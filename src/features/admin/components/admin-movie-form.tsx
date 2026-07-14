"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { Movie, MovieType } from "@/types/movie";
import { useCreateMovie } from "../hooks/use-create-movie";
import { useUpdateMovie } from "../hooks/use-update-movie";
import { AdminMovieFields } from "./admin-movie-fields";
import { AdminMovieVideoSection } from "./admin-movie-video-section";

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
      <AdminMovieFields
        title={title}
        onTitleChange={(e) => setTitle(e.target.value)}
        slug={slug}
        onSlugChange={(e) => setSlug(e.target.value)}
        poster={poster}
        onPosterChange={(e) => setPoster(e.target.value)}
        backdrop={backdrop}
        onBackdropChange={(e) => setBackdrop(e.target.value)}
        description={description}
        onDescriptionChange={(e) => setDescription(e.target.value)}
        type={type}
        onTypeChange={(e) => setType(e.target.value as MovieType)}
        releaseDate={releaseDate}
        onReleaseDateChange={(e) => setReleaseDate(e.target.value)}
        duration={duration}
        onDurationChange={(e) => setDuration(e.target.value)}
        isPremium={isPremium}
        onIsPremiumChange={(e) => setIsPremium(e.target.checked)}
      />

      <AdminMovieVideoSection
        type={type}
        mode={mode}
        movie={movie}
        hasVideo={hasVideo}
        onVideoUploaded={({ videoId: newVideoId }) => {
          setVideoId(newVideoId);
          setHasVideo(true);
        }}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang lưu..." : mode === "create" ? "Tạo Phim" : "Lưu Thay Đổi"}
      </Button>
    </form>
  );
}
