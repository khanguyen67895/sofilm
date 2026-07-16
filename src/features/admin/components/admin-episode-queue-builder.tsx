"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VideoUploadField } from "./video-upload-field";

export interface QueuedEpisode {
  episodeNumber: number;
  title: string;
  duration?: number;
  videoId: string;
}

interface AdminEpisodeQueueBuilderProps {
  episodes: QueuedEpisode[];
  onChange: (episodes: QueuedEpisode[]) => void;
}

/** Series create-mode only — the movie doesn't exist yet (no id to attach
 * episodes to), so uploads are queued in local state here and only actually
 * posted to the API once AdminMovieForm creates the movie. Editing an
 * existing series instead uses AdminEpisodeManager, which mutates for real. */
export function AdminEpisodeQueueBuilder({ episodes, onChange }: AdminEpisodeQueueBuilderProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");

  const nextNumber =
    episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) + 1 : 1;

  function handleUploaded({ videoId }: { videoId: string }) {
    onChange([
      ...episodes,
      {
        episodeNumber: nextNumber,
        title: title.trim() || `Tập ${nextNumber}`,
        duration: duration ? Number(duration) : undefined,
        videoId,
      },
    ]);
    setTitle("");
    setDuration("");
  }

  function removeEpisode(episodeNumber: number) {
    onChange(episodes.filter((e) => e.episodeNumber !== episodeNumber));
  }

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm tracking-wide text-white/80 uppercase">
        Danh Sách Tập
      </h3>

      {episodes.length > 0 && (
        <div className="space-y-2">
          {episodes.map((ep) => (
            <div
              key={ep.episodeNumber}
              className="flex items-center justify-between rounded-md border border-white/10 p-3"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  Tập {ep.episodeNumber} — {ep.title}
                </p>
                {ep.duration ? (
                  <p className="text-xs text-white/50">{ep.duration} phút</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeEpisode(ep.episodeNumber)}
                aria-label={`Xoá Tập ${ep.episodeNumber}`}
                className="text-white/40 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

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
        <VideoUploadField key={nextNumber} hasVideo={false} onUploaded={handleUploaded} />
      </div>
    </div>
  );
}
