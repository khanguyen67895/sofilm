"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/common/empty-state";
import { ROUTES } from "@/constants/routes";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { ShortItem } from "./short-item";

export function ShortsFeed() {
  const { data: shorts, isLoading, isError } = useShortsFeed();

  return (
    <div className="relative h-dvh w-full bg-black">
      <Link
        href={ROUTES.home}
        aria-label="Về trang chủ"
        className="absolute top-4 left-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </Link>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-dvh items-center justify-center"
        >
          <Spinner />
        </motion.div>
      ) : isError || !shorts ? (
        <div className="flex h-dvh flex-col items-center justify-center gap-2 text-center text-white/70">
          <p>Không thể tải video ngắn.</p>
          <p className="text-sm text-white/40">Vui lòng thử lại sau.</p>
        </div>
      ) : shorts.length === 0 ? (
        <div className="flex h-dvh items-center justify-center">
          <EmptyState
            title="Chưa có video ngắn nào"
            description="Video mới đang được tải lên, quay lại sau bạn nhé!"
          />
        </div>
      ) : (
        <Virtuoso
          style={{ height: "100dvh" }}
          data={shorts}
          className="scrollbar-none snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
          itemContent={(_, short) => <ShortItem short={short} />}
        />
      )}
    </div>
  );
}
