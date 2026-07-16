import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { AppNotification } from "@/types/notification";

/** Shape returned by the backend's shared `paginate()` helper. */
interface BackendPage<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    const { data } = await apiClient.get<ApiResponse<BackendPage<AppNotification>>>(
      ENDPOINTS.notifications.list,
      { params: { limit: 20 } }
    );
    return data.data.items;
  },
};
