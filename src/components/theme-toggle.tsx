"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("icanpdf-theme");
    const shouldDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", shouldDark);
    setDark(shouldDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("icanpdf-theme", next ? "dark" : "light");
  }

  return (
    <button type="button" onClick={toggleTheme} className={`grid place-items-center rounded-xl border border-[var(--line)] text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] ${compact ? "h-10 w-10" : "h-9 w-9"}`} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
