"use client";

import { useEffect } from "react";
import { checkAndNotifyReminders } from "@/lib/notifications/reminderNotifications";
import { syncRemindersToServiceWorker } from "@/lib/notifications/reminderSync";
import { useProfileStore } from "@/lib/store/profileStore";

export function ReminderNotificationSync() {
  const reminders = useProfileStore((s) => s.reminders);

  useEffect(() => {
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
