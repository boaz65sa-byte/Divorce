"use client";

import { useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import { trackFeature } from "@/lib/analytics/client";
import {
  buildPlatformShareUrl,
  canNativeShare,
  copyShareContent,
  getAppShareUrl,
  getDefaultShareContent,
  nativeShare,
  sharePlatforms,
  type ShareLang,
  type SharePlatform,
} from "@/lib/share/socialShare";

interface SocialShareButtonsProps {
  lang?: ShareLang;
  url?: string;
  title?: string;
  text?: string;
  heading?: string;
  compact?: boolean;
  showNative?: boolean;
}

export function SocialShareButtons({
  lang = "he",
  url,
  title,
  text,
  heading,
  compact = false,
  showNative = true,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");

  const content = useMemo(() => {
    const shareUrl = url ?? getAppShareUrl();
    const base = getDefaultShareContent(lang, shareUrl);
    return {
      ...base,
      title: title ?? base.title,
      text: text ?? base.text,
    };
  }, [lang, url, title, text]);

  const platforms = useMemo(
    () =>
      sharePlatforms.filter(
        (platform) =>
          platform.id !== "native" ||
          (showNative && canNativeShare()),
      ),
    [showNative],
  );

  const handleShare = async (platform: SharePlatform) => {
    trackFeature(`share_${platform}`);

    if (platform === "copy") {
      const ok = await copyShareContent(content);
      setCopied(ok);
      setStatus(
        ok
          ? lang === "he"
            ? "הועתק! הדבק/י ב-Instagram, סטטוס או קבוצה"
            : "Copied! Paste on Instagram, status or group"
          : lang === "he"
            ? "לא הצליח — העתק/י ידנית"
            : "Copy failed",
      );
      setTimeout(() => {
        setCopied(false);
        setStatus("");
      }, 3500);
      return;
    }

    if (platform === "native") {
      const ok = await nativeShare(content);
      if (!ok) {
        setStatus(lang === "he" ? "שיתוף לא זמין" : "Share unavailable");
      }
      return;
    }

    const shareUrl = buildPlatformShareUrl(platform, content);
    if (!shareUrl) return;

    if (platform === "email" || platform === "sms" || platform === "viber") {
      window.location.href = shareUrl;
      return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=520");
  };

  const defaultHeading =
    lang === "he" ? "שתף/י את האפליקציה" : "Share the app";

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white ${
        compact ? "p-4" : "p-5"
      }`}
      aria-label={heading ?? defaultHeading}
    >
      <div className="mb-3 flex items-center gap-2">
        <Share2 className="h-5 w-5 text-brand-600" aria-hidden />
        <h2 className="font-semibold text-slate-900">
          {heading ?? defaultHeading}
        </h2>
      </div>

      {!compact && (
        <p className="mb-4 text-sm text-slate-600">
          {lang === "he"
            ? "עוזר/ים למישהו שצריך — שתף/י ב-WhatsApp, פייסבוק, לינקדאין ועוד"
            : "Help someone who needs it — share on WhatsApp, Facebook, LinkedIn and more"}
        </p>
      )}

      <div
        className={`grid gap-2 ${
          compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3"
        }`}
      >
        {platforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => void handleShare(platform.id)}
            className={`flex min-h-11 items-center justify-center rounded-xl px-2 py-2.5 text-xs font-bold transition ${platform.className}`}
          >
            {lang === "he" ? platform.label : platform.labelEn}
          </button>
        ))}
      </div>

      {(status || copied) && (
        <p className="mt-3 text-center text-sm font-medium text-green-700">
          {status || (lang === "he" ? "הועתק!" : "Copied!")}
        </p>
      )}

      {!compact && (
        <p className="mt-3 text-[11px] text-slate-400">
          {lang === "he"
            ? "Instagram: לחץ/י «העתק קישור» והדבק/י בסטורי או ביופי"
            : "Instagram: tap Copy link and paste in story or bio"}
        </p>
      )}
    </section>
  );
}
