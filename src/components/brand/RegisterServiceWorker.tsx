"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Capacitor?: unknown;
  }
}

function isCapacitorRuntime(): boolean {
  if (process.env.NEXT_PUBLIC_CAP_BUILD === "1") return true;
  if (typeof window !== "undefined" && window.Capacitor) return true;
  return false;
}

export function RegisterServiceWorker() {
  useEffect(() => {
    if (isCapacitorRuntime()) return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA optional — fail silently
    });
  }, []);

  return null;
}
