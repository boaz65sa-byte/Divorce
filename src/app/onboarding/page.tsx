"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, PageHeader, Select } from "@/components/ui";
import { religionLabels } from "@/data/religiousCourts";
import { markWelcomeSeen } from "@/lib/notifications/reminderNotifications";
import { useProfileStore } from "@/lib/store/profileStore";
import type { AgreementType, CourtType, Gender, ReligionType } from "@/lib/types";

const steps = [
  "ברוכים הבאים",
  "דת / עדה",
  "מצב משפחתי",
  "ערכאה",
  "הכנסות",
  "סיכום",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, setProfile, completeOnboarding } = useProfileStore();
  const [step, setStep] = useState(0);

  useEffect(() => {
    markWelcomeSeen();
  }, []);

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      router.push("/");
    }
  };

  const back = () => setStep(Math.max(0, step - 1));

  return (
    <div>
      <PageHeader
        title="הגדרת פרופיל"
        subtitle={`שלב ${step + 1} מתוך ${steps.length}: ${steps[step]}`}
      />

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-brand-600 transition-all"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-slate-700">
              נשאל כמה שאלות כדי להתאים את המסלול, הצ'ק-ליסט והמחשבונים
              למצב שלכם. הנתונים נשמרים במכשיר שלכם בלבד.
            </p>
            <Select
              label="מין / תפקיד (אופציונלי)"
              value={profile.gender ?? "other"}
              onChange={(v) => setProfile({ gender: v as Gender })}
              options={[
                { value: "male", label: "גבר" },
                { value: "female", label: "אישה" },
                { value: "other", label: "לא רלוונטי / לא רוצה לציין" },
              ]}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Select
              label="דת / עדה (לדין האישי)"
              value={profile.religion}
              onChange={(v) => setProfile({ religion: v as ReligionType })}
              options={[
                { value: "jewish", label: "יהודי/ה" },
                { value: "muslim", label: "מוסלמי/ת" },
                { value: "christian", label: "נוצרי/ת" },
                { value: "druze", label: "דרוזי/ת" },
              ]}
            />
            <p className="text-sm text-slate-600">
              הדין האישי קובע את ערכת בתי הדין הדתיים הרלוונטיים. חוקי
              ישראל (כמו איזון משאבים) חלים על כולם בנושאים מסוימים.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Select
              label="יש ילדים?"
              value={profile.hasChildren ? "yes" : "no"}
              onChange={(v) =>
                setProfile({
                  hasChildren: v === "yes",
                  children:
                    v === "yes" && profile.children.length === 0
                      ? [
                          {
                            id: crypto.randomUUID(),
                            age: 8,
                            daysWithParentA: 7,
                          },
                        ]
                      : profile.children,
                })
              }
              options={[
                { value: "no", label: "לא" },
                { value: "yes", label: "כן" },
              ]}
            />
            <Select
              label="סוג הליך"
              value={profile.agreement}
              onChange={(v) =>
                setProfile({ agreement: v as AgreementType })
              }
              options={[
                { value: "consensus", label: "גירושין בהסכמה" },
                { value: "dispute", label: "יש מחלוקות / לא בהסכמה" },
              ]}
            />
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
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Select
              label="ערכאה צפויה (נושאים נלווים)"
              value={profile.court}
              onChange={(v) => setProfile({ court: v as CourtType })}
              options={[
                { value: "rabbinical", label: "בית דין דתי" },
                { value: "family", label: "בית משפט לענייני משפחה" },
              ]}
            />
            <p className="text-sm text-slate-600">
              {profile.religion === "jewish"
                ? "ליהודים — הגט ניתן רק בבית הדין הרבני."
                : `ל${religionLabels[profile.religion]} — הליך הגירושין בערכאה הדתית הרלוונטית.`}
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Input
              label={`הכנסה נטו חודשית — ${profile.parentAName}`}
              type="number"
              value={profile.incomeA || ""}
              onChange={(v) => setProfile({ incomeA: Number(v) || 0 })}
              hint="לאחר מס — לצורך מחשבונים"
            />
            <Input
              label={`הכנסה נטו חודשית — ${profile.parentBName}`}
              type="number"
              value={profile.incomeB || ""}
              onChange={(v) => setProfile({ incomeB: Number(v) || 0 })}
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>דת/עדה:</strong> {religionLabels[profile.religion]}
            </p>
            <p>
              <strong>ילדים:</strong> {profile.hasChildren ? "כן" : "לא"}
            </p>
            <p>
              <strong>הליך:</strong>{" "}
              {profile.agreement === "consensus" ? "בהסכמה" : "עם מחלוקות"}
            </p>
            <p>
              <strong>ערכאה:</strong>{" "}
              {profile.court === "rabbinical"
                ? "בית דין דתי"
                : "בית משפט למשפחה"}
            </p>
            <p>
              <strong>הכנסות:</strong> {profile.incomeA.toLocaleString("he-IL")}{" "}
              / {profile.incomeB.toLocaleString("he-IL")} ₪
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={back} className="flex-1">
            חזרה
          </Button>
        )}
        <Button onClick={next} className="flex-1">
          {step === steps.length - 1 ? "סיום והמשך" : "המשך"}
        </Button>
      </div>
    </div>
  );
}
