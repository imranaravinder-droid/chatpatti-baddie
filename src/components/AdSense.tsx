"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID;

interface Props {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export default function AdSense({ slot, format = "auto", className = "" }: Props) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!AD_CLIENT || initialized.current) return;
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
      initialized.current = true;
    } catch {}
  }, []);

  if (!AD_CLIENT) return null;

  return (
    <>
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <ins
        className={`adsbygoogle ${className}`}
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </>
  );
}
