"use client";

import { useMemo, useState } from "react";
import {
  Button,
  ExportButtons,
  Input,
  PageHeader,
  Select,
  StatBox,
} from "@/components/ui";
import { calcSpousalSupport } from "@/lib/calc/spousalSupport";
import { formatCurrency } from "@/lib/exportReport";
import { useProfileStore } from "@/lib/store/profileStore";
import type { CourtType } from "@/lib/types";

export default function SpousalSupportPage() {
  const profile = useProfileStore((s) => s.profile);

  const [court, setCourt] = useState<CourtType>(profile.court);
  const [husbandIncome, setHusbandIncome] = useState(
    Math.max(profile.incomeA, profile.incomeB) || 18000,
  );
  const [wifeIncome, setWifeIncome] = useState(
    Math.min(profile.incomeA, profile.incomeB) || 4000,
  );
  const [marriageYears, setMarriageYears] = useState(7);
  const [wifeWorks, setWifeWorks] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () =>
      calcSpousalSupport({
        husbandIncome,
        wifeIncome,
        court,
        marriageYears,
        wifeWorks,
      }),
    [husbandIncome, wifeIncome, court, marriageYears, wifeWorks],
  );

  const reportSections = [
    {
      title: "נתונים",
      lines: [
        `ערכאה: ${court === "rabbinical" ? "בית דין רבני" : "בית משפט למשפחה"}`,
        `הכנסת בעל: ${formatCurrency(husbandIncome)}`,
        `הכנסת אישה: ${formatCurrency(wifeIncome)}`,
        `שנות נישואין: ${marriageYears}`,
        `האישה עובדת: ${wifeWorks ? "כן" : "לא"}`,
      ],
    },
    {
      title: "תוצאה",
      lines: [
        `טווח: ${formatCurrency(result.estimatedMin)} – ${formatCurrency(result.estimatedMax)}`,
        `אמצע: ${formatCurrency(result.estimatedMid)}`,
        `משך מוערך: ${result.durationMonths}`,
        ...result.factors.map((f) => `• ${f}`),
      ],
    },
  ];

  return (
    <div>
      <PageHeader
        title="מזונות אישה"
        subtitle="הערכה לפי ערכאה, הכנסות ומשך הנישואין"
      />

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <Select
          label="ערכאה"
          value={court}
          onChange={(v) => setCourt(v as CourtType)}
          options={[
            { value: "rabbinical", label: "בית דין רבני" },
            { value: "family", label: "בית משפט למשפחה" },
          ]}
        />

        <Input
          label="הכנסה נטו — בעל (₪)"
          type="number"
          value={husbandIncome}
          onChange={(v) => setHusbandIncome(Number(v) || 0)}
        />
        <Input
          label="הכנסה נטו — אישה (₪)"
          type="number"
          value={wifeIncome}
          onChange={(v) => setWifeIncome(Number(v) || 0)}
        />
        <Input
          label="משך הנישואין (שנים)"
          type="number"
          min={1}
          max={50}
          value={marriageYears}
          onChange={(v) => setMarriageYears(Number(v) || 1)}
        />
        <Select
          label="האישה עובדת?"
          value={wifeWorks ? "yes" : "no"}
          onChange={(v) => setWifeWorks(v === "yes")}
          options={[
            { value: "yes", label: "כן" },
            { value: "no", label: "לא / הכנסה מינימלית" },
          ]}
        />

        <Button onClick={() => setShowResult(true)} className="w-full">
          חשב הערכה
        </Button>
      </div>

      {showResult && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="טווח חודשי"
              value={`${formatCurrency(result.estimatedMin)} – ${formatCurrency(result.estimatedMax)}`}
              highlight
            />
            <StatBox
              label="אמצע משוער"
              value={formatCurrency(result.estimatedMid)}
              highlight
            />
          </div>

          <StatBox label="משך מוערך" value={result.durationMonths} />

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 font-semibold">גורמים בהערכה</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              {result.factors.map((factor) => (
                <li key={factor}>• {factor}</li>
              ))}
            </ul>
          </div>

          <ExportButtons
            title="מזונות אישה"
            sections={reportSections}
            disclaimer={result.disclaimer}
            filename="mezonot-isha.txt"
          />

          <p className="text-xs text-slate-500">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
