import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function Logo() {
  return (
    <Link
      href={ROUTES.home}
      className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="sofilm-logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-brand-light)" />
            <stop offset="1" stopColor="var(--color-brand-dark)" />
          </linearGradient>
        </defs>
        <path
          d="M16 2 28 16 16 30 4 16Z"
          fill="none"
          stroke="url(#sofilm-logo-grad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M16 9 23 16 16 23 9 16Z" fill="url(#sofilm-logo-grad)" />
      </svg>
      <span className="text-white">
        SO<span className="text-brand">FILM</span>
      </span>
    </Link>
  );
}
