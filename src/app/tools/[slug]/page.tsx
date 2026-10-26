import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight, Clock3, LockKeyhole, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ToolWorkspace } from "@/components/tool-workspace";
import { getTool, tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const title = `${tool.name} Online — Fast, Free & Secure`;
  return {
    title,
    description: `${tool.description} Use iCanPDF online with secure processing, accurate results, and no installation required.`,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: `${title} | iCanPDF`, description: tool.description, url: `${siteConfig.url}/tools/${tool.slug}`, type: "website" },
    twitter: { card: "summary_large_image", title, description: tool.description },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const related = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 4);
  const schema = {
    "@context": "https://schema.org", "@type": "WebApplication", name: tool.name, url: `${siteConfig.url}/tools/${tool.slug}`,
    description: tool.description, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <SiteHeader />
    <main>
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--background)] pb-20 pt-8">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[#dfe3ff] opacity-60 blur-[100px] dark:bg-[#343963] dark:opacity-30" />
        <div className="container-shell relative">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]"><Link href="/">Home</Link><ChevronRight size={12} /><Link href="/#all-tools">{tool.category}</Link><ChevronRight size={12} /><span className="text-[var(--foreground)]">{tool.name}</span></nav>
          <div className="mx-auto mb-10 mt-10 max-w-3xl text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm"><tool.icon size={26} /></span><div className="mt-5 flex items-center justify-center gap-2">{tool.new && <span className="rounded-full bg-[#e5f8ef] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#1d8e69]">New</span>}<span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--brand)]">Online PDF tool</span></div><h1 className="mt-3 text-[clamp(38px,5.5vw,62px)] font-[780] leading-[1.04] tracking-[-.055em]">{tool.name}</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">{tool.description} No installation, no learning curve.</p></div>
          <ToolWorkspace tool={{ slug: tool.slug, name: tool.name, action: tool.action, accepts: tool.accepts }} />
        </div>
      </section>

      <section className="section-space bg-[var(--surface)]"><div className="container-shell"><div className="mx-auto max-w-2xl text-center"><span className="eyebrow">How it works</span><h2 className="section-title !text-[36px]">{tool.name} in three simple steps</h2></div><div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">{[["1", "Upload your file", "Choose a file from your device or drag it into the secure upload area."], ["2", "Choose your settings", "Fine-tune output quality and options, then preview the expected result."], ["3", "Download securely", "Get your finished document instantly or save it to your private workspace."]].map(([n, title, copy]) => <div key={n} className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6"><span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand)] text-xs font-extrabold text-white">{n}</span><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p></div>)}</div></div></section>

      <section className="section-space"><div className="container-shell grid items-center gap-14 lg:grid-cols-2"><div><span className="eyebrow">Built for quality</span><h2 className="section-title !mx-0 !text-[40px]">Accurate results. Every time.</h2><p className="section-copy !mx-0">{tool.longDescription}</p><ul className="mt-7 grid gap-3 sm:grid-cols-2">{["Preserves original quality", "Works on every device", "No software required", "Files up to 2 GB"].map((item) => <li key={item} className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 size={16} className="text-[#259474]" />{item}</li>)}</ul></div><div className="grid grid-cols-2 gap-3">{[[Zap, "Fast processing", "Global infrastructure routes each job to the fastest available region."], [ShieldCheck, "Private by design", "Files are isolated and never shared with unrelated services."], [LockKeyhole, "Secure transfer", "TLS encryption protects every upload and download."], [Clock3, "Auto-delete", "Temporary files disappear automatically after one hour."]].map(([Icon, title, copy]) => { const I = Icon as typeof Zap; return <div key={String(title)} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"><I size={20} className="text-[var(--brand)]" /><h3 className="mt-4 text-sm font-extrabold">{String(title)}</h3><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{String(copy)}</p></div>; })}</div></div></section>

      <section className="section-space bg-[var(--surface)]"><div className="container-shell"><div className="flex items-end justify-between"><div><span className="eyebrow">Keep working</span><h2 className="mt-4 text-3xl font-extrabold tracking-[-.04em]">Related PDF tools</h2></div><Link href="/#all-tools" className="hidden items-center gap-2 text-sm font-bold text-[var(--brand)] sm:flex">View all tools <ArrowRight size={15} /></Link></div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="group rounded-2xl border border-[var(--line)] bg-[var(--background)] p-5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]"><item.icon size={19} /></span><h3 className="mt-4 text-sm font-extrabold">{item.name}</h3><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{item.description}</p><span className="mt-4 flex items-center gap-1 text-[10px] font-extrabold text-[var(--brand)] opacity-0 transition group-hover:opacity-100">Open tool <ArrowRight size={12} /></span></Link>)}</div></div></section>

      <section className="section-space"><div className="container-shell mx-auto max-w-3xl text-center"><Sparkles size={24} className="mx-auto text-[var(--brand)]" /><h2 className="mt-4 text-3xl font-extrabold tracking-[-.04em]">Do more with iCanPDF Pro</h2><p className="mt-3 text-sm text-[var(--muted)]">Unlimited tasks, batch processing, advanced OCR, and 50 GB of secure storage.</p><Link href="/signup" className="btn-primary mt-7">Start your free trial <ArrowRight size={16} /></Link></div></section>
    </main>
    <SiteFooter />
  </>;
}
