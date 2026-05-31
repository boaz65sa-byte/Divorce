"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChildrenEditor } from "@/components/ChildrenEditor";
import { Button, Input, PageHeader, Select } from "@/components/ui";
import { religionLabels } from "@/data/religiousCourts";
import { useProfileStore } from "@/lib/store/profileStore";
import type { AgreementType, CourtType, Gender, ReligionType } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const resetProfile = useProfileStore((s) => s.resetProfile);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setProfile({
      hasChildren: profile.hasChildren && profile.children.length > 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleHasChildren = (yes: boolean) => {
    setProfile({
      hasChildren: yes,
      children:
        yes && profile.children.length === 0
          ? [
              {
                id: crypto.randomUUID(),
                age: 8,
                daysWithParentA: 7,
              },
            ]
          : yes
            ? profile.children
            : [],
    });
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "לאפס את כל הנתונים (פרופיל, צ'ק-ליסט, תזכורות)? פעולה זו לא ניתנת לביטול.",
      )
    ) {
      return;
    }
    resetProfile();
    router.push("/welcome");
  };

  return (
    <div>
      <PageHeader
        title="הגדרות פרופיל"
        subtitle="עריכת ילדים, הכנסות וערכאה — בלי לעבור אונבורדינג מחדש"
      />

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">פרטים אישיים</h2>
          <div className="space-y-4">
            <Select
              label="מין / תפקיד"
              value={profile.gender ?? "other"}
              onChange={(v) => setProfile({ gender: v as Gender })}
              options={[
                { value: "male", label: "גבר" },
                { value: "female", label: "אישה" },
                { value: "other", label: "לא רלוונטי" },
              ]}
            />
            <Select
              label="דת / עדה"
              value={profile.religion}
              onChange={(v) => setProfile({ religion: v as ReligionType })}
              options={[
                { value: "jewish", label: religionLabels.jewish },
                { value: "muslim", label: religionLabels.muslim },
                { value: "christian", label: religionLabels.christian },
                { value: "druze", label: religionLabels.druze },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="שם הורה א'"
                value={profile.parentAName}
                onChange={(v) => setProfile({ parentAName: v })}
              />
              <Input
                label="שם הורה ב'"
                value={profile.parentBName}
                onChange={(v) => setProfile({ parentBName: v })}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">הליך גירושין</h2>
          <div className="space-y-4">
            <Select
              label="סוג הליך"
              value={profile.agreement}
              onChange={(v) => setProfile({ agreement: v as AgreementType })}
              options={[
                { value: "consensus", label: "גירושין בהסכמה" },
                { value: "dispute", label: "עם מחלוקות" },
              ]}
            />
            <Select
              label="ערכאה צפויה"
              value={profile.court}
              onChange={(v) => setProfile({ court: v as CourtType })}
              options={[
                { value: "rabbinical", label: "בית דין דתי" },
                { value: "family", label: "בית משפט לענייני משפחה" },
              ]}
            />
            <Link
              href="/compare"
              className="block text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
            >
              השוואת רבני vs משפחה →
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">ילדים</h2>
          <Select
            label="יש ילדים?"
            value={profile.hasChildren ? "yes" : "no"}
            onChange={(v) => handleHasChildren(v === "yes")}
            options={[
              { value: "no", label: "לא" },
              { value: "yes", label: "כן" },
            ]}
          />
          {profile.hasChildren && (
            <div className="mt-4">
              <ChildrenEditor
                children={profile.children}
                onChange={(children) => setProfile({ children })}
                parentAName={profile.parentAName}
              />
              <Link
                href="/calculators/child-support"
                className="mt-3 block text-sm text-brand-700 underline-offset-2 hover:underline"
              >
                למחשבון מזונות ומשך תשלום →
              </Link>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">הכנסות (נטו)</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={profile.parentAName}
              type="number"
              value={profile.incomeA || ""}
              onChange={(v) => setProfile({ incomeA: Number(v) || 0 })}
            />
            <Input
              label={profile.parentBName}
              type="number"
              value={profile.incomeB || ""}
              onChange={(v) => setProfile({ incomeB: Number(v) || 0 })}
            />
          </div>
        </section>

        <Button onClick={save} className="w-full">
          {saved ? "נשמר ✓" : "שמור שינויים"}
        </Button>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-800">פעולות נוספות</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/feedback" className="text-brand-700 hover:underline">
              שליחת משוב / בטא
            </Link>
            <Link href="/onboarding" className="text-brand-700 hover:underline">
              עבור/י שוב את האונבורדינג המלא
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="text-right text-rose-600 hover:text-rose-700"
            >
              איפוס כל הנתונים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
