import { HomeAuthGate } from "@/features/home/components/home-auth-gate";
import { HomeView } from "@/features/home/components/home-view";

export default function Home() {
  return (
    <>
      <HomeAuthGate />
      <HomeView />
    </>
  );
}
