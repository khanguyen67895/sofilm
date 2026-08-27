"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex flex-col items-center gap-3 px-4 py-24 text-center", className)}
    >
      <p className="text-white/70">{title}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium text-brand hover:underline"
        >
          Retry
        </button>
      )}
    </motion.div>
  );
}
