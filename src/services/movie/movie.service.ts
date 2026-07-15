import { apiClient, ENDPOINTS } from "@/services/api";
import { MOCK_MOVIES, MOCK_ROWS, MOCK_TRENDING } from "@/lib/mock-data";
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
  isFavorite?: boolean;
  hasAccess?: boolean;
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
    isFavorite: raw.isFavorite ?? false,
    hasAccess: raw.hasAccess ?? true,
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

  async getSimilar(slug: string, limit = 12): Promise<Movie[]> {
    const { data } = await apiClient.get<ApiResponse<BackendMovie[]>>(
      ENDPOINTS.movies.recommend(slug),
      { params: { limit } }
    );
    return data.data.map(mapMovieResponse);
  },

  async search(query: string): Promise<Movie[]> {
    // const { data } = await apiClient.get<ApiResponse<Movie[]>>(ENDPOINTS.movies.search, { params: { q: query } });
    // return data.data;
    await new Promise((r) => setTimeout(r, 200));
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_MOVIES.filter((m) => m.title.toLowerCase().includes(q));
  },

  /** 1-indexed. `genreBucket` deterministically splits the mock pool into even
   * slices (mock movies don't carry the real backend's genre taxonomy yet) so
   * every genre filter pill shows a real, non-empty page rather than nothing. */
  async getPage(
    page: number,
    pageSize = 24,
    genreBucket?: { index: number; count: number }
  ): Promise<PaginatedResponse<Movie>> {
    await new Promise((r) => setTimeout(r, 200));
    let pool = [...MOCK_MOVIES, ...MOCK_MOVIES, ...MOCK_MOVIES].map(
      (m, i) => ({ ...m, id: `${m.id}-${i}`, slug: `${m.slug}-${i}` })
    );
    if (genreBucket) {
      pool = pool.filter((_, i) => i % genreBucket.count === genreBucket.index);
    }
    const start = (page - 1) * pageSize;
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
    const { data } = await apiClient.get<ApiResponse<{ items: Short[] }>>(
      ENDPOINTS.shorts.feed,
      { params: { limit: 50 } }
    );
    return data.data.items;
  },

  async likeShort(id: string): Promise<void> {
    await apiClient.post(ENDPOINTS.shorts.like(id));
  },

  async unlikeShort(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.shorts.unlike(id));
  },

  async getFavorites(): Promise<Movie[]> {
    const { data } = await apiClient.get<ApiResponse<BackendMovie[]>>(
      ENDPOINTS.favorites.list
    );
    return data.data.map(mapMovieResponse);
  },

  async addFavorite(movieId: string): Promise<void> {
    await apiClient.post(ENDPOINTS.favorites.add, { movieId });
  },

  async removeFavorite(movieId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.favorites.remove(movieId));
  },

  async getWatchHistory(): Promise<Movie[]> {
    const { data } = await apiClient.get<
      ApiResponse<{ items: { movie: BackendMovie | null }[] }>
    >(ENDPOINTS.history.continueWatching);
    return data.data.items
      .map((item) => item.movie)
      .filter((movie): movie is BackendMovie => movie != null)
      .map(mapMovieResponse);
  },
};
