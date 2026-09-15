import type { MetadataRoute } from "next";

/** Keeps the internal admin CMS and bare auth forms out of search/ad-crawler
 * indexing — they're back-office/nav-only screens, not publisher content. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/auth"] },
      { userAgent: "Mediapartners-Google", disallow: ["/admin", "/auth"] },
    ],
  };
}
