"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { NotificationIcon } from "./header-icons";

const DEFAULT_AVATAR = "https://picsum.photos/seed/sofilm-avatar/88/88";

export function HeaderActions({ avatar }: { avatar?: string }) {
  const avatarSrc = avatar || DEFAULT_AVATAR;

  return (
    <>
      <button type="button" aria-label="Thông báo" className="hidden shrink-0 sm:block">
        <NotificationIcon width={46} height={46} />
      </button>

      <Link href={ROUTES.subscription} className="hidden sm:block">
        <Button size="md">Upgrade</Button>
      </Link>

      <Link
        href={ROUTES.profile}
        aria-label="Tài khoản"
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-stone-300"
      >
        <AnimatePresence>
          <motion.div
            key={avatarSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image src={avatarSrc} alt="Avatar" fill sizes="44px" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </Link>
    </>
  );
}
