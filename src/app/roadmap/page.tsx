"use client";

import { PageHeader, ProgressBar } from "@/components/ui";
import { BsSection } from "@/components/brand/BsSimple";
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
  const nextStep = roadmapSteps.find((s) => !completedRoadmap.includes(s.id));
  const nextIndex = nextStep
    ? roadmapSteps.findIndex((s) => s.id === nextStep.id)
    : -1;

  return (
    <div>
      <PageHeader
        title="המסלול שלי"
        subtitle="שלבי גירושין בישראל — מההתחלה ועד תעודת הגירושין"
      />

      <BsSection accent="blue" className="mb-6">
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
        {nextStep && (
          <p className="mt-2 rounded-xl bg-brand-50 px-3 py-2 text-sm font-medium text-brand-900">
            השלב הבא: {nextStep.title}
          </p>
        )}
      </BsSection>

      <div className="relative mr-3">
        <div
          className="bs-timeline-line absolute bottom-4 right-[15px] top-4 w-1 rounded-full opacity-30"
          aria-hidden
        />

        <ol className="space-y-4">
          {roadmapSteps.map((step, index) => {
            const done = completedRoadmap.includes(step.id);
            const isNext = index === nextIndex;
            const isPast = done || (nextIndex >= 0 && index < nextIndex);

            return (
              <li key={step.id} className="relative pr-10">
                <span
                  className={`absolute right-0 flex h-8 w-8 translate-x-1/2 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
                    done
                      ? "bs-mark text-white"
                      : isNext
                        ? "border-2 border-brand-500 bg-white text-brand-700 ring-4 ring-brand-100"
                        : isPast
                          ? "bg-brand-100 text-brand-700"
                          : "bg-slate-100 text-slate-500"
                  }`}
                  aria-hidden
                >
                  {done ? "✓" : index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => toggleRoadmapStep(step.id)}
                  className={`bs-card bs-card-hover w-full p-4 text-right transition ${
                    done
                      ? "border-green-200 bg-green-50/90"
                      : isNext
                        ? "border-brand-300 bg-brand-50/50"
                        : ""
                  }`}
                >
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {step.description}
                  </p>
                  {isNext && !done && (
                    <p className="mt-2 text-xs font-semibold text-brand-700">
                      ← שלב נוכחי
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
