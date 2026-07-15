export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
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
  };
  order: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
}

export interface BannerPayload {
  imageUrl: string;
  title?: string;
  movieId?: string;
  order?: number;
  isActive?: boolean;
  startAt?: string;
  endAt?: string;
}
