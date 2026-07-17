"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { usePlayerStore } from "@/store/player.store";
import { formatCountdown } from "@/utils/format";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying, volume, resume, pause, setVolume } = usePlayerStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  // True while the video is stalled waiting on more data — surfaces network/
  // server-side buffering stalls as a visible spinner instead of a silent
  // freeze, so "did it crash" vs "is it just buffering" is no longer a guess.
  const [isBuffering, setIsBuffering] = useState(false);

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

  function seek(time: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }

  function updateBuffered() {
    const video = videoRef.current;
    if (!video || video.buffered.length === 0) return;
    setBuffered(video.buffered.end(video.buffered.length - 1));
  }

  const playedPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="group relative h-156.75 w-full overflow-hidden rounded-lg bg-black"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="auto"
        className="h-full w-full object-cover"
        onClick={toggle}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
        onProgress={updateBuffered}
        onWaiting={() => setIsBuffering(true)}
        onStalled={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
      />

      {isBuffering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <Spinner className="h-10 w-10 border-4" />
        </div>
      )}

      {!isPlaying && !isBuffering && (
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

      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="relative flex h-3 w-full items-center">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/40"
              style={{ width: `${bufferedPct}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand"
              style={{ width: `${playedPct}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Tua video"
            className="absolute inset-x-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        <div className="flex items-center gap-4">
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
          <span className="text-xs text-white/70 tabular-nums">
            {formatCountdown(currentTime)} / {formatCountdown(duration)}
          </span>
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
    </div>
  );
}
