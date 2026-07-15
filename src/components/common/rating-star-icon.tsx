import type { SVGProps } from "react";

export function RatingStarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 16" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.05725 12.3735L3.42825 14.8073L4.3125 9.6525L0.5625 6.00225L5.7375 5.25225L8.052 0.5625L10.3665 5.25225L15.5415 6.00225L11.7915 9.6525L12.6758 14.8073L8.05725 12.3735Z"
        fill="#FE9A00"
        stroke="#FE9A00"
        strokeWidth={1.125}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
