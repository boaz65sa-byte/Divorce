"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { SocialShareButtons } from "@/components/share/SocialShareButtons";
import { buildQrUrl } from "@/lib/shareCalc";
import { getAppShareUrl, getDefaultShareContent } from "@/lib/share/socialShare";
import { BRAND } from "@/lib/brand/brand";

export default function ShareAppPage() {
  const [lang, setLang] = useState<"he" | "en">("he");
  const shareUrl = getAppShareUrl();
  const content = getDefaultShareContent(lang, shareUrl);

  return (
    <div>
      <PageHeader
        title={lang === "he" ? "שיתוף האפליקציה" : "Share the app"}
        subtitle={
          lang === "he"
            ? "דחף/י ברשתות — עזור/י להורים שמתמודדים עם גירושין"
            : "Share on social — help parents going through divorce"
        }
      />

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setLang("he")}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            lang === "he" ? "bs-badge text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          עברית
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            lang === "en" ? "bs-badge text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          English
        </button>
      </div>

      <SocialShareButtons lang={lang} url={shareUrl} />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-center">
        <p className="mb-3 text-sm font-medium text-slate-700">
          {lang === "he" ? "QR לשיתוף מהיר" : "QR for quick sharing"}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={buildQrUrl(shareUrl, 220)}
          alt={`QR ${BRAND.name}`}
          width={220}
          height={220}
          className="mx-auto rounded-xl border border-slate-100"
        />
        <p className="mt-3 break-all text-xs text-slate-500" dir="ltr">
          {shareUrl}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-900">
        <p className="font-semibold">
          {lang === "he" ? "טקסט מוכן להעתקה" : "Ready-to-copy text"}
        </p>
        <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">
          {content.text}
        </pre>
      </div>
    </div>
  );
}
