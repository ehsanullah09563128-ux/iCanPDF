import Link from "next/link";

export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="iCanPDF home">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[11px] bg-[#5362e9] shadow-[0_8px_18px_rgba(83,98,233,.25)]" aria-hidden="true">
        <span className="h-[21px] w-[16px] rounded-[3px] bg-white shadow-sm" />
        <span className="absolute right-[9px] top-[8px] h-2 w-2 bg-[#aeb5ff] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
        <span className="absolute bottom-[9px] left-[11px] h-[2px] w-[10px] rounded-full bg-[#5362e9]" />
        <span className="absolute bottom-[13px] left-[11px] h-[2px] w-[7px] rounded-full bg-[#8893f6]" />
      </span>
      {!compact && <span className="text-[20px] font-extrabold tracking-[-.045em] text-[var(--foreground)]">iCan<span className="text-[#5362e9]">PDF</span></span>}
    </Link>
  );
}
