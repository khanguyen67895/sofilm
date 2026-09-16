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

// api.soaff.ai in prod, localhost:PORT in dev — socket.io-client opens both
// an https(polling)/wss(upgrade) connection to this same host.
const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "https://api.soaff.ai";
const apiWsOrigin = apiOrigin.replace(/^http/, "ws");

// Static CSP (no per-request nonce) — see next/dist/docs' content-security-policy
// guide: nonces would force every page into dynamic rendering (killing static
// generation/ISR for the whole site), which is a much bigger tradeoff than
// this pass is after. `unsafe-inline` on script/style is exactly what that
// same guide recommends as the non-nonce default. Domains beyond 'self' are
// only the ones actually loaded today (see google-identity.ts, facebook-sdk.ts,
// adsense-script.tsx) plus the handful AdSense's own script pulls in at
// runtime for ad rendering/anti-fraud checks.
const CSP_DIRECTIVES = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    "https://accounts.google.com",
    "https://connect.facebook.net",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://www.googletagservices.com",
  ].join(" "),
  "style-src 'self' 'unsafe-inline'",
  // Poster/backdrop/banner URLs are admin-entered free text against any host
  // (see next.config.ts's own remotePatterns comment below) — img-src mirrors
  // that same trust boundary rather than fighting it.
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    apiOrigin,
    apiWsOrigin,
    "https://accounts.google.com",
    "https://graph.facebook.com",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
  ].join(" "),
  [
    "frame-src 'self'",
    "https://accounts.google.com",
    "https://www.facebook.com",
    "https://googleads.g.doubleclick.net",
    "https://tpc.googlesyndication.com",
  ].join(" "),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  // Belt-and-suspenders with frame-ancestors above — older browsers only
  // understand this one.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
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
