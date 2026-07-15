import { AdminBannerEditView } from "@/features/admin";

interface AdminBannerEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBannerEditPage({ params }: AdminBannerEditPageProps) {
  const { id } = await params;
  return <AdminBannerEditView bannerId={id} />;
}
