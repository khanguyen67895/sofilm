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
  }, [videoRef, src]);
}
