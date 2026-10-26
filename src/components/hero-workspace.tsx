"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, FileText, LockKeyhole, MousePointer2, Play, ShieldCheck, Sparkles, Upload, X } from "lucide-react";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

export function HeroWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file || progress >= 100) return;
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + 8, 100)), 90);
    return () => window.clearInterval(timer);
  }, [file, progress]);

  function selectFile(next?: File) {
    if (!next) return;
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file.");
      return;
    }
    if (next.size > 100 * 1024 * 1024) {
      setError("File must be smaller than 100 MB.");
      return;
    }
    setError("");
    setProgress(4);
    setFile(next);
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) { selectFile(event.target.files?.[0]); }
  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  }

  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] pb-20 pt-16 lg:pb-28 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="pointer-events-none absolute left-[5%] top-8 h-[420px] w-[420px] rounded-full bg-[#dfe3ff]/70 blur-[110px] dark:bg-[#31365f]/40" />
      <div className="container-shell relative grid items-center gap-14 lg:grid-cols-[.93fr_1.07fr]">
        <div className="animate-enter text-center lg:text-left">
          <Link href="/tools/chat-with-pdf" className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9dcf7] bg-white/75 px-3 py-2 text-xs font-bold text-[#454fc1] shadow-sm backdrop-blur dark:border-[#353b66] dark:bg-[#1a1e36] dark:text-[#aeb5ff]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#5362e9] text-white"><Sparkles size={11} /></span>
            Meet AI PDF Copilot <ArrowRight size={13} />
          </Link>
          <h1 className="max-w-[700px] text-[clamp(46px,6.2vw,76px)] font-[780] leading-[.98] tracking-[-.06em] text-[var(--foreground)]">
            Every PDF tool.<br /><span className="text-gradient">One beautiful place.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[590px] text-[17px] leading-7 text-[var(--muted)] lg:mx-0 lg:text-[18px]">Edit, convert, compress, sign, and understand documents—without the complexity. Fast, secure, and built for focused work.</p>
          <div className="mx-auto mt-8 max-w-[520px] lg:mx-0">
            <div
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`rounded-2xl border p-2.5 shadow-[var(--shadow-md)] transition ${dragging ? "border-[#6673ee] bg-[#eef0ff] scale-[1.01]" : "border-[var(--line)] bg-[var(--surface)]"}`}
            >
              {!file ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button onClick={() => inputRef.current?.click()} className="btn-primary flex-1 min-h-[56px] rounded-xl" type="button"><Upload size={18} /> Choose a PDF file</button>
                  <Link href="#all-tools" className="btn-secondary min-h-[56px] rounded-xl px-5">Explore tools <ArrowRight size={16} /></Link>
                  <input ref={inputRef} className="sr-only" type="file" accept="application/pdf,.pdf" onChange={onInput} />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-1">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fff0f1] text-[#e55668]"><FileText size={21} /></span>
                  <span className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-bold">{file.name}</span><span className="block text-xs text-[var(--muted)]">{(file.size / 1024 / 1024).toFixed(1)} MB · {progress < 100 ? `Uploading ${progress}%` : "Ready to edit"}</span><span className="mt-2 block h-1 overflow-hidden rounded-full bg-[var(--surface-muted)]"><span className="block h-full rounded-full bg-[#5a68eb] transition-all" style={{ width: `${progress}%` }} /></span></span>
                  {progress === 100 ? <Link href="/tools/edit-pdf" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#5362e9] text-white" aria-label="Continue to editor"><ArrowRight size={18} /></Link> : <button onClick={() => { setFile(null); setProgress(0); }} className="grid h-10 w-10 shrink-0 place-items-center text-[var(--muted)]" aria-label="Cancel upload"><X size={18} /></button>}
                </div>
              )}
            </div>
            {error && <p className="mt-2 text-sm font-semibold text-red-600" role="alert">{error}</p>}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[var(--muted)] lg:justify-start"><span className="inline-flex items-center gap-1.5"><LockKeyhole size={13} className="text-[#38a37d]" /> 256-bit encrypted</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-[#38a37d]" /> Auto-delete in 1 hour</span><span>No signup required</span></div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[630px] lg:mx-0">
          <div className="absolute -inset-5 rounded-[40px] bg-gradient-to-br from-[#e1e4ff] via-[#f3eaff] to-[#d9f2f0] opacity-80 blur-2xl dark:opacity-20" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/65 p-3 shadow-[var(--shadow-lg)] backdrop-blur-xl dark:border-white/10 dark:bg-[#171a31]/70">
            <div className="mb-3 flex h-9 items-center gap-1.5 px-2"><span className="h-2.5 w-2.5 rounded-full bg-[#ff8b82]" /><span className="h-2.5 w-2.5 rounded-full bg-[#ffd069]" /><span className="h-2.5 w-2.5 rounded-full bg-[#65d29d]" /><span className="ml-4 h-6 flex-1 rounded-md bg-[#f0f2f8] dark:bg-white/5" /></div>
            <div className="relative aspect-[1.34] overflow-hidden rounded-[20px] bg-[#f2f3ff] dark:bg-[#1d213c]">
              <Image src="/images/icanpdf-workspace.png" fill priority sizes="(max-width: 1024px) 90vw, 600px" alt="iCanPDF document workspace with secure conversion tools" className="object-cover" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/70 bg-white/90 p-3.5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#15182d]/90">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f1] text-[#e95366]"><FileText size={19} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-extrabold text-[var(--foreground)]">Q4 product strategy.pdf</span>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#edf0f6]"><span className="block h-full w-[86%] rounded-full bg-gradient-to-r from-[#5362e9] to-[#8c70e8]" /></span>
                    <span className="text-[10px] font-semibold text-[var(--muted)]">Converting to Word · 86%</span>
                  </span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ecfbf5] text-[#239b73]"><Check size={14} /></span>
                </div>
              </div>
            </div>
          </div>
          <div className="animate-float absolute -left-4 top-[22%] hidden items-center gap-2 rounded-xl border border-white bg-white px-3.5 py-3 text-xs font-extrabold text-[#262a50] shadow-xl sm:flex dark:border-white/10 dark:bg-[#20243e] dark:text-white"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eeeaff] text-[#6c56d9]"><Sparkles size={14} /></span> AI summary ready</div>
          <div className="animate-float-alt absolute -right-3 top-[13%] hidden items-center gap-2 rounded-xl border border-white bg-white px-3.5 py-3 text-xs font-extrabold text-[#262a50] shadow-xl sm:flex dark:border-white/10 dark:bg-[#20243e] dark:text-white"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eafaf4] text-[#279d77]"><ShieldCheck size={14} /></span> Securely processed</div>
          <div className="absolute -bottom-4 right-[12%] hidden rounded-xl border border-white/90 bg-white/90 px-3 py-2 text-[11px] font-bold text-[#40455d] shadow-lg backdrop-blur sm:flex dark:border-white/10 dark:bg-[#20243e] dark:text-white"><MousePointer2 size={14} className="mr-1.5 text-[#5967e9]" /> Drag, drop, done.</div>
        </div>
      </div>
      <div className="container-shell relative mt-16 flex flex-col items-center justify-between gap-5 border-t border-[var(--line)] pt-8 text-[12px] text-[var(--muted)] sm:flex-row">
        <span className="font-semibold">Trusted by 2.4M+ people every month</span>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-extrabold tracking-tight text-[color-mix(in_srgb,var(--foreground),transparent_35%)]"><span>Northstar</span><span>Acme Inc.</span><span>VERTEX</span><span>Monogram</span><span>Cloudline</span></div>
        <Link href="#how-it-works" className="inline-flex items-center gap-1.5 font-bold text-[var(--brand-dark)]"><Play size={13} className="fill-current" /> See how it works</Link>
      </div>
    </section>
  );
}
