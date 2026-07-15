"use client";

import { useState } from "react";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { cn } from "@/utils/cn";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export function StarRatingInput({ value, onChange, size = 24 }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          aria-label={`${star} sao`}
          className="transition-transform hover:scale-110"
        >
          <RatingStarIcon
            width={size}
            height={size}
            className={cn(star > active && "opacity-25")}
          />
        </button>
      ))}
    </div>
  );
}
