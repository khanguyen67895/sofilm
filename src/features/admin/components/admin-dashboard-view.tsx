"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clapperboard, Film, GalleryHorizontal, PlusCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { useAdminMovies } from "../hooks/use-admin-movies";
import { useAdminBanners } from "../hooks/use-admin-banners";
import { useAdminShorts } from "../hooks/use-admin-shorts";

const STAT_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function StatCard({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  isLoading: boolean;
}) {
  return (
    <motion.div
      variants={STAT_VARIANTS}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/3 p-5 transition-colors hover:border-brand/40"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-white/50">{label}</p>
        {isLoading ? (
          <Skeleton className="mt-1 h-7 w-16" />
        ) : (
          <p className="text-2xl font-semibold text-white">{value}</p>
        )}
      </div>
    </motion.div>
  );
}

export function AdminDashboardView() {
  const { data: moviePage, isLoading: isMoviesLoading } = useAdminMovies(1);
  const { data: banners, isLoading: isBannersLoading } = useAdminBanners();
  const { data: shortPage, isLoading: isShortsLoading } = useAdminShorts(1);

  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="font-heading text-lg text-white"
      >
        Overview
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCard
          icon={Film}
          label="Total Movies"
          value={moviePage?.total ?? 0}
          isLoading={isMoviesLoading}
        />
        <StatCard
          icon={GalleryHorizontal}
          label="Hero Banners"
          value={banners?.length ?? 0}
          isLoading={isBannersLoading}
        />
        <StatCard
          icon={Clapperboard}
          label="Shorts"
          value={shortPage?.total ?? 0}
          isLoading={isShortsLoading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <Link href={ROUTES.adminMovieNew}>
          <Button size="sm">
            <PlusCircle size={16} /> Add New Movie
          </Button>
        </Link>
        <Link href={ROUTES.adminBannerNew}>
          <Button variant="outline" size="sm">
            <GalleryHorizontal size={16} /> Add Hero Banner
          </Button>
        </Link>
        <Link href={ROUTES.adminShortNew}>
          <Button variant="outline" size="sm">
            <Clapperboard size={16} /> Add Short
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
