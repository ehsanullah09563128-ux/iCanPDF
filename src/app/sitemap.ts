import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/blog", "/security", "/help", "/docs", "/careers", "/privacy", "/terms", "/cookies"];
  return [...staticPages.map((path) => ({ url: `${siteConfig.url}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : 0.6 })), ...tools.map((tool) => ({ url: `${siteConfig.url}/tools/${tool.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: tool.popular ? 0.9 : 0.75 }))];
}
