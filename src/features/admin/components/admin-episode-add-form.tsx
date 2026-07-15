"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Episode } from "@/types/movie";
import { useCreateEpisode } from "../hooks/use-episode-mutations";

interface AdminEpisodeAddFormProps {
  movieId: string;
  episodes: Episode[];
}

export function AdminEpisodeAddForm({ movieId, episodes }: AdminEpisodeAddFormProps) {
  const createEpisode = useCreateEpisode(movieId);
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [error, setError] = useState<string>();

  function handleAdd() {
    if (!newTitle.trim()) {
      setError("Bắt buộc phải nhập tên tập.");
      return;
    }
    setError(undefined);
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
    <div className="rounded-md border border-dashed border-white/15 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Tên tập (VD: Tập 1)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          aria-invalid={Boolean(error)}
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
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
