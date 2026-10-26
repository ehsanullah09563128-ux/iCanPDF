"use client";

import { AlertCircle, ArrowRight, Check, CheckCircle2, Download, File, FilePlus2, GripVertical, LockKeyhole, RotateCw, Settings2, ShieldCheck, Trash2, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import type { PdfTool } from "@/lib/tools";

type WorkspaceTool = Pick<PdfTool, "slug" | "name" | "action" | "accepts">;
type Stage = "empty" | "ready" | "processing" | "done";

export function ToolWorkspace({ tool }: { tool: WorkspaceTool }) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<Stage>("empty");
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState("Balanced");
  const [error, setError] = useState("");

  useEffect(() => {
    if (stage !== "processing") return;
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + Math.ceil(Math.random() * 7), 100);
        if (next === 100) window.setTimeout(() => setStage("done"), 350);
        return next;
      });
    }, 180);
    return () => window.clearInterval(timer);
  }, [stage]);

  const supportsMultiple = ["merge-pdf", "jpg-to-pdf", "batch-process", "create-pdf"].includes(tool.slug);

  function addFiles(next: File[]) {
    const valid = next.filter((file) => file.size <= 2 * 1024 * 1024 * 1024);
    if (!valid.length) { setError("This file type is not supported or the file is too large."); return; }
    setError("");
    setFiles((current) => supportsMultiple ? [...current, ...valid] : [valid[0]]);
    setStage("ready");
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) { addFiles(Array.from(event.target.files ?? [])); }
  function onDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); addFiles(Array.from(event.dataTransfer.files)); }
  function process() { setProgress(4); setStage("processing"); }
  function reset() { setFiles([]); setProgress(0); setStage("empty"); setError(""); if (input.current) input.current.value = ""; }

  function downloadResult() {
    const source = files[0];
    if (!source) return;
    const url = URL.createObjectURL(source);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `iCanPDF-${source.name}`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (stage === "processing") return <div className="mx-auto max-w-2xl rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-md)] sm:p-12">
    <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[var(--brand-soft)] text-[var(--brand)]"><RotateCw size={31} className="animate-spin" /><span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-[var(--surface)] bg-[#28a079]" /></span>
    <h2 className="mt-7 text-2xl font-extrabold tracking-[-.035em]">Working on your document…</h2><p className="mt-2 text-sm text-[var(--muted)]">{tool.name} is processing securely. Keep this tab open.</p>
    <div className="mx-auto mt-8 max-w-md"><div className="mb-2 flex justify-between text-xs font-bold"><span>{progress < 35 ? "Analyzing document" : progress < 80 ? "Applying changes" : "Finalizing output"}</span><span className="text-[var(--brand)]">{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]"><span className="block h-full rounded-full bg-gradient-to-r from-[#5362e9] to-[#8b70e8] transition-all duration-300" style={{ width: `${progress}%` }} /></div></div>
    <button className="mt-8 text-xs font-bold text-[var(--muted)] hover:text-red-600" onClick={reset}>Cancel processing</button>
  </div>;

  if (stage === "done") return <div className="mx-auto max-w-2xl rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-md)] sm:p-12">
    <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e7f8f1] text-[#239372]"><Check size={37} strokeWidth={2.7} /></span><h2 className="mt-7 text-2xl font-extrabold tracking-[-.035em]">Your file is ready!</h2><p className="mt-2 text-sm text-[var(--muted)]">Processed securely. This temporary result will be removed in one hour.</p>
    <div className="mx-auto mt-7 flex max-w-md items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--background)] p-3 text-left"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0f1] text-[#e25b6b]"><File size={20} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-extrabold">iCanPDF-{files[0]?.name}</span><span className="text-xs text-[var(--muted)]">{files.length} file{files.length > 1 ? "s" : ""} processed</span></span><CheckCircle2 size={19} className="text-[#259575]" /></div>
    <button onClick={downloadResult} className="btn-primary mt-7 w-full max-w-md"><Download size={18} /> Download result</button><div className="mt-4 flex justify-center gap-5"><button onClick={reset} className="text-xs font-bold text-[var(--muted)] hover:text-[var(--brand)]">Process another file</button><Link href="/dashboard" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--brand)]">Save to workspace</Link></div>
  </div>;

  return <div className="mx-auto max-w-3xl">
    <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} className={`rounded-[26px] border bg-[var(--surface)] p-3 shadow-[var(--shadow-md)] transition ${dragging ? "scale-[1.01] border-[var(--brand)]" : "border-[var(--line)]"}`}>
      {stage === "empty" ? <div className={`grid min-h-[310px] place-items-center rounded-[20px] border-2 border-dashed p-8 text-center transition ${dragging ? "border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[var(--line)] bg-[var(--background)]"}`}><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]"><UploadCloud size={29} /></span><h2 className="mt-5 text-lg font-extrabold">Drop {supportsMultiple ? "your files" : "a file"} here</h2><p className="mt-2 text-sm text-[var(--muted)]">or choose from your device</p><button onClick={() => input.current?.click()} className="btn-primary mt-5">{tool.action} <ArrowRight size={16} /></button><p className="mt-4 text-[10px] font-semibold text-[var(--muted)]">Up to 2 GB · {supportsMultiple ? "Multiple files supported" : "One file at a time"}</p></div></div> : <div className="p-3 sm:p-5">
        <div className="flex items-center justify-between"><h2 className="text-sm font-extrabold">Your {files.length > 1 ? "files" : "file"}</h2><button onClick={reset} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-red-50 hover:text-red-600" aria-label="Remove all files"><Trash2 size={16} /></button></div>
        <div className="mt-3 space-y-2">{files.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--background)] p-3"><GripVertical size={16} className={supportsMultiple ? "text-[var(--muted)]" : "invisible"} /><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#fff0f1] text-[#dc596a]"><File size={18} /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-extrabold">{file.name}</span><span className="text-[10px] text-[var(--muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</span></span><button onClick={() => { const next = files.filter((_, i) => i !== index); setFiles(next); if (!next.length) setStage("empty"); }} className="grid h-8 w-8 place-items-center text-[var(--muted)] hover:text-red-600" aria-label={`Remove ${file.name}`}><X size={16} /></button></div>)}</div>
        {supportsMultiple && <button onClick={() => input.current?.click()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--line)] py-3 text-xs font-bold text-[var(--muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"><FilePlus2 size={15} /> Add more files</button>}
        <div className="mt-5 rounded-xl bg-[var(--surface-soft)] p-4"><div className="flex items-center gap-2 text-xs font-extrabold"><Settings2 size={15} className="text-[var(--brand)]" /> Output settings</div><div className="mt-3 grid grid-cols-3 gap-2">{["Smaller", "Balanced", "Best quality"].map((item) => <button key={item} onClick={() => setQuality(item)} className={`rounded-lg border px-2 py-2.5 text-[10px] font-bold transition ${quality === item ? "border-[var(--brand)] bg-[var(--surface)] text-[var(--brand)]" : "border-transparent text-[var(--muted)]"}`}>{item}</button>)}</div></div>
        <button onClick={process} className="btn-primary mt-5 w-full">{tool.name} <ArrowRight size={16} /></button>
      </div>}
      <input ref={input} type="file" accept={tool.accepts} multiple={supportsMultiple} className="sr-only" onChange={onInput} />
    </div>
    {error && <p role="alert" className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-red-600"><AlertCircle size={14} /> {error}</p>}
    <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-bold text-[var(--muted)]"><span className="inline-flex items-center gap-1.5"><LockKeyhole size={12} className="text-[#269575]" /> Encrypted transfer</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#269575]" /> Automatic deletion</span><span>No watermark</span></div>
  </div>;
}
