"use client";

import { type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import type { MovieType } from "@/types/movie";

interface AdminMovieFieldsProps {
  title: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  slug: string;
  onSlugChange: (e: ChangeEvent<HTMLInputElement>) => void;
  poster: string;
  onPosterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  backdrop: string;
  onBackdropChange: (e: ChangeEvent<HTMLInputElement>) => void;
  description: string;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  type: MovieType;
  onTypeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  releaseDate: string;
  onReleaseDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  duration: string;
  onDurationChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isPremium: boolean;
  onIsPremiumChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function AdminMovieFields({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  poster,
  onPosterChange,
  backdrop,
  onBackdropChange,
  description,
  onDescriptionChange,
  type,
  onTypeChange,
  releaseDate,
  onReleaseDateChange,
  duration,
  onDurationChange,
  isPremium,
  onIsPremiumChange,
}: AdminMovieFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input placeholder="Tên phim" value={title} onChange={onTitleChange} required />
      <Input placeholder="Slug (tuỳ chọn)" value={slug} onChange={onSlugChange} />
      <Input
        placeholder="URL Poster"
        value={poster}
        onChange={onPosterChange}
        className="sm:col-span-2"
      />
      <Input
        placeholder="URL Backdrop"
        value={backdrop}
        onChange={onBackdropChange}
        className="sm:col-span-2"
      />
      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={onDescriptionChange}
        rows={4}
        className="h-auto w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-500 sm:col-span-2"
      />
      <select
        value={type}
        onChange={onTypeChange}
        className="h-10 rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-red-500"
      >
        <option value="MOVIE">Phim Lẻ</option>
        <option value="SERIES">Phim Bộ</option>
      </select>
      <Input type="date" value={releaseDate} onChange={onReleaseDateChange} />
      <Input
        type="number"
        placeholder="Thời lượng (phút)"
        value={duration}
        onChange={onDurationChange}
      />
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={isPremium} onChange={onIsPremiumChange} />
        Nội dung Premium
      </label>
    </div>
  );
}
