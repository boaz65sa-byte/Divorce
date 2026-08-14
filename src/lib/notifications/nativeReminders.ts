import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { Reminder } from "@/lib/types";

// Deterministic 32-bit id from the reminder's string id — the plugin requires a number.
function toNotificationId(reminderId: string): number {
  let hash = 0;
  for (let i = 0; i < reminderId.length; i++) {
    hash = (hash * 31 + reminderId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export async function requestNativeNotificationPermission(): Promise<boolean> {
  const result = await LocalNotifications.requestPermissions();
  return result.display === "granted";
}

export async function hasNativeNotificationPermission(): Promise<boolean> {
  const result = await LocalNotifications.checkPermissions();
  return result.display === "granted";
}

// Schedules one native notification per open reminder, on the reminder's own date at 09:00.
// The OS fires these even if the app is fully closed, replacing the web setInterval/service-worker approach.
export async function syncNativeReminders(reminders: Reminder[]): Promise<void> {
  const granted = await hasNativeNotificationPermission();
  if (!granted) return;

  const { notifications: pending } = await LocalNotifications.getPending();
  if (pending.length > 0) {
    await LocalNotifications.cancel({
      notifications: pending.map((n) => ({ id: n.id })),
    });
  }

  const upcoming = reminders.filter((r) => !r.done);
  if (upcoming.length === 0) return;

  const now = new Date();
  const toSchedule = upcoming
    .map((reminder) => {
      const fireAt = new Date(`${reminder.date}T09:00:00`);
      return { reminder, fireAt };
    })
    .filter(({ fireAt }) => fireAt.getTime() > now.getTime());

  if (toSchedule.length === 0) return;

  await LocalNotifications.schedule({
    notifications: toSchedule.map(({ reminder, fireAt }) => ({
      id: toNotificationId(reminder.id),
      title: "תגרשן לי — תזכורת",
      body: reminder.title,
      schedule: { at: fireAt },
      extra: { reminderId: reminder.id },
    })),
  });
}
