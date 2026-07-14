import type { SVGProps } from "react";

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="#F2F2F2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 21L15 15"
        stroke="#F2F2F2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NotificationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 46 46" fill="none" {...props}>
      <rect width="46" height="46" rx="23" fill="#F2F2F2" fillOpacity="0.1" />
      <path
        d="M20.6666 14.8333C20.6666 13.5447 21.7113 12.5 23 12.5C24.2886 12.5 25.3333 13.5447 25.3333 14.8333C28.0635 16.1243 29.8584 18.8166 30 21.8333V25.3333C30.178 26.8043 31.044 28.1032 32.3333 28.8333H13.6666C14.9559 28.1032 15.8219 26.8043 16 25.3333V21.8333C16.1416 18.8166 17.9364 16.1243 20.6666 14.8333"
        stroke="#F2F2F2"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 28.8333V30C19.5 31.933 21.067 33.5 23 33.5C24.933 33.5 26.5 31.933 26.5 30V28.8333"
        stroke="#F2F2F2"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
