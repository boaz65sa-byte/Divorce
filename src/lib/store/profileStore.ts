"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyPatternChange,
  calcRolling14DayStats,
  getDefaultScheduleSettings,
} from "@/lib/calendar/schedule";
import type {
  CustodyScheduleSettings,
  JournalEntry,
  ParentSide,
  Reminder,
  SchedulePattern,
  UserProfile,
} from "@/lib/types";

const defaultProfile: UserProfile = {
  onboardingComplete: false,
  religion: "jewish",
  hasChildren: false,
  children: [],
  court: "rabbinical",
  agreement: "dispute",
  incomeA: 0,
  incomeB: 0,
  parentAName: "הורה א'",
  parentBName: "הורה ב'",
};

interface AppState {
  profile: UserProfile;
  custodySchedule: CustodyScheduleSettings;
  completedChecklist: string[];
  completedRoadmap: string[];
  reminders: Reminder[];
  journal: JournalEntry[];
  setProfile: (partial: Partial<UserProfile>) => void;
  setCustodySchedule: (partial: Partial<CustodyScheduleSettings>) => void;
  setSchedulePattern: (pattern: SchedulePattern) => void;
  setDayOverride: (date: string, parent: ParentSide | null) => void;
  setHolidayAssignment: (date: string, parent: ParentSide | null) => void;
  syncDaysToChildren: () => void;
  completeOnboarding: () => void;
  toggleChecklistItem: (id: string) => void;
  toggleRoadmapStep: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, "id" | "done">) => void;
  toggleReminder: (id: string) => void;
  removeReminder: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void;
  removeJournalEntry: (id: string) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      custodySchedule: getDefaultScheduleSettings(),
      completedChecklist: [],
      completedRoadmap: [],
      reminders: [],
      journal: [],

      setProfile: (partial) =>
        set({ profile: { ...get().profile, ...partial } }),

      setCustodySchedule: (partial) =>
        set({
          custodySchedule: { ...get().custodySchedule, ...partial },
        }),

      setSchedulePattern: (pattern) =>
        set({
          custodySchedule: applyPatternChange(get().custodySchedule, pattern),
        }),

      setDayOverride: (date, parent) => {
        const overrides = { ...get().custodySchedule.dayOverrides };
        if (parent === null) {
          delete overrides[date];
        } else {
          overrides[date] = parent;
        }
        set({
          custodySchedule: {
            ...get().custodySchedule,
            dayOverrides: overrides,
          },
        });
      },

      setHolidayAssignment: (date, parent) => {
        const assignments = { ...get().custodySchedule.holidayAssignments };
        if (parent === null) {
          delete assignments[date];
        } else {
          assignments[date] = parent;
        }
        set({
          custodySchedule: {
            ...get().custodySchedule,
            holidayAssignments: assignments,
          },
        });
      },

      syncDaysToChildren: () => {
        const { nightsA } = calcRolling14DayStats(get().custodySchedule);
        const profile = get().profile;
        if (profile.children.length === 0) return;

        set({
          profile: {
            ...profile,
            children: profile.children.map((child) => ({
              ...child,
              daysWithParentA: nightsA,
            })),
          },
        });
      },

      completeOnboarding: () =>
        set({
          profile: { ...get().profile, onboardingComplete: true },
        }),

      toggleChecklistItem: (id) => {
        const current = get().completedChecklist;
        set({
          completedChecklist: current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id],
        });
      },

      toggleRoadmapStep: (id) => {
        const current = get().completedRoadmap;
        set({
          completedRoadmap: current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id],
        });
      },

      addReminder: (reminder) =>
        set({
          reminders: [
            ...get().reminders,
            { ...reminder, id: crypto.randomUUID(), done: false },
          ],
        }),

      toggleReminder: (id) =>
        set({
          reminders: get().reminders.map((r) =>
            r.id === id ? { ...r, done: !r.done } : r,
          ),
        }),

      removeReminder: (id) =>
        set({
          reminders: get().reminders.filter((r) => r.id !== id),
        }),

      addJournalEntry: (entry) =>
        set({
          journal: [
            { ...entry, id: crypto.randomUUID() },
            ...get().journal,
          ],
        }),

      removeJournalEntry: (id) =>
        set({
          journal: get().journal.filter((e) => e.id !== id),
        }),

      resetProfile: () =>
        set({
          profile: defaultProfile,
          custodySchedule: getDefaultScheduleSettings(),
          completedChecklist: [],
          completedRoadmap: [],
          reminders: [],
          journal: [],
        }),
    }),
    { name: "tagarshan-li-profile" },
  ),
);

export function getProgressPercent(
  completed: string[],
  total: number,
): number {
  if (total === 0) return 0;
  return Math.round((completed.length / total) * 100);
}

export function getUpcomingReminders(reminders: Reminder[]): Reminder[] {
  const today = new Date().toISOString().slice(0, 10);
  return reminders
    .filter((r) => !r.done && r.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calcJournalSplit(
  entries: JournalEntry[],
  incomeA: number,
  incomeB: number,
  parentAName: string,
  parentBName: string,
) {
  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const paidByA = entries
    .filter((e) => e.paidBy === "a")
    .reduce((sum, e) => sum + e.amount, 0);
  const paidByB = entries
    .filter((e) => e.paidBy === "b")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = incomeA + incomeB;
  const fairShareA = totalIncome > 0 ? total * (incomeA / totalIncome) : total / 2;
  const fairShareB = total - fairShareA;

  const balanceA = paidByA - fairShareA;
  const balanceB = paidByB - fairShareB;

  let owedFrom = "";
  let owedTo = "";
  let owedAmount = 0;

  if (balanceA > balanceB && balanceA > 0) {
    owedFrom = parentBName;
    owedTo = parentAName;
    owedAmount = (balanceA - balanceB) / 2;
  } else if (balanceB > balanceA && balanceB > 0) {
    owedFrom = parentAName;
    owedTo = parentBName;
    owedAmount = (balanceB - balanceA) / 2;
  }

  return {
    total,
    paidByA,
    paidByB,
    fairShareA,
    fairShareB,
    owedFrom,
    owedTo,
    owedAmount: Math.max(0, Math.round(owedAmount)),
  };
}
