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
  // The OK button routes back to the movie list on success (both create and
  // edit), or just dismisses on error so the admin can fix and retry.
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
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (type === "SERIES") {
      if (!isValidImageSrc(poster)) nextErrors.poster = "Poster image is required.";
      if (!isValidImageSrc(backdrop)) nextErrors.backdrop = "Backdrop image is required.";
    }
    if (!releaseDate) nextErrors.releaseDate = "Release date is required.";
    if (type === "MOVIE" && !duration.trim()) nextErrors.duration = "Duration is required.";
    if (!genreId) nextErrors.genreId = "Genre is required.";
    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0 && !blocked;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
            thumbnail: ep.thumbnail,
            videoId: ep.videoId,
          });
        }
        setIsSubmitting(false);
        setDialog({ variant: "success", title: "Movie created successfully!" });
      } catch (err) {
        setIsSubmitting(false);
        setDialog({
          variant: "error",
          title: "Failed to create movie",
          description: getApiErrorMessages(err).join(" "),
        });
      }
    } else if (movie) {
      updateMovie.mutate(payload, {
        onSuccess: () => setDialog({ variant: "success", title: "Movie updated successfully!" }),
        onError: (err) =>
          setDialog({
            variant: "error",
            title: "Failed to update movie",
            description: getApiErrorMessages(err).join(" "),
          }),
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
            You must upload a video before creating the movie.
          </p>
        )}
        {!videoMissing && thumbnailMissing && (
          <p className="mt-2 text-xs text-red-500">
            You must upload a thumbnail before saving.
          </p>
        )}
        {episodesMissing && (
          <p className="mt-2 text-xs text-red-500">
            At least 1 episode is required before creating.
          </p>
        )}
      </div>

      {isGenresError && (
        <p className="text-xs text-red-500">
          Failed to load genres. Please reload the page.
        </p>
      )}

      <Button type="submit" disabled={isPending || blocked}>
        {isPending ? "Saving..." : mode === "create" ? "Create Movie" : "Save Changes"}
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
