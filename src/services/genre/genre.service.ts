import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { Genre } from "@/types/genre";

export const genreService = {
  async getAll(): Promise<Genre[]> {
    const { data } = await apiClient.get<ApiResponse<Genre[]>>(ENDPOINTS.genres.list);
    return data.data;
  },
};
