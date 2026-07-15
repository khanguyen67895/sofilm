import { apiClient, ENDPOINTS } from "@/services/api";
import { mapMovieResponse, type BackendMovie } from "@/services/movie/movie.service";
import type { ApiResponse } from "@/types/api";
import type { Movie, MovieType } from "@/types/movie";

export interface AdminMovieListItem {
  id: string;
  slug: string;
  title: string;
  type: MovieType;
  poster?: string;
  backdrop?: string;
  isPremium: boolean;
  createdAt: string;
}

export interface AdminMoviePage {
  items: AdminMovieListItem[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface MoviePayload {
  title: string;
  slug?: string;
  description?: string;
  poster?: string;
  backdrop?: string;
  type: MovieType;
  releaseDate?: string;
  duration?: number;
  isPremium?: boolean;
  videoId?: string;
}

export interface EpisodePayload {
  episodeNumber: number;
  title: string;
  thumbnail?: string;
  duration?: number;
  videoId?: string;
}

export const movieAdminService = {
  async listMovies(page: number, limit = 20): Promise<AdminMoviePage> {
    const { data } = await apiClient.get<ApiResponse<AdminMoviePage>>(
      ENDPOINTS.movies.adminList,
      { params: { page, limit } }
    );
    return data.data;
  },

  async getMovieById(id: string): Promise<Movie> {
    const { data } = await apiClient.get<ApiResponse<BackendMovie>>(
      ENDPOINTS.movies.adminDetail(id)
    );
    return mapMovieResponse(data.data);
  },

  async createMovie(payload: MoviePayload): Promise<Movie> {
    const { data } = await apiClient.post<ApiResponse<BackendMovie>>(
      ENDPOINTS.movies.create,
      payload
    );
    return mapMovieResponse(data.data);
  },

  async updateMovie(id: string, payload: Partial<MoviePayload>): Promise<Movie> {
    const { data } = await apiClient.patch<ApiResponse<BackendMovie>>(
      ENDPOINTS.movies.update(id),
      payload
    );
    return mapMovieResponse(data.data);
  },

  async createEpisode(movieId: string, payload: EpisodePayload) {
    const { data } = await apiClient.post(ENDPOINTS.episodes.create(movieId), payload);
    return data.data;
  },

  async updateEpisode(movieId: string, episodeId: string, payload: Partial<EpisodePayload>) {
    const { data } = await apiClient.patch(
      ENDPOINTS.episodes.update(movieId, episodeId),
      payload
    );
    return data.data;
  },

  async deleteEpisode(movieId: string, episodeId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.episodes.remove(movieId, episodeId));
  },
};
