import type { SchedulePattern } from "@/lib/types";

export interface JewishHoliday {
  id: string;
  name: string;
  date: string;
  durationDays: number;
  category: "major" | "minor";
}

const holidays2025: JewishHoliday[] = [
  { id: "pesach-25", name: "פסח", date: "2025-04-13", durationDays: 7, category: "major" },
  { id: "shavuot-25", name: "שבועות", date: "2025-06-02", durationDays: 2, category: "major" },
  { id: "rosh-25", name: "ראש השנה", date: "2025-09-23", durationDays: 2, category: "major" },
  { id: "kippur-25", name: "יום כיפור", date: "2025-10-02", durationDays: 1, category: "major" },
  { id: "sukkot-25", name: "סוכות", date: "2025-10-07", durationDays: 7, category: "major" },
  { id: "hanukkah-25", name: "חנוכה", date: "2025-12-15", durationDays: 8, category: "minor" },
];

const holidays2026: JewishHoliday[] = [
  { id: "pesach-26", name: "פסח", date: "2026-04-02", durationDays: 7, category: "major" },
  { id: "shavuot-26", name: "שבועות", date: "2026-05-22", durationDays: 2, category: "major" },
  { id: "rosh-26", name: "ראש השנה", date: "2026-09-12", durationDays: 2, category: "major" },
  { id: "kippur-26", name: "יום כיפור", date: "2026-09-21", durationDays: 1, category: "major" },
  { id: "sukkot-26", name: "סוכות", date: "2026-09-26", durationDays: 7, category: "major" },
  { id: "hanukkah-26", name: "חנוכה", date: "2026-12-05", durationDays: 8, category: "minor" },
];

const holidays2027: JewishHoliday[] = [
  { id: "pesach-27", name: "פסח", date: "2027-04-22", durationDays: 7, category: "major" },
  { id: "shavuot-27", name: "שבועות", date: "2027-06-11", durationDays: 2, category: "major" },
  { id: "rosh-27", name: "ראש השנה", date: "2027-10-02", durationDays: 2, category: "major" },
  { id: "kippur-27", name: "יום כיפור", date: "2027-10-11", durationDays: 1, category: "major" },
  { id: "sukkot-27", name: "סוכות", date: "2027-10-16", durationDays: 7, category: "major" },
  { id: "hanukkah-27", name: "חנוכה", date: "2027-12-25", durationDays: 8, category: "minor" },
];

const allHolidays = [...holidays2025, ...holidays2026, ...holidays2027];

export function getHolidayOnDate(date: string): JewishHoliday | undefined {
  for (const holiday of allHolidays) {
    const start = new Date(holiday.date + "T12:00:00");
    const check = new Date(date + "T12:00:00");
    const end = new Date(start);
    end.setDate(end.getDate() + holiday.durationDays - 1);
    if (check >= start && check <= end) {
      return holiday;
    }
  }
  return undefined;
}

export function getHolidaysInMonth(year: number, month: number): JewishHoliday[] {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  return allHolidays.filter((h) => {
    const start = new Date(h.date + "T12:00:00");
    const end = new Date(start);
    end.setDate(end.getDate() + h.durationDays - 1);
    return end >= monthStart && start <= monthEnd;
  });
}

export const patternLabels: Record<SchedulePattern, string> = {
  "week-alternate": "שבוע-שבוע (7/7)",
  "2-2-3": "2-2-3 (14 ימים)",
  "5-2": "5 ימים + 2 (14 ימים)",
  "custom-cycle": "מחזור מותאם",
};

export const patternDescriptions: Record<SchedulePattern, string> = {
  "week-alternate": "שבוע שלם עם הורה א', שבוע שלם עם הורה ב'",
  "2-2-3": "2 לילות א', 2 ב', 3 א' — ואז 2 ב', 2 א', 3 ב' (מחזור 14)",
  "5-2": "5 לילות עם הורה א', 2 עם ב', ואז הפוך",
  "custom-cycle": "הגדרה ידנית של 14 ימים במחזור",
};
