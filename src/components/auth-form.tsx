"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, User } from "lucide-react";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email"), password: data.get("password") }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) { setError(result.error ?? "Something went wrong."); return; }
      router.push("/dashboard"); router.refresh();
    } catch { setError("Unable to connect. Check your internet connection and try again."); }
    finally { setLoading(false); }
  }

  const requirements = [{ label: "8+ characters", pass: password.length >= 8 }, { label: "Uppercase", pass: /[A-Z]/.test(password) }, { label: "Number", pass: /[0-9]/.test(password) }];

  return <div className="w-full max-w-[430px]">
    <div className="text-center lg:text-left"><h1 className="text-[34px] font-extrabold tracking-[-.045em]">{signup ? "Create your account" : "Welcome back"}</h1><p className="mt-2 text-sm text-[var(--muted)]">{signup ? "Start working smarter with every document." : "Log in to continue to your iCanPDF workspace."}</p></div>
    <a href="/api/auth/google" className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-sm font-extrabold shadow-sm transition hover:bg-[var(--surface-soft)]"><span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-bold text-[#4285f4] shadow-sm">G</span> Continue with Google</a>
    <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-[var(--line)]" /><span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">or continue with email</span><span className="h-px flex-1 bg-[var(--line)]" /></div>
    {error && <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700" role="alert"><AlertCircle size={15} className="mt-.5 shrink-0" />{error}</div>}
    <form onSubmit={submit} className="space-y-4">
      {signup && <label className="block"><span className="mb-2 block text-xs font-extrabold">Full name</span><span className="flex h-12 items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[#5362e9]/10"><User size={16} className="text-[var(--muted)]" /><input name="name" required minLength={2} autoComplete="name" placeholder="Alex Morgan" className="w-full bg-transparent text-sm outline-none" /></span></label>}
      <label className="block"><span className="mb-2 block text-xs font-extrabold">Email address</span><span className="flex h-12 items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[#5362e9]/10"><Mail size={16} className="text-[var(--muted)]" /><input name="email" required type="email" autoComplete="email" placeholder="you@company.com" className="w-full bg-transparent text-sm outline-none" /></span></label>
      <label className="block"><span className="mb-2 flex items-center justify-between text-xs font-extrabold"><span>Password</span>{!signup && <Link href="/forgot-password" className="text-[var(--brand)]">Forgot password?</Link>}</span><span className="flex h-12 items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[#5362e9]/10"><LockKeyhole size={16} className="text-[var(--muted)]" /><input name="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={signup ? 8 : 1} type={visible ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" /><button type="button" onClick={() => setVisible((value) => !value)} className="text-[var(--muted)]" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
      {signup && <div className="flex flex-wrap gap-x-4 gap-y-1">{requirements.map((item) => <span key={item.label} className={`flex items-center gap-1 text-[10px] font-semibold ${item.pass ? "text-[#238d6c]" : "text-[var(--muted)]"}`}><Check size={11} strokeWidth={3} />{item.label}</span>)}</div>}
      {signup && <label className="flex items-start gap-2.5 text-[11px] leading-5 text-[var(--muted)]"><input required type="checkbox" className="mt-1 accent-[#5362e9]" /> <span>I agree to the <Link href="/terms" className="font-bold text-[var(--foreground)]">Terms of Service</Link> and <Link href="/privacy" className="font-bold text-[var(--foreground)]">Privacy Policy</Link>.</span></label>}
      {!signup && <label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]"><input type="checkbox" className="accent-[#5362e9]" /> Keep me signed in</label>}
      <button disabled={loading} className="btn-primary min-h-12 w-full disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><LoaderCircle size={17} className="animate-spin" /> {signup ? "Creating account…" : "Logging in…"}</> : <>{signup ? "Create free account" : "Log in"} <ArrowRight size={16} /></>}</button>
    </form>
    <p className="mt-7 text-center text-xs text-[var(--muted)]">{signup ? "Already have an account?" : "New to iCanPDF?"} <Link href={signup ? "/login" : "/signup"} className="font-extrabold text-[var(--brand)]">{signup ? "Log in" : "Create an account"}</Link></p>
    <p className="mt-7 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[var(--muted)]"><LockKeyhole size={12} className="text-[#289474]" /> Protected by enterprise-grade encryption</p>
  </div>;
}
