"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories, tools } from "@/lib/tools";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setToolsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = query.trim() ? tools.filter((tool) => `${tool.name} ${tool.description}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : tools.filter((tool) => tool.popular).slice(0, 6);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background),transparent_7%)] backdrop-blur-xl">
        <div className="container-shell flex h-[72px] items-center justify-between gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <div className="relative" ref={menuRef}>
              <button onClick={() => setToolsOpen((value) => !value)} className="btn-ghost min-h-10 px-3.5" type="button" aria-expanded={toolsOpen}>PDF tools <ChevronDown size={14} className={`transition ${toolsOpen ? "rotate-180" : ""}`} /></button>
              {toolsOpen && (
                <div className="absolute left-0 top-[48px] w-[720px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)]">
                  <div className="grid grid-cols-3 gap-x-7 gap-y-5">
                    {categories.slice(0, 3).map((category) => (
                      <div key={category}>
                        <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[.12em] text-[var(--muted)]">{category}</p>
                        <div className="space-y-1">
                          {tools.filter((tool) => tool.category === category).slice(0, 5).map((tool) => (
                            <Link key={tool.slug} href={`/tools/${tool.slug}`} onClick={() => setToolsOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-semibold hover:bg-[var(--surface-soft)]">
                              <tool.icon size={16} className="text-[var(--brand)]" />{tool.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/#all-tools" onClick={() => setToolsOpen(false)} className="mt-5 flex items-center justify-center rounded-xl bg-[var(--brand-soft)] px-4 py-3 text-sm font-bold text-[var(--brand-dark)]">Browse all 37 PDF tools</Link>
                </div>
              )}
            </div>
            <Link href="/tools/edit-pdf" className="btn-ghost min-h-10 px-3.5">Edit & sign</Link>
            <Link href="/tools/chat-with-pdf" className="btn-ghost min-h-10 px-3.5"><Sparkles size={15} className="text-[#7a65e8]" /> AI PDF</Link>
            <Link href="/#pricing" className="btn-ghost min-h-10 px-3.5">Pricing</Link>
            <Link href="/dashboard" className="btn-ghost min-h-10 px-3.5">Workspace</Link>
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <button className="grid h-9 w-9 place-items-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface-soft)]" onClick={() => setSearchOpen(true)} aria-label="Search tools"><Search size={18} /></button>
            <ThemeToggle />
            <Link href="/login" className="btn-ghost min-h-10 px-3">Log in</Link>
            <Link href="/signup" className="btn-primary min-h-10 rounded-xl px-4">Get started</Link>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-[var(--background)] p-5 lg:hidden">
          <div className="flex items-center justify-between"><Logo /><button onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)]" aria-label="Close menu"><X size={20} /></button></div>
          <nav className="mt-10 flex flex-col gap-2" aria-label="Mobile navigation">
            <button className="flex items-center justify-between border-b border-[var(--line)] py-4 text-left text-lg font-bold" onClick={() => setSearchOpen(true)}>Search tools <Search size={20} /></button>
            <Link onClick={() => setMobileOpen(false)} href="/#all-tools" className="border-b border-[var(--line)] py-4 text-lg font-bold">PDF tools</Link>
            <Link onClick={() => setMobileOpen(false)} href="/tools/edit-pdf" className="border-b border-[var(--line)] py-4 text-lg font-bold">Edit & sign</Link>
            <Link onClick={() => setMobileOpen(false)} href="/tools/chat-with-pdf" className="border-b border-[var(--line)] py-4 text-lg font-bold">AI PDF</Link>
            <Link onClick={() => setMobileOpen(false)} href="/#pricing" className="border-b border-[var(--line)] py-4 text-lg font-bold">Pricing</Link>
            <Link onClick={() => setMobileOpen(false)} href="/dashboard" className="border-b border-[var(--line)] py-4 text-lg font-bold">Workspace</Link>
          </nav>
          <div className="mt-8 grid grid-cols-2 gap-3"><Link href="/login" className="btn-secondary">Log in</Link><Link href="/signup" className="btn-primary">Get started</Link></div>
          <div className="mt-6 flex justify-between"><span className="text-sm text-[var(--muted)]">Appearance</span><ThemeToggle compact /></div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[80] bg-[#11142a]/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search tools" onMouseDown={() => setSearchOpen(false)}>
          <div onMouseDown={(event) => event.stopPropagation()} className="mx-auto mt-[10vh] max-w-xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
            <div className="flex items-center gap-3 border-b border-[var(--line)] px-5"><Search size={19} className="text-[var(--muted)]" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search PDF tools…" className="h-16 w-full bg-transparent text-base outline-none" /><button onClick={() => setSearchOpen(false)} className="rounded-lg border border-[var(--line)] px-2 py-1 text-xs text-[var(--muted)]">ESC</button></div>
            <div className="p-2">
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{query ? "Search results" : "Popular tools"}</p>
              {results.map((tool) => <Link onClick={() => setSearchOpen(false)} key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center gap-3 rounded-xl p-3 hover:bg-[var(--surface-soft)]"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]"><tool.icon size={18} /></span><span><span className="block text-sm font-bold">{tool.name}</span><span className="block text-xs text-[var(--muted)]">{tool.description}</span></span></Link>)}
              {!results.length && <p className="p-7 text-center text-sm text-[var(--muted)]">No tools found. Try another search.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
