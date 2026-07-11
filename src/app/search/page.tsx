import { Suspense } from "react";
import { SearchView } from "@/features/search/components/search-view";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchView />
    </Suspense>
  );
}
