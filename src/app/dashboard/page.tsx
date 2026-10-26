import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata: Metadata = { title: "Workspace", description: "Manage files, conversions, AI conversations, storage, and PDF workflows in your iCanPDF workspace.", robots: { index: false, follow: false } };

export default function DashboardPage() { return <DashboardShell />; }
