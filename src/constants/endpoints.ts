export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    otpPhoneRequest: "/auth/otp/phone/request",
    otpPhoneVerify: "/auth/otp/phone/verify",
  },
  movies: {
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
    unlike: (id: string) => `/shorts/${id}/like`,
  },
  subscriptions: {
    plans: "/subscriptions/plans",
    current: "/subscriptions/me",
  },
  payments: {
    checkout: "/payments/checkout",
    history: "/payments/history",
    verify: (id: string) => `/payments/verify/${id}`,
  },
  users: {
    me: "/users/me",
  },
  favorites: {
    list: "/favorites",
    add: "/favorites",
    remove: (movieId: string) => `/favorites/${movieId}`,
  },
  history: {
    continueWatching: "/history/continue-watching",
  },
} as const;
