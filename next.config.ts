import type { NextConfig } from "next";

// The deployed backend serves media (posters/thumbnails) from the same host
// as the API (single-VM MinIO setup, see sofilm_backend's docker-compose),
// just on a different port — so without this, next/image throws "hostname
// not configured" for any real (non-mock) media URL in production.
const apiHostname = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "").hostname || undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "http", hostname: "localhost", port: "9000" },
      ...(apiHostname && apiHostname !== "localhost"
        ? [
            { protocol: "http" as const, hostname: apiHostname },
            { protocol: "https" as const, hostname: apiHostname },
          ]
        : []),
    ],
  },
};

export default nextConfig;
