import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s | iCanPDF" },
  description: siteConfig.description,
  applicationName: "iCanPDF",
  keywords: ["PDF editor", "PDF converter", "compress PDF", "merge PDF", "AI PDF", "sign PDF", "OCR PDF"],
  authors: [{ name: "iCanPDF" }],
  creator: "iCanPDF",
  openGraph: { type: "website", locale: "en_US", url: siteConfig.url, siteName: "iCanPDF", title: siteConfig.title, description: siteConfig.description, images: [{ url: "/images/icanpdf-workspace.png", width: 1200, height: 900, alt: "iCanPDF all-in-one PDF workspace" }] },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description, images: ["/images/icanpdf-workspace.png"] },
  robots: { index: true, follow: true },
  category: "technology",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fbfcff" }, { media: "(prefers-color-scheme: dark)", color: "#0e1020" }] };

const themeScript = `(function(){try{var t=localStorage.getItem('icanpdf-theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}</body></html>;
}
