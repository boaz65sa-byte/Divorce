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
import { formatCurrency } from "@/lib/exportReport";
import {
  calcJournalSplit,
  useProfileStore,
} from "@/lib/store/profileStore";
import type { JournalEntry } from "@/lib/types";

const categoryLabels: Record<JournalEntry["category"], string> = {
  education: "חינוך",
  health: "בריאות",
  activities: "חוגים / פעילות",
  clothing: "ביגוד",
  other: "אחר",
};

export default function JournalPage() {
  const profile = useProfileStore((s) => s.profile);
  const journal = useProfileStore((s) => s.journal);
  const addJournalEntry = useProfileStore((s) => s.addJournalEntry);
  const removeJournalEntry = useProfileStore((s) => s.removeJournalEntry);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<JournalEntry["category"]>("other");
  const [paidBy, setPaidBy] = useState<"a" | "b">("a");

  const split = useMemo(
    () =>
      calcJournalSplit(
        journal,
        profile.incomeA,
        profile.incomeB,
        profile.parentAName,
        profile.parentBName,
      ),
    [journal, profile],
  );

  const handleAdd = () => {
    const num = Number(amount);
    if (!description.trim() || num <= 0) return;
    addJournalEntry({
      date,
      description: description.trim(),
      amount: num,
      category,
      paidBy,
    });
    setDescription("");
    setAmount("");
  };

  const reportSections = [
    {
      title: "סיכום יומן הוצאות",
      lines: [
        `סה"כ הוצאות: ${formatCurrency(split.total)}`,
        `${profile.parentAName} שילם: ${formatCurrency(split.paidByA)}`,
        `${profile.parentBName} שילם: ${formatCurrency(split.paidByB)}`,
        `חלק הוגן ${profile.parentAName}: ${formatCurrency(split.fairShareA)}`,
        `חלק הוגן ${profile.parentBName}: ${formatCurrency(split.fairShareB)}`,
        split.owedAmount > 0
          ? `${split.owedFrom} חייב/ת ${formatCurrency(split.owedAmount)} ל${split.owedTo}`
          : "אין יתרה לחלוקה",
      ],
    },
    {
      title: "פירוט",
      lines: journal.map(
        (e) =>
          `${e.date} | ${categoryLabels[e.category]} | ${e.description} | ${formatCurrency(e.amount)} | ${e.paidBy === "a" ? profile.parentAName : profile.parentBName}`,
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="יומן הוצאות ילדים"
        subtitle="תיעוד הוצאות וחלוקה לפי יחס הכנסות"
      />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatBox label="סה״כ הוצאות" value={formatCurrency(split.total)} highlight />
        <StatBox
          label="יתרה לחלוקה"
          value={
            split.owedAmount > 0
              ? `${split.owedFrom} → ${split.owedTo}: ${formatCurrency(split.owedAmount)}`
              : "מאוזן"
          }
        />
      </div>

      <div className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <Input label="תיאור" value={description} onChange={setDescription} />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="סכום (₪)"
            type="number"
            value={amount}
            onChange={setAmount}
          />
          <Input label="תאריך" type="date" value={date} onChange={setDate} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="קטגוריה"
            value={category}
            onChange={(v) => setCategory(v as JournalEntry["category"])}
            options={Object.entries(categoryLabels).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Select
            label="שולם על ידי"
            value={paidBy}
            onChange={(v) => setPaidBy(v as "a" | "b")}
            options={[
              { value: "a", label: profile.parentAName },
              { value: "b", label: profile.parentBName },
            ]}
          />
        </div>
        <Button onClick={handleAdd} className="w-full">
          + הוסף הוצאה
        </Button>
      </div>

      {journal.length > 0 && (
        <>
          <ul className="mb-6 space-y-2">
            {journal.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{entry.description}</p>
                  <p className="text-slate-500">
                    {new Date(entry.date).toLocaleDateString("he-IL")} ·{" "}
                    {categoryLabels[entry.category]} ·{" "}
                    {entry.paidBy === "a"
                      ? profile.parentAName
                      : profile.parentBName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{formatCurrency(entry.amount)}</span>
                  <button
                    type="button"
                    onClick={() => removeJournalEntry(entry.id)}
                    className="text-xs text-red-500"
                  >
                    מחק
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <ExportButtons
            title="יומן הוצאות ילדים"
            sections={reportSections}
            disclaimer="הערכה בלבד — לא ייעוץ משפטי."
            filename="yoman-hotzaot.txt"
          />
        </>
      )}

      {journal.length === 0 && (
        <p className="text-center text-slate-500">עדיין אין הוצאות מתועדות</p>
      )}
    </div>
  );
}
