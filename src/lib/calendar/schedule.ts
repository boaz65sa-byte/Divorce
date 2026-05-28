import { getHolidayOnDate } from "@/data/jewishHolidays";
import type {
  CalendarDay,
  CustodyScheduleSettings,
  MonthStats,
  ParentSide,
  SchedulePattern,
} from "@/lib/types";

export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(start + "T12:00:00");
  const e = new Date(end + "T12:00:00");
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDefaultCycle(pattern: SchedulePattern): ParentSide[] {
  switch (pattern) {
    case "week-alternate":
      return [...Array(7).fill("a"), ...Array(7).fill("b")] as ParentSide[];
    case "2-2-3":
      return [
        "a", "a", "b", "b", "a", "a", "a",
        "b", "b", "a", "a", "b", "b", "b",
      ];
    case "5-2":
      return [
        "a", "a", "a", "a", "a", "b", "b",
        "b", "b", "b", "b", "b", "a", "a",
      ];
    case "custom-cycle":
    default:
      return [
        "a", "a", "a", "a", "a", "a", "a",
        "b", "b", "b", "b", "b", "b", "b",
      ];
  }
}

export function getDefaultScheduleSettings(): CustodyScheduleSettings {
  const today = toDateString(new Date());
  return {
    pattern: "2-2-3",
    cycleStartDate: today,
    customCycle: getDefaultCycle("2-2-3"),
    shabbatMode: "alternate",
    shabbatFirstParent: "a",
    holidayMode: "alternate-years",
    holidayAssignments: {},
    dayOverrides: {},
  };
}

function getPatternParent(
  settings: CustodyScheduleSettings,
  date: string,
): ParentSide {
  const cycle = settings.customCycle.length === 14
    ? settings.customCycle
    : getDefaultCycle(settings.pattern);

  const offset = daysBetween(settings.cycleStartDate, date);
  const idx = ((offset % 14) + 14) % 14;
  return cycle[idx];
}

function getShabbatWeekIndex(date: string): number {
  const d = new Date(date + "T12:00:00");
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  return Math.floor(
    (d.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24 * 7),
  );
}

function resolveShabbatParent(
  settings: CustodyScheduleSettings,
  date: string,
  patternParent: ParentSide,
): { parent: ParentSide; source: "shabbat" | "pattern" } {
  if (settings.shabbatMode === "follow-day") {
    return { parent: patternParent, source: "pattern" };
  }

  if (settings.shabbatMode === "manual") {
    const manual = settings.dayOverrides[date];
    if (manual) {
      return { parent: manual, source: "shabbat" };
    }
    return { parent: patternParent, source: "pattern" };
  }

  const weekIdx = getShabbatWeekIndex(date);
  const firstIsA = settings.shabbatFirstParent === "a";
  const parent: ParentSide =
    weekIdx % 2 === 0
      ? firstIsA ? "a" : "b"
      : firstIsA ? "b" : "a";

  return { parent, source: "shabbat" };
}

function resolveHolidayParent(
  settings: CustodyScheduleSettings,
  date: string,
  holidayId: string,
  patternParent: ParentSide,
): ParentSide {
  if (settings.holidayMode === "manual") {
    return settings.holidayAssignments[date] ?? patternParent;
  }

  if (settings.holidayMode === "alternate-years") {
    const year = new Date(date + "T12:00:00").getFullYear();
    const base = holidayId.split("-")[0];
    const hash = base.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const parentForYear: ParentSide =
      (year + hash) % 2 === 0 ? "a" : "b";
    return settings.holidayAssignments[date] ?? parentForYear;
  }

  return patternParent;
}

export function resolveDay(
  settings: CustodyScheduleSettings,
  date: string,
): Pick<CalendarDay, "parent" | "source" | "holiday"> {
  const d = new Date(date + "T12:00:00");
  const dayOfWeek = d.getDay();
  const isSaturday = dayOfWeek === 6;
  const isFriday = dayOfWeek === 5;

  if (settings.dayOverrides[date]) {
    const holiday = getHolidayOnDate(date);
    return {
      parent: settings.dayOverrides[date],
      source: "override",
      holiday: holiday
        ? { id: holiday.id, name: holiday.name }
        : undefined,
    };
  }

  const patternParent = getPatternParent(settings, date);
  let parent = patternParent;
  let source: CalendarDay["source"] = "pattern";

  if (isSaturday && settings.shabbatMode === "alternate") {
    const shabbat = resolveShabbatParent(settings, date, patternParent);
    parent = shabbat.parent;
    source = shabbat.source;
  } else if (isFriday && settings.shabbatMode === "alternate") {
    const sat = new Date(d);
    sat.setDate(sat.getDate() + 1);
    const shabbat = resolveShabbatParent(
      settings,
      toDateString(sat),
      patternParent,
    );
    parent = shabbat.parent;
    source = shabbat.source;
  }

  const holiday = getHolidayOnDate(date);
  if (holiday && settings.holidayMode !== "follow-day") {
    parent = resolveHolidayParent(
      settings,
      date,
      holiday.id,
      parent,
    );
    source = "holiday";
  } else if (holiday) {
    return {
      parent,
      source,
      holiday: { id: holiday.id, name: holiday.name },
    };
  }

  return {
    parent,
    source,
    holiday: holiday ? { id: holiday.id, name: holiday.name } : undefined,
  };
}

export function buildMonthCalendar(
  settings: CustodyScheduleSettings,
  year: number,
  month: number,
): CalendarDay[] {
  const today = toDateString(new Date());
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startDay);

  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const date = toDateString(d);
    const resolved = resolveDay(settings, date);
    const dayOfWeek = d.getDay();

    days.push({
      date,
      dayOfMonth: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: date === today,
      isFriday: dayOfWeek === 5,
      isSaturday: dayOfWeek === 6,
      parent: resolved.parent,
      source: resolved.source,
      holiday: resolved.holiday,
    });
  }

  return days;
}

export function calcMonthStats(days: CalendarDay[]): MonthStats {
  const inMonth = days.filter((d) => d.isCurrentMonth);
  let nightsA = 0;
  let nightsB = 0;
  let shabbatA = 0;
  let shabbatB = 0;
  let holidaysA = 0;
  let holidaysB = 0;

  for (const day of inMonth) {
    if (day.parent === "a") nightsA++;
    else nightsB++;

    if (day.isSaturday) {
      if (day.parent === "a") shabbatA++;
      else shabbatB++;
    }

    if (day.holiday) {
      if (day.parent === "a") holidaysA++;
      else holidaysB++;
    }
  }

  return { nightsA, nightsB, shabbatA, shabbatB, holidaysA, holidaysB };
}

export function calcRolling14DayStats(
  settings: CustodyScheduleSettings,
  endDate?: string,
): { nightsA: number; nightsB: number } {
  const end = endDate ?? toDateString(new Date());
  const endD = new Date(end + "T12:00:00");
  let nightsA = 0;
  let nightsB = 0;

  for (let i = 13; i >= 0; i--) {
    const d = new Date(endD);
    d.setDate(d.getDate() - i);
    const date = toDateString(d);
    const { parent } = resolveDay(settings, date);
    if (parent === "a") nightsA++;
    else nightsB++;
  }

  return { nightsA, nightsB };
}

export function applyPatternChange(
  settings: CustodyScheduleSettings,
  pattern: SchedulePattern,
): CustodyScheduleSettings {
  return {
    ...settings,
    pattern,
    customCycle: getDefaultCycle(pattern),
  };
}
