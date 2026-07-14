"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminMovieDetail } from "../hooks/use-admin-movie-detail";
import { AdminMovieForm } from "./admin-movie-form";

export function AdminMovieEditView({ movieId }: { movieId: string }) {
  const { data: movie, isLoading } = useAdminMovieDetail(movieId);

  return (
    <AnimatePresence mode="wait">
      {isLoading || !movie ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AdminMovieForm mode="edit" movie={movie} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
