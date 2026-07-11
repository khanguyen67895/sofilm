import { apiClient, ENDPOINTS } from "@/services/api";
import { MOCK_MOVIES, MOCK_ROWS, MOCK_SHORTS, MOCK_TRENDING } from "@/lib/mock-data";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Episode, Movie, MovieRow } from "@/types/movie";
import type { Short } from "@/types/shorts";

// NOTE: reads are backed by mock data for now so the UI works without a
// backend. Swap the body for the commented apiClient call once the real
// API is available — the function signatures already match it.

export interface BackendEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  thumbnail?: string;
  duration?: number;
  videoId?: string;
  videoUrl?: string;
}

export interface BackendMovie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  description?: string;
  poster?: string;
  backdrop?: string;
  type: "MOVIE" | "SERIES";
  releaseDate?: string;
  duration?: number;
  rating: number;
  views: number;
  isPremium: boolean;
  videoId?: string;
  videoUrl?: string;
  genres?: { name: string }[];
  seasons?: { episodes: BackendEpisode[] }[];
}

export function mapMovieResponse(raw: BackendMovie): Movie {
  const episodes: Episode[] = (raw.seasons ?? [])
    .flatMap((season) => season.episodes)
    .sort((a, b) => a.episodeNumber - b.episodeNumber)
    .map((ep) => ({
      id: ep.id,
      title: ep.title,
      slug: `ep-${ep.episodeNumber}`,
      episodeNumber: ep.episodeNumber,
      duration: ep.duration ?? 0,
      videoUrl: ep.videoUrl ?? "",
      thumbnail: ep.thumbnail ?? "",
    }));

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    originalTitle: raw.originalTitle,
    description: raw.description ?? "",
    poster: raw.poster ?? "",
    backdrop: raw.backdrop ?? "",
    type: raw.type,
    genres: (raw.genres ?? []).map((g) => g.name),
    releaseDate: raw.releaseDate ?? "",
    duration: raw.duration ?? 0,
    rating: raw.rating,
    views: raw.views,
    isPremium: raw.isPremium,
    videoId: raw.videoId,
    videoUrl: raw.videoUrl,
    episodes: episodes.length > 0 ? episodes : undefined,
  };
}

export const movieService = {
  async getHomeRows(): Promise<MovieRow[]> {
    await new Promise((r) => setTimeout(r, 250));
    return MOCK_ROWS;
  },

  async getTrending(): Promise<Movie[]> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_TRENDING;
  },

  async getBySlug(slug: string): Promise<Movie | undefined> {
    const { data } = await apiClient.get<ApiResponse<BackendMovie>>(
      ENDPOINTS.movies.detail(slug)
    );
    return mapMovieResponse(data.data);
  },

  async search(query: string): Promise<Movie[]> {
    // const { data } = await apiClient.get<ApiResponse<Movie[]>>(ENDPOINTS.movies.search, { params: { q: query } });
    // return data.data;
    await new Promise((r) => setTimeout(r, 200));
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_MOVIES.filter((m) => m.title.toLowerCase().includes(q));
  },

  async getPage(page: number, pageSize = 20): Promise<PaginatedResponse<Movie>> {
    await new Promise((r) => setTimeout(r, 200));
    const pool = [...MOCK_MOVIES, ...MOCK_MOVIES, ...MOCK_MOVIES].map(
      (m, i) => ({ ...m, id: `${m.id}-${i}`, slug: `${m.slug}-${i}` })
    );
    const start = page * pageSize;
    const items = pool.slice(start, start + pageSize);
    return {
      items,
      page,
      pageSize,
      total: pool.length,
      hasMore: start + pageSize < pool.length,
    };
  },

  async getShortsFeed(): Promise<Short[]> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_SHORTS;
  },

  async getFavorites(): Promise<Movie[]> {
    const { data } = await apiClient.get<ApiResponse<Movie[]>>(
      ENDPOINTS.profile.favorites
    );
    return data.data;
  },

  async getWatchHistory(): Promise<Movie[]> {
    const { data } = await apiClient.get<ApiResponse<Movie[]>>(
      ENDPOINTS.profile.watchHistory
    );
    return data.data;
  },
};
