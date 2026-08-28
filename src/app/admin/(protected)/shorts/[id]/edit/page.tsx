import { AdminShortEditView } from "@/features/admin";

interface AdminShortEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminShortEditPage({ params }: AdminShortEditPageProps) {
  const { id } = await params;
  return <AdminShortEditView shortId={id} />;
}
