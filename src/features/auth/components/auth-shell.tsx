import Image from "next/image";
import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12">
      <Image
        src="/image/ic_bg_login.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />

      <div className="relative w-full max-w-160 overflow-hidden rounded-3xl border border-[#FE4C00] bg-black/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-brand/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-brand/30 blur-3xl" />

        <div className="relative space-y-8">
          <div className="flex justify-center">
            <Image src="/image/ic_logo.png" alt="SOFILM" width={168} height={42} priority />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
