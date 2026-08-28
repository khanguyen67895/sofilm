"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/error-state";
import { ROUTES } from "@/constants/routes";
import type { AdminShortItem } from "@/types/shorts";
import { isValidImageSrc } from "@/utils/image";
import { useAdminShorts } from "../hooks/use-admin-shorts";
import { useDeleteShort } from "../hooks/use-delete-short";

function ShortRow({
  short,
  onDeleted,
}: {
  short: AdminShortItem;
  onDeleted: () => void;
}) {
  const deleteShort = useDeleteShort();

  function handleDelete() {
    if (!window.confirm(`Delete "${short.title}"? This action cannot be undone.`)) return;
    deleteShort.mutate(short.id, { onSuccess: onDeleted });
  }

  return (
    <div className="flex flex-col gap-1.5 border-b border-white/10 px-4 py-3 last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-white/5">
          {isValidImageSrc(short.thumbnail) && (
            <Image src={short.thumbnail} alt={short.title} fill className="object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{short.title}</p>
          <p className="text-xs text-white/50">
            {short.movieSlug ? `Movie: ${short.movieSlug} · ` : ""}
            {short.likes} likes · {short.comments} comments
            {!short.isActive && " · Hidden"}
          </p>
        </div>
        <Link
          href={ROUTES.adminShortEdit(short.id)}
          className="text-xs text-white/60 hover:text-white"
        >
          Edit
        </Link>
        <button
          type="button"
          aria-label="Delete short"
          disabled={deleteShort.isPending}
          onClick={handleDelete}
          className="text-white/40 hover:text-red-500 disabled:opacity-40"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {deleteShort.isError && (
        <p className="text-xs text-red-500">Failed to delete short. Please try again.</p>
      )}
    </div>
  );
}

export function AdminShortList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useAdminShorts(page);
  const [showDeleted, setShowDeleted] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-white">Shorts</h2>
        <Link href={ROUTES.adminShortNew}>
          <Button size="sm">+ Add Short</Button>
        </Link>
      </div>

      {isError ? (
        <ErrorState title="Failed to load shorts." onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/10 rounded-md border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {data?.items.map((short) => (
                <ShortRow key={short.id} short={short} onDeleted={() => setShowDeleted(true)} />
              ))}
              {data?.items.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-white/50">
                  No shorts yet.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="flex items-center justify-between text-sm text-white/60">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {data.page}</span>
          <button
            type="button"
            disabled={!data.hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <AlertDialog
        open={showDeleted}
        variant="success"
        title="Short deleted successfully!"
        onConfirm={() => setShowDeleted(false)}
      />
    </div>
  );
}
