import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import { LoginRequiredModal } from "@/components/common/login-required-modal";
import { SITE_CONFIG } from "@/constants/config";

/** Plus Jakarta Sans is the site's only typeface — every font token in
 * globals.css (`sans`, `mono`, `heading`, `display`, `rank`) resolves to it. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
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
      className={`${jakarta.variable} h-full antialiased`}
    >
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7219800880647637"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
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
