export const ROUTES = {
  home: "/",
  category: "/category",
  search: "/search",
  shorts: "/shorts",
  subscription: "/subscription",
  profile: "/profile",
  login: "/auth/login",
  register: "/auth/register",
  movie: (slug: string) => `/movie/${slug}`,
  watch: (slug: string, episode?: number) =>
    episode ? `/movie/${slug}/watch?ep=${episode}` : `/movie/${slug}/watch`,
  admin: "/admin",
  adminMovies: "/admin/movies",
  adminMovieNew: "/admin/movies/new",
  adminMovieEdit: (id: string) => `/admin/movies/${id}/edit`,
} as const;
