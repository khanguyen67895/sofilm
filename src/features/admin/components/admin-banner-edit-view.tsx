"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBanners } from "../hooks/use-admin-banners";
import { AdminBannerForm } from "./admin-banner-form";

export function AdminBannerEditView({ bannerId }: { bannerId: string }) {
  const { data: banners, isLoading } = useAdminBanners();
  const banner = banners?.find((b) => b.id === bannerId);

  return (
    <AnimatePresence mode="wait">
      {isLoading || !banner ? (
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
          <AdminBannerForm mode="edit" banner={banner} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
