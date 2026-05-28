"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Input,
  PageHeader,
  Select,
  StatBox,
} from "@/components/ui";
import { calcBtlAllowance } from "@/lib/calc/btlAllowance";
import { formatCurrency } from "@/lib/exportReport";

export default function BtlCalculatorPage() {
  const [courtOrder, setCourtOrder] = useState(3500);
  const [children, setChildren] = useState(2);
  const [maritalStatus, setMaritalStatus] = useState<
    "single" | "remarried" | "separated"
  >("single");
  const [belowRetirement, setBelowRetirement] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () =>
      calcBtlAllowance({
        courtOrderAmount: courtOrder,
        childrenInCustody: children,
        maritalStatus,
        isBelowRetirementAge: belowRetirement,
      }),
    [courtOrder, children, maritalStatus, belowRetirement],
  );

  return (
    <div>
      <PageHeader
        title="קצבת מזונות — ביטוח לאומי"
        subtitle="הערכה לפי פסק דין שלא שולם — לא תחליף לפנייה לביטוח לאומי"
      />

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <Input
          label="סכום פסק הדין למזונות (₪/חודש)"
          type="number"
          value={courtOrder}
          onChange={(v) => setCourtOrder(Number(v) || 0)}
        />
        <Input
          label="מספר ילדים באחזקתך (0–18)"
          type="number"
          min={0}
          max={10}
          value={children}
          onChange={(v) => setChildren(Number(v) || 0)}
        />
        <Select
          label="מצב משפחתי"
          value={maritalStatus}
          onChange={(v) =>
            setMaritalStatus(v as "single" | "remarried" | "separated")
          }
          options={[
            { value: "single", label: "רווק/ה / גרוש/ה" },
            { value: "separated", label: "נשוי/אה — גרים בנפרד" },
            { value: "remarried", label: "נשוי/אה בשנית / ידוע/ה בציבור" },
          ]}
        />
        <Select
          label="מתחת לגיל פרישה?"
          value={belowRetirement ? "yes" : "no"}
          onChange={(v) => setBelowRetirement(v === "yes")}
          options={[
            { value: "yes", label: "כן" },
            { value: "no", label: "לא" },
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
              label="הערכת קצבה"
              value={
                result.eligible
                  ? formatCurrency(result.estimatedAllowance)
                  : "לא זכאי/ת"
              }
              highlight
            />
            <StatBox
              label="תקרה מקסימלית"
              value={formatCurrency(result.maxCap)}
            />
          </div>

          <ul className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            {result.reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>

          <a
            href="https://www.btl.gov.il/Simulators/Pages/mezonotCalc.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-brand-700 underline"
          >
            מחשבון רשמי בביטוח לאומי →
          </a>

          <p className="text-xs text-slate-500">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
