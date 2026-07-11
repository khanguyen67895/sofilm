import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white",
        className
      )}
      {...props}
    />
  );
}
