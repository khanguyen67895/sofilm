import type { Metadata } from "next";
import { PrivacyPolicyView } from "@/features/legal";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư | SoFilm",
  description: "Chính sách quyền riêng tư của SoFilm — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
