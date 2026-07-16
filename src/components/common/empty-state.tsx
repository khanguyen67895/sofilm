"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  title = "Nội dung đang được cập nhật",
  description = "Phim mới đang được tải lên, quay lại sau bạn nhé!",
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex flex-col items-center justify-center gap-4 px-4 py-24 text-center", className)}
    >
      <Image
        src="/image/ic_loading.gif"
        alt=""
        width={96}
        height={96}
        unoptimized
        className="opacity-90"
      />
      <div className="space-y-1.5">
        <p className="font-heading text-base font-semibold tracking-wide text-white uppercase">
          {title}
        </p>
        <p className="text-sm text-white/50">{description}</p>
      </div>
    </motion.div>
  );
}
