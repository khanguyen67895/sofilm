import type { Metadata } from "next";
import { FaqView } from "@/features/legal";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp | SoFilm",
  description: "Giải đáp thắc mắc thường gặp về gói VIP, thanh toán chuyển khoản, và cách sử dụng SoFilm.",
};

export default function FaqPage() {
  return <FaqView />;
}
