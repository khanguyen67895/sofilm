import { create } from "zustand";

interface PlayerState {
  currentMovieSlug: string | null;
  currentEpisode: number;
  isPlaying: boolean;
  volume: number;
  play: (slug: string, episode?: number) => void;
  resume: () => void;
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
  // Local play/pause toggle on an already-open player — unlike `play`, this must
  // NOT touch currentMovieSlug/currentEpisode, otherwise resuming playback on the
  // detail page resets `activeEpisode` back to episode 1 (see MovieDetailView).
  resume: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
  reset: () =>
    set({ currentMovieSlug: null, currentEpisode: 1, isPlaying: false }),
}));
