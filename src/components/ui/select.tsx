import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        // bg-white/5 (translucent) only looks right on the closed box — the browser
        // renders the opened option list itself and mostly ignores translucent
        // backgrounds, defaulting to a light native popup with barely-readable text.
        // A solid dark background + explicit white option color fixes both.
        "h-10 w-full rounded-md border border-white/15 bg-[#1a1a1a] px-3 text-sm text-white outline-none transition-colors focus:border-brand aria-invalid:border-red-500 [&>option]:bg-[#1a1a1a] [&>option]:text-white",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
