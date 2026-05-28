"use client";

import { PageHeader, ProgressBar } from "@/components/ui";
import { BsSection } from "@/components/brand/BsSimple";
import {
  getChecklistForProfile,
  getSuggestedDueDate,
} from "@/data/process";
import {
  getProgressPercent,
  useProfileStore,
} from "@/lib/store/profileStore";

const phaseLabels: Record<string, string> = {
  documents: "מסמכים",
  financial: "פיננסי",
  process: "הליך",
  get: "סידור גט",
};

export default function ChecklistPage() {
  const profile = useProfileStore((s) => s.profile);
  const completedChecklist = useProfileStore((s) => s.completedChecklist);
  const toggleChecklistItem = useProfileStore((s) => s.toggleChecklistItem);

  const items = getChecklistForProfile(profile);
  const progress = getProgressPercent(completedChecklist, items.length);
  const phases = [...new Set(items.map((item) => item.phase))];
  const baseDate = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        title="צ'ק-ליסט"
        subtitle={`מותאם ל${profile.agreement === "consensus" ? "גירושין בהסכמה" : "הליך עם מחלוקות"} · ${
          profile.court === "rabbinical" ? "בית דין דתי" : "בית משפט למשפחה"
        }`}
      />

      <BsSection accent="teal" className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-600">הושלם</span>
          <span className="font-bold text-brand-700">
            {completedChecklist.filter((id) => items.some((i) => i.id === id)).length} / {items.length}
          </span>
        </div>
        <ProgressBar percent={progress} />
      </BsSection>

      {phases.map((phase) => (
        <section key={phase} className="mb-8">
          <h2 className="mb-3 font-semibold text-slate-900">
            {phaseLabels[phase] ?? phase}
          </h2>
          <ul className="space-y-2">
            {items
              .filter((item) => item.phase === phase)
              .map((item) => {
                const done = completedChecklist.includes(item.id);
                const due = getSuggestedDueDate(baseDate, item.suggestedDueDays);
                const overdue =
                  due && !done && due < new Date().toISOString().slice(0, 10);

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`bs-card bs-card-hover flex w-full items-start gap-3 p-4 text-right transition ${
                        done
                          ? "border-green-200 bg-green-50/90"
                          : overdue
                            ? "border-orange-200 bg-orange-50/90"
                            : ""
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          done
                            ? "border-green-600 bg-green-600 text-xs text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {done ? "✓" : ""}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-sm text-slate-600">
                            {item.description}
                          </p>
                        )}
                        {due && (
                          <p
                            className={`mt-1 text-xs ${
                              overdue ? "font-semibold text-orange-700" : "text-slate-500"
                            }`}
                          >
                            יעד מוצע:{" "}
                            {new Date(due + "T12:00:00").toLocaleDateString("he-IL")}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
