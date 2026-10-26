import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/settings", "/admin", "/api/"] }, sitemap: `${siteConfig.url}/sitemap.xml`, host: siteConfig.url }; }
