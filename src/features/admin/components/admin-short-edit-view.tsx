"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminShortDetail } from "../hooks/use-admin-short-detail";
import { AdminShortForm } from "./admin-short-form";

export function AdminShortEditView({ shortId }: { shortId: string }) {
  const { data: short, isLoading } = useAdminShortDetail(shortId);

  return (
    <AnimatePresence mode="wait">
      {isLoading || !short ? (
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
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AdminShortForm mode="edit" short={short} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
