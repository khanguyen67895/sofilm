"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import Image from "next/image";
import Hls from "hls.js";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { usePlayerStore } from "@/store/player.store";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/utils/cn";
import { formatCountdown } from "@/utils/format";

const HLS_SOURCE_PATTERN = /\.m3u8($|\?)/i;

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
  // Read straight off the actual playing element once its real pixel size is
  // known — no backend metadata involved. On desktop the player frame never
  // resizes for a portrait video; only the fit mode changes, exactly like a
  // native player (Windows Movies & TV, VLC, ...) pillarboxing it inside a
  // fixed-size window instead of stretching/cropping it to fill. On mobile
  // that fixed wide frame is the problem, not the fix — a portrait video in
  // a landscape-shaped box reads as two dead black bars either side — so
  // there the frame instead reshapes to the video's own aspect ratio.
  const [isPortrait, setIsPortrait] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const fitsNaturalAspect = isPortrait && !isDesktop && aspectRatio;
  // True while the video is stalled waiting on more data — surfaces network/
  // server-side buffering stalls as a visible spinner instead of a silent
  // freeze, so "did it crash" vs "is it just buffering" is no longer a guess.
  const [isBuffering, setIsBuffering] = useState(false);

  // The transcoder hands back an HLS master playlist (`.m3u8`) once a video
  // finishes processing (see `movie.videoUrl` / `episode.videoUrl` from
  // movie-service). Only Safari plays that natively through a bare <video>
  // tag; every other browser has no native `.m3u8` support at all, so those
  // need hls.js (MSE-based) attached manually or the video never plays.
  // Plain mp4 sources (e.g. the raw upload served as-is before transcoding
  // finishes) bypass hls.js entirely and just get assigned to `video.src`.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHlsSource = HLS_SOURCE_PATTERN.test(src);
    const hasNativeHlsSupport = video.canPlayType("application/vnd.apple.mpegurl") !== "";

    if (isHlsSource && !hasNativeHlsSupport) {
      if (!Hls.isSupported()) {
        console.error("This browser can't play HLS video and hls.js isn't supported either.");
        return;
      }
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) console.error("hls.js fatal error", data);
      });
      return () => hls.destroy();
    }

    video.src = src;
    return () => {
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

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
      setIsPortrait(videoHeight > videoWidth);
      setAspectRatio(videoWidth / videoHeight);
    }
  }

  const playedPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      style={fitsNaturalAspect ? { aspectRatio } : undefined}
      className={cn(
        "group relative w-full overflow-hidden rounded-lg bg-black",
        !fitsNaturalAspect && "h-65 sm:h-156.75"
      )}
    >
      <video
        ref={videoRef}
        poster={poster}
        preload="auto"
        className={cn("h-full w-full", isPortrait && !fitsNaturalAspect ? "object-contain" : "object-cover")}
        onClick={toggle}
        onLoadedMetadata={handleLoadedMetadata}
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
