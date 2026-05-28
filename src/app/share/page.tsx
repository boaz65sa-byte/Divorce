"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import Link from "next/link";
import { PageHeader, StatBox } from "@/components/ui";
import { calcChildSupport } from "@/lib/calc/childSupport";
import { formatCurrency } from "@/lib/exportReport";
import { buildQrUrl, decodeSharePayload } from "@/lib/shareCalc";
import { useProfileStore } from "@/lib/store/profileStore";

function ShareContent() {
  const searchParams = useSearchParams();
  const profile = useProfileStore((s) => s.profile);
  const encoded = searchParams.get("d");

  const payload = useMemo(
    () => (encoded ? decodeSharePayload(encoded) : null),
    [encoded],
  );

  const result = useMemo(() => {
    if (!payload) return null;
    return calcChildSupport({
      children: [
        { age: payload.childAge, daysWithParentA: payload.daysWithA },
      ],
      incomeA: payload.incomeA,
      incomeB: payload.incomeB,
      housingCost: payload.housingCost,
      court: payload.court,
      parentAIsFather: true,
    });
  }, [payload]);

  if (!payload || !result) {
    return (
      <div className="text-center">
        <p className="text-slate-600">קישור לא תקין או שפג תוקפו.</p>
        <Link href="/calculators/child-support" className="mt-4 inline-block text-brand-700 underline">
          למחשבון מזונות
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const payerLabel =
    result.direction === "a-to-b"
      ? `${profile.parentAName} → ${profile.parentBName}`
      : result.direction === "b-to-a"
        ? `${profile.parentBName} → ${profile.parentAName}`
        : "אין תשלום נטו";

  return (
    <div>
      <PageHeader
        title="חישוב משותף"
        subtitle="מזונות ילדים — שיתוף בין הורים"
      />

      <div className="grid grid-cols-2 gap-3">
        <StatBox
          label="תשלום חודשי"
          value={formatCurrency(result.amount)}
          highlight
        />
        <StatBox label="כיוון" value={payerLabel} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p>גיל ילד/ה: {payload.childAge}</p>
        <p>לילות אצל הורה א': {payload.daysWithA}/14</p>
        <p>הכנסה א': {formatCurrency(payload.incomeA)}</p>
        <p>הכנסה ב': {formatCurrency(payload.incomeB)}</p>
        <p>מדור: {formatCurrency(payload.housingCost)}</p>
      </div>

      {shareUrl && (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">QR לשיתוף</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={buildQrUrl(shareUrl)}
            alt="QR code"
            width={180}
            height={180}
            className="rounded-lg"
          />
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">{result.disclaimer}</p>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<p className="text-center text-slate-500">טוען...</p>}>
      <ShareContent />
    </Suspense>
  );
}
