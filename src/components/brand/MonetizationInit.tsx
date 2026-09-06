"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { showBannerIfAllowed } from "@/lib/monetization/ads";

export function MonetizationInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    void showBannerIfAllowed();
  }, []);

  return null;
}
