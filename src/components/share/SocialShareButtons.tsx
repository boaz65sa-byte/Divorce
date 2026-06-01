"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Copy,
  Link2,
  Mail,
  Share2,
} from "lucide-react";
import { trackFeature } from "@/lib/analytics/client";
import {
  buildPlatformShareUrl,
  canNativeShare,
  copyShareContent,
  getAppShareUrl,
  getDefaultShareContent,
  nativeShare,
  sharePlatforms,
  type ShareLang,
  type SharePlatform,
} from "@/lib/share/socialShare";

interface SocialShareButtonsProps {
  lang?: ShareLang;
  url?: string;
  title?: string;
  text?: string;
  /** full = דף שיתוף | inline = שורה דקה | hidden = רק כפתור פתיחה */
  variant?: "full" | "inline" | "hidden";
}

const primaryPlatforms: SharePlatform[] = [
  "whatsapp",
  "copy",
  "native",
  "facebook",
  "telegram",
];

export function SocialShareButtons({
  lang = "he",
  url,
  title,
  text,
  variant = "hidden",
}: SocialShareButtonsProps) {
  const [open, setOpen] = useState(variant === "full");
  const [showMore, setShowMore] = useState(false);
  const [showCopyText, setShowCopyText] = useState(false);
  const [status, setStatus] = useState("");

  const content = useMemo(() => {
    const shareUrl = url ?? getAppShareUrl();
    const base = getDefaultShareContent(lang, shareUrl);
    return {
      ...base,
      title: title ?? base.title,
      text: text ?? base.text,
    };
  }, [lang, url, title, text]);

  const platforms = useMemo(
    () =>
      sharePlatforms.filter(
        (p) => p.id !== "native" || canNativeShare(),
      ),
    [],
  );

  const primary = platforms.filter((p) => primaryPlatforms.includes(p.id));
  const secondary = platforms.filter((p) => !primaryPlatforms.includes(p.id));

  const handleShare = async (platform: SharePlatform) => {
    trackFeature(`share_${platform}`);

    if (platform === "copy") {
      const ok = await copyShareContent(content);
      setStatus(
        ok
          ? lang === "he"
            ? "הקישור הועתק"
            : "Link copied"
          : lang === "he"
            ? "לא הצליח"
            : "Failed",
      );
      setTimeout(() => setStatus(""), 2500);
      return;
    }

    if (platform === "native") {
      await nativeShare(content);
      return;
    }

    const shareUrl = buildPlatformShareUrl(platform, content);
    if (!shareUrl) return;

    if (platform === "email" || platform === "sms" || platform === "viber") {
      window.location.href = shareUrl;
      return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer,width=560,height=480");
  };

  const platformButton = (platform: (typeof platforms)[0], small = false) => (
    <button
      key={platform.id}
      type="button"
      onClick={() => void handleShare(platform.id)}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-800 ${
        small
          ? "min-h-9 px-2.5 py-1.5 text-[11px] font-medium"
          : "min-h-10 flex-1 px-3 py-2 text-xs font-semibold"
      }`}
      title={lang === "he" ? platform.label : platform.labelEn}
    >
      {platform.id === "copy" && <Copy className="h-3.5 w-3.5 shrink-0" />}
      {platform.id === "email" && <Mail className="h-3.5 w-3.5 shrink-0" />}
      {platform.id === "native" && <Share2 className="h-3.5 w-3.5 shrink-0" />}
      {platform.id !== "copy" &&
        platform.id !== "email" &&
        platform.id !== "native" && (
          <Link2 className="h-3.5 w-3.5 shrink-0 opacity-60" />
        )}
      <span className="truncate">
        {lang === "he" ? platform.label : platform.labelEn}
      </span>
    </button>
  );

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {primary.slice(0, 4).map((p) => platformButton(p, true))}
        {status && (
          <span className="text-[11px] text-teal-700">{status}</span>
        )}
      </div>
    );
  }

  if (variant === "hidden" && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-brand-700"
      >
        <Share2 className="h-4 w-4" />
        {lang === "he" ? "שיתוף" : "Share"}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
      {variant === "hidden" && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mb-3 flex w-full items-center justify-between text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-brand-600" />
            {lang === "he" ? "שיתוף" : "Share"}
          </span>
          <ChevronDown className="h-4 w-4 rotate-180 text-slate-400" />
        </button>
      )}

      {variant === "full" && (
        <p className="mb-3 text-sm text-slate-600">
          {lang === "he"
            ? "בחר/י פלטפורמה — הטקסט והקישור יישלחו אוטומטית"
            : "Pick a platform — text and link are included automatically"}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {primary.map((p) => platformButton(p))}
      </div>

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="mt-3 flex w-full items-center justify-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-700"
      >
        {lang === "he"
          ? showMore
            ? "פחות אפשרויות"
            : "עוד רשתות (LinkedIn, X, SMS…)"
          : showMore
            ? "Fewer options"
            : "More networks (LinkedIn, X, SMS…)"}
        <ChevronDown
          className={`h-3.5 w-3.5 transition ${showMore ? "rotate-180" : ""}`}
        />
      </button>

      {showMore && (
        <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-200/80 pt-3">
          {secondary.map((p) => platformButton(p, true))}
        </div>
      )}

      {variant === "full" && (
        <button
          type="button"
          onClick={() => setShowCopyText((v) => !v)}
          className="mt-4 text-[11px] font-medium text-slate-500 underline-offset-2 hover:text-brand-700 hover:underline"
        >
          {lang === "he"
            ? showCopyText
              ? "הסתר טקסט לפרסום"
              : "הצג טקסט לפרסום"
            : showCopyText
              ? "Hide promo text"
              : "Show promo text"}
        </button>
      )}

      {showCopyText && variant === "full" && (
        <pre className="mt-2 max-h-32 overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-[11px] leading-relaxed text-slate-600">
          {content.text}
        </pre>
      )}

      {status && (
        <p className="mt-2 text-center text-[11px] text-teal-700">{status}</p>
      )}
    </div>
  );
}
