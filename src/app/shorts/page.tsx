import { Suspense } from "react";
import { ShortsFeed } from "@/features/shorts/components/shorts-feed";

export default function ShortsPage() {
  return (
    <Suspense fallback={null}>
      <ShortsFeed />
    </Suspense>
  );
}
