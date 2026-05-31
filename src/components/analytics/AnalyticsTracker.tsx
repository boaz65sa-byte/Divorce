"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackVisit } from "@/lib/analytics/client";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const visitSent = useRef(false);

  useEffect(() => {
    if (visitSent.current) return;
    visitSent.current = true;
    trackVisit();
  }, []);

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
