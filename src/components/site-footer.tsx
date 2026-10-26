import Link from "next/link";
import { ArrowRight, Globe2, Heart, LockKeyhole, Mail } from "lucide-react";
import { Logo } from "./logo";

const groups = [
  { title: "Popular tools", links: [["PDF to Word", "/tools/pdf-to-word"], ["Compress PDF", "/tools/compress-pdf"], ["Merge PDF", "/tools/merge-pdf"], ["Edit PDF", "/tools/edit-pdf"], ["Sign PDF", "/tools/sign-pdf"]] },
  { title: "Solutions", links: [["AI PDF", "/tools/chat-with-pdf"], ["OCR", "/tools/ocr-pdf"], ["Batch processing", "/tools/batch-process"], ["For teams", "/#pricing"], ["API", "/docs"]] },
  { title: "Company", links: [["About", "/about"], ["Blog", "/blog"], ["Security", "/security"], ["Careers", "/careers"], ["Contact", "mailto:hello@icanpdf.com"]] },
  { title: "Support", links: [["Help center", "/help"], ["Status", "/status"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Cookies", "/cookies"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="container-shell py-16">
        <div className="mb-16 overflow-hidden rounded-[28px] bg-[#15182f] px-6 py-10 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:py-12">
          <div><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#aeb5ff]"><Mail size={15} /> The PDF Brief</p><h2 className="max-w-lg text-3xl font-bold tracking-[-.04em]">Smarter document workflows, once a month.</h2><p className="mt-3 text-sm text-slate-300">Product news, practical guides, and zero spam.</p></div>
          <form className="mt-7 flex max-w-md gap-2 lg:mt-0 lg:w-[420px]"><label className="sr-only" htmlFor="newsletter-email">Work email</label><input id="newsletter-email" type="email" required placeholder="you@company.com" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#858df6]" /><button className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#5c69eb] transition hover:bg-[#6f7af0]" aria-label="Subscribe"><ArrowRight size={19} /></button></form>
        </div>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          <div><Logo /><p className="mt-5 max-w-[290px] text-sm leading-6 text-[var(--muted)]">Everything you need to work with PDF documents—beautifully simple, private by design.</p><div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]"><span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-3 py-2"><LockKeyhole size={13} /> 256-bit TLS</span><span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-3 py-2"><Globe2 size={13} /> GDPR ready</span></div></div>
          <div className="grid grid-cols-2 gap-9 sm:grid-cols-4">{groups.map((group) => <div key={group.title}><h3 className="text-sm font-bold">{group.title}</h3><ul className="mt-4 space-y-3.5">{group.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm text-[var(--muted)] transition hover:text-[var(--brand)]">{label}</Link></li>)}</ul></div>)}</div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--line)] pt-7 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} iCanPDF, Inc. All rights reserved.</span><span className="inline-flex items-center gap-1.5">Made with <Heart size={13} className="fill-[#ee7287] text-[#ee7287]" /> for documents that matter.</span></div>
      </div>
    </footer>
  );
}
