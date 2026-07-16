/** next/image's default loader throws `Failed to construct 'URL': Invalid URL`
 * whenever `src` is a non-empty string that isn't root-relative or a fully
 * qualified URL (e.g. a bare filename or S3 key typed into an admin form
 * without a protocol) — so truthiness alone ("value looks set") isn't a safe
 * enough check before rendering it. This validates the shape instead. */
export function isValidImageSrc(src: string | null | undefined): src is string {
  if (!src) return false;
  return (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  );
}

export function resolveImageSrc(src: string | null | undefined, fallback: string): string {
  return isValidImageSrc(src) ? src : fallback;
}
