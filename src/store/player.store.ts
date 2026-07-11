import { create } from "zustand";

interface PlayerState {
  currentMovieSlug: string | null;
  currentEpisode: number;
  isPlaying: boolean;
  volume: number;
  play: (slug: string, episode?: number) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentMovieSlug: null,
  currentEpisode: 1,
  isPlaying: false,
  volume: 1,
  play: (slug, episode = 1) =>
    set({ currentMovieSlug: slug, currentEpisode: episode, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
  reset: () =>
    set({ currentMovieSlug: null, currentEpisode: 1, isPlaying: false }),
}));
