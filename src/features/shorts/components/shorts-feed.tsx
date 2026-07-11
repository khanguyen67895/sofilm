"use client";

import { Virtuoso } from "react-virtuoso";
import { Spinner } from "@/components/ui/spinner";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { ShortItem } from "./short-item";

export function ShortsFeed() {
  const { data: shorts, isLoading } = useShortsFeed();

  if (isLoading || !shorts) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Virtuoso
      style={{ height: "calc(100dvh - 4rem)" }}
      data={shorts}
      className="snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      itemContent={(_, short) => <ShortItem short={short} />}
    />
  );
}
