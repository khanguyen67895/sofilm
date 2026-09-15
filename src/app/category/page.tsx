import { Suspense } from "react";
import type { Metadata } from "next";
import { MovieCatalogView } from "@/features/movie/components/movie-catalog-view";

export const metadata: Metadata = {
  title: "Categories | SoFilm",
  description: "Browse SoFilm's full catalog of movies and series by genre — action, drama, comedy, and more.",
};

export default function CategoryPage() {
  return (
    <Suspense fallback={null}>
      <MovieCatalogView />
    </Suspense>
  );
}
