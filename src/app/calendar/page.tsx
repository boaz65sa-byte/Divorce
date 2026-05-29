"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { Button, Input, PageHeader, Select, StatBox } from "@/components/ui";
import {
  getHolidaysInMonth,
  patternDescriptions,
  patternLabels,
} from "@/data/jewishHolidays";
import {
  buildMonthCalendar,
  calcMonthStats,
  calcRolling14DayStats,
} from "@/lib/calendar/schedule";
import { useProfileStore } from "@/lib/store/profileStore";
import type {
  HolidayMode,
  ParentSide,
  SchedulePattern,
  ShabbatMode,
} from "@/lib/types";

const monthNames = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

export default function CalendarPage() {
  const profile = useProfileStore((s) => s.profile);
  const custodySchedule = useProfileStore((s) => s.custodySchedule);
  const setCustodySchedule = useProfileStore((s) => s.setCustodySchedule);
  const setSchedulePattern = useProfileStore((s) => s.setSchedulePattern);
  const setDayOverride = useProfileStore((s) => s.setDayOverride);
  const setHolidayAssignment = useProfileStore((s) => s.setHolidayAssignment);
  const syncDaysToChildren = useProfileStore((s) => s.syncDaysToChildren);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showSettings, setShowSettings] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  const days = useMemo(
    () => buildMonthCalendar(custodySchedule, year, month),
    [custodySchedule, year, month],
  );

  const monthStats = useMemo(() => calcMonthStats(days), [days]);
  const rolling14 = useMemo(
    () => calcRolling14DayStats(custodySchedule),
    [custodySchedule],
  );

  const holidaysThisMonth = getHolidaysInMonth(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDayClick = (date: string, currentParent: ParentSide) => {
    const override = custodySchedule.dayOverrides[date];
    if (override) {
      setDayOverride(date, null);
      return;
    }
    const next: ParentSide = currentParent === "a" ? "b" : "a";
    setDayOverride(date, next);
  };

  const handleSync = () => {
    syncDaysToChildren();
    setSyncMsg(
      `עודכן: ${rolling14.nightsA} לילות עם ${profile.parentAName} (מתוך 14)`,
    );
    setTimeout(() => setSyncMsg(""), 4000);
  };

  return (
    <div>
      <PageHeader
        title="לוח משמורת"
        subtitle="תכנון שהות ילדים — שבתות, חגים וימי חול"
      />

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          aria-label="חודש קודם"
        >
          →
        </button>
        <div className="text-center">
          <p className="font-bold text-slate-900">
            {monthNames[month]} {year}
          </p>
          <button
            type="button"
            onClick={() => {
              setYear(today.getFullYear());
              setMonth(today.getMonth());
            }}
            className="text-xs text-brand-700 hover:underline"
          >
            חזרה להיום
          </button>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          aria-label="חודש הבא"
        >
          ←
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-blue-900">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          {profile.parentAName}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-amber-900">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          {profile.parentBName}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-purple-800">
          ש = שבת
        </span>
        <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-700">
          ● = שינוי ידני
        </span>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <MonthGrid
          days={days}
          parentAName={profile.parentAName}
          parentBName={profile.parentBName}
          onDayClick={handleDayClick}
        />
        <p className="mt-3 text-center text-xs text-slate-500">
          לחיצה על יום — החלפת הורה / ביטול שינוי ידני
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatBox
          label={`לילות — ${profile.parentAName} (חודש)`}
          value={String(monthStats.nightsA)}
        />
        <StatBox
          label={`לילות — ${profile.parentBName} (חודש)`}
          value={String(monthStats.nightsB)}
        />
        <StatBox
          label="שבתות א'"
          value={String(monthStats.shabbatA)}
        />
        <StatBox
          label="שבתות ב'"
          value={String(monthStats.shabbatB)}
        />
      </div>

      <section className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 p-4">
        <h2 className="font-semibold text-brand-900">14 ימים אחרונים (מזונות)</h2>
        <p className="mt-1 text-sm text-brand-800">
          {profile.parentAName}: {rolling14.nightsA} לילות ·{" "}
          {profile.parentBName}: {rolling14.nightsB} לילות
        </p>
        <p className="mt-1 text-xs text-brand-700">
          מחשבון מזונות (919/15) משתמש ביחס שהות מתוך 14 לילות
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={handleSync} variant="secondary" className="text-sm">
            עדכן לילות בפרופיל
          </Button>
          <Link href="/settings">
            <Button variant="secondary" className="text-sm">
              ערוך גילאי ילדים
            </Button>
          </Link>
          <Link href="/calculators/child-support">
            <Button variant="secondary" className="text-sm">
              למחשבון מזונות
            </Button>
          </Link>
        </div>
        {syncMsg && (
          <p className="mt-2 text-sm font-medium text-green-700">{syncMsg}</p>
        )}
      </section>

      {holidaysThisMonth.length > 0 && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-semibold text-slate-900">חגים בחודש</h2>
          <ul className="space-y-2">
            {holidaysThisMonth.map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
              >
                <span>
                  <strong>{h.name}</strong>
                  <span className="mr-2 text-slate-500">
                    {new Date(h.date + "T12:00:00").toLocaleDateString("he-IL")}
                    {h.durationDays > 1 && ` (+${h.durationDays - 1} ימים)`}
                  </span>
                </span>
                {custodySchedule.holidayMode === "manual" && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setHolidayAssignment(h.date, "a")
                      }
                      className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
                    >
                      א'
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHolidayAssignment(h.date, "b")
                      }
                      className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
                    >
                      ב'
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="flex w-full items-center justify-between font-semibold text-slate-900"
        >
          <span>הגדרות לוח</span>
          <span>{showSettings ? "▲" : "▼"}</span>
        </button>

        {showSettings && (
          <div className="mt-4 space-y-4">
            <Select
              label="תבנית שהות"
              value={custodySchedule.pattern}
              onChange={(v) => setSchedulePattern(v as SchedulePattern)}
              options={Object.entries(patternLabels).map(([value, label]) => ({
                value,
                label,
              }))}
            />
            <p className="text-xs text-slate-600">
              {patternDescriptions[custodySchedule.pattern]}
            </p>

            <Input
              label="תחילת מחזור"
              type="date"
              value={custodySchedule.cycleStartDate}
              onChange={(v) => setCustodySchedule({ cycleStartDate: v })}
              hint="יום ראשון במחזור 14 הימים"
            />

            <Select
              label="שבתות"
              value={custodySchedule.shabbatMode}
              onChange={(v) =>
                setCustodySchedule({ shabbatMode: v as ShabbatMode })
              }
              options={[
                { value: "alternate", label: "לסירוגין (שבת-שבת)" },
                { value: "follow-day", label: "לפי תבנית ימי החול" },
                { value: "manual", label: "ידני (לחיצה על יום)" },
              ]}
            />

            {custodySchedule.shabbatMode === "alternate" && (
              <Select
                label="מי מקבל את השבת הראשונה?"
                value={custodySchedule.shabbatFirstParent}
                onChange={(v) =>
                  setCustodySchedule({
                    shabbatFirstParent: v as ParentSide,
                  })
                }
                options={[
                  { value: "a", label: profile.parentAName },
                  { value: "b", label: profile.parentBName },
                ]}
              />
            )}

            <Select
              label="חגים"
              value={custodySchedule.holidayMode}
              onChange={(v) =>
                setCustodySchedule({ holidayMode: v as HolidayMode })
              }
              options={[
                { value: "alternate-years", label: "לסירוגין מדי שנה" },
                { value: "follow-day", label: "לפי תבנית רגילה" },
                { value: "manual", label: "הקצאה ידנית לכל חג" },
              ]}
            />

            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              חגים מוצגים לפי לוח עברי (2025–2027): פסח, שבועות, ראש השנה,
              כיפור, סוכות, חנוכה. לחגים מוסלמים/נוצריים — השתמש/י בשינוי ידני
              על הימים הרלוונטיים.
            </p>
          </div>
        )}
      </section>

      <p className="text-xs text-slate-500">
        הערכה לתכנון בלבד — לא ייעוץ משפטי. הסדר משמורת סופי נקבע בהסכם או
        בפסק דין.
      </p>
    </div>
  );
}
