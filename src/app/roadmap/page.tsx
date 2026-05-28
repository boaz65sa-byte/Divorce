"use client";

import { PageHeader, ProgressBar } from "@/components/ui";
import { roadmapSteps } from "@/data/process";
import {
  getProgressPercent,
  useProfileStore,
} from "@/lib/store/profileStore";

export default function RoadmapPage() {
  const completedRoadmap = useProfileStore((s) => s.completedRoadmap);
  const toggleRoadmapStep = useProfileStore((s) => s.toggleRoadmapStep);
  const profile = useProfileStore((s) => s.profile);

  const progress = getProgressPercent(completedRoadmap, roadmapSteps.length);

  return (
    <div>
      <PageHeader
        title="המסלול שלי"
        subtitle="שלבי גירושין בישראל — מההתחלה ועד תעודת הגירושין"
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-600">התקדמות</span>
          <span className="font-bold text-brand-700">{progress}%</span>
        </div>
        <ProgressBar percent={progress} />
        <p className="mt-3 text-sm text-slate-600">
          ערכאה:{" "}
          {profile.court === "rabbinical"
            ? "בית דין רבני"
            : "בית משפט למשפחה"}{" "}
          ·{" "}
          {profile.agreement === "consensus" ? "בהסכמה" : "עם מחלוקות"}
        </p>
      </div>

      <ol className="space-y-3">
        {roadmapSteps.map((step, index) => {
          const done = completedRoadmap.includes(step.id);
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => toggleRoadmapStep(step.id)}
                className={`w-full rounded-2xl border p-4 text-right transition ${
                  done
                    ? "border-green-200 bg-green-50"
                    : "border-slate-200 bg-white hover:border-brand-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      done
                        ? "bg-green-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {done ? "✓" : index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
