import type { LabelHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label className={cn("mb-1.5 block text-xs font-medium text-white/70", className)} {...props}>
      {children}
      {required && <span className="ml-0.5 text-brand">*</span>}
    </label>
  );
}
