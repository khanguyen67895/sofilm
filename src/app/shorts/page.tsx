import { Suspense } from "react";
import type { Metadata } from "next";
import { ShortsFeed } from "@/features/shorts/components/shorts-feed";

export const metadata: Metadata = {
  title: "Shorts | SoFilm",
  description: "Watch short-form video clips on SoFilm — swipe through a vertical feed of shorts.",
};

export default function ShortsPage() {
  return (
    <Suspense fallback={null}>
      <ShortsFeed />
    </Suspense>
  );
}
