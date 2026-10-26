import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { RecoveryForm } from "@/components/recovery-form";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };
export default function ForgotPasswordPage() { return <main className="flex min-h-screen flex-col px-5 py-6 sm:px-10"><Logo /><div className="flex flex-1 items-center justify-center py-12"><RecoveryForm mode="forgot" /></div></main>; }
