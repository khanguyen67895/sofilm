"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { resolveImageSrc } from "@/utils/image";
import { NotificationBell } from "@/features/notifications";

const DEFAULT_AVATAR = "https://picsum.photos/seed/sofilm-avatar/88/88";

export function HeaderActions({ avatar }: { avatar?: string }) {
  const avatarSrc = resolveImageSrc(avatar, DEFAULT_AVATAR);
  const router = useRouter();
  const requireAuth = useRequireAuth();

  return (
    <>
      <NotificationBell />

      <Button
        size="md"
        className="h-9 px-4 text-[11px] sm:h-11 sm:px-6 sm:text-sm"
        onClick={() =>
          requireAuth(() => router.push(ROUTES.subscription), "Đăng nhập để nâng cấp gói VIP.")
        }
      >
        Upgrade
      </Button>

      <Link
        href={ROUTES.profile}
        aria-label="Tài khoản"
        className="relative hidden h-11 w-11 shrink-0 overflow-hidden rounded-full bg-stone-300 sm:block"
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
