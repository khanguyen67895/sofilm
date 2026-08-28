"use client";

import { useEffect, type RefObject } from "react";
import Hls from "hls.js";

const HLS_SOURCE_PATTERN = /\.m3u8($|\?)/i;

/** The transcoder hands back an HLS master playlist (`.m3u8`) once a video
 * finishes processing. Only Safari plays that natively through a bare
 * <video> tag; every other browser has no native `.m3u8` support at all, so
 * those need hls.js (MSE-based) attached manually or the video never plays.
 * Plain mp4 sources (e.g. the raw upload served as-is before transcoding
 * finishes) bypass hls.js entirely and just get assigned to `video.src`. */
export function useHlsVideo(videoRef: RefObject<HTMLVideoElement | null>, src: string | undefined) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHlsSource = HLS_SOURCE_PATTERN.test(src);
    const hasNativeHlsSupport = video.canPlayType("application/vnd.apple.mpegurl") !== "";

    if (isHlsSource && !hasNativeHlsSupport) {
      if (!Hls.isSupported()) {
        console.error("This browser can't play HLS video and hls.js isn't supported either.");
        return;
      }
      const hls = new Hls({
        // The origin (S3, no CDN in front of it yet) is a long, sometimes
        // inconsistent round-trip from the viewer, so the default ~30s
        // buffer target empties out mid-segment on any throughput dip —
        // that's the stall/loading-spinner this config is tuned against.
        // A deeper buffer absorbs more of that jitter before playback runs
        // dry, at the cost of a slightly larger memory footprint.
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        // Always start at the lowest rung instead of hls.js's default -1
        // "auto" pick — a fast first segment (local TCP burst) otherwise
        // gets read as "bandwidth is great", jumps straight to a high rung,
        // then can't sustain it once the real, slower throughput kicks in —
        // that overshoot-then-stall is a big source of the mid-playback
        // loading spinner. Ramping up from the bottom only once bandwidth is
        // actually proven trades a softer first frame for far fewer stalls.
        startLevel: 0,
        // Lower than the ~0.9/0.7 defaults — makes the ABR controller more
        // conservative about trusting a bandwidth spike enough to switch up,
        // for the same overshoot-then-stall reason as startLevel above.
        abrBandWidthFactor: 0.7,
        abrBandWidthUpFactor: 0.6,
      });
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
  }, [videoRef, src]);
}
