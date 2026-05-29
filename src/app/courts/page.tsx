"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { courtComparison } from "@/data/process";
import {
  getReligiousCourt,
  religiousCourts,
  religionLabels,
} from "@/data/religiousCourts";
import { useProfileStore } from "@/lib/store/profileStore";

export default function CourtsPage() {
  const religion = useProfileStore((s) => s.profile.religion) ?? "jewish";
  const myCourt = getReligiousCourt(religion);

  return (
    <div>
      <Link href="/" className="mb-4 inline-block text-sm text-brand-700">
        ← חזרה לבית
      </Link>

      <PageHeader
        title="ערכאות ודין אישי"
        subtitle="השוואה לפי דת/עדה + רבני vs משפחה"
      />

      <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm font-semibold text-brand-900">
          הפרופיל שלך: {religionLabels[religion]}
        </p>
        <p className="mt-2 text-sm text-brand-800">
          <strong>ערכת גירושין:</strong> {myCourt.divorceCourt}
        </p>
        <p className="mt-1 text-sm text-brand-800">
          <strong>תהליך:</strong> {myCourt.divorceProcess}
        </p>
      </div>

      <h2 className="mb-3 font-semibold text-slate-900">כל העדות</h2>
      <div className="space-y-3">
        {religiousCourts.map((court) => (
          <div
            key={court.religion}
            className={`rounded-2xl border p-4 ${
              court.religion === religion
                ? "border-brand-300 bg-brand-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <h3 className="font-semibold text-slate-900">{court.label}</h3>
            <dl className="mt-2 space-y-1 text-sm text-slate-700">
              <div>
                <dt className="font-medium">גירושין</dt>
                <dd>{court.divorceCourt}</dd>
              </div>
              <div>
                <dt className="font-medium">רכוש</dt>
                <dd>{court.propertyLaw}</dd>
              </div>
              <div>
                <dt className="font-medium">מזונות</dt>
                <dd>{court.childSupport}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-semibold text-slate-900">
        יהודים — רבני vs משפחה
      </h2>
      <Link
        href="/compare"
        className="mb-3 inline-block text-sm font-medium text-brand-700 hover:underline"
      >
        השוואה אינטראקטיבית מלאה →
      </Link>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-3 text-right font-semibold">נושא</th>
              <th className="p-3 text-right font-semibold">רבני</th>
              <th className="p-3 text-right font-semibold">משפחה</th>
            </tr>
          </thead>
          <tbody>
            {courtComparison.map((row) => (
              <tr key={row.topic} className="border-b border-slate-100">
                <td className="p-3 font-medium">{row.topic}</td>
                <td className="p-3 text-slate-700">{row.rabbinical}</td>
                <td className="p-3 text-slate-700">{row.family}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
