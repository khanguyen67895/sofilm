export interface Banner {
  id: string;
  /** Legacy static-image banners only — new banners are video-only (videoId). */
  imageUrl?: string;
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  videoId?: string;
  /** Resolved server-side — the banner's own uploaded video if set, else the
   * linked movie's video. Autoplays as the hero background when present. */
  videoUrl?: string;
  movie?: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    poster?: string;
    backdrop?: string;
    /** Resolved server-side (video-service lookup) from the movie's videoId — a
     * short clip the hero can autoplay as its background. */
    videoUrl?: string;
    isPremium?: boolean;
  };
  order: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
}

export interface BannerPayload {
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  /** Required — the public hero's Watch Now/More Info always need a movie to link to. */
  movieId: string;
  videoId: string;
  order?: number;
  isActive?: boolean;
  startAt?: string;
  endAt?: string;
}
