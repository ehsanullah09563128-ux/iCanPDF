import { HeroWorkspace } from "@/components/hero-workspace";
import { ToolExplorer } from "@/components/tool-explorer";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AiSection, BlogSection, FaqSection, FinalCta, PricingSection, SecuritySection, TestimonialsSection, ValueSection, WorkflowSection } from "@/components/landing-sections";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "iCanPDF",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "18420" },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <SiteHeader />
    <main>
      <HeroWorkspace />
      <ToolExplorer />
      <WorkflowSection />
      <AiSection />
      <ValueSection />
      <SecuritySection />
      <TestimonialsSection />
      <PricingSection />
      <BlogSection />
      <FaqSection />
      <FinalCta />
    </main>
    <SiteFooter />
  </>;
}
