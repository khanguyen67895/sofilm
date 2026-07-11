import { MovieDetailView } from "@/features/movie/components/movie-detail-view";

interface MoviePageProps {
  params: Promise<{ slug: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params;
  return <MovieDetailView slug={slug} />;
}
