"use client";

import { type ChangeEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MovieType } from "@/types/movie";

export interface AdminMovieFieldErrors {
  title?: string;
  poster?: string;
  backdrop?: string;
  releaseDate?: string;
  duration?: string;
}

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
  errors: AdminMovieFieldErrors;
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
  errors,
}: AdminMovieFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label required>Tên phim</Label>
        <Input value={title} onChange={onTitleChange} aria-invalid={Boolean(errors.title)} />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <Label>Slug (tuỳ chọn)</Label>
        <Input value={slug} onChange={onSlugChange} />
      </div>

      <div className="sm:col-span-2">
        <Label required>URL Poster</Label>
        <Input value={poster} onChange={onPosterChange} aria-invalid={Boolean(errors.poster)} />
        {errors.poster && <p className="mt-1 text-xs text-red-500">{errors.poster}</p>}
      </div>

      <div className="sm:col-span-2">
        <Label required>URL Backdrop</Label>
        <Input
          value={backdrop}
          onChange={onBackdropChange}
          aria-invalid={Boolean(errors.backdrop)}
        />
        {errors.backdrop && <p className="mt-1 text-xs text-red-500">{errors.backdrop}</p>}
      </div>

      <div className="sm:col-span-2">
        <Label>Mô tả</Label>
        <Textarea value={description} onChange={onDescriptionChange} rows={4} />
      </div>

      <div>
        <Label>Loại</Label>
        <Select value={type} onChange={onTypeChange}>
          <option value="MOVIE">Phim Lẻ</option>
          <option value="SERIES">Phim Bộ</option>
        </Select>
      </div>

      <div>
        <Label required>Ngày phát hành</Label>
        <Input
          type="date"
          value={releaseDate}
          onChange={onReleaseDateChange}
          aria-invalid={Boolean(errors.releaseDate)}
        />
        {errors.releaseDate && <p className="mt-1 text-xs text-red-500">{errors.releaseDate}</p>}
      </div>

      <div>
        <Label required={type === "MOVIE"}>Thời lượng (phút)</Label>
        <Input
          type="number"
          value={duration}
          onChange={onDurationChange}
          aria-invalid={Boolean(errors.duration)}
        />
        {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <Checkbox checked={isPremium} onChange={onIsPremiumChange} />
        Nội dung Premium
      </label>
    </div>
  );
}
