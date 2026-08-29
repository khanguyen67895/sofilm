"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

const VARIANTS = {
  primary: "btn-glass btn-glass-primary text-white",
  secondary: "btn-glass btn-glass-secondary text-white",
  outline: "border border-white/25 text-white hover:bg-white/10",
  ghost: "bg-transparent text-white/80 hover:bg-white/10 hover:text-white",
} as const;

const SIZES = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
} as const;

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  style,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "font-display inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide uppercase disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      style={style}
      {...props}
    />
  );
}
