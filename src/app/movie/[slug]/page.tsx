import type { Metadata } from "next";
import { MovieDetailView } from "@/features/movie/components/movie-detail-view";
import { movieService } from "@/services/movie/movie.service";
import { SITE_CONFIG } from "@/constants/config";

interface MoviePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { slug } = await params;
  const movie = await movieService.getBySlug(slug).catch(() => undefined);
  if (!movie) return { title: SITE_CONFIG.name };

  return {
    title: `${movie.title} | ${SITE_CONFIG.name}`,
    description: movie.description || SITE_CONFIG.description,
    openGraph: {
      title: movie.title,
      description: movie.description || SITE_CONFIG.description,
      images: movie.backdrop ? [movie.backdrop] : undefined,
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params;
  return <MovieDetailView slug={slug} />;
}
