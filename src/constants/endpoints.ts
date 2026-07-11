export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  movies: {
    list: "/movies",
    detail: (slug: string) => `/movies/${slug}`,
    trending: "/movies/trending",
    byCategory: (categorySlug: string) => `/movies/category/${categorySlug}`,
    search: "/movies/search",
    create: "/movies",
    update: (id: string) => `/movies/${id}`,
    adminList: "/movies/admin/list",
    adminDetail: (id: string) => `/movies/by-id/${id}`,
  },
  episodes: {
    list: (movieId: string) => `/movies/${movieId}/episodes`,
    create: (movieId: string) => `/movies/${movieId}/episodes`,
    update: (movieId: string, episodeId: string) => `/movies/${movieId}/episodes/${episodeId}`,
    remove: (movieId: string, episodeId: string) => `/movies/${movieId}/episodes/${episodeId}`,
  },
  videos: {
    uploadUrl: "/videos/upload-url",
    complete: (id: string) => `/videos/${id}/complete`,
    detail: (id: string) => `/videos/${id}`,
  },
  shorts: {
    feed: "/shorts/feed",
    like: (id: string) => `/shorts/${id}/like`,
  },
  subscription: {
    plans: "/subscription/plans",
    subscribe: "/subscription/subscribe",
    current: "/subscription/current",
  },
  payment: {
    checkout: "/payment/checkout",
    history: "/payment/history",
    verify: (id: string) => `/payment/verify/${id}`,
  },
  profile: {
    me: "/profile/me",
    watchHistory: "/profile/watch-history",
    favorites: "/profile/favorites",
  },
} as const;
