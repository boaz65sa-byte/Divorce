import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating,
  type BannerAdOptions,
} from "@capacitor-community/admob";
import { getBannerAdUnitId, usesLiveAds } from "./adIds";
import { hasRemovedAds } from "./purchases";

const BANNER_SHOWN_CLASS = "has-ad-banner";
// Lift the banner above the fixed bottom nav (~88pt on a typical iPhone).
const BANNER_MARGIN_ABOVE_NAV = 88;

function platform(): "ios" | "android" {
  return Capacitor.getPlatform() === "ios" ? "ios" : "android";
}

let initialized = false;
let adsAllowed = true;

function setBannerShown(shown: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle(BANNER_SHOWN_CLASS, shown);
}

async function requestConsentThenContinue(): Promise<boolean> {
  try {
    const info = await AdMob.requestConsentInfo();
    if (
      info.isConsentFormAvailable &&
      info.status === AdmobConsentStatus.REQUIRED
    ) {
      const after = await AdMob.showConsentForm();
      return after.canRequestAds;
    }
    return info.canRequestAds;
  } catch {
    // UMP not configured yet in the AdMob console — still request ads.
    return true;
  }
}

export async function initializeAds(): Promise<void> {
  if (!Capacitor.isNativePlatform() || initialized) return;

  if (platform() === "ios") {
    try {
      const { status } = await AdMob.trackingAuthorizationStatus();
      if (status === "notDetermined") {
        await AdMob.requestTrackingAuthorization();
      }
    } catch {
      // ATT unavailable (older iOS) — ads still show, non-personalized
    }
  }

  adsAllowed = await requestConsentThenContinue();

  const testing = !usesLiveAds(platform());
  await AdMob.initialize({
    initializeForTesting: testing,
    maxAdContentRating: MaxAdContentRating.ParentalGuidance,
  });
  initialized = true;
}

export async function showBannerIfAllowed(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (await hasRemovedAds()) return;
  await initializeAds();
  if (!adsAllowed) return;

  const options: BannerAdOptions = {
    adId: getBannerAdUnitId(platform()),
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: BANNER_MARGIN_ABOVE_NAV,
    isTesting: !usesLiveAds(platform()),
  };
  try {
    await AdMob.showBanner(options);
    setBannerShown(true);
  } catch {
    setBannerShown(false);
  }
}

export async function hideBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.hideBanner();
  } catch {
    // no-op
  }
  setBannerShown(false);
}
