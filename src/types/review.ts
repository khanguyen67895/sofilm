export interface ReviewUser {
  userId: string;
  displayName: string;
  avatar?: string;
}

export interface Review {
  id: string;
  rating?: number;
  comment?: string;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  user: ReviewUser;
}

export interface ReviewSummary {
  average: number;
  /** Count of rows that carry a rating. */
  total: number;
  /** Count of rows that carry comment text — distinct from `total`. */
  commentsCount: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface CreateReviewPayload {
  rating?: number;
  comment?: string;
}
