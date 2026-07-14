"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ROUTES } from "@/constants/routes";
import { SearchIcon } from "./header-icons";

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `${ROUTES.search}?q=${encodeURIComponent(q)}` : ROUTES.search);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="hidden h-11 w-56 items-center justify-between gap-2 rounded-3xl bg-[rgba(242,242,242,0.10)] px-4 sm:flex lg:w-96"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Searching for movies..."
        className="font-heading h-full w-full bg-transparent text-sm font-light text-white outline-none placeholder:text-white/40"
      />
      <button type="submit" aria-label="Tìm kiếm" className="shrink-0">
        <SearchIcon width={18} height={18} />
      </button>
    </form>
  );
}
