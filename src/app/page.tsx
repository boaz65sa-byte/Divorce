"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, PageHeader, ProgressBar } from "@/components/ui";
import { BsSection } from "@/components/brand/BsSimple";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";
import {
  getChecklistForProfile,
  roadmapSteps,
} from "@/data/process";
import { hasSeenWelcome } from "@/lib/notifications/reminderNotifications";
import {
  getProgressPercent,
  getUpcomingReminders,
  useProfileStore,
} from "@/lib/store/profileStore";

const quickActions = [
  { href: "/assistant", title: "עוזר חכם", description: "שאל/י על החוק", emoji: "💬" },
  { href: "/roadmap", title: "המסלול שלי", description: "שלבי ההליך", emoji: "🗺️" },
  { href: "/knowledge", title: "מה החוק אומר", description: "זכויות וחובות", emoji: "⚖️" },
  { href: "/calculators", title: "מחשבונים", description: "מזונות, BTL, רכוש", emoji: "🧮" },
];

const extraTools = [
  { href: "/calendar", title: "לוח משמורת", emoji: "📅" },
  { href: "/reminders", title: "תזכורות", emoji: "🔔" },
  { href: "/journal", title: "יומן", emoji: "📒" },
  { href: "/professionals", title: "עו\"ד", emoji: "👔" },
  { href: "/courts", title: "ערכאות", emoji: "🏛️" },
  { href: "/agreement", title: "הסכם", emoji: "📄" },
  { href: "/resources", title: "קישורים", emoji: "🔗" },
];

export default function HomePage() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const completedRoadmap = useProfileStore((s) => s.completedRoadmap);
  const completedChecklist = useProfileStore((s) => s.completedChecklist);
  const reminders = useProfileStore((s) => s.reminders);

  const upcoming = getUpcomingReminders(reminders);

  const roadmapProgress = getProgressPercent(
    completedRoadmap,
    roadmapSteps.length,
  );
  const checklistItems = getChecklistForProfile(profile);
  const checklistProgress = getProgressPercent(
    completedChecklist,
    checklistItems.length,
  );
  const overallProgress = Math.round(
    (roadmapProgress + checklistProgress) / 2,
  );

  useEffect(() => {
    if (profile.onboardingComplete) return;
    if (!hasSeenWelcome()) {
      router.replace("/welcome");
    } else {
      router.replace("/onboarding");
    }
  }, [profile.onboardingComplete, router]);

  const nextStep = roadmapSteps.find(
    (step) => !completedRoadmap.includes(step.id),
  );

  return (
    <div>
      <PageHeader
        title="שלום, ברוכים הבאים"
        subtitle={`${BS_SIMPLE.tagline} · ${BS_SIMPLE.signature}`}
      />

      {upcoming.length > 0 && (
        <Card href="/reminders" className="mb-6 border-orange-200 bg-orange-50">
          <p className="text-sm font-semibold text-orange-900">
            {upcoming.length} תזכורות קרובות
          </p>
          <p className="mt-1 text-sm text-orange-800">
            הבאה: {upcoming[0].title} —{" "}
            {new Date(upcoming[0].date).toLocaleDateString("he-IL")}
          </p>
        </Card>
      )}

      <Card href="/assistant" className="mb-6 border-brand-200 bg-brand-50">
        <p className="font-semibold text-brand-900">עוזר חכם חדש</p>
        <p className="mt-1 text-sm text-brand-800">
          שאל/י על מזונות, רכוש, גט, יישוב סכסוך ועוד
        </p>
      </Card>

      {profile.hasChildren && (
        <Card href="/calendar" className="mb-6 border-purple-200 bg-purple-50">
          <p className="font-semibold text-purple-900">לוח משמורת</p>
          <p className="mt-1 text-sm text-purple-800">
            תכנון שהות — שבתות, חגים, וסנכרון למחשבון מזונות
          </p>
        </Card>
      )}

      <BsSection title="התקדמות בהליך" accent="blue" className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-brand-700">
            {overallProgress}%
          </span>
        </div>
        <ProgressBar percent={overallProgress} />
        {nextStep && (
          <p className="mt-3 text-sm text-slate-600">
            השלב הבא:{" "}
            <Link href="/roadmap" className="font-medium text-brand-700">
              {nextStep.title}
            </Link>
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="bs-card rounded-xl p-3">
            <p className="text-slate-500">מסלול</p>
            <p className="font-semibold">{roadmapProgress}%</p>
          </div>
          <Link href="/checklist" className="bs-card bs-card-hover rounded-xl p-3">
            <p className="text-slate-500">צ'ק-ליסט</p>
            <p className="font-semibold">{checklistProgress}%</p>
          </Link>
        </div>
      </BsSection>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Card key={action.href} href={action.href}>
            <span className="text-2xl" aria-hidden>
              {action.emoji}
            </span>
            <h3 className="mt-2 font-semibold text-slate-900">{action.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{action.description}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-semibold text-slate-900">כלים נוספים</h2>
      <div className="grid grid-cols-3 gap-2">
        {extraTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:border-brand-400"
          >
            <span className="text-xl">{tool.emoji}</span>
            <span className="mt-1 text-[10px] font-medium text-slate-700">
              {tool.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
