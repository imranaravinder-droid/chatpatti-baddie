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
    default: "CP Baddie - 22+ AI Agents | Free AI Chat, Images & More",
    template: "%s | CP Baddie",
  },
  description:
    "CP Baddie ? 22+ AI specialists. Chat, study, create images, get advice, browse YouTube. Free, private, 24 Indian languages.",
  keywords: [
    "CP Baddie",
    "free AI chat",
    "AI image generator",
    "AI study help",
    "AI Hindi",
    "AI Indian languages",
    "free AI assistant",
    "AI life coach",
    "AI voice generator",
    "Pinterest pins",
    "AI media",
    "Voice AI",
    "AI Talk",
    "online AI free",
    "generative AI India",
  ],
  authors: [{ name: "CP Baddie Chat" }],
  creator: "CP Baddie Chat",
  publisher: "CP Baddie Chat",
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
    siteName: "CP Baddie",
    title: "CP Baddie - 22+ AI Agents, Free",
    description:
      "CP Baddie ? 22+ AI agents. Chat, create images, study, get advice. Free, private, 24 languages.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CP Baddie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CP Baddie - 22+ AI Agents",
    description:
      "CP Baddie ? 22+ AI agents. Free, private, 24 Indian languages.",
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
  category: "wellness",
  metadataBase: new URL("https://cpbaddie.com"),
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
        <meta name="google-site-verification" content="UaKQBG922ubp_DUKHcu0q13BgnaSgUR0Mk1o56e04FQ" />
        <meta name="pinterest-site-verification" content="92b166f17948b54f89daa16667a5577f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CP Baddie" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CP Baddie",
              description:
                "CP Baddie ? 22+ AI agents for chat, images, study, and life advice. Free, private, 24 Indian languages.",
              url: "https://cpbaddie.com",
              applicationCategory: "WellnessApplication",
              operatingSystem: "Web",
              author: {
                "@type": "Organization",
                name: "CP Baddie Chat",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4486222454241909" crossOrigin="anonymous" />
        <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js" />
        <script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js" />
        <script dangerouslySetInnerHTML={{ __html: "(function(){var a=document.createElement('amp-auto-ads');a.setAttribute('type','adsense');a.setAttribute('data-ad-client','ca-pub-4486222454241909');document.head.appendChild(a);})();" }} />
        <meta name="google-adsense-account" content="ca-pub-4486222454241909" />
        <script dangerouslySetInnerHTML={{ __html: "window.$crisp=[];window.CRISP_WEBSITE_ID='9ec997ba-af12-4515-9a44-cdd9932d9629';(function(){d=document;s=d.createElement('script');s.src='https://client.crisp.chat/l.js';s.async=1;d.getElementsByTagName('head')[0].appendChild(s);})();" }} />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <Navbar />
        <ServiceWorkerRegister />
        <Analytics />
        <main className="flex-1 w-full max-w-3xl mx-auto">
          {children}
        </main>
        <div className="w-full max-w-3xl mx-auto px-4 py-2">
          <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
          <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
        </div>
        <footer className="text-center py-6 px-4 border-t border-gray-100 space-y-3">
          <p className="text-xs text-gray-400">
            💖 CP Baddie &middot; 22+ AI agents ✨ free
          </p>
          <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
            <a href="https://cpbaddie.com" className="text-gray-400 hover:text-pink-500">Home</a>
            <span className="text-gray-300">|</span>
            <a href="/chat" className="text-gray-400 hover:text-pink-500">Chat</a>
            <span className="text-gray-300">|</span>
            <a href="/cbtalk" className="text-gray-400 hover:text-pink-500">CB Talk</a>
            <span className="text-gray-300">|</span>
            <a href="/instagram" className="text-gray-400 hover:text-pink-500">Prisha Insta</a>
            <span className="text-gray-300">|</span>
            <a href="/dashboard" className="text-gray-400 hover:text-pink-500">My History</a>
            <span className="text-gray-300">|</span>
            <a href="/privacy" className="text-gray-400 hover:text-pink-500">Privacy</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
