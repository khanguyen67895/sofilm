import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { CreateReviewPayload, Review, ReviewSummary } from "@/types/review";

/** Shape returned by the backend's shared `paginate()` helper — uses `limit`,
 * not `pageSize` like the frontend's own `PaginatedResponse`. */
interface BackendPage<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export const reviewService = {
  async getSummary(movieId: string): Promise<ReviewSummary> {
    const { data } = await apiClient.get<ApiResponse<ReviewSummary>>(
      ENDPOINTS.reviews.summary(movieId)
    );
    const summary = data.data;
    // No reviews yet reads as a broken 0-star movie — default to 5 stars
    // until real reviews land, matching mapMovieResponse's Movie.rating default.
    return summary.total > 0 ? summary : { ...summary, average: 5 };
  },

  async list(movieId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    const { data } = await apiClient.get<ApiResponse<BackendPage<Review>>>(
      ENDPOINTS.reviews.list(movieId),
      { params: { page, limit } }
    );
    const backendPage = data.data;
    return {
      items: backendPage.items,
      page: backendPage.page,
      pageSize: backendPage.limit,
      total: backendPage.total,
      hasMore: backendPage.hasMore,
    };
  },

  async submit(movieId: string, payload: CreateReviewPayload): Promise<Review> {
    const { data } = await apiClient.post<ApiResponse<Review>>(
      ENDPOINTS.reviews.submit(movieId),
      payload
    );
    return data.data;
  },

  async toggleLike(movieId: string, reviewId: string): Promise<{ likesCount: number; likedByMe: boolean }> {
    const { data } = await apiClient.post<ApiResponse<{ likesCount: number; likedByMe: boolean }>>(
      ENDPOINTS.reviews.like(movieId, reviewId)
    );
    return data.data;
  },
};
