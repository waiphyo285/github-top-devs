import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Github Top Devs - Discover Top GitHub Developers",
  description:
    "Browse, filter, and search rankings of the top open-source GitHub developers globally and by country based on followers and public contributions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <GoogleTagManager gtmId="GTM-PJMSHTZR" />
      <body
        className="min-h-full flex flex-col bg-background text-foreground radial-bg relative overflow-x-clip"
        suppressHydrationWarning
      >
        {/* Glassmorphic Ambient Background Blobs */}
        <div className="absolute top-[5%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-emerald-500/4 blur-[140px] pointer-events-none -z-20 animate-pulse-slow" style={{ animationDuration: '20s' }} />
        <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-teal-400/4 blur-[150px] pointer-events-none -z-20 animate-pulse-slow" style={{ animationDuration: '24s', animationDelay: '3s' }} />
        <div className="absolute bottom-[10%] left-[10%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] rounded-full bg-emerald-900/5 blur-[160px] pointer-events-none -z-20 animate-pulse-slow" style={{ animationDuration: '28s', animationDelay: '6s' }} />

        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

