import { AdminMovieEditView } from "@/features/admin";

interface AdminMovieEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminMovieEditPage({ params }: AdminMovieEditPageProps) {
  const { id } = await params;
  return <AdminMovieEditView movieId={id} />;
}
