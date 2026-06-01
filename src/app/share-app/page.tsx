"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { SocialShareButtons } from "@/components/share/SocialShareButtons";
import { buildQrUrl } from "@/lib/shareCalc";
import { getAppShareUrl } from "@/lib/share/socialShare";
import { BRAND } from "@/lib/brand/brand";

export default function ShareAppPage() {
  const [lang, setLang] = useState<"he" | "en">("he");
  const [showQr, setShowQr] = useState(false);
  const shareUrl = getAppShareUrl();

  return (
    <div>
      <PageHeader
        title={lang === "he" ? "שיתוף" : "Share"}
        subtitle={
          lang === "he"
            ? "עזור/י למישהו שצריך — בלי לפרסם את הפרטים האישיים שלך"
            : "Help someone who needs it — without exposing your private data"
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

      <SocialShareButtons lang={lang} url={shareUrl} variant="full" />

      <button
        type="button"
        onClick={() => setShowQr((v) => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
      >
        <span>{lang === "he" ? "QR לשיתוף" : "Share QR code"}</span>
        <ChevronDown
          className={`h-4 w-4 transition ${showQr ? "rotate-180" : ""}`}
        />
      </button>

      {showQr && (
        <div className="mt-2 rounded-2xl border border-slate-200/80 bg-white p-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={buildQrUrl(shareUrl, 180)}
            alt={`QR ${BRAND.name}`}
            width={180}
            height={180}
            className="mx-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
