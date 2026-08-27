"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "./input";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

export function PasswordInput({ className, ...props }: HTMLMotionProps<"input">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock
        size={16}
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"
      />
      <Input
        type={visible ? "text" : "password"}
        className={cn("h-12 rounded-full pl-10 pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-white/40 hover:text-white/70"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
