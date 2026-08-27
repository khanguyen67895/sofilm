import type { Metadata } from "next";
import { Merienda, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import { LoginRequiredModal } from "@/components/common/login-required-modal";
import { SITE_CONFIG } from "@/constants/config";

/** Plus Jakarta Sans is the site's typeface everywhere — `sans`/`mono`/`heading`
 * in globals.css all resolve to this one variable. Merienda is the single
 * deliberate exception: `--font-rank` (the big rank number on TrendingRow's
 * cards, `.font-rank`) resolves to it instead, nowhere else. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${jakarta.variable} ${merienda.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <AppProviders>
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <LoginRequiredModal />
        </AppProviders>
      </body>
    </html>
  );
}
