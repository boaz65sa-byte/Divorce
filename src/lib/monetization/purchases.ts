import { Capacitor } from "@capacitor/core";
import { Purchases } from "@revenuecat/purchases-capacitor";

// TODO: replace with real public SDK keys once the project exists at app.revenuecat.com
// (see capacitor-iap-remove-ads skill). Public keys, safe to embed in client code.
const REVENUECAT_API_KEYS: Record<"ios" | "android", string> = {
  ios: "REPLACE_WITH_IOS_REVENUECAT_KEY",
  android: "REPLACE_WITH_ANDROID_REVENUECAT_KEY",
};

const ENTITLEMENT_ID = "no_ads";

let configured = false;

function platform(): "ios" | "android" {
  return Capacitor.getPlatform() === "ios" ? "ios" : "android";
}

function isConfigurable(): boolean {
  return Capacitor.isNativePlatform() && !REVENUECAT_API_KEYS[platform()].startsWith("REPLACE_");
}

export async function configurePurchases(): Promise<void> {
  if (configured || !isConfigurable()) return;
  await Purchases.configure({ apiKey: REVENUECAT_API_KEYS[platform()] });
  configured = true;
}

export async function hasRemovedAds(): Promise<boolean> {
  if (!configured) return false;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}

export async function purchaseRemoveAds(): Promise<boolean> {
  if (!configured) return false;
  const offerings = await Purchases.getOfferings();
  const pkg = offerings.current?.availablePackages[0];
  if (!pkg) return false;

  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false; // includes user-cancelled purchase
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!configured) return false;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}
