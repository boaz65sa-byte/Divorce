"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Input,
  PageHeader,
  Select,
  StatBox,
} from "@/components/ui";
import { calcAllExpenses, splitExpense } from "@/lib/calc/expenseSplit";
import { formatCurrency } from "@/lib/calc/childSupport";
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
    split: "by-income",
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
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [incomeA, setIncomeA] = useState(profile.incomeA || 12000);
  const [incomeB, setIncomeB] = useState(profile.incomeB || 8000);

  const totals = useMemo(
    () => calcAllExpenses(expenses, incomeA, incomeB),
    [expenses, incomeA, incomeB],
  );

  const updateExpense = (id: string, patch: Partial<ExpenseItem>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e)),
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

  return (
    <div>
      <PageHeader
        title="חלוקת הוצאות"
        subtitle="חלוקה באחוזים — 50/50, לפי הכנסות, או מותאם"
      />

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
          const split = splitExpense(expense, incomeA, incomeB);
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
                  options={[
                    { value: "50-50", label: "50% / 50%" },
                    { value: "by-income", label: "לפי הכנסות" },
                    { value: "custom", label: "אחוזים מותאמים" },
                  ]}
                />
              </div>

              {expense.split === "custom" && (
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

              <div className="mt-3 flex justify-between text-sm text-slate-600">
                <span>
                  {profile.parentAName}: {formatCurrency(split.parentA)}
                </span>
                <span>
                  {profile.parentBName}: {formatCurrency(split.parentB)}
                </span>
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
    </div>
  );
}
