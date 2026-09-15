export const ROUTES = {
  home: "/",
  category: "/category",
  search: "/search",
  shorts: "/shorts",
  short: (id: string) => `/shorts?id=${id}`,
  subscription: "/subscription",
  subscriptionCheckout: (planId: string) => `/subscription/checkout?planId=${planId}`,
  subscriptionSuccess: (invoiceId: string) => `/subscription/success?invoiceId=${invoiceId}`,
  profile: "/profile",
  login: "/auth/login",
  register: "/auth/register",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
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
  adminShorts: "/admin/shorts",
  adminShortNew: "/admin/shorts/new",
  adminShortEdit: (id: string) => `/admin/shorts/${id}/edit`,
  adminPayments: "/admin/payments",
} as const;

/** Full-bleed screens that render their own layout — no public Header/Footer:
 * auth (login/register), the entire admin section, and Shorts (edge-to-edge full-viewport
 * video feed like TikTok/Reels, with its own minimal floating back control). */
export function isChromeLessRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/auth/") ||
    pathname.startsWith(ROUTES.admin) ||
    pathname.startsWith(ROUTES.shorts)
  );
}

/** Screens with no publisher-facing content — the internal admin CMS and the
 * bare auth forms. AdSense policy forbids serving ads on back-office/nav-only
 * screens, so `AdSenseScript` skips loading on these instead of the global
 * root-layout script covering every route. */
export function isAdsExcludedRoute(pathname: string): boolean {
  return pathname.startsWith("/auth/") || pathname.startsWith(ROUTES.admin);
}
