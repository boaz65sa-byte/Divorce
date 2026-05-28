import type { ReactNode } from "react";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";

export function BsBrandMark({
  size = "md",
  showLabel = false,
}: {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`bs-mark flex shrink-0 items-center justify-center rounded-xl font-black text-white shadow-sm ring-2 ring-white/30 ${sizes[size]}`}
        aria-hidden
      >
        bs
      </div>
      {showLabel && (
        <div className="leading-tight">
          <p className="text-xs font-bold tracking-wide text-slate-800">
            {BS_SIMPLE.name}
          </p>
          <p className="text-[10px] text-slate-500">{BS_SIMPLE.author}</p>
        </div>
      )}
    </div>
  );
}

export function BsBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "accent" | "soft";
}) {
  const variants = {
    default: "bg-slate-900 text-white",
    accent: "bs-badge text-white",
    soft: "bg-brand-50 text-brand-800 border border-brand-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function BsSignature({ compact = false }: { compact?: boolean }) {
  return (
    <footer
      className={`bs-signature text-center ${compact ? "py-3" : "py-5"}`}
      aria-label={`עיצוב ${BS_SIMPLE.signature}`}
    >
      <div className="bs-accent-line mx-auto mb-2 max-w-[120px]" />
      <p className="text-[11px] font-semibold tracking-wider text-slate-600">
        {BS_SIMPLE.signature}
      </p>
      {!compact && (
        <p className="mt-1 text-[10px] text-slate-400">{BS_SIMPLE.tagline}</p>
      )}
    </footer>
  );
}

export function BsPatternBg({ children }: { children: ReactNode }) {
  return <div className="bs-pattern relative min-h-screen">{children}</div>;
}

export function BsSection({
  title,
  subtitle,
  children,
  accent,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  accent?: "blue" | "teal" | "violet";
  className?: string;
}) {
  const accents = {
    blue: "border-brand-500",
    teal: "border-cyan-500",
    violet: "border-violet-500",
  };

  return (
    <section
      className={`bs-section rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm ${className} ${
        accent ? `border-r-4 ${accents[accent]}` : ""
      }`}
    >
      {title && (
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            )}
          </div>
          <BsBadge variant="soft">bs-simple</BsBadge>
        </div>
      )}
      {children}
    </section>
  );
}

export function BsPageAccent() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-32 overflow-hidden opacity-40">
      <div className="bs-hero-glow absolute -left-20 -top-20 h-40 w-40 rounded-full blur-3xl" />
      <div className="bs-hero-glow-2 absolute -right-10 top-0 h-32 w-32 rounded-full blur-3xl" />
    </div>
  );
}
