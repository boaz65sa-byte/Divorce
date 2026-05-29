"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, PageHeader, Select } from "@/components/ui";
import { courtComparison } from "@/data/process";
import {
  getReligiousCourt,
  religionLabels,
} from "@/data/religiousCourts";
import { useProfileStore } from "@/lib/store/profileStore";
import type { CourtType } from "@/lib/types";

const courtTips: Record<
  CourtType,
  { title: string; points: string[]; calculator?: string }
> = {
  family: {
    title: "בית משפט לענייני משפחה",
    points: [
      "מזונות ילדים 6+ לפי הלכת 919/15 (הכנסות + שהות)",
      "מזונות אישה — לרוב תקופה מוגבלת + בחינת הכנסות",
      "מגמת משמורת משותפת ושיתוף פעולה",
      "אין סמכות על מתן גט ליהודים",
    ],
    calculator: "/calculators/child-support",
  },
  rabbinical: {
    title: "בית דין רבני",
    points: [
      "סמכות בלעדית על מתן גט (יהודים)",
      "עד גיל 6 — חובת אב במזונות (גישה מסורתית)",
      "מזונות אישה — עקרון \"עולה עמו\"",
      "919/15 — לא תמיד מיושם באופן זהה למשפחה",
    ],
    calculator: "/calculators/child-support",
  },
};

export default function ComparePage() {
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const [highlight, setHighlight] = useState<CourtType | "both">(
    profile.court,
  );
  const [topicFilter, setTopicFilter] = useState("all");

  const myCourt = getReligiousCourt(profile.religion);

  const filteredRows = useMemo(() => {
    if (topicFilter === "all") return courtComparison;
    return courtComparison.filter((row) =>
      row.topic.toLowerCase().includes(topicFilter),
    );
  }, [topicFilter]);

  const recommendation = useMemo(() => {
    if (profile.religion !== "jewish") {
      return `ל${religionLabels[profile.religion]} — הליך הגירושין ב${myCourt.divorceCourt}. נושאים נלווים (משמורת, מזונות) יכולים להידון גם בבית משפט למשפחה.`;
    }
    if (profile.court === "rabbinical") {
      return "בחרת בית דין דתי — הגט יינתן שם. מומלץ להשוות חישוב מזונות בשני המסלולים (919/15 vs גישה רבנית).";
    }
    return "בחרת בית משפט למשפחה — מתאים לנושאים נלווים. הגט ליהודים עדיין דורש בית דין רבני.";
  }, [profile.court, profile.religion, myCourt.divorceCourt]);

  return (
    <div>
      <Link href="/settings" className="mb-4 inline-block text-sm text-brand-700">
        ← חזרה להגדרות
      </Link>

      <PageHeader
        title="השוואת ערכאות"
        subtitle="רבני vs משפחה — מותאם לפרופיל שלך"
      />

      <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm font-semibold text-brand-900">המלצה לפי הפרופיל</p>
        <p className="mt-2 text-sm text-brand-800">{recommendation}</p>
        <p className="mt-2 text-xs text-brand-700">
          {religionLabels[profile.religion]} ·{" "}
          {profile.court === "rabbinical" ? "בית דין דתי" : "בית משפט למשפחה"}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Select
          label="הדגש עמודה"
          value={highlight}
          onChange={(v) => setHighlight(v as CourtType | "both")}
          options={[
            { value: "both", label: "שתי הערכאות" },
            { value: "rabbinical", label: "רבני" },
            { value: "family", label: "משפחה" },
          ]}
        />
        <Select
          label="סינון נושא"
          value={topicFilter}
          onChange={setTopicFilter}
          options={[
            { value: "all", label: "כל הנושאים" },
            { value: "מזונות", label: "מזונות" },
            { value: "משמורת", label: "משמורת" },
            { value: "גט", label: "גט" },
            { value: "רכוש", label: "רכוש" },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-3 text-right font-semibold">נושא</th>
              <th
                className={`p-3 text-right font-semibold ${
                  highlight === "rabbinical" || highlight === "both"
                    ? "bg-indigo-50 text-indigo-900"
                    : ""
                }`}
              >
                בית דין רבני
              </th>
              <th
                className={`p-3 text-right font-semibold ${
                  highlight === "family" || highlight === "both"
                    ? "bg-teal-50 text-teal-900"
                    : ""
                }`}
              >
                בית משפט למשפחה
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.topic} className="border-b border-slate-100">
                <td className="p-3 font-medium">{row.topic}</td>
                <td
                  className={`p-3 text-slate-700 ${
                    highlight === "rabbinical" || highlight === "both"
                      ? "bg-indigo-50/50"
                      : ""
                  } ${
                    profile.court === "rabbinical" ? "ring-1 ring-inset ring-indigo-200" : ""
                  }`}
                >
                  {row.rabbinical}
                </td>
                <td
                  className={`p-3 text-slate-700 ${
                    highlight === "family" || highlight === "both"
                      ? "bg-teal-50/50"
                      : ""
                  } ${
                    profile.court === "family" ? "ring-1 ring-inset ring-teal-200" : ""
                  }`}
                >
                  {row.family}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(Object.keys(courtTips) as CourtType[]).map((court) => {
          const tip = courtTips[court];
          const active = profile.court === court;
          return (
            <div
              key={court}
              className={`rounded-2xl border p-4 ${
                active
                  ? "border-brand-300 bg-brand-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-semibold text-slate-900">{tip.title}</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {tip.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              {tip.calculator && (
                <Link
                  href={tip.calculator}
                  className="mt-3 inline-block text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
                >
                  מחשבון מזונות →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm text-slate-600">
          עדכן/י את הערכאה בפרופיל — זה משפיע על צ&apos;ק-ליסט, מסלול ומחשבונים.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={profile.court === "rabbinical" ? "primary" : "secondary"}
            onClick={() => setProfile({ court: "rabbinical" })}
          >
            הערכאה שלי: רבני
          </Button>
          <Button
            variant={profile.court === "family" ? "primary" : "secondary"}
            onClick={() => setProfile({ court: "family" })}
          >
            הערכאה שלי: משפחה
          </Button>
        </div>
        <Link href="/courts" className="block text-sm text-brand-700 hover:underline">
          מידע נוסף על כל העדות →
        </Link>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        מידע כללי בלבד — לא ייעוץ משפטי. יש להתייעץ עם עורך/ת דין או טוען/ת רבני.
      </p>
    </div>
  );
}
