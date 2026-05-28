import { BRAND } from "@/lib/brand/brand";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** סמל המותג — שני מסלולים שמתחברים (הורים + דרך חדשה) */
export function LogoMark({ size = 40, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={BRAND.name}
    >
      <defs>
        <linearGradient id="tl-logo-grad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4338ca" />
          <stop offset="0.5" stopColor="#0d9488" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#tl-logo-grad)" />
      <path
        d="M14 34C14 26 18 18 24 14C30 18 34 26 34 34"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M18 32C20 26 22 22 24 20C26 22 28 26 30 32"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="24" cy="12" r="2.5" fill="white" opacity="0.9" />
    </svg>
  );
}

interface LogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

const markSizes = { sm: 32, md: 40, lg: 52 };

export function Logo({
  showTagline = false,
  size = "md",
  variant = "dark",
}: LogoProps) {
  const text = variant === "dark" ? "text-slate-900" : "text-white";
  const sub = variant === "dark" ? "text-slate-500" : "text-white/75";

  return (
    <div className="flex items-center gap-3">
      <LogoMark size={markSizes[size]} />
      <div className="leading-tight">
        <p className={`text-lg font-black tracking-tight ${text}`}>{BRAND.name}</p>
        {showTagline && (
          <p className={`text-[11px] font-medium ${sub}`}>{BRAND.tagline}</p>
        )}
        <p className={`text-[9px] font-semibold tracking-widest uppercase ${sub}`}>
          bs-simple
        </p>
      </div>
    </div>
  );
}

/** סמל הסטודיו bs-simple (לשימוש משני) */
export function StudioMark({ size = 28 }: { size?: number }) {
  return (
    <div
      className="bs-mark flex shrink-0 items-center justify-center rounded-lg font-black text-white shadow-sm ring-2 ring-white/20"
      style={{ width: size, height: size, fontSize: size * 0.28 }}
      aria-hidden
    >
      bs
    </div>
  );
}
