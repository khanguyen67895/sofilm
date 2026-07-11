"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/common/logo";
import { Reveal } from "@/components/common/reveal";
import {
  FacebookIcon,
  MessengerIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/components/common/social-icons";
import { SITE_CONFIG } from "@/constants/config";

const SOCIALS = [
  { icon: MessengerIcon, label: "Messenger", bg: "bg-[#0084FF]", href: "#" },
  { icon: YoutubeIcon, label: "YouTube", bg: "bg-[#FF0000]", href: "#" },
  { icon: TiktokIcon, label: "TikTok", bg: "bg-black border border-white/20", href: "#" },
  { icon: FacebookIcon, label: "Facebook", bg: "bg-[#1877F2]", href: "#" },
];

const CONTACTS = [
  { icon: Mail, text: "hello@sofilm.com" },
  { icon: Phone, text: "0335 456 789" },
  { icon: MapPin, text: "42 Nguyen Phuoc Lan St., Da Nang" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/5 bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,106,61,0.12),transparent_60%)]" />

      <Reveal className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 text-center sm:px-8">
        <Logo />

        <div className="flex items-center gap-4">
          {SOCIALS.map(({ icon: Icon, label, bg, href }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${bg}`}
            >
              <Icon width={18} height={18} />
            </motion.a>
          ))}
        </div>

        <div className="flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {CONTACTS.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-2 rounded-full bg-white/5 px-5 py-3 text-sm text-white/70"
            >
              <Icon size={15} className="text-brand" />
              {text}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="relative border-t border-white/5 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {SITE_CONFIG.name.toUpperCase()} all rights reserved.
      </div>
    </footer>
  );
}
