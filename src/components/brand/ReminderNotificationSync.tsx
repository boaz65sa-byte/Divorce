"use client";

import { useEffect } from "react";
import { checkAndNotifyReminders } from "@/lib/notifications/reminderNotifications";
import { syncRemindersToServiceWorker } from "@/lib/notifications/reminderSync";
import { isNativePlatform, syncNativeReminders } from "@/lib/notifications/nativeReminders";
import { useProfileStore } from "@/lib/store/profileStore";

export function ReminderNotificationSync() {
  const reminders = useProfileStore((s) => s.reminders);

  useEffect(() => {
    if (isNativePlatform()) {
      // Native local notifications are scheduled by the OS ahead of time —
      // no foreground polling needed, and it wouldn't fire while backgrounded anyway.
      syncNativeReminders(reminders);
      return;
    }

    checkAndNotifyReminders(reminders);
    syncRemindersToServiceWorker(reminders);

    const interval = setInterval(() => {
      checkAndNotifyReminders(reminders);
      syncRemindersToServiceWorker(reminders);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  return null;
}
