// Google's official test IDs — always fill with a "Test Ad" placeholder.
// Safe for simulator/dev. Never click live ads on a device you control.
const TEST_AD_IDS = {
  ios: {
    banner: "ca-app-pub-3940256099942544/2934735716",
  },
  android: {
    banner: "ca-app-pub-3940256099942544/6300978111",
  },
} as const;

// Paste real Banner Ad Unit IDs from admob.google.com before the store archive.
// Also replace the App ID in:
//   ios/App/App/Info.plist → GADApplicationIdentifier
//   android/app/src/main/AndroidManifest.xml → com.google.android.gms.ads.APPLICATION_ID
export const LIVE_AD_IDS = {
  ios: {
    banner: "ca-app-pub-4350877545415820/4444772308",
  },
  android: {
    banner: "",
  },
} as const;

export function usesLiveAds(platform: "ios" | "android"): boolean {
  return Boolean(LIVE_AD_IDS[platform].banner);
}

export function getBannerAdUnitId(platform: "ios" | "android"): string {
  return LIVE_AD_IDS[platform].banner || TEST_AD_IDS[platform].banner;
}
