export type MovieType = "MOVIE" | "SERIES";

export interface Episode {
  id: string;
  title: string;
  slug: string;
  episodeNumber: number;
  duration: number;
  videoUrl: string;
  thumbnail: string;
}

export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  description: string;
  poster: string;
  backdrop: string;
  type: MovieType;
  genres: string[];
  genreIds: string[];
  releaseDate: string;
  duration: number;
  rating: number;
  reviewsCount: number;
  views: number;
  isPremium: boolean;
  isFavorite?: boolean;
  /** Server-verified: true if the caller may play this movie (always true for
   * non-premium movies). When false, videoUrl/episode videoUrls are omitted. */
  hasAccess?: boolean;
  videoId?: string;
  videoUrl?: string;
  episodes?: Episode[];
}

export interface MovieRow {
  id: string;
  title: string;
  movies: Movie[];
}

/** What the homepage hero slider actually needs to render — a `Movie`
 * satisfies this structurally, but a hero banner not linked to any movie
 * (just a standalone video/title) does too, since every field here is
 * optional except id/title. */
export interface HeroItem {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  poster?: string;
  backdrop?: string;
  videoUrl?: string;
  isPremium?: boolean;
}
