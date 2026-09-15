import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchView } from "@/features/search/components/search-view";

export const metadata: Metadata = {
  title: "Search | SoFilm",
  description: "Search SoFilm's catalog of movies, series, and shorts by title.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchView />
    </Suspense>
  );
}
