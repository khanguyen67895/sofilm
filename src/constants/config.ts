export const SITE_CONFIG = {
  name: "SoFilm",
  description: "Xem phim, series và shorts chất lượng cao — mọi lúc, mọi nơi.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  socketURL: process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:8080",
  timeout: 15_000,
};

export const AUTH_TOKEN_KEY = "sofilm_access_token";
export const REFRESH_TOKEN_KEY = "sofilm_refresh_token";
