import type { Metadata } from "next";
import { Geist, Geist_Mono, Merienda, Unbounded } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import { LoginRequiredModal } from "@/components/common/login-required-modal";
import { SITE_CONFIG } from "@/constants/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
  weight: ["400"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${merienda.variable} h-full antialiased`}
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
