"use client";

import { useEffect } from "react";
import { checkAndNotifyReminders } from "@/lib/notifications/reminderNotifications";
import { useProfileStore } from "@/lib/store/profileStore";

export function ReminderNotificationSync() {
  const reminders = useProfileStore((s) => s.reminders);

  useEffect(() => {
    checkAndNotifyReminders(reminders);

    const interval = setInterval(() => {
      checkAndNotifyReminders(reminders);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  return null;
}
