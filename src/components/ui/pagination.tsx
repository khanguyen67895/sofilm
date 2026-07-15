"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";

const DARK_CIRCLE_STYLE: React.CSSProperties = {
  background:
    "linear-gradient(0deg, #000 0%, #000 100%), linear-gradient(0deg, rgba(51, 51, 51, 0.45) 0%, rgba(51, 51, 51, 0.45) 100%), rgba(153, 153, 153, 0.30)",
  backgroundBlendMode: "plus-lighter, luminosity, darken",
  boxShadow:
    "0.662px 0.662px 0 -0.331px #333 inset, -0.662px -0.662px 0 -0.331px #262626 inset, 0.662px 0.662px 0.331px -0.662px #FFF inset, -0.662px -0.662px 0.331px -0.662px #FFF inset, 0 0 1.985px 0 rgba(255,255,255,0.50) inset, 0 0 10.588px 0 #F2F2F2 inset",
};

const CIRCLE_SIZE = "h-11 w-11";

function CurrentPageBadge({ page }: { page: number }) {
  return (
    <span
      className={cn(
        CIRCLE_SIZE,
        "font-heading flex shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
      )}
    >
      {page}
    </span>
  );
}

function OtherPageButton({ page, onClick }: { page: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={DARK_CIRCLE_STYLE}
      className={cn(
        CIRCLE_SIZE,
        "font-heading flex shrink-0 items-center justify-center rounded-full text-sm font-medium text-white/80 transition-colors hover:text-white"
      )}
    >
      {page}
    </button>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Trang trước" : "Trang sau"}
      style={DARK_CIRCLE_STYLE}
      className={cn(
        CIRCLE_SIZE,
        "flex shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-30"
      )}
    >
      <Image
        src={direction === "prev" ? "/image/ic_left.png" : "/image/ic_right.png"}
        alt=""
        width={18}
        height={18}
      />
    </button>
  );
}

function buildPageList(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | "ellipsis"> = [1];
  if (current > 3) pages.push("ellipsis");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-3">
      <NavButton direction="prev" onClick={() => onPageChange(page - 1)} disabled={page <= 1} />

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-white/50">
            ...
          </span>
        ) : p === page ? (
          <CurrentPageBadge key={p} page={p} />
        ) : (
          <OtherPageButton key={p} page={p} onClick={() => onPageChange(p)} />
        )
      )}

      <NavButton
        direction="next"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      />
    </div>
  );
}
