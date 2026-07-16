import Image from "next/image";
import { cn } from "@/utils/cn";
import { isValidImageSrc } from "@/utils/image";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase();

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-white/10 text-white",
        className
      )}
    >
      {isValidImageSrc(src) ? (
        <Image src={src} alt={name ?? ""} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-medium">
          {initial || "?"}
        </span>
      )}
    </div>
  );
}
