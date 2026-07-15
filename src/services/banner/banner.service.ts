import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { Banner } from "@/types/banner";

export const bannerService = {
  async getActive(): Promise<Banner[]> {
    const { data } = await apiClient.get<ApiResponse<Banner[]>>(ENDPOINTS.banners.active);
    return data.data;
  },
};
