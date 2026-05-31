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
  calcAllExpenses,
  defaultChildPercents,
  splitExpense,
} from "@/lib/calc/expenseSplit";
import { formatCurrency } from "@/lib/exportReport";
import { useProfileStore } from "@/lib/store/profileStore";
import type { ExpenseItem, ExpenseSplitMode } from "@/lib/types";

const defaultExpenses: ExpenseItem[] = [
  {
    id: "1",
    name: "חינוך (מחצית)",
    amount: 800,
    split: "50-50",
  },
  {
    id: "2",
    name: "קייטנה",
    amount: 600,
    split: "by-children",
    percentA: 40,
    percentB: 40,
    childPercents: [10, 10],
  },
  {
    id: "3",
    name: "ביטוח בריאות ילדים",
    amount: 400,
    split: "50-50",
  },
];

export default function ExpensesCalculatorPage() {
  const profile = useProfileStore((s) => s.profile);
  const childCount = profile.hasChildren ? profile.children.length : 0;
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() =>
    childCount >= 2
      ? defaultExpenses
      : defaultExpenses.map((expense) =>
          expense.split === "by-children"
            ? {
                ...expense,
                split: "by-income" as const,
                childPercents: undefined,
              }
            : expense,
        ),
  );
  const [incomeA, setIncomeA] = useState(profile.incomeA || 12000);
  const [incomeB, setIncomeB] = useState(profile.incomeB || 8000);

  const totals = useMemo(
    () => calcAllExpenses(expenses, incomeA, incomeB, childCount),
    [expenses, incomeA, incomeB, childCount],
  );

  const updateExpense = (id: string, patch: Partial<ExpenseItem>) => {
    setExpenses((prev) =>
      prev.map((expense) => {
        if (expense.id !== id) return expense;
        const next = { ...expense, ...patch };
        if (patch.split === "by-children" && childCount > 0) {
          next.percentA = next.percentA ?? 40;
          next.percentB = next.percentB ?? 40;
          next.childPercents =
            next.childPercents && next.childPercents.length === childCount
              ? next.childPercents
              : defaultChildPercents(childCount);
        }
        return next;
      }),
    );
  };

  const updateChildPercent = (
    expenseId: string,
    childIndex: number,
    value: number,
  ) => {
    setExpenses((prev) =>
      prev.map((expense) => {
        if (expense.id !== expenseId) return expense;
        const childPercents = [
          ...(expense.childPercents ?? defaultChildPercents(childCount)),
        ];
        childPercents[childIndex] = value;
        return { ...expense, childPercents };
      }),
    );
  };

  const addExpense = () => {
    setExpenses((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "הוצאה חדשה",
        amount: 0,
        split: "50-50",
      },
    ]);
  };

  const splitOptions = [
    { value: "50-50", label: "50% / 50%" },
    { value: "by-income", label: "לפי הכנסות" },
    { value: "custom", label: "אחוזים מותאמים (הורים)" },
    ...(childCount > 0
      ? [{ value: "by-children", label: "הורים + ילדים" }]
      : []),
  ];

  const exportSections = [
    {
      title: "סיכום חודשי",
      lines: [
        `${profile.parentAName}: ${formatCurrency(totals.totalA)}`,
        `${profile.parentBName}: ${formatCurrency(totals.totalB)}`,
        ...totals.totalPerChild.map(
          (amount, index) =>
            `ילד/ה ${index + 1} (הוצאה ישירה): ${formatCurrency(amount)}`,
        ),
      ],
    },
    {
      title: "פירוט הוצאות",
      lines: totals.rows.map((row) => {
        const childPart =
          row.perChild.length > 0
            ? ` · ילדים: ${row.perChild.map((amount) => formatCurrency(amount)).join(", ")}`
            : "";
        return `${row.name}: ${formatCurrency(row.amount)} → ${profile.parentAName} ${formatCurrency(row.parentA)}, ${profile.parentBName} ${formatCurrency(row.parentB)}${childPart}`;
      }),
    },
  ];

  return (
    <div>
      <PageHeader
        title="חלוקת הוצאות"
        subtitle="50/50, לפי הכנסות, מותאם — או חלוקה גם לילדים"
      />

      {childCount === 0 && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          להוספת חלוקה לפי ילדים — הגדירו ילדים ב
          <a href="/settings" className="mx-1 font-semibold underline">
            הגדרות פרופיל
          </a>
        </p>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Input
          label={`הכנסה — ${profile.parentAName}`}
          type="number"
          value={incomeA}
          onChange={(v) => setIncomeA(Number(v) || 0)}
        />
        <Input
          label={`הכנסה — ${profile.parentBName}`}
          type="number"
          value={incomeB}
          onChange={(v) => setIncomeB(Number(v) || 0)}
        />
      </div>

      <div className="space-y-4">
        {expenses.map((expense) => {
          const split = splitExpense(expense, incomeA, incomeB, childCount);
          return (
            <div
              key={expense.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <Input
                label="שם הוצאה"
                value={expense.name}
                onChange={(v) => updateExpense(expense.id, { name: v })}
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Input
                  label="סכום (₪)"
                  type="number"
                  value={expense.amount}
                  onChange={(v) =>
                    updateExpense(expense.id, { amount: Number(v) || 0 })
                  }
                />
                <Select
                  label="שיטת חלוקה"
                  value={expense.split}
                  onChange={(v) =>
                    updateExpense(expense.id, {
                      split: v as ExpenseSplitMode,
                    })
                  }
                  options={splitOptions}
                />
              </div>

              {(expense.split === "custom" ||
                expense.split === "by-children") && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Input
                    label={`% ${profile.parentAName}`}
                    type="number"
                    value={expense.percentA ?? 50}
                    onChange={(v) =>
                      updateExpense(expense.id, {
                        percentA: Number(v) || 0,
                      })
                    }
                  />
                  <Input
                    label={`% ${profile.parentBName}`}
                    type="number"
                    value={expense.percentB ?? 50}
                    onChange={(v) =>
                      updateExpense(expense.id, {
                        percentB: Number(v) || 0,
                      })
                    }
                  />
                </div>
              )}

              {expense.split === "by-children" && childCount > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {profile.children.map((child, index) => (
                    <Input
                      key={child.id}
                      label={`% ילד/ה ${index + 1} (גיל ${child.age})`}
                      type="number"
                      value={
                        expense.childPercents?.[index] ??
                        defaultChildPercents(childCount)[index]
                      }
                      onChange={(v) =>
                        updateChildPercent(expense.id, index, Number(v) || 0)
                      }
                    />
                  ))}
                </div>
              )}

              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>{profile.parentAName}</span>
                  <span>{formatCurrency(split.parentA)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{profile.parentBName}</span>
                  <span>{formatCurrency(split.parentB)}</span>
                </div>
                {split.perChild.map((amount, index) => (
                  <div key={index} className="flex justify-between text-teal-700">
                    <span>ילד/ה {index + 1}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="secondary" onClick={addExpense} className="mt-4 w-full">
        + הוסף הוצאה
      </Button>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatBox
          label={`סה"כ — ${profile.parentAName}`}
          value={formatCurrency(totals.totalA)}
          highlight
        />
        <StatBox
          label={`סה"כ — ${profile.parentBName}`}
          value={formatCurrency(totals.totalB)}
          highlight
        />
      </div>

      {totals.totalPerChild.some((amount) => amount > 0) && (
        <div className="mt-3 rounded-2xl border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-900">חלק ישיר לילדים</p>
          <div className="mt-2 space-y-1 text-sm text-teal-800">
            {totals.totalPerChild.map((amount, index) => (
              <p key={index}>
                ילד/ה {index + 1}: {formatCurrency(amount)}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <ExportButtons
          title="חלוקת הוצאות"
          sections={exportSections}
          disclaimer="הערכה בלבד — לא ייעוץ משפטי."
          filename="halokat-hotzaot.txt"
        />
      </div>
    </div>
  );
}
