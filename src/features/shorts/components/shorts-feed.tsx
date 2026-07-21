"use client";

import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/common/empty-state";
import { useEnsureBackFallback } from "@/hooks/use-ensure-back-fallback";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { ShortItem } from "./short-item";

export function ShortsFeed() {
  useEnsureBackFallback();
  const { data: shorts, isLoading, isError } = useShortsFeed();

  return (
    <div className="relative h-dvh w-full bg-black">

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
