import type { Metadata } from "next";
import { ProfileView } from "@/features/profile/components/profile-view";

export const metadata: Metadata = {
  title: "My Profile | SoFilm",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileView />;
}
