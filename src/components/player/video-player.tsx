"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import Image from "next/image";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/store/player.store";
import { useHlsVideo } from "@/hooks/use-hls-video";
import { cn } from "@/utils/cn";
import { formatCountdown } from "@/utils/format";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onEnded?: () => void;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  onAspectRatioChange?: (aspectRatio: number) => void;
}

export function VideoPlayer({
  src,
  poster,
  onEnded,
  onNextEpisode,
  onPrevEpisode,
  onAspectRatioChange,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying, volume, resume, pause, setVolume } = usePlayerStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  // Read straight off the actual playing element once its real pixel size is
  // known — no backend metadata involved. The player frame always reshapes
  // to the video's own aspect ratio (portrait or landscape alike) instead of
  // pillar/letterboxing it inside a fixed-size box.
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const fitsNaturalAspect = aspectRatio !== null;
  // True while the video is stalled waiting on more data — surfaces network/
  // server-side buffering stalls as a visible spinner instead of a silent
  // freeze, so "did it crash" vs "is it just buffering" is no longer a guess.
  const [isBuffering, setIsBuffering] = useState(false);

  useHlsVideo(videoRef, src);

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
    const container = containerRef.current;
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      // React detaches this container from the DOM on unmount (e.g. the
      // route-change that follows pressing Back). Removing an element that's
      // still `document.fullscreenElement` without exiting fullscreen first
      // leaves Chromium in a broken state — the navigation that follows
      // resolves to a blank about:blank tab instead of the previous page.
      // Always exit cleanly before the node goes away.
      if (document.fullscreenElement === container) {
        document.exitFullscreen().catch(() => {});
      }
    };
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

  function handleLoadedMetadata(e: SyntheticEvent<HTMLVideoElement>) {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth > 0 && videoHeight > 0) {
      const ratio = videoWidth / videoHeight;
      setAspectRatio(ratio);
      onAspectRatioChange?.(ratio);
    }
  }

  const playedPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      style={fitsNaturalAspect ? { aspectRatio } : undefined}
      className={cn(
        "group relative mx-auto w-full max-h-[70vh] overflow-hidden rounded-lg bg-black lg:max-h-140",
        !fitsNaturalAspect && "h-65 sm:h-156.75"
      )}
    >
      <video
        ref={videoRef}
        poster={poster}
        preload="auto"
        className="h-full w-full object-contain"
        onClick={toggle}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
        onProgress={updateBuffered}
        onWaiting={() => setIsBuffering(true)}
        onStalled={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onEnded={onEnded}
      />

      {!isPlaying && !isBuffering && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Play video"
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

      {(onPrevEpisode || onNextEpisode) && (
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-2">
          <button
            type="button"
            onClick={onPrevEpisode}
            disabled={!onPrevEpisode}
            aria-label="Previous episode"
            className="flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:opacity-30"
          >
            <Image src="/image/ic_up.png" alt="" width={36} height={36} className="h-full w-full" />
          </button>
          <button
            type="button"
            onClick={onNextEpisode}
            disabled={!onNextEpisode}
            aria-label="Next episode"
            className="flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:opacity-30"
          >
            <Image src="/image/ic_down.png" alt="" width={36} height={36} className="h-full w-full" />
          </button>
        </div>
      )}

      {/* Visible by default on mobile — a hover-only reveal would leave the
       * fullscreen button (and every other control) permanently unreachable
       * on a touchscreen, which has no hover state at all. */}
      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-linear-to-t from-black/80 to-transparent p-4 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
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
            aria-label="Seek video"
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
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="ml-auto text-white"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
