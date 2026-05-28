"use client";

import { PageHeader, ProgressBar } from "@/components/ui";
import { checklistTemplates } from "@/data/process";
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
  const completedChecklist = useProfileStore((s) => s.completedChecklist);
  const toggleChecklistItem = useProfileStore((s) => s.toggleChecklistItem);

  const progress = getProgressPercent(
    completedChecklist,
    checklistTemplates.length,
  );

  const phases = [...new Set(checklistTemplates.map((item) => item.phase))];

  return (
    <div>
      <PageHeader
        title="צ'ק-ליסט"
        subtitle="מסמכים ומשימות — לפני, במהלך ואחרי ההליך"
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-600">הושלם</span>
          <span className="font-bold text-brand-700">
            {completedChecklist.length} / {checklistTemplates.length}
          </span>
        </div>
        <ProgressBar percent={progress} />
      </div>

      {phases.map((phase) => (
        <section key={phase} className="mb-8">
          <h2 className="mb-3 font-semibold text-slate-900">
            {phaseLabels[phase] ?? phase}
          </h2>
          <ul className="space-y-2">
            {checklistTemplates
              .filter((item) => item.phase === phase)
              .map((item) => {
                const done = completedChecklist.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-right transition ${
                        done
                          ? "border-green-200 bg-green-50"
                          : "border-slate-200 bg-white hover:border-brand-300"
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
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-sm text-slate-600">
                            {item.description}
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
