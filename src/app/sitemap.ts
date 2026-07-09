import type { MetadataRoute } from "next";
import { sampleVents } from "@/lib/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chatpattiebaddie.vercel.app";

  const ventEntries = sampleVents.map((vent) => ({
    url: `${baseUrl}/vent/${vent.id}`,
    lastModified: new Date(vent.createdAt),
    changeFrequency: "never" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...ventEntries,
  ];
}
