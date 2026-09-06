"use client";

import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { officialProfessionalResources } from "@/data/professionals";

export default function ProfessionalsPage() {
  return (
    <div>
      <PageHeader
        title="אנשי מקצוע — קישורים רשמיים"
        subtitle="מידע ציבורי בלבד · לא מדריך עורכי דין"
      />

      <div
        className="mb-5 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-4 text-sm text-amber-950"
        role="status"
      >
        <p className="font-bold">חשוב לדעת</p>
        <p className="mt-2 leading-relaxed">
          האפליקציה <strong>אינה</strong> מציגה רשימת עורכי דין אמיתיים,{" "}
          <strong>אינה</strong> מפנה לאנשי מקצוע, ו<strong>אינה</strong> ממליצה על
          עורכי דין, טוענים רבניים או מגשרים. דוגמאות פיקטיביות עם מספרי טלפון
          הוסרו. למטה מופיעים רק קישורים לאתרים ציבוריים ורשמיים שבהם ניתן
          לחפש מידע בעצמכם.
        </p>
      </div>

      <div className="space-y-3">
        {officialProfessionalResources.map((resource) => (
          <Card key={resource.id}>
            <h2 className="font-semibold text-slate-900">{resource.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{resource.description}</p>
            <a
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-brand-700 underline"
            >
              פתיחת הקישור הרשמי
            </a>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        איש מקצוע שרוצה להופיע בעתיד?{" "}
        <Link href="/feedback" className="font-semibold text-brand-700 underline">
          שלחו משוב
        </Link>
      </p>
    </div>
  );
}
