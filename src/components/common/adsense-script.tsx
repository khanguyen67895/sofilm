"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { isAdsExcludedRoute } from "@/constants/routes";

const ADSENSE_CLIENT_ID = "ca-pub-7219800880647637";

/** Loads the Auto ads script everywhere except `isAdsExcludedRoute` screens
 * (admin CMS, auth forms) — see that helper for why those are excluded. */
export function AdSenseScript() {
  const pathname = usePathname();

  if (isAdsExcludedRoute(pathname)) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}
