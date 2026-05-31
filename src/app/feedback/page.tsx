"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button, Input, PageHeader, Select } from "@/components/ui";
import {
  buildFeedbackMailto,
  exportFeedbackJson,
  getFeedbackEntries,
  saveFeedbackEntry,
} from "@/lib/feedback/feedbackStore";
import { trackFeature } from "@/lib/analytics/client";

const categories = [
  { value: "bug", label: "באג / תקלה" },
  { value: "calculator", label: "מחשבון" },
  { value: "ux", label: "חוויית שימוש" },
  { value: "content", label: "תוכן / דיוק משפטי" },
  { value: "feature", label: "בקשת פיצ'ר" },
  { value: "other", label: "אחר" },
];

export default function FeedbackPage() {
  const pathname = usePathname();
  const [rating, setRating] = useState(4);
  const [category, setCategory] = useState("ux");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [entryCount] = useState(() =>
    typeof window !== "undefined" ? getFeedbackEntries().length : 0,
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    const entry = saveFeedbackEntry({
      rating,
      category,
      message: message.trim(),
      email: email.trim() || undefined,
      page: pathname,
    });

    trackFeature("feedback_submit");

    setSubmitted(true);
    setSavedEntryId(entry.id);
    setMessage("");
  };

  return (
    <div>
      <PageHeader
        title="משוב ובטא"
        subtitle="עוזר/ים לנו לשפר — המשוב נשמר במכשיר שלך"
      />

      <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
        <p className="font-semibold">תודה על השתתפות בבטא!</p>
        <p className="mt-1">
          המשוב נשמר מקומית. אפשר לייצא קובץ JSON ולשלוח למפתח, או לפתוח
          הודעת אימייל.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="font-semibold text-green-900">תודה! המשוב נשמר.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => exportFeedbackJson(getFeedbackEntries())}
            >
              ייצוא JSON
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const entry = getFeedbackEntries().find(
                  (item) => item.id === savedEntryId,
                );
                if (entry) window.location.href = buildFeedbackMailto(entry);
              }}
            >
              שליחה באימייל
            </Button>
            <Button variant="ghost" onClick={() => setSubmitted(false)}>
              שליחת משוב נוסף
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-slate-700">
              דירוג כללי
            </legend>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                    rating >= value
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  aria-label={`${value} כוכבים`}
                  aria-pressed={rating >= value}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>

          <Select
            label="קטגוריה"
            value={category}
            onChange={setCategory}
            options={categories}
          />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              מה עבד / מה חסר?
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="bs-input w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="למשל: המחשבון לא ברור, חסר שלב בצ'ק-ליסט..."
            />
          </label>

          <Input
            label="אימייל (אופציונלי — לחזרה אליך)"
            type="email"
            value={email}
            onChange={setEmail}
          />

          <Button type="submit" className="w-full" disabled={!message.trim()}>
            שליחת משוב
          </Button>
        </form>
      )}

      <p className="mt-6 text-xs text-slate-500">
        {entryCount} משובים שמורים במכשיר. אין שליחה אוטומטית לשרת — הפרטיות
        שלך נשמרת.
      </p>
    </div>
  );
}
