"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./button";

interface AlertDialogProps {
  open: boolean;
  variant: "success" | "error";
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

const VARIANT_STYLE = {
  success: { icon: CheckCircle2, iconClass: "text-emerald-500" },
  error: { icon: XCircle, iconClass: "text-red-500" },
} as const;

/** A single-action ("OK") modal for reporting the outcome of an action —
 * success or error — instead of a silent redirect or an inline error line
 * that's easy to miss. Used across the admin create/edit/delete flows
 * (movie, banner, short): success on a form submit closes to the list,
 * success on a delete just dismisses in place, error just dismisses so the
 * admin can fix and retry. */
export function AlertDialog({
  open,
  variant,
  title,
  description,
  confirmLabel = "OK",
  onConfirm,
}: AlertDialogProps) {
  const { icon: Icon, iconClass } = VARIANT_STYLE[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6 text-center shadow-2xl"
          >
            <Icon size={40} className={cn("mx-auto mb-4", iconClass)} />
            <h2 id="alert-dialog-title" className="text-lg font-semibold text-white">
              {title}
            </h2>
            {description && <p className="mt-2 text-sm text-white/60">{description}</p>}
            <Button type="button" size="md" className="mt-6 w-full" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
