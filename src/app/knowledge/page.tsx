"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { BsSection } from "@/components/brand/BsSimple";
import { knowledgeTopics } from "@/data/knowledge";

type SideFilter = "all" | "a" | "b" | "both";

const sideLabels: Record<SideFilter, string> = {
  all: "הכל",
  a: "הורה א'",
  b: "הורה ב'",
  both: "שני הצדדים",
};

export default function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");

  const filtered = knowledgeTopics.filter((topic) => {
    const matchesQuery =
      topic.title.includes(query) ||
      topic.summary.includes(query) ||
      topic.tags.some((tag) => tag.includes(query));

    const matchesSide =
      sideFilter === "all" ||
      topic.forSide === sideFilter ||
      (sideFilter === "both" && topic.forSide === "both");

    return matchesQuery && matchesSide;
  });

  return (
    <div>
      <PageHeader
        title="מה החוק אומר"
        subtitle="זכויות, חובות ומידע משפטי כללי"
      />

      <input
        type="search"
        placeholder="חיפוש נושא..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bs-input mb-3 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none"
      />

      <BsSection accent="violet" className="mb-4">
        <p className="mb-2 text-xs font-medium text-slate-600">סינון לפי צד</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(sideLabels) as SideFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSideFilter(key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                sideFilter === key
                  ? "bs-badge text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sideLabels[key]}
            </button>
          ))}
        </div>
      </BsSection>

      <div className="space-y-3">
        {filtered.map((topic) => (
          <Card key={topic.id} href={`/knowledge/${topic.id}`}>
            <div className="flex flex-wrap gap-2">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                >
                  {tag}
                </span>
              ))}
              {topic.forSide && topic.forSide !== "both" && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                  {topic.forSide === "a" ? "הורה א'" : "הורה ב'"}
                </span>
              )}
            </div>
            <h2 className="mt-2 font-semibold text-slate-900">{topic.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{topic.summary}</p>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500">לא נמצאו תוצאות</p>
      )}

      <p className="mt-6 text-center text-sm">
        <Link
          href="https://www.kolzchut.org.il"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 underline"
        >
          מידע נוסף בכל-זכות →
        </Link>
      </p>
    </div>
  );
}
