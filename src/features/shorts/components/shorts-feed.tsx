"use client";

import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { Spinner } from "@/components/ui/spinner";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { ShortItem } from "./short-item";

export function ShortsFeed() {
  const { data: shorts, isLoading } = useShortsFeed();

  if (isLoading || !shorts) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[calc(100dvh-4rem)] items-center justify-center"
      >
        <Spinner />
      </motion.div>
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
