"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ExportButtons,
  Input,
  PageHeader,
  Select,
  StatBox,
} from "@/components/ui";
import { ChildrenEditor } from "@/components/ChildrenEditor";
import {
  CHILD_SUPPORT_END_AGE,
  calcChildSupport,
  formatCurrency,
  formatSupportDuration,
} from "@/lib/calc/childSupport";
import { buildShareUrl } from "@/lib/shareCalc";
import { useProfileStore } from "@/lib/store/profileStore";
import type { ChildProfile, CourtType } from "@/lib/types";

function defaultChildren(): ChildProfile[] {
  return [
    {
      id: crypto.randomUUID(),
      age: 8,
      daysWithParentA: 7,
    },
  ];
}

export default function ChildSupportCalculatorPage() {
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);

  const [court, setCourt] = useState<CourtType>(profile.court);
  const [incomeA, setIncomeA] = useState(profile.incomeA || 12000);
  const [incomeB, setIncomeB] = useState(profile.incomeB || 8000);
  const [housingCost, setHousingCost] = useState(4500);
  const [children, setChildren] = useState<ChildProfile[]>(
    profile.hasChildren && profile.children.length > 0
      ? profile.children
      : defaultChildren(),
  );
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (profile.hasChildren && profile.children.length > 0) {
      setChildren(profile.children);
    }
  }, [profile.children, profile.hasChildren]);

  const result = useMemo(
    () =>
      calcChildSupport({
        children: children.map(({ age, daysWithParentA }) => ({
          age,
          daysWithParentA,
        })),
        incomeA,
        incomeB,
        housingCost,
        court,
        parentAIsFather: true,
      }),
    [children, incomeA, incomeB, housingCost, court],
  );

  const payerLabel =
    result.direction === "a-to-b"
      ? `${profile.parentAName} → ${profile.parentBName}`
      : result.direction === "b-to-a"
        ? `${profile.parentBName} → ${profile.parentAName}`
        : "אין תשלום נטו";

  const handleCalculate = () => {
    setProfile({
      hasChildren: children.length > 0,
      children,
      incomeA,
      incomeB,
      court,
    });
    setShowResult(true);
  };

  return (
    <div>
      <PageHeader
        title="מחשבון מזונות ילדים"
        subtitle={`לפי 919/15 (גיל 6+) וחובת אב (עד גיל 6) · מזונות עד גיל ${CHILD_SUPPORT_END_AGE}`}
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

        <div>
          <p className="mb-3 text-sm font-medium text-slate-700">ילדים</p>
          <ChildrenEditor
            children={children}
            onChange={setChildren}
            parentAName={profile.parentAName}
          />
        </div>

        <Button onClick={handleCalculate} className="w-full">
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
            <StatBox
              label="משך תשלום (הילד האחרון)"
              value={formatSupportDuration(result.longestRemainingMonths)}
            />
          </div>

          {result.totalEstimatedRemaining > 0 && (
            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm font-semibold text-teal-900">
                הערכת סה&quot;כ עד סיום מזונות (כל הילדים)
              </p>
              <p className="mt-1 text-2xl font-black text-teal-800">
                ~{formatCurrency(result.totalEstimatedRemaining)}
              </p>
              <p className="mt-2 text-xs text-teal-700">
                מבוסס על התשלום החודשי הנוכחי × חודשים שנותרו עד גיל{" "}
                {CHILD_SUPPORT_END_AGE}. הסכום בפועל משתנה (שינויי הכנסה, שהות,
                צרכים).
              </p>
            </div>
          )}

          {result.breakdown.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="mb-3 font-semibold">פירוט לפי ילד</h3>
              <ul className="space-y-3 text-sm">
                {result.breakdown.map((row, i) => {
                  const duration = result.durations[i];
                  return (
                    <li
                      key={i}
                      className="rounded-xl bg-slate-50 px-3 py-2"
                    >
                      <div className="flex justify-between">
                        <span>
                          גיל {row.age} (
                          {row.rule === "under6" ? "עד 6" : "919/15"})
                        </span>
                        <span className="font-medium">
                          {formatCurrency(Math.abs(row.transferFromAToB))} / חודש
                        </span>
                      </div>
                      {duration && (
                        <p className="mt-1 text-xs text-slate-500">
                          נותרו {formatSupportDuration(duration.monthsRemaining)}{" "}
                          · הערכה כוללת ~
                          {formatCurrency(duration.estimatedRemainingTotal)}
                        </p>
                      )}
                    </li>
                  );
                })}
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
                  `משך (הילד האחרון): ${formatSupportDuration(result.longestRemainingMonths)}`,
                  `הערכת סה"כ עד גיל ${CHILD_SUPPORT_END_AGE}: ~${formatCurrency(result.totalEstimatedRemaining)}`,
                ],
              },
              {
                title: "פירוט ילדים",
                lines: result.durations.map(
                  (d) =>
                    `גיל ${d.age}: ${formatSupportDuration(d.monthsRemaining)} · ~${formatCurrency(d.estimatedRemainingTotal)}`,
                ),
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
                daysWithA: children[0]?.daysWithParentA ?? 7,
                childAge: children[0]?.age ?? 8,
                children: children.map(({ age, daysWithParentA }) => ({
                  age,
                  daysWithParentA,
                })),
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
