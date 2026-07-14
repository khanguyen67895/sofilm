import Image from "next/image";
import { Logo } from "@/components/common/logo";
import { PhoneLoginForm } from "@/features/auth/components/phone-login-form";

const COLLAGE_SEEDS = [
  "backdrop-1",
  "backdrop-4",
  "backdrop-7",
  "backdrop-10",
  "backdrop-13",
  "backdrop-16",
];

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12">
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-2 opacity-50 sm:grid-cols-6">
        {COLLAGE_SEEDS.map((seed, i) => (
          <div
            key={seed}
            className="relative aspect-2/3"
            style={{ marginTop: i % 2 === 0 ? "2rem" : 0 }}
          >
            <Image
              src={`https://picsum.photos/seed/${seed}/400/600`}
              alt=""
              fill
              sizes="20vw"
              className="rounded-lg object-cover grayscale-[20%]"
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-black/50 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <PhoneLoginForm />
      </div>
    </div>
  );
}
