export type AnalyticsEventType = "visit" | "page_view" | "feature";

export interface AnalyticsTrackPayload {
  type: AnalyticsEventType;
  sessionId: string;
  path?: string;
  feature?: string;
}

export interface AnalyticsStats {
  totalVisits: number;
  uniqueSessions: number;
  totalPageViews: number;
  totalFeatureUses: number;
  topPages: { path: string; count: number }[];
  topFeatures: { feature: string; count: number }[];
  daily: { date: string; visits: number; pageViews: number }[];
  storage: "redis" | "file" | "none";
  updatedAt: string;
}

export interface AnalyticsStore {
  totalVisits: number;
  totalPageViews: number;
  totalFeatureUses: number;
  sessions: string[];
  pages: Record<string, number>;
  features: Record<string, number>;
  daily: Record<string, { visits: number; pageViews: number }>;
}

export function emptyStore(): AnalyticsStore {
  return {
    totalVisits: 0,
    totalPageViews: 0,
    totalFeatureUses: 0,
    sessions: [],
    pages: {},
    features: {},
    daily: {},
  };
}
