import type { ReactNode } from "react";
import { Reveal } from "@/components/common/reveal";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <Reveal className="mx-auto max-w-4xl space-y-10 px-6 py-12 sm:px-8 lg:px-20">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl font-bold text-white uppercase">{title}</h1>
        <p className="text-sm text-white/40">Cập nhật lần cuối: {updated}</p>
      </div>
      <div className="space-y-8">{children}</div>
    </Reveal>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-lg font-semibold text-white uppercase">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}
