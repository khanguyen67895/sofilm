"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/store/player.store";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying, volume, resume, pause, setVolume } = usePlayerStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // play() returns a promise that rejects with AbortError whenever the
    // element unmounts or its src changes (e.g. switching episodes) before
    // playback actually starts — an expected race, not a real failure, so it
    // must be caught or it surfaces as an unhandled rejection.
    if (isPlaying) video.play().catch(() => {});
    else video.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  function toggle() {
    if (isPlaying) pause();
    else resume();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void containerRef.current?.requestFullscreen();
    }
  }

  return (
    <div
      ref={containerRef}
      className="group relative h-156.75 w-full overflow-hidden rounded-lg bg-black"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-cover"
        onClick={toggle}
      />

      {!isPlaying && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Phát video"
          className="absolute inset-0 flex items-center justify-center bg-black/20"
        >
          <Image
            src="/image/ic_play.png"
            alt=""
            width={64}
            height={64}
            className="transition-transform hover:scale-110"
          />
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <button type="button" onClick={toggle} className="text-white">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          type="button"
          onClick={() => setVolume(volume > 0 ? 0 : 1)}
          className="text-white"
        >
          {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          className="ml-auto text-white"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
    </div>
  );
}
