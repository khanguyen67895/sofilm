"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** Route-level error boundary — without this, an uncaught render/effect
 * error anywhere in a page leaves that whole segment blank (just the root
 * layout's Header/Footer survive) with nothing telling the user or us what
 * broke. Logging here at least gets the real error into the console instead
 * of a silent black screen. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-150 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-lg font-semibold text-white">Đã có lỗi xảy ra.</p>
      <p className="max-w-md text-sm text-white/50">{error.message}</p>
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}
