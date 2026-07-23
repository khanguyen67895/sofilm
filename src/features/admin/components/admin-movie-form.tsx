"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useGenres } from "@/features/movie";
import { movieAdminService } from "@/services/admin/movie-admin.service";
import type { Movie, MovieType } from "@/types/movie";
import { getApiErrorMessages } from "@/utils/api-error";
import { isValidImageSrc } from "@/utils/image";
import { useCreateMovie } from "../hooks/use-create-movie";
import { useUpdateMovie } from "../hooks/use-update-movie";
import { AdminMovieFields, type AdminMovieFieldErrors } from "./admin-movie-fields";
import type { QueuedEpisode } from "./admin-episode-queue-builder";
import { AdminMovieVideoSection } from "./admin-movie-video-section";

interface AdminMovieFormProps {
  mode: "create" | "edit";
  movie?: Movie;
}

export function AdminMovieForm({ mode, movie }: AdminMovieFormProps) {
  const router = useRouter();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie(movie?.id ?? "");
  const { data: genres = [], isError: isGenresError } = useGenres();

  const [title, setTitle] = useState(movie?.title ?? "");
  const [slug, setSlug] = useState(movie?.slug ?? "");
  const [description, setDescription] = useState(movie?.description ?? "");
  const [poster, setPoster] = useState(movie?.poster ?? "");
  const [backdrop, setBackdrop] = useState(movie?.backdrop ?? "");
  const [type, setType] = useState<MovieType>(movie?.type ?? "MOVIE");
  const [releaseDate, setReleaseDate] = useState(movie?.releaseDate ?? "");
  const [duration, setDuration] = useState(movie?.duration ? String(movie.duration) : "");
  const [isPremium, setIsPremium] = useState(movie?.isPremium ?? false);
  const [genreId, setGenreId] = useState(movie?.genreIds?.[0] ?? "");
  const [videoId, setVideoId] = useState(movie?.videoId ?? "");
  const [hasVideo, setHasVideo] = useState(Boolean(movie?.videoUrl));
  const [thumbnailUrl, setThumbnailUrl] = useState(movie?.poster || movie?.backdrop || undefined);
  const [queuedEpisodes, setQueuedEpisodes] = useState<QueuedEpisode[]>([]);
  const [errors, setErrors] = useState<AdminMovieFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Create-only — the OK button routes back to the movie list on success, or
  // just dismisses on error so the admin can fix and retry.
  const [dialog, setDialog] = useState<{
    variant: "success" | "error";
    title: string;
    description?: string;
  } | null>(null);

  const isPending = isSubmitting || createMovie.isPending || updateMovie.isPending;

  // A standalone MOVIE needs its video attached (create-time only — editing
  // usually just touches metadata) and an uploaded thumbnail image (it's now
  // the only source for poster/backdrop, replacing manual URLs).
  const videoMissing = mode === "create" && type === "MOVIE" && !hasVideo;
  const thumbnailMissing = type === "MOVIE" && !thumbnailUrl;
  // A series with zero episodes is a dead end for viewers — required at
  // creation. Editing an existing series manages episodes via AdminEpisodeManager.
  const episodesMissing = mode === "create" && type === "SERIES" && queuedEpisodes.length === 0;
  const blocked = videoMissing || thumbnailMissing || episodesMissing;

  function validate(): boolean {
    const nextErrors: AdminMovieFieldErrors = {};
    if (!title.trim()) nextErrors.title = "Bắt buộc phải nhập tên phim.";
    if (type === "SERIES") {
      if (!isValidImageSrc(poster)) nextErrors.poster = "Bắt buộc phải tải ảnh poster lên.";
      if (!isValidImageSrc(backdrop)) nextErrors.backdrop = "Bắt buộc phải tải ảnh backdrop lên.";
    }
    if (!releaseDate) nextErrors.releaseDate = "Bắt buộc phải chọn ngày phát hành.";
    if (type === "MOVIE" && !duration.trim()) nextErrors.duration = "Bắt buộc phải nhập thời lượng.";
    if (!genreId) nextErrors.genreId = "Bắt buộc phải chọn thể loại.";
    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0 && !blocked;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    const payload = {
      title,
      slug: slug || undefined,
      description: description || undefined,
      poster: type === "MOVIE" ? thumbnailUrl : poster || undefined,
      backdrop: type === "MOVIE" ? thumbnailUrl : backdrop || undefined,
      type,
      releaseDate: releaseDate || undefined,
      duration: duration ? Number(duration) : undefined,
      isPremium,
      videoId: type === "MOVIE" ? videoId || undefined : undefined,
      genreIds: [genreId],
    };

    if (mode === "create") {
      setIsSubmitting(true);
      try {
        const created = await createMovie.mutateAsync(payload);
        for (const ep of queuedEpisodes) {
          await movieAdminService.createEpisode(created.id, {
            episodeNumber: ep.episodeNumber,
            title: ep.title,
            duration: ep.duration,
            videoId: ep.videoId,
          });
        }
        setIsSubmitting(false);
        setDialog({ variant: "success", title: "Tạo phim thành công!" });
      } catch (err) {
        setIsSubmitting(false);
        setDialog({
          variant: "error",
          title: "Tạo phim thất bại",
          description: getApiErrorMessages(err).join(" "),
        });
      }
    } else if (movie) {
      updateMovie.mutate(payload, {
        onError: (err) => setSubmitError(getApiErrorMessages(err).join(" ")),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <AdminMovieFields
        title={title}
        onTitleChange={(e) => setTitle(e.target.value)}
        slug={slug}
        onSlugChange={(e) => setSlug(e.target.value)}
        poster={poster}
        onPosterUploaded={setPoster}
        backdrop={backdrop}
        onBackdropUploaded={setBackdrop}
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
        genres={genres}
        genreId={genreId}
        onGenreIdChange={(e) => setGenreId(e.target.value)}
        errors={errors}
      />

      <div>
        <AdminMovieVideoSection
          type={type}
          mode={mode}
          movie={movie}
          hasVideo={hasVideo}
          thumbnailUrl={thumbnailUrl}
          onVideoUploaded={({ videoId: newVideoId }) => {
            setVideoId(newVideoId);
            setHasVideo(true);
          }}
          onThumbnailUploaded={setThumbnailUrl}
          queuedEpisodes={queuedEpisodes}
          onQueuedEpisodesChange={setQueuedEpisodes}
        />
        {videoMissing && (
          <p className="mt-2 text-xs text-red-500">
            Bắt buộc phải tải video lên trước khi tạo phim.
          </p>
        )}
        {!videoMissing && thumbnailMissing && (
          <p className="mt-2 text-xs text-red-500">
            Bắt buộc phải tải thumbnail lên trước khi lưu.
          </p>
        )}
        {episodesMissing && (
          <p className="mt-2 text-xs text-red-500">
            Bắt buộc phải có ít nhất 1 tập phim trước khi tạo.
          </p>
        )}
      </div>

      {isGenresError && (
        <p className="text-xs text-red-500">
          Không thể tải danh sách thể loại. Vui lòng tải lại trang.
        </p>
      )}
      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <Button type="submit" disabled={isPending || blocked}>
        {isPending ? "Đang lưu..." : mode === "create" ? "Tạo Phim" : "Lưu Thay Đổi"}
      </Button>

      <AlertDialog
        open={dialog !== null}
        variant={dialog?.variant ?? "success"}
        title={dialog?.title ?? ""}
        description={dialog?.description}
        onConfirm={() => {
          const wasSuccess = dialog?.variant === "success";
          setDialog(null);
          if (wasSuccess) router.push(ROUTES.adminMovies);
        }}
      />
    </form>
  );
}
