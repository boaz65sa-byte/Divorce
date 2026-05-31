import type { FeedbackEntry } from "@/lib/types";

const FEEDBACK_KEY = "tagarshan-li-feedback";

export function getFeedbackEntries(): FeedbackEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FeedbackEntry[];
  } catch {
    return [];
  }
}

export function saveFeedbackEntry(
  entry: Omit<FeedbackEntry, "id" | "createdAt">,
): FeedbackEntry {
  const full: FeedbackEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const entries = [full, ...getFeedbackEntries()].slice(0, 50);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries));
  return full;
}

export function exportFeedbackJson(entries: FeedbackEntry[]): void {
  const blob = new Blob([JSON.stringify(entries, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tagarshan-li-feedback-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildFeedbackMailto(entry: FeedbackEntry): string {
  const subject = encodeURIComponent(`תגרשן לי — משוב (${entry.category})`);
  const body = encodeURIComponent(
    [
      `דירוג: ${entry.rating}/5`,
      `קטגוריה: ${entry.category}`,
      entry.page ? `עמוד: ${entry.page}` : "",
      entry.email ? `אימייל: ${entry.email}` : "",
      "",
      entry.message,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return `mailto:?subject=${subject}&body=${body}`;
}
