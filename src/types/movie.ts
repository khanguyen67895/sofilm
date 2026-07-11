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
  releaseDate: string;
  duration: number;
  rating: number;
  views: number;
  isPremium: boolean;
  videoId?: string;
  videoUrl?: string;
  episodes?: Episode[];
}

export interface MovieRow {
  id: string;
  title: string;
  movies: Movie[];
}
