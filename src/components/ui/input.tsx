"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

export function Input({ className, ...props }: HTMLMotionProps<"input">) {
  return (
    <motion.input
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-red-500",
        className
      )}
      {...props}
    />
  );
}
