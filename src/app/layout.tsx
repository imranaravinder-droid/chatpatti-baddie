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
    default: "CHATPATTIE BADDIE - 22+ AI Agents",
    template: "%s | CHATPATTIE BADDIE",
  },
  description:
    "CHATPATTIE BADDIE — 22+ AI specialists. Chat, study, create images, get advice. Free, private, 24 Indian languages.",
  keywords: [
    "Chatpattie Baddie",
    "AI chat free",
    "AI image generator",
    "AI study help",
    "AI Hindi",
    "AI Indian languages",
    "free AI assistant",
    "AI life coach",
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
    title: "CHATPATTIE BADDIE - 22+ AI Agents, Free",
    description:
      "CHATPATTIE BADDIE — 22+ AI agents. Chat, create images, study, get advice. Free, private, 24 languages.",
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
    title: "CHATPATTIE BADDIE - 22+ AI Agents",
    description:
      "CHATPATTIE BADDIE — 22+ AI agents. Free, private, 24 Indian languages.",
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
                "CHATPATTIE BADDIE — 22+ AI agents for chat, images, study, and life advice. Free, private, 24 Indian languages.",
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <Navbar />
        <ServiceWorkerRegister />
        <Analytics />
        <main className="flex-1 w-full max-w-3xl mx-auto">
          {children}
        </main>
        <div className="w-full max-w-3xl mx-auto px-4 py-2">
          <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-YOUR_PUBLISHER_ID" data-ad-slot="YOUR_AD_SLOT_ID" data-ad-format="auto" />
          <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
        </div>
        <footer className="text-center py-6 px-4 border-t border-gray-100 space-y-3">
          <p className="text-xs text-gray-400">
            💕 CHATPATTIE BADDIE &middot; 22+ AI agents — free
          </p>
          <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
            <a href="https://chatpatti-baddie.vercel.app" className="text-gray-400 hover:text-pink-500">Home</a>
            <span className="text-gray-300">|</span>
            <a href="/chat" className="text-gray-400 hover:text-pink-500">Chat</a>
            <span className="text-gray-300">|</span>
            <a href="/askm" className="text-gray-400 hover:text-pink-500">AskM 🎨</a>
            <span className="text-gray-300">|</span>
            <a href="/askm" className="text-gray-400 hover:text-pink-500">AskM 🎨</a>
            <span className="text-gray-300">|</span>
            <a href="/dashboard" className="text-gray-400 hover:text-pink-500">Drama Log</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
