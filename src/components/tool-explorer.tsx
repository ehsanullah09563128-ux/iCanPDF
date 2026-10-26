"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { categories, tools, type ToolCategory } from "@/lib/tools";
import { useMemo, useState } from "react";

const accents: Record<string, { bg: string; color: string }> = {
  blue: { bg: "#edf0ff", color: "#5362e9" }, green: { bg: "#eaf9f3", color: "#238d6c" }, orange: { bg: "#fff3e8", color: "#e17c32" },
  violet: { bg: "#f1edff", color: "#7657d9" }, cyan: { bg: "#e9f8fb", color: "#208fa8" }, slate: { bg: "#eef1f6", color: "#59647d" },
  pink: { bg: "#fff0f6", color: "#d45186" }, indigo: { bg: "#eceeff", color: "#4f5bd0" }, purple: { bg: "#f4ecff", color: "#8a4fd1" },
  rose: { bg: "#fff0f1", color: "#dd5d6e" }, amber: { bg: "#fff7e4", color: "#bd8427" }, emerald: { bg: "#e9faf2", color: "#238d65" },
};

export function ToolExplorer() {
  const [category, setCategory] = useState<ToolCategory | "All tools">("All tools");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const filtered = useMemo(() => tools.filter((tool) => (category === "All tools" || tool.category === category) && (!query || `${tool.name} ${tool.description}`.toLowerCase().includes(query.toLowerCase()))), [category, query]);
  const visible = expanded || query || category !== "All tools" ? filtered : filtered.slice(0, 12);

  return (
    <section id="all-tools" className="section-space bg-[var(--surface)] scroll-mt-16">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center"><span className="eyebrow">37 purpose-built tools</span><h2 className="section-title">One workspace. Every PDF task.</h2><p className="section-copy">No maze of menus. Pick a tool and get a polished result in seconds.</p></div>
        <div className="mx-auto mt-10 flex max-w-5xl flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {(["All tools", ...categories] as const).map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition ${category === item ? "border-[#5362e9] bg-[#5362e9] text-white shadow-[0_8px_18px_rgba(83,98,233,.2)]" : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}>{item}</button>)}
          </div>
          <label className="flex h-10 min-w-[220px] items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 text-[var(--muted)] focus-within:border-[var(--brand)]"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a tool" className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none" /></label>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((tool) => {
            const accent = accents[tool.accent] ?? accents.blue;
            return <Link href={`/tools/${tool.slug}`} key={tool.slug} className="group relative min-h-[186px] rounded-2xl border border-[var(--line)] bg-[var(--background)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--brand),transparent_55%)] hover:bg-[var(--surface)] hover:shadow-[var(--shadow-md)]">
              {tool.new && <span className="absolute right-4 top-4 rounded-full bg-[#e9f9f3] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#1a8d68]">New</span>}
              <span className="grid h-11 w-11 place-items-center rounded-xl transition group-hover:scale-105" style={{ background: accent.bg, color: accent.color }}><tool.icon size={21} strokeWidth={1.9} /></span>
              <h3 className="mt-5 text-[15px] font-extrabold tracking-[-.015em]">{tool.name}</h3><p className="mt-2 text-[12.5px] leading-5 text-[var(--muted)]">{tool.description}</p>
              <ArrowRight size={16} className="absolute bottom-5 right-5 translate-x-0 text-[var(--muted)] opacity-0 transition group-hover:translate-x-1 group-hover:text-[var(--brand)] group-hover:opacity-100" />
            </Link>;
          })}
        </div>
        {!visible.length && <div className="mt-8 rounded-2xl border border-dashed border-[var(--line)] p-12 text-center text-sm text-[var(--muted)]">No tools match your search.</div>}
        {!expanded && !query && category === "All tools" && <div className="mt-8 text-center"><button className="btn-secondary" onClick={() => setExpanded(true)}>View all 37 tools <ArrowRight size={16} /></button></div>}
      </div>
    </section>
  );
}
