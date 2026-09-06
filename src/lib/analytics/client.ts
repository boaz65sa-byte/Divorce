"use client";

import { Capacitor } from "@capacitor/core";
import type { AnalyticsEventType } from "./types";

const SESSION_KEY = "tagarshan-analytics-session";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

async function sendEvent(payload: {
  type: AnalyticsEventType;
  path?: string;
  feature?: string;
}): Promise<void> {
  if (Capacitor.isNativePlatform()) return;

  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        sessionId: getSessionId(),
      }),
      keepalive: true,
    });
  } catch {
    // analytics should never break the app
  }
}

export function trackVisit(): void {
  void sendEvent({ type: "visit" });
}

export function trackPageView(path: string): void {
  if (path.startsWith("/admin")) return;
  void sendEvent({ type: "page_view", path });
}

export function trackFeature(feature: string): void {
  void sendEvent({ type: "feature", feature });
}
