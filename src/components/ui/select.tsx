import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white outline-none transition-colors focus:border-brand aria-invalid:border-red-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
