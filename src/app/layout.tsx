import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CHATPATTIE BADDIE - Your Emotional AI Companion",
    template: "%s | CHATPATTIE BADDIE",
  },
  description:
    "Vent, process, and transform your emotions with the ultimate AI Baddie. Anonymous emotional processing with AI-powered mood analysis, songs, dance, book recs, and cooking therapy.",
  keywords: [
    "AI emotional companion",
    "mental wellness AI",
    "vent chat",
    "mood tracker",
    "AI therapy alternative",
    "emotional processing",
    "Chatpatti Baddie",
    "AI companion",
  ],
  authors: [{ name: "Chatpatti Baddie" }],
  creator: "Chatpatti Baddie",
  publisher: "Chatpatti Baddie",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CHATPATTIE BADDIE",
    title: "CHATPATTIE BADDIE - Your Emotional AI Companion",
    description:
      "Spill your drama. The Baddie listens. AI-powered venting with mood analysis, songs, dance, books & recipes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CHATPATTIE BADDIE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CHATPATTIE BADDIE - Your Emotional AI Companion",
    description:
      "Spill your drama. The Baddie listens. AI-powered venting with mood analysis, songs, dance, books & recipes.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192.png",
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/icons/icon-192.png",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Baddie",
  },
  category: "wellness",
  metadataBase: new URL("https://chatpatti-baddie.vercel.app"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="google-site-verification" content="UaKQBG922ubp_DUKHcu0q13BgnaSgUR0Mk1o56e04FQ" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CHATPATTIE BADDIE",
              description:
                "An AI-powered emotional companion that helps users process their feelings through venting, mood analysis, songs, dance tutorials, book recommendations, and cooking therapy.",
              url: "https://chatpatti-baddie.vercel.app",
              applicationCategory: "WellnessApplication",
              operatingSystem: "Web",
              author: {
                "@type": "Organization",
                name: "Chatpatti Baddie",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <Navbar />
        <ServiceWorkerRegister />
        <Analytics />
        <main className="flex-1 w-full max-w-3xl mx-auto">
          {children}
        </main>
        <footer className="text-center py-6 px-4 border-t border-gray-100 space-y-3">
          <p className="text-xs text-gray-400">
            💖 CHATPATTIE BADDIE &middot; Your emotional AI companion
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="https://chatpatti-baddie.vercel.app" className="text-gray-400 hover:text-pink-500">Home</a>
            <span className="text-gray-300">|</span>
            <a href="/dashboard" className="text-gray-400 hover:text-pink-500">Drama Log</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
