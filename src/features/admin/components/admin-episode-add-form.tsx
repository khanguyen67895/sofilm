"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Episode } from "@/types/movie";
import { useCreateEpisode } from "../hooks/use-episode-mutations";
import { ImageUploadField } from "./image-upload-field";
import { VideoUploadField } from "./video-upload-field";

interface AdminEpisodeAddFormProps {
  movieId: string;
  episodes: Episode[];
}

export function AdminEpisodeAddForm({ movieId, episodes }: AdminEpisodeAddFormProps) {
  const createEpisode = useCreateEpisode(movieId);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const nextNumber =
    episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) + 1 : 1;

  function handleUploaded({ videoId }: { videoId: string }) {
    createEpisode.mutate(
      {
        episodeNumber: nextNumber,
        title: title.trim() || `Episode ${nextNumber}`,
        duration: duration ? Number(duration) : undefined,
        thumbnail: thumbnail || undefined,
        videoId,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDuration("");
          setThumbnail("");
        },
      }
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-dashed border-white/15 p-3">
      <p className="text-sm font-medium text-white">Add Episode {nextNumber}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder={`Episode title (default: Episode ${nextNumber})`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="sm:flex-1"
        />
        <Input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="sm:w-40"
        />
      </div>
      {/* Keyed by nextNumber so the upload widgets reset to "idle" the moment
       * an episode is created — without this they would keep showing "Tải lên
       * thành công" from the previous episode's upload. */}
      <ImageUploadField
        key={`thumb-${nextNumber}`}
        label="Thumbnail"
        previewUrl={thumbnail}
        onUploaded={setThumbnail}
      />
      <VideoUploadField key={nextNumber} hasVideo={false} onUploaded={handleUploaded} />
      {createEpisode.isPending && <p className="text-xs text-white/50">Creating episode...</p>}
      {createEpisode.isError && (
        <p className="text-xs text-red-500">Failed to create episode. Please try again.</p>
      )}
    </div>
  );
}
