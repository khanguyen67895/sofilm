import { apiClient, ENDPOINTS } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Episode, Movie, MovieRow } from "@/types/movie";
import type { Short } from "@/types/shorts";

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
  genres?: { id: string; name: string }[];
  seasons?: { episodes: BackendEpisode[] }[];
}

/** Shape returned by the backend's shared `paginate()` helper — uses `limit`,
 * not `pageSize` like the frontend's own `PaginatedResponse`. */
interface BackendPage<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
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
    genreIds: (raw.genres ?? []).map((g) => g.id),
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
  /** Composes the homepage's rows from real endpoints — "Continue Watching" only
   * appears for a signed-in viewer with history, so it's fetched conditionally. */
  async getHomeRows(): Promise<MovieRow[]> {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    const [latestRes, topViewRes, continueWatching] = await Promise.all([
      apiClient.get<ApiResponse<BackendMovie[]>>(ENDPOINTS.movies.latest, {
        params: { limit: 20 },
      }),
      apiClient.get<ApiResponse<BackendMovie[]>>(ENDPOINTS.movies.topView, {
        params: { limit: 20 },
      }),
      isAuthenticated ? movieService.getWatchHistory().catch(() => []) : Promise.resolve([]),
    ]);

    const rows: MovieRow[] = [];
    if (continueWatching.length > 0) {
      rows.push({ id: "continue-watching", title: "Continue Watching", movies: continueWatching });
    }
    rows.push({
      id: "new-releases",
      title: "New Releases",
      movies: latestRes.data.data.map(mapMovieResponse),
    });
    rows.push({
      id: "top-rated",
      title: "Top Rated",
      movies: topViewRes.data.data.map(mapMovieResponse),
    });

    return rows;
  },

  async getTrending(limit = 20): Promise<Movie[]> {
    const { data } = await apiClient.get<ApiResponse<BackendMovie[]>>(ENDPOINTS.movies.trending, {
      params: { limit },
    });
    return data.data.map(mapMovieResponse);
  },

  async getLatest(limit = 10): Promise<Movie[]> {
    const { data } = await apiClient.get<ApiResponse<BackendMovie[]>>(ENDPOINTS.movies.latest, {
      params: { limit },
    });
    return data.data.map(mapMovieResponse);
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
    if (!query.trim()) return [];
    const { data } = await apiClient.get<ApiResponse<BackendPage<BackendMovie>>>(
      ENDPOINTS.movies.search,
      { params: { q: query } }
    );
    return data.data.items.map(mapMovieResponse);
  },

  /** 1-indexed. `genreSlug` filters via the backend's genre-slug join. */
  async getPage(page: number, pageSize = 24, genreSlug?: string): Promise<PaginatedResponse<Movie>> {
    const { data } = await apiClient.get<ApiResponse<BackendPage<BackendMovie>>>(
      ENDPOINTS.movies.list,
      { params: { page, limit: pageSize, genre: genreSlug } }
    );
    const backendPage = data.data;
    return {
      items: backendPage.items.map(mapMovieResponse),
      page: backendPage.page,
      pageSize: backendPage.limit,
      total: backendPage.total,
      hasMore: backendPage.hasMore,
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
