"use client";

import { useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { isValidImageSrc } from "@/utils/image";
import { useImageUpload } from "../hooks/use-image-upload";

interface ImageUploadFieldProps {
  label: string;
  previewUrl?: string;
  onUploaded: (url: string) => void;
}

/** Generic "upload an image from local disk, get a public URL back" field —
 * shared by the movie/series poster, backdrop, and thumbnail inputs so none
 * of them require the admin to paste/host a URL themselves. */
export function ImageUploadField({ label, previewUrl, onUploaded }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, status } = useImageUpload();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    onUploaded(url);
    e.target.value = "";
  }

  const isBusy = status === "uploading";

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isBusy}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud size={16} />
        {previewUrl ? `Thay ${label}` : `Tải ${label} Lên`}
      </Button>

      <AnimatePresence mode="wait">
        {isBusy ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Progress value={progress * 100} />
          </motion.div>
        ) : status === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-xs text-green-500"
          >
            <CheckCircle2 size={14} /> Tải lên thành công
          </motion.p>
        ) : status === "error" ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-500"
          >
            Tải ảnh thất bại. Vui lòng thử lại.
          </motion.p>
        ) : null}
      </AnimatePresence>

      {isValidImageSrc(previewUrl) && (
        <div className="relative h-32 w-56 overflow-hidden rounded-md bg-white/5">
          <Image src={previewUrl} alt={`Xem trước ${label}`} fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
