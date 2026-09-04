"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackVisit } from "@/lib/analytics/client";

declare global {
  interface Window {
    Capacitor?: unknown;
  }
}

function isCapBuild(): boolean {
  if (process.env.NEXT_PUBLIC_CAP_BUILD === "1") return true;
  if (typeof window !== "undefined" && window.Capacitor) return true;
  return false;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const visitSent = useRef(false);

  useEffect(() => {
    if (isCapBuild()) return;
    if (visitSent.current) return;
    visitSent.current = true;
    trackVisit();
  }, []);

  useEffect(() => {
    if (isCapBuild()) return;
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
