"use client";

import { useMemo, useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import {
  professionals,
  roleFilters,
  roleLabels,
} from "@/data/professionals";
import type { Professional } from "@/lib/types";

export default function ProfessionalsPage() {
  const [filter, setFilter] = useState<Professional["role"] | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return professionals.filter((p) => {
      if (filter !== "all" && p.role !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  return (
    <div>
      <PageHeader
        title="אנשי מקצוע"
        subtitle="עורכי דין, טוענים רבניים ומגשרים — רשימה לדוגמה"
      />

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        הרשימה להמחשה בלבד. לפני פנייה — ודא/י רישוי, ניסיון והמלצות.
        האפליקציה אינה אחראית על איכות השירות.
      </div>

      <input
        type="search"
        placeholder="חיפוש לפי שם, עיר או התמחות..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {roleFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === f.value
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((pro) => (
          <Card key={pro.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                  {roleLabels[pro.role]}
                </span>
                <h2 className="mt-2 font-semibold text-slate-900">{pro.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{pro.specialty}</p>
                <p className="mt-1 text-sm text-slate-500">{pro.city}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {pro.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                >
                  {lang}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-3 text-sm">
              {pro.phone && (
                <a href={`tel:${pro.phone}`} className="text-brand-700 underline">
                  {pro.phone}
                </a>
              )}
              {pro.email && (
                <a
                  href={`mailto:${pro.email}`}
                  className="text-brand-700 underline"
                >
                  אימייל
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500">לא נמצאו תוצאות</p>
      )}
    </div>
  );
}
