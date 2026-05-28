"use client";

import { Card, PageHeader } from "@/components/ui";

const calculators = [
  {
    href: "/calculators/child-support",
    title: "מזונות ילדים",
    description: "919/15, גיל 6-, מדור + שיתוף",
    tag: "P0",
  },
  {
    href: "/calculators/spousal-support",
    title: "מזונות אישה",
    description: "הערכה לפי ערכאה והכנסות",
    tag: "",
  },
  {
    href: "/calculators/btl",
    title: "קצבת ביטוח לאומי",
    description: "הערכה לפי פסק דין שלא שולם",
    tag: "חדש",
  },
  {
    href: "/calculators/expenses",
    title: "חלוקת הוצאות",
    description: "50/50, לפי הכנסות, מותאם",
    tag: "",
  },
  {
    href: "/calculators/assets",
    title: "איזון משאבים",
    description: "נכסים וחובות — 50/50",
    tag: "",
  },
];

const tools = [
  { href: "/calendar", title: "לוח משמורת", description: "שבתות, חגים, 2-2-3" },
  { href: "/journal", title: "יומן הוצאות", description: "תיעוד + חלוקה" },
  { href: "/agreement", title: "טיוטת הסכם", description: "מבוסס פרופיל" },
  { href: "/assistant", title: "עוזר חכם", description: "שאלות על החוק" },
  { href: "/professionals", title: "אנשי מקצוע", description: "עו\"ד, טוענים" },
];

export default function CalculatorsPage() {
  return (
    <div>
      <PageHeader
        title="מחשבונים וכלים"
        subtitle="הערכות לפי דין ופסיקה — לא תחליף לייעוץ משפטי"
      />

      <h2 className="mb-3 font-semibold text-slate-900">מחשבונים</h2>
      <div className="space-y-3">
        {calculators.map((calc) => (
          <Card key={calc.href} href={calc.href}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900">{calc.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{calc.description}</p>
              </div>
              {calc.tag === "חדש" && (
                <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  חדש
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-semibold text-slate-900">כלים נוספים</h2>
      <div className="space-y-3">
        {tools.map((tool) => (
          <Card key={tool.href} href={tool.href}>
            <h3 className="font-semibold text-slate-900">{tool.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
