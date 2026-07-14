export const ROUTES = {
  home: "/",
  category: "/category",
  search: "/search",
  shorts: "/shorts",
  subscription: "/subscription",
  profile: "/profile",
  login: "/auth/login",
  adminLogin: "/admin/login",
  movie: (slug: string) => `/movie/${slug}`,
  watch: (slug: string, episode?: number) =>
    episode ? `/movie/${slug}/watch?ep=${episode}` : `/movie/${slug}/watch`,
  admin: "/admin",
  adminMovies: "/admin/movies",
  adminMovieNew: "/admin/movies/new",
  adminMovieEdit: (id: string) => `/admin/movies/${id}/edit`,
} as const;

/** Full-bleed auth screens (phone/OTP login, admin login) render their own layout — no Header/Footer/MobileNav. */
export function isChromeLessRoute(pathname: string): boolean {
  return pathname.startsWith(ROUTES.login) || pathname === ROUTES.adminLogin;
}
