import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import { LoginRequiredModal } from "@/components/common/login-required-modal";
import { SITE_CONFIG } from "@/constants/config";

/** The site's only font — every `--font-*` token in globals.css (`sans`,
 * `mono`, `heading`, `rank`) resolves to this one variable, so there is
 * exactly one typeface anywhere on the site, not per-element opt-in. */
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
      className={`${unbounded.variable} h-full antialiased`}
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
