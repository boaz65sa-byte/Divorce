"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FeatureCard,
  PageHeader,
  ProgressBar,
  ToolChip,
} from "@/components/ui";
import { BsSection } from "@/components/brand/BsSimple";
import { BRAND } from "@/lib/brand/brand";
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
import type { BrandIconName } from "@/components/brand/BrandIcons";
import type { IconTone } from "@/components/brand/BrandIcons";

const quickActions: {
  href: string;
  title: string;
  description: string;
  icon: BrandIconName;
  iconTone: IconTone;
  featured?: boolean;
}[] = [
  {
    href: "/assistant",
    title: "עוזר חכם",
    description: "שאל/י על החוק",
    icon: "assistant",
    iconTone: "violet",
    featured: true,
  },
  {
    href: "/roadmap",
    title: "המסלול שלי",
    description: "שלבי ההליך",
    icon: "roadmap",
    iconTone: "teal",
  },
  {
    href: "/knowledge",
    title: "מה החוק אומר",
    description: "זכויות וחובות",
    icon: "knowledge",
    iconTone: "indigo",
  },
  {
    href: "/calculators",
    title: "מחשבונים",
    description: "מזונות, BTL, רכוש",
    icon: "calculators",
    iconTone: "amber",
  },
];

const extraTools: { href: string; title: string; icon: BrandIconName; tone: IconTone }[] = [
  { href: "/calendar", title: "לוח משמורת", icon: "calendar", tone: "rose" },
  { href: "/reminders", title: "תזכורות", icon: "reminders", tone: "violet" },
  { href: "/journal", title: "יומן", icon: "journal", tone: "teal" },
  { href: "/professionals", title: "עו\"ד", icon: "professionals", tone: "indigo" },
  { href: "/courts", title: "ערכאות", icon: "courts", tone: "sky" },
  { href: "/agreement", title: "הסכם", icon: "agreement", tone: "amber" },
  { href: "/resources", title: "קישורים", icon: "resources", tone: "teal" },
  { href: "/settings", title: "פרופיל", icon: "agreement", tone: "indigo" },
  { href: "/feedback", title: "משוב", icon: "assistant", tone: "violet" },
  { href: "/share-app", title: "שיתוף", icon: "resources", tone: "teal" },
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

  const greeting =
    profile.parentAName !== "הורה א'"
      ? `שלום, ${profile.parentAName}`
      : "שלום, ברוכים הבאים";

  return (
    <div>
      <PageHeader title={greeting} subtitle={BRAND.tagline} />

      {upcoming.length > 0 && (
        <Link
          href="/reminders"
          className="bs-card bs-card-hover mb-6 block border-orange-200/80 bg-gradient-to-l from-orange-50 to-amber-50 p-4"
        >
          <p className="text-sm font-bold text-orange-900">
            {upcoming.length} תזכורות קרובות
          </p>
          <p className="mt-1 text-sm text-orange-800/90">
            הבאה: {upcoming[0].title} —{" "}
            {new Date(upcoming[0].date).toLocaleDateString("he-IL")}
          </p>
        </Link>
      )}

      {profile.hasChildren && (
        <FeatureCard
          href="/calendar"
          icon="calendar"
          title="לוח משמורת"
          description="שבתות, חגים, וסנכרון למחשבון מזונות"
          iconTone="rose"
          featured
        />
      )}

      <BsSection title="התקדמות בהליך" accent="blue" className="mb-8 mt-6">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-3xl font-black tabular-nums text-brand-700">
            {overallProgress}%
          </span>
          <span className="text-xs text-slate-500">סה&quot;כ התקדמות</span>
        </div>
        <ProgressBar percent={overallProgress} />
        {nextStep && (
          <p className="mt-3 rounded-xl bg-indigo-50/80 px-3 py-2 text-sm text-indigo-900">
            השלב הבא:{" "}
            <Link href="/roadmap" className="font-bold underline-offset-2 hover:underline">
              {nextStep.title}
            </Link>
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="bs-card rounded-xl p-3">
            <p className="text-xs text-slate-500">מסלול</p>
            <p className="text-lg font-bold text-slate-900">{roadmapProgress}%</p>
          </div>
          <Link href="/checklist" className="bs-card bs-card-hover rounded-xl p-3">
            <p className="text-xs text-slate-500">צ&apos;ק-ליסט</p>
            <p className="text-lg font-bold text-slate-900">{checklistProgress}%</p>
          </Link>
        </div>
      </BsSection>

      <h2 className="mb-3 text-sm font-bold tracking-wide text-slate-500">
        כלים מרכזיים
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <FeatureCard key={action.href} {...action} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-bold tracking-wide text-slate-500">
        כלים נוספים
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {extraTools.map((tool) => (
          <ToolChip key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  );
}
