export interface Short {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  movieSlug: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export interface AdminShortItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  movieSlug: string;
  likes: number;
  comments: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateShortPayload {
  title: string;
  videoId: string;
  movieSlug: string;
}
