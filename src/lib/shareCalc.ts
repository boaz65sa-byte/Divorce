import type { ShareCalcPayload } from "./types";

export function encodeSharePayload(payload: ShareCalcPayload): string {
  return btoa(JSON.stringify(payload));
}

export function decodeSharePayload(encoded: string): ShareCalcPayload | null {
  try {
    const json = atob(encoded);
    return JSON.parse(json) as ShareCalcPayload;
  } catch {
    return null;
  }
}

export function buildShareUrl(payload: ShareCalcPayload): string {
  if (typeof window === "undefined") return "";
  const data = encodeSharePayload(payload);
  return `${window.location.origin}/share?d=${encodeURIComponent(data)}`;
}

export function buildQrUrl(text: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
}
