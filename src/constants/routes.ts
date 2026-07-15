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
  adminBanners: "/admin/banners",
  adminBannerNew: "/admin/banners/new",
  adminBannerEdit: (id: string) => `/admin/banners/${id}/edit`,
} as const;

/** Full-bleed auth screens (phone/OTP login) and the entire admin section render their
 * own layout (AdminHeader/AdminSidebar or a bare centered form) — no public
 * Header/Footer/MobileNav. */
export function isChromeLessRoute(pathname: string): boolean {
  return pathname.startsWith(ROUTES.login) || pathname.startsWith(ROUTES.admin);
}
