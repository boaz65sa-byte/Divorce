import type { ReactNode } from "react";
import { BsBadge } from "@/components/brand/BsSimple";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";
import {
  buildReportText,
  downloadTextFile,
  printReport,
} from "@/lib/exportReport";

export function LegalDisclaimer({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50 text-amber-900 ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
      }`}
      role="note"
    >
      {compact ? (
        <p>הערכה בלבד — לא ייעוץ משפטי. יש להתייעץ עם עו&quot;ד או טוען רבני.</p>
      ) : (
        <>
          <p className="font-semibold">הערה משפטית</p>
          <p className="mt-1">
            המידע והחישובים באפליקציה מספקים הערכה כללית בלבד. הם אינם
            מהווים ייעוץ משפטי ואינם מחליפים עורך דין, טוען רבני, בית דין
            או בית משפט. כל מקרה נבחן לגופו.
          </p>
        </>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <BsBadge variant="accent">{BS_SIMPLE.name}</BsBadge>
        <span className="text-[10px] text-slate-400">{BS_SIMPLE.author}</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      <div className="bs-accent-line mt-4 max-w-[80px]" />
    </div>
  );
}

export function Card({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = `bs-card bs-card-hover block p-5 ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return <div className={classes}>{children}</div>;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50";
  const variants = {
    primary: "bs-btn-primary text-white hover:opacity-95",
    secondary: "bs-btn-secondary text-slate-800 hover:bg-slate-50",
    ghost: "text-brand-700 hover:bg-brand-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="bs-input w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bs-input w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="bs-timeline-line h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

export function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bs-card rounded-xl p-4 ${
        highlight ? "border border-brand-100 bg-brand-50/80" : "bg-slate-50/80"
      }`}
    >
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function ExportButtons({
  title,
  sections,
  disclaimer,
  filename,
}: {
  title: string;
  sections: { title: string; lines: string[] }[];
  disclaimer: string;
  filename: string;
}) {
  const handleDownload = () => {
    const text = buildReportText(title, sections, disclaimer);
    downloadTextFile(filename, text);
  };

  const handlePrint = () => {
    printReport(title, sections, disclaimer);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={handleDownload}>
        הורדת TXT
      </Button>
      <Button variant="secondary" onClick={handlePrint}>
        הדפסה / PDF
      </Button>
    </div>
  );
}
