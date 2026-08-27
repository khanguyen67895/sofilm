import { Suspense } from "react";
import { MovieCatalogView } from "@/features/movie/components/movie-catalog-view";

export default function CategoryPage() {
  return (
    <Suspense fallback={null}>
      <MovieCatalogView />
    </Suspense>
  );
}
