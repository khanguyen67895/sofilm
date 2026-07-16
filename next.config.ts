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
    // Next.js 16 only serves quality=75 unless explicitly allow-listed —
    // posters/backdrops are large, hover-scaled hero images, so 75 alone
    // reads soft. 90 is used for those; 75 stays as the default elsewhere.
    qualities: [75, 90],
    // Admin-entered poster/backdrop/banner URLs are free text (no host
    // allowlist realistically covers "whatever an admin pastes from a search
    // engine while testing"), and this is an ADMIN-only, role-gated surface —
    // not public UGC — so trade next/image's per-host allowlist for "never
    // crashes the page over an unconfigured host" instead of maintaining an
    // ever-growing list. The specific hosts below stay as documentation of
    // known-good sources.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
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
