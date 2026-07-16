"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Episode } from "@/types/movie";
import { useCreateEpisode } from "../hooks/use-episode-mutations";
import { VideoUploadField } from "./video-upload-field";

interface AdminEpisodeAddFormProps {
  movieId: string;
  episodes: Episode[];
}

export function AdminEpisodeAddForm({ movieId, episodes }: AdminEpisodeAddFormProps) {
  const createEpisode = useCreateEpisode(movieId);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");

  const nextNumber =
    episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) + 1 : 1;

  function handleUploaded({ videoId }: { videoId: string }) {
    createEpisode.mutate(
      {
        episodeNumber: nextNumber,
        title: title.trim() || `Tập ${nextNumber}`,
        duration: duration ? Number(duration) : undefined,
        videoId,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDuration("");
        },
      }
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-dashed border-white/15 p-3">
      <p className="text-sm font-medium text-white">Thêm Tập {nextNumber}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder={`Tên tập (mặc định: Tập ${nextNumber})`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="sm:flex-1"
        />
        <Input
          type="number"
          placeholder="Thời lượng (phút)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="sm:w-40"
        />
      </div>
      {/* Keyed by nextNumber so the upload widget resets to "idle" the moment
       * an episode is created — without this it would keep showing "Tải lên
       * thành công" from the previous episode's upload. */}
      <VideoUploadField key={nextNumber} hasVideo={false} onUploaded={handleUploaded} />
      {createEpisode.isPending && <p className="text-xs text-white/50">Đang tạo tập...</p>}
      {createEpisode.isError && (
        <p className="text-xs text-red-500">Tạo tập thất bại. Vui lòng thử lại.</p>
      )}
    </div>
  );
}
