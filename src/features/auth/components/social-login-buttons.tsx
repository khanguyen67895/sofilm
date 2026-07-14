"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FacebookIcon, GoogleIcon } from "@/components/common/social-icons";

/** Visual only for now — no OAuth client wired up yet, see the buttons' `disabled`-free but inert state. */
export function SocialLoginButtons() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="secondary" className="w-full gap-2 text-base">
          <GoogleIcon width={25} height={25} /> GOOGLE
        </Button>
        <Button type="button" variant="secondary" className="w-full gap-2 text-base">
          <FacebookIcon width={25} height={25} className="text-[#1877F2]" /> FACEBOOK
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-0 flex-1 self-stretch outline outline-1 outline-offset-[-0.50px] outline-white/0"
        />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-0 flex-1 self-stretch outline outline-1 outline-offset-[-0.50px] outline-white/0"
        />
      </div>
    </>
  );
}
