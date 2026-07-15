import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { Banner, BannerPayload } from "@/types/banner";

export const bannerAdminService = {
  async listAll(): Promise<Banner[]> {
    const { data } = await apiClient.get<ApiResponse<Banner[]>>(ENDPOINTS.banners.adminList);
    return data.data;
  },

  async create(payload: BannerPayload): Promise<Banner> {
    const { data } = await apiClient.post<ApiResponse<Banner>>(ENDPOINTS.banners.create, payload);
    return data.data;
  },

  async update(id: string, payload: Partial<BannerPayload>): Promise<Banner> {
    const { data } = await apiClient.patch<ApiResponse<Banner>>(
      ENDPOINTS.banners.update(id),
      payload
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.banners.remove(id));
  },
};
