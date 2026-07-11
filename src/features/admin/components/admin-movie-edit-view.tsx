"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdminMovieDetail } from "../hooks/use-admin-movie-detail";
import { AdminMovieForm } from "./admin-movie-form";

export function AdminMovieEditView({ movieId }: { movieId: string }) {
  const { data: movie, isLoading } = useAdminMovieDetail(movieId);

  if (isLoading || !movie) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return <AdminMovieForm mode="edit" movie={movie} />;
}
