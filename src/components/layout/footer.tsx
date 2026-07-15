"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/common/contact-icons";
import { Reveal } from "@/components/common/reveal";
import { SITE_CONFIG } from "@/constants/config";
import { ROUTES, isChromeLessRoute } from "@/constants/routes";

const SOCIALS = [
  { icon: "/image/ic_mes.png", label: "Messenger", bg: "bg-[#0084FF]", href: "#" },
  { icon: "/image/ic_you.png", label: "YouTube", bg: "bg-[#FF0000]", href: "#" },
  { icon: "/image/ic_tik.png", label: "TikTok", bg: "bg-black border border-white/20", href: "#" },
  { icon: "/image/ic_face.png", label: "Facebook", bg: "bg-[#1877F2]", href: "#" },
];

const CONTACTS = [
  { icon: MailIcon, text: "hello@sofilm.com" },
  { icon: PhoneIcon, text: "0335 456 789" },
  { icon: MapPinIcon, text: "42 Nguyen Phuoc Lan St., Da Nang" },
];

export function Footer() {
  const pathname = usePathname();

  if (isChromeLessRoute(pathname)) return null;

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/5 bg-black">
      <Image
        src="/image/ic_bg_footer.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover object-bottom-left opacity-25"
      />

      <Reveal className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href={ROUTES.home} aria-label={SITE_CONFIG.name}>
            <Image
              src="/image/ic_logo.png"
              alt={SITE_CONFIG.name}
              width={168}
              height={42}
              className="h-9 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            {SOCIALS.map(({ icon: Icon, label, bg, href }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-white ${bg}`}
              >
                <Image src={Icon} alt="" fill sizes="40px" className="object-contain" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {CONTACTS.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-5 py-3 text-base text-white/70"
            >
              <Icon width={24} height={24} className="shrink-0 text-white" />
              {text}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="relative pb-6 text-center text-sm text-white/40">
        © {new Date().getFullYear()} {SITE_CONFIG.name.toUpperCase()} all rights reserved.
      </div>
    </footer>
  );
}
