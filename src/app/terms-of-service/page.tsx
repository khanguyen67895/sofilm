import type { Metadata } from "next";
import { TermsOfServiceView } from "@/features/legal";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | SoFilm",
  description: "Điều khoản sử dụng dịch vụ SoFilm — quyền và nghĩa vụ khi sử dụng nền tảng.",
};

export default function TermsOfServicePage() {
  return <TermsOfServiceView />;
}
