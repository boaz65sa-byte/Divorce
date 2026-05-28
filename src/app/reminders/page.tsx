"use client";

import { useEffect, useState } from "react";
import { Button, Input, PageHeader, Select } from "@/components/ui";
import { BsSection } from "@/components/brand/BsSimple";
import {
  areNotificationsEnabled,
  checkAndNotifyReminders,
  getNotificationSupport,
  requestNotificationPermission,
  setNotificationsEnabled,
} from "@/lib/notifications/reminderNotifications";
import {
  getUpcomingReminders,
  useProfileStore,
} from "@/lib/store/profileStore";
import type { Reminder } from "@/lib/types";

const typeLabels: Record<Reminder["type"], string> = {
  hearing: "דיון",
  payment: "תשלום",
  document: "מסמך",
  other: "אחר",
};

const typeColors: Record<Reminder["type"], string> = {
  hearing: "bg-purple-100 text-purple-800",
  payment: "bg-green-100 text-green-800",
  document: "bg-blue-100 text-blue-800",
  other: "bg-slate-100 text-slate-700",
};

export default function RemindersPage() {
  const reminders = useProfileStore((s) => s.reminders);
  const addReminder = useProfileStore((s) => s.addReminder);
  const toggleReminder = useProfileStore((s) => s.toggleReminder);
  const removeReminder = useProfileStore((s) => s.removeReminder);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<Reminder["type"]>("hearing");
  const [showForm, setShowForm] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const notifSupport = getNotificationSupport();

  useEffect(() => {
    setNotificationsOn(areNotificationsEnabled());
  }, []);

  const upcoming = getUpcomingReminders(reminders);
  const past = reminders.filter((r) => r.done || (r.date < new Date().toISOString().slice(0, 10) && !r.done));

  const handleAdd = () => {
    if (!title.trim() || !date) return;
    addReminder({ title: title.trim(), date, type });
    setTitle("");
    setDate("");
    setShowForm(false);
    if (notificationsOn) {
      setTimeout(() => checkAndNotifyReminders(useProfileStore.getState().reminders), 500);
    }
  };

  const toggleNotifications = async () => {
    if (notificationsOn) {
      setNotificationsEnabled(false);
      setNotificationsOn(false);
      return;
    }
    const granted = await requestNotificationPermission();
    setNotificationsOn(granted);
  };

  return (
    <div>
      <PageHeader
        title="תזכורות"
        subtitle="מועדי דיון, תשלומים ומשימות חשובות"
      />

      {notifSupport !== "unsupported" && (
        <BsSection accent="teal" className="mb-6">
          <p className="mb-2 text-sm text-slate-700">
            קבל/י התראה ביום התזכורת או יום לפני (כשהאפליקציה פתוחה או מותקנת
            כ-PWA).
          </p>
          <Button
            variant={notificationsOn ? "secondary" : "primary"}
            onClick={toggleNotifications}
            className="w-full"
          >
            {notificationsOn ? "התראות פעילות ✓" : "הפעל התראות"}
          </Button>
          {notifSupport === "denied" && (
            <p className="mt-2 text-xs text-red-600">
              ההרשאה נחסמה בדפדפן — יש לאפשר בהגדרות האתר.
            </p>
          )}
        </BsSection>
      )}

      {upcoming.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 font-semibold text-slate-900">קרובות</h2>
          <ReminderList
            items={upcoming}
            onToggle={toggleReminder}
            onRemove={removeReminder}
          />
        </section>
      )}

      {upcoming.length === 0 && (
        <p className="mb-6 rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
          אין תזכורות קרובות. הוסיפו תזכורת ראשונה.
        </p>
      )}

      {showForm ? (
        <div className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <Input
            label="כותרת"
            value={title}
            onChange={setTitle}
          />
          <Input
            label="תאריך"
            type="date"
            value={date}
            onChange={setDate}
          />
          <Select
            label="סוג"
            value={type}
            onChange={(v) => setType(v as Reminder["type"])}
            options={[
              { value: "hearing", label: "דיון" },
              { value: "payment", label: "תשלום" },
              { value: "document", label: "מסמך" },
              { value: "other", label: "אחר" },
            ]}
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="flex-1">
              שמור
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
              ביטול
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)} className="mb-6 w-full">
          + תזכורת חדשה
        </Button>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-slate-500">עבר / הושלמו</h2>
          <ReminderList
            items={past}
            onToggle={toggleReminder}
            onRemove={removeReminder}
            muted
          />
        </section>
      )}
    </div>
  );
}

function ReminderList({
  items,
  onToggle,
  onRemove,
  muted,
}: {
  items: Reminder[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  muted?: boolean;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className={`rounded-xl border p-4 ${
            item.done
              ? "border-slate-200 bg-slate-50 opacity-60"
              : "border-slate-200 bg-white"
          } ${muted ? "opacity-70" : ""}`}
        >
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                item.done
                  ? "border-green-600 bg-green-600 text-xs text-white"
                  : "border-slate-300"
              }`}
            >
              {item.done ? "✓" : ""}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[item.type]}`}
                >
                  {typeLabels[item.type]}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(item.date).toLocaleDateString("he-IL")}
                </span>
              </div>
              <p
                className={`mt-1 font-medium ${item.done ? "line-through text-slate-500" : "text-slate-900"}`}
              >
                {item.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              מחק
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
