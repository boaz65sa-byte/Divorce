import type { Reminder } from "@/lib/types";

const NOTIFIED_KEY = "tagarshan-li-notified";
const PERMISSION_KEY = "tagarshan-li-notifications";

export type NotificationPermissionState = "granted" | "denied" | "default" | "unsupported";

export function getNotificationSupport(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export function areNotificationsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PERMISSION_KEY) === "true";
}

export function setNotificationsEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    localStorage.setItem(PERMISSION_KEY, "true");
  } else {
    localStorage.removeItem(PERMISSION_KEY);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (getNotificationSupport() === "unsupported") return false;

  const result = await Notification.requestPermission();
  const granted = result === "granted";
  setNotificationsEnabled(granted);
  return granted;
}

function getNotifiedToday(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as { date: string; ids: string[] };
    const today = new Date().toISOString().slice(0, 10);
    if (parsed.date !== today) return new Set();
    return new Set(parsed.ids);
  } catch {
    return new Set();
  }
}

function markNotified(id: string): void {
  const today = new Date().toISOString().slice(0, 10);
  const current = getNotifiedToday();
  current.add(id);
  localStorage.setItem(
    NOTIFIED_KEY,
    JSON.stringify({ date: today, ids: [...current] }),
  );
}

function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date + "T12:00:00");
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function checkAndNotifyReminders(reminders: Reminder[]): number {
  if (typeof window === "undefined") return 0;
  if (!areNotificationsEnabled()) return 0;
  if (Notification.permission !== "granted") return 0;

  const notified = getNotifiedToday();
  let count = 0;
  const today = new Date().toISOString().slice(0, 10);

  for (const reminder of reminders) {
    if (reminder.done) continue;
    if (notified.has(reminder.id)) continue;

    const diff = daysUntil(reminder.date);
    const shouldNotify = diff === 0 || diff === 1;

    if (!shouldNotify) continue;

    const when =
      diff === 0 ? "היום" : "מחר";

    try {
      new Notification("תגרשן לי — תזכורת", {
        body: `${reminder.title} (${when})`,
        icon: "/icons/icon.svg",
        tag: reminder.id,
      });
      markNotified(reminder.id);
      count++;
    } catch {
      // ignore notification errors
    }
  }

  if (count === 0 && reminders.some((r) => !r.done && r.date === today)) {
    // fallback for same-day without duplicate tags
  }

  return count;
}

export const WELCOME_SEEN_KEY = "tagarshan-li-welcome-seen";

export function hasSeenWelcome(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(WELCOME_SEEN_KEY) === "true";
}

export function markWelcomeSeen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WELCOME_SEEN_KEY, "true");
}
