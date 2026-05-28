"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsBrandMark, BsSection } from "@/components/brand/BsSimple";
import { Button } from "@/components/ui";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";
import { markWelcomeSeen } from "@/lib/notifications/reminderNotifications";

const features = [
  { emoji: "🗺️", title: "מפת דרכים", desc: "שלב אחר שלב עד תעודת גירושין", tone: "teal" as const },
  { emoji: "✅", title: "צ'ק-ליסט", desc: "מותאם להסכמה/מחלוקת ולערכאה", tone: "indigo" as const },
  { emoji: "🧮", title: "מחשבונים", desc: "מזונות, רכוש, ביטוח לאומי", tone: "amber" as const },
  { emoji: "📅", title: "לוח משמורת", desc: "שבתות, חגים, 2-2-3", tone: "rose" as const },
  { emoji: "💬", title: "עוזר חכם", desc: "שאלות על החוק וההליך", tone: "violet" as const },
  { emoji: "⚖️", title: "מאגר ידע", desc: "זכויות וחובות לכל צד", tone: "sky" as const },
];

const toneClass: Record<(typeof features)[number]["tone"], string> = {
  teal: "bs-icon-teal",
  indigo: "bs-icon-indigo",
  amber: "bs-icon-amber",
  rose: "bs-icon-rose",
  violet: "bs-icon-violet",
  sky: "bs-icon-sky",
};

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<"he" | "en">("he");

  const start = () => {
    markWelcomeSeen();
    router.push("/onboarding");
  };

  return (
    <div className="-mx-4 -mt-4">
      <div className="relative overflow-hidden">
        <Image
          src="/images/cover.jpeg"
          alt="תגרשן לי"
          width={1024}
          height={683}
          className="h-52 w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-4 right-4 left-4 text-white">
          <BsBrandMark size="md" showLabel />
          <h1 className="mt-3 text-3xl font-black tracking-tight">תגרשן לי</h1>
          <p className="mt-1 text-sm text-white/90">
            {lang === "he"
              ? "המלווה הדיגיטלי שלך לגירושין בישראל"
              : "Your digital divorce companion in Israel"}
          </p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setLang("he")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              lang === "he" ? "bs-badge text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            עברית
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              lang === "en" ? "bs-badge text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            English
          </button>
        </div>

        <BsSection accent="blue" className="mb-4">
          {lang === "he" ? (
            <>
              <p className="text-slate-700">
                גירושין בישראל? <strong>תגרשן לי</strong> — ידע, כלים ומסלול
                אישי, במקום אחד.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>· חינם · בעברית · הנתונים במכשיר שלך</li>
                <li>· מזונות · משמורת · צ&apos;ק-ליסט · מחשבונים</li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-slate-700">
                Divorce in Israel? <strong>Tagarshan Li</strong> — knowledge,
                tools & your personal roadmap, in one app.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>· Free · Hebrew · Data stays on your device</li>
                <li>· Support · Custody · Checklist · Calculators</li>
              </ul>
            </>
          )}
        </BsSection>

        <div className="mb-6 grid grid-cols-2 gap-2">
          {features.map((f) => (
            <div key={f.title} className="bs-card p-3">
              <div className={`bs-icon-wrap ${toneClass[f.tone]} mb-2`}>{f.emoji}</div>
              <p className="text-sm font-bold text-slate-900">{f.title}</p>
              <p className="text-[11px] leading-snug text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <Button onClick={start} className="bs-shimmer mb-3 w-full text-base py-3">
          {lang === "he" ? "התחל/י — חינם" : "Start — it's free"}
        </Button>

        <Link
          href="/onboarding"
          onClick={() => markWelcomeSeen()}
          className="mb-4 block text-center text-sm text-brand-700 hover:underline"
        >
          {lang === "he" ? "יש לי כבר פרופיל →" : "I already have a profile →"}
        </Link>

        <p className="bs-disclaimer rounded-xl px-3 py-2 text-xs text-amber-950">
          {lang === "he"
            ? "⚠️ הערכה בלבד — לא ייעוץ משפטי. יש להתייעץ עם עו\"ד."
            : "⚠️ Estimates only — not legal advice. Consult an attorney."}
        </p>

        <p className="mt-4 text-center text-[10px] text-slate-400">
          {BS_SIMPLE.signature}
        </p>
      </div>
    </div>
  );
}
