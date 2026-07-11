"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Episode } from "@/types/movie";
import {
  useCreateEpisode,
  useDeleteEpisode,
  useUpdateEpisode,
} from "../hooks/use-episode-mutations";
import { VideoUploadField } from "./video-upload-field";

interface AdminEpisodeManagerProps {
  movieId: string;
  episodes: Episode[];
}

export function AdminEpisodeManager({ movieId, episodes }: AdminEpisodeManagerProps) {
  const createEpisode = useCreateEpisode(movieId);
  const updateEpisode = useUpdateEpisode(movieId);
  const deleteEpisode = useDeleteEpisode(movieId);

  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");

  function handleAdd() {
    if (!newTitle.trim()) return;
    const nextNumber =
      episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) + 1 : 1;
    createEpisode.mutate(
      {
        episodeNumber: nextNumber,
        title: newTitle.trim(),
        duration: newDuration ? Number(newDuration) : undefined,
      },
      {
        onSuccess: () => {
          setNewTitle("");
          setNewDuration("");
        },
      }
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-sm tracking-wide text-white/80 uppercase">
        Danh Sách Tập
      </h3>

      <div className="space-y-3">
        {episodes
          .slice()
          .sort((a, b) => a.episodeNumber - b.episodeNumber)
          .map((ep) => (
            <div
              key={ep.id}
              className="flex flex-col gap-2 rounded-md border border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Tập {ep.episodeNumber} — {ep.title}
                </p>
                {ep.duration > 0 && <p className="text-xs text-white/50">{ep.duration} phút</p>}
              </div>
              <div className="flex items-center gap-3">
                <VideoUploadField
                  hasVideo={Boolean(ep.videoUrl)}
                  onUploaded={({ videoId }) =>
                    updateEpisode.mutate({ episodeId: ep.id, payload: { videoId } })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteEpisode.mutate(ep.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        {episodes.length === 0 && (
          <p className="text-sm text-white/50">Chưa có tập nào.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-md border border-dashed border-white/15 p-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Tên tập (VD: Tập 1)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="sm:flex-1"
        />
        <Input
          type="number"
          placeholder="Thời lượng (phút)"
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value)}
          className="sm:w-40"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={createEpisode.isPending}
        >
          <Plus size={16} /> Thêm Tập
        </Button>
      </div>
    </div>
  );
}
