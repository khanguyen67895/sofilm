import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { AdminShortItem, CreateShortPayload, UpdateShortPayload } from "@/types/shorts";

/** Shape returned by the backend's shared `paginate()` helper — uses `limit`,
 * not `pageSize` like the frontend's own `PaginatedResponse`. */
interface BackendPage<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export const shortAdminService = {
  async listShorts(page: number, limit = 20): Promise<PaginatedResponse<AdminShortItem>> {
    const { data } = await apiClient.get<ApiResponse<BackendPage<AdminShortItem>>>(
      ENDPOINTS.shorts.adminList,
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

  /** The backend returns the raw Short entity (nested `video`, `likesCount`/
   * `commentsCount`) rather than the flattened admin-list shape — callers
   * don't need the response, they just invalidate and refetch listShorts(). */
  async createShort(payload: CreateShortPayload): Promise<void> {
    await apiClient.post(ENDPOINTS.shorts.create, payload);
  },

  async getShortById(id: string): Promise<AdminShortItem> {
    const { data } = await apiClient.get<ApiResponse<AdminShortItem>>(
      ENDPOINTS.shorts.adminDetail(id)
    );
    return data.data;
  },

  async updateShort(id: string, payload: UpdateShortPayload): Promise<void> {
    await apiClient.patch(ENDPOINTS.shorts.update(id), payload);
  },

  async deleteShort(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.shorts.remove(id));
  },
};
