export interface Short {
  id: string;
  title: string;
  content?: string;
  videoUrl: string;
  thumbnail: string;
  movieSlug?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export interface AdminShortItem {
  id: string;
  title: string;
  content?: string;
  videoUrl: string;
  thumbnail: string;
  movieSlug?: string;
  likes: number;
  comments: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateShortPayload {
  title: string;
  videoId: string;
  content?: string;
  thumbnailUrl?: string;
  movieSlug?: string;
}

export interface UpdateShortPayload {
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  movieSlug?: string;
  videoId?: string;
  isActive?: boolean;
}
