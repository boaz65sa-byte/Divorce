"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { BrandIcon, type IconTone } from "@/components/brand/BrandIcons";
import type { BrandIconName } from "@/components/brand/BrandIcons";
import { BsSection } from "@/components/brand/BsSimple";
import { Button } from "@/components/ui";
import { SocialShareButtons } from "@/components/share/SocialShareButtons";
import { BRAND } from "@/lib/brand/brand";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";
import { markWelcomeSeen } from "@/lib/notifications/reminderNotifications";

const features: {
  icon: BrandIconName;
  title: string;
  desc: string;
  tone: IconTone;
}[] = [
  { icon: "roadmap", title: "מפת דרכים", desc: "שלב אחר שלב עד תעודת גירושין", tone: "teal" },
  { icon: "checklist", title: "צ'ק-ליסט", desc: "מותאם להסכמה/מחלוקת ולערכאה", tone: "indigo" },
  { icon: "calculators", title: "מחשבונים", desc: "מזונות, רכוש, ביטוח לאומי", tone: "amber" },
  { icon: "calendar", title: "לוח משמורת", desc: "שבתות, חגים, 2-2-3", tone: "rose" },
  { icon: "assistant", title: "עוזר חכם", desc: "שאלות על החוק וההליך", tone: "violet" },
  { icon: "knowledge", title: "מאגר ידע", desc: "זכויות וחובות לכל צד", tone: "sky" },
];

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<"he" | "en">("he");

  useEffect(() => {
    document.title = `${BRAND.name} — ${BRAND.tagline}`;
  }, []);

  const start = () => {
    markWelcomeSeen();
    router.push("/onboarding");
  };

  return (
    <div className="-mx-4 -mt-4">
      <div className="relative overflow-hidden">
        <Image
          src="/images/cover.jpeg"
          alt={BRAND.name}
          width={1024}
          height={683}
          className="h-52 w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/40 to-transparent" />
        <div className="absolute bottom-5 right-4 left-4">
          <Logo showTagline variant="light" size="lg" />
        </div>
      </div>

      <div className="px-4 pt-5">
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
                <strong>{BRAND.name}</strong> — {BRAND.tagline}. {BRAND.promise}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>· חינם · בעברית · הנתונים במכשיר שלך</li>
                <li>· מזונות · משמורת · צ&apos;ק-ליסט · מחשבונים</li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-slate-700">
                <strong>{BRAND.nameEn}</strong> — {BRAND.taglineEn}
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
              <BrandIcon name={f.icon} tone={f.tone} size="sm" className="mb-2" />
              <p className="text-sm font-bold text-slate-900">{f.title}</p>
              <p className="text-[11px] leading-snug text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <Button onClick={start} className="bs-shimmer mb-3 w-full py-3 text-base">
          {lang === "he" ? "התחל/י — חינם" : "Start — it's free"}
        </Button>

        <Link
          href="/onboarding"
          onClick={() => markWelcomeSeen()}
          className="mb-4 block text-center text-sm text-brand-700 hover:underline"
        >
          {lang === "he" ? "יש לי כבר פרופיל →" : "I already have a profile →"}
        </Link>

        <div className="mb-4">
          <SocialShareButtons lang={lang} compact />
        </div>

        <p className="bs-disclaimer rounded-xl px-3 py-2 text-xs text-amber-950">
          {lang === "he"
            ? "⚠️ הערכה בלבד — לא ייעוץ משפטי. יש להתייעץ עם עו\"ד."
            : "⚠️ Estimates only — not legal advice. Consult an attorney."}
        </p>

        <p className="mt-4 text-center text-[10px] text-slate-400">
          {BRAND.name} · {BS_SIMPLE.signature}
        </p>
      </div>
    </div>
  );
}
