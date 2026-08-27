"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Episode } from "@/types/movie";
import { useDeleteEpisode, useUpdateEpisode } from "../hooks/use-episode-mutations";
import { ImageUploadField } from "./image-upload-field";
import { VideoUploadField } from "./video-upload-field";

interface AdminEpisodeRowProps {
  movieId: string;
  episode: Episode;
}

export function AdminEpisodeRow({ movieId, episode }: AdminEpisodeRowProps) {
  const updateEpisode = useUpdateEpisode(movieId);
  const deleteEpisode = useDeleteEpisode(movieId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-2 rounded-md border border-white/10 p-3"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            Episode {episode.episodeNumber} — {episode.title}
          </p>
          {episode.duration > 0 && (
            <p className="text-xs text-white/50">{episode.duration} min</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ImageUploadField
            label="Thumbnail"
            previewUrl={episode.thumbnail}
            onUploaded={(url) =>
              updateEpisode.mutate({ episodeId: episode.id, payload: { thumbnail: url } })
            }
          />
          <VideoUploadField
            hasVideo={Boolean(episode.videoUrl)}
            onUploaded={({ videoId }) =>
              updateEpisode.mutate({ episodeId: episode.id, payload: { videoId } })
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={deleteEpisode.isPending}
            onClick={() => deleteEpisode.mutate(episode.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      {(updateEpisode.isError || deleteEpisode.isError) && (
        <p className="text-xs text-red-500">
          {updateEpisode.isError
            ? "Failed to update episode video. Please try again."
            : "Failed to delete episode. Please try again."}
        </p>
      )}
    </motion.div>
  );
}
