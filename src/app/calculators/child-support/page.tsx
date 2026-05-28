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
import {
  calcChildSupport,
  formatCurrency,
} from "@/lib/calc/childSupport";
import { buildShareUrl } from "@/lib/shareCalc";
import { useProfileStore } from "@/lib/store/profileStore";
import type { CourtType } from "@/lib/types";

export default function ChildSupportCalculatorPage() {
  const profile = useProfileStore((s) => s.profile);

  const [court, setCourt] = useState<CourtType>(profile.court);
  const [incomeA, setIncomeA] = useState(profile.incomeA || 12000);
  const [incomeB, setIncomeB] = useState(profile.incomeB || 8000);
  const [housingCost, setHousingCost] = useState(4500);
  const [childAge, setChildAge] = useState(8);
  const [daysWithA, setDaysWithA] = useState(6);
  const [childAge2, setChildAge2] = useState(0);
  const [hasSecondChild, setHasSecondChild] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const children = [{ age: childAge, daysWithParentA: daysWithA }];
    if (hasSecondChild && childAge2 > 0) {
      children.push({ age: childAge2, daysWithParentA: daysWithA });
    }

    return calcChildSupport({
      children,
      incomeA,
      incomeB,
      housingCost,
      court,
      parentAIsFather: true,
    });
  }, [
    childAge,
    daysWithA,
    childAge2,
    hasSecondChild,
    incomeA,
    incomeB,
    housingCost,
    court,
  ]);

  const payerLabel =
    result.direction === "a-to-b"
      ? `${profile.parentAName} → ${profile.parentBName}`
      : result.direction === "b-to-a"
        ? `${profile.parentBName} → ${profile.parentAName}`
        : "אין תשלום נטו";

  return (
    <div>
      <PageHeader
        title="מחשבון מזונות ילדים"
        subtitle="לפי הלכת 919/15 (גיל 6+) וחובת אב (עד גיל 6)"
      />

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <Select
          label="ערכאה"
          value={court}
          onChange={(v) => setCourt(v as CourtType)}
          options={[
            { value: "family", label: "בית משפט למשפחה (919/15)" },
            { value: "rabbinical", label: "בית דין רבני (הערכה)" },
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={`הכנסה נטו — ${profile.parentAName}`}
            type="number"
            value={incomeA}
            onChange={(v) => setIncomeA(Number(v) || 0)}
          />
          <Input
            label={`הכנסה נטו — ${profile.parentBName}`}
            type="number"
            value={incomeB}
            onChange={(v) => setIncomeB(Number(v) || 0)}
          />
        </div>

        <Input
          label="עלות מדור / שכירות (₪)"
          type="number"
          value={housingCost}
          onChange={(v) => setHousingCost(Number(v) || 0)}
          hint="הוצאות דיור בבית הילד"
        />

        <Input
          label="גיל ילד/ה 1"
          type="number"
          min={0}
          max={17}
          value={childAge}
          onChange={(v) => setChildAge(Number(v) || 0)}
        />

        <Select
          label="לילות אצל הורה א' (מתוך 14)"
          value={String(daysWithA)}
          onChange={(v) => setDaysWithA(Number(v))}
          options={[
            { value: "7", label: "7 — משמורת משותפת" },
            { value: "6", label: "6 לילות" },
            { value: "5", label: "5 לילות" },
            { value: "4", label: "4 לילות" },
            { value: "2", label: "2 לילות" },
            { value: "0", label: "ללא לינה" },
          ]}
        />

        <Select
          label="ילד/ה נוסף/ת?"
          value={hasSecondChild ? "yes" : "no"}
          onChange={(v) => setHasSecondChild(v === "yes")}
          options={[
            { value: "no", label: "לא" },
            { value: "yes", label: "כן" },
          ]}
        />

        {hasSecondChild && (
          <Input
            label="גיל ילד/ה 2"
            type="number"
            min={0}
            max={17}
            value={childAge2}
            onChange={(v) => setChildAge2(Number(v) || 0)}
          />
        )}

        <Button onClick={() => setShowResult(true)} className="w-full">
          חשב מזונות
        </Button>
      </div>

      {showResult && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="תשלום חודשי נטו"
              value={formatCurrency(result.amount)}
              highlight
            />
            <StatBox label="כיוון" value={payerLabel} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="ילדים עד 6"
              value={formatCurrency(result.under6Total)}
            />
            <StatBox
              label="ילדים 6+ (919)"
              value={formatCurrency(Math.abs(result.over6Transfer))}
            />
            <StatBox
              label="מדור"
              value={formatCurrency(Math.abs(result.housingTransfer))}
            />
          </div>

          {result.breakdown.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="mb-3 font-semibold">פירוט לפי ילד</h3>
              <ul className="space-y-2 text-sm">
                {result.breakdown.map((row, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-slate-100 pb-2"
                  >
                    <span>
                      גיל {row.age} ({row.rule === "under6" ? "עד 6" : "919/15"})
                    </span>
                    <span className="font-medium">
                      {formatCurrency(Math.abs(row.transferFromAToB))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ExportButtons
            title="מזונות ילדים"
            sections={[
              {
                title: "תוצאה",
                lines: [
                  `תשלום נטו: ${formatCurrency(result.amount)}`,
                  `כיוון: ${payerLabel}`,
                  `ילדים עד 6: ${formatCurrency(result.under6Total)}`,
                  `ילדים 6+: ${formatCurrency(Math.abs(result.over6Transfer))}`,
                  `מדור: ${formatCurrency(Math.abs(result.housingTransfer))}`,
                ],
              },
            ]}
            disclaimer={result.disclaimer}
            filename="mezonot-yeladim.txt"
          />

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              const payload = {
                type: "child-support" as const,
                incomeA,
                incomeB,
                housingCost,
                childAge,
                daysWithA,
                court,
              };
              const url = buildShareUrl(payload);
              navigator.clipboard.writeText(url).catch(() => {});
              window.open(url, "_blank");
            }}
          >
            שתף/י חישוב עם הורה שני (קישור + QR)
          </Button>

          <p className="text-xs text-slate-500">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
