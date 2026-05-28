"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { knowledgeTopics } from "@/data/knowledge";

export default function KnowledgePage() {
  const [query, setQuery] = useState("");

  const filtered = knowledgeTopics.filter(
    (topic) =>
      topic.title.includes(query) ||
      topic.summary.includes(query) ||
      topic.tags.some((tag) => tag.includes(query)),
  );

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
        className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />

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
