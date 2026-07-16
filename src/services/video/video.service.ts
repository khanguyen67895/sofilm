import axios from "axios";
import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";

export interface CreateUploadUrlPayload {
  filename: string;
  contentType: string;
}

export interface CreateUploadUrlResult {
  videoId: string;
  uploadUrl: string;
  key: string;
}

export interface VideoDetail {
  id: string;
  status: "UPLOADING" | "QUEUED" | "PROCESSING" | "READY" | "FAILED";
  hlsMasterPlaylistUrl?: string;
  thumbnailUrl?: string;
}

export const videoService = {
  async requestUploadUrl(payload: CreateUploadUrlPayload): Promise<CreateUploadUrlResult> {
    const { data } = await apiClient.post<ApiResponse<CreateUploadUrlResult>>(
      ENDPOINTS.videos.uploadUrl,
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

  async completeUpload(videoId: string): Promise<VideoDetail> {
    const { data } = await apiClient.post<ApiResponse<VideoDetail>>(
      ENDPOINTS.videos.complete(videoId)
    );
    return data.data;
  },

  async getById(videoId: string): Promise<VideoDetail> {
    const { data } = await apiClient.get<ApiResponse<VideoDetail>>(
      ENDPOINTS.videos.detail(videoId)
    );
    return data.data;
  },
};
