export const SITE_CONFIG = {
  name: "SoFilm",
  description: "Watch movies, series, and shorts in high quality — anytime, anywhere.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api.soaff.ai",
  socketURL: process.env.NEXT_PUBLIC_SOCKET_URL ?? "https://api.soaff.ai",
  timeout: 15_000,
};

export const AUTH_TOKEN_KEY = "sofilm_access_token";
export const REFRESH_TOKEN_KEY = "sofilm_refresh_token";

export const SOCIAL_AUTH_CONFIG = {
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "",
};

/** Fallback for any poster/backdrop/thumbnail field that can come back empty
 * from the API — next/image throws ("Failed to construct 'URL': Invalid URL")
 * if given an empty-string src, so every such field must fall back to this
 * instead of rendering the raw value directly. */
export const PLACEHOLDER_IMAGE = "/image/no-image.svg";
