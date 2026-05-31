import type { AnalyticsStore, AnalyticsTrackPayload } from "./types";

export function applyAnalyticsEvent(
  store: AnalyticsStore,
  payload: AnalyticsTrackPayload,
  day = new Date().toISOString().slice(0, 10),
): AnalyticsStore {
  const next: AnalyticsStore = {
    ...store,
    sessions: [...store.sessions],
    pages: { ...store.pages },
    features: { ...store.features },
    daily: { ...store.daily },
  };

  if (!next.daily[day]) {
    next.daily[day] = { visits: 0, pageViews: 0 };
  }

  const addSession = () => {
    if (!next.sessions.includes(payload.sessionId)) {
      next.sessions.push(payload.sessionId);
    }
  };

  if (payload.type === "visit") {
    next.totalVisits += 1;
    next.daily[day].visits += 1;
    addSession();
    return next;
  }

  if (payload.type === "page_view" && payload.path) {
    next.totalPageViews += 1;
    next.daily[day].pageViews += 1;
    next.pages[payload.path] = (next.pages[payload.path] ?? 0) + 1;
    addSession();
    return next;
  }

  if (payload.type === "feature" && payload.feature) {
    next.totalFeatureUses += 1;
    next.features[payload.feature] = (next.features[payload.feature] ?? 0) + 1;
    addSession();
  }

  return next;
}
