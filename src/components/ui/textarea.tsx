import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "h-auto w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-colors outline-none placeholder:text-white/40 focus:border-brand aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  );
}
