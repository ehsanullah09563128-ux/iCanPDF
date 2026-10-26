import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { RecoveryForm } from "@/components/recovery-form";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };
export default function ResetPasswordPage() { return <main className="flex min-h-screen flex-col px-5 py-6 sm:px-10"><Logo /><div className="flex flex-1 items-center justify-center py-12"><RecoveryForm mode="reset" /></div></main>; }
