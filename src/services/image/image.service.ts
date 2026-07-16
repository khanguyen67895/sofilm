import axios from "axios";
import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";

export interface CreateImageUploadUrlPayload {
  filename: string;
  contentType: string;
}

export interface CreateImageUploadUrlResult {
  uploadUrl: string;
  publicUrl: string;
}

export const imageService = {
  async requestUploadUrl(
    payload: CreateImageUploadUrlPayload
  ): Promise<CreateImageUploadUrlResult> {
    const { data } = await apiClient.post<ApiResponse<CreateImageUploadUrlResult>>(
      ENDPOINTS.images.uploadUrl,
      payload
    );
    return data.data;
  },

  /** Raw PUT straight to the presigned S3/MinIO URL — must skip apiClient's baseURL/auth headers. */
  async uploadToS3(
    uploadUrl: string,
    file: File,
    onProgress?: (ratio: number) => void
  ): Promise<void> {
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (e) => {
        if (onProgress) onProgress(e.total ? e.loaded / e.total : 0);
      },
    });
  },
};
