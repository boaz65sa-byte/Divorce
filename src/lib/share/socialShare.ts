import { BRAND } from "@/lib/brand/brand";

export type ShareLang = "he" | "en";

export type SharePlatform =
  | "whatsapp"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "telegram"
  | "email"
  | "sms"
  | "reddit"
  | "messenger"
  | "viber"
  | "copy"
  | "native";

export interface ShareContent {
  url: string;
  title: string;
  text: string;
  hashtags?: string[];
}

export interface SharePlatformMeta {
  id: SharePlatform;
  label: string;
  labelEn: string;
  className: string;
}

export const sharePlatforms: SharePlatformMeta[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    labelEn: "WhatsApp",
    className: "bg-[#25D366] text-white hover:opacity-90",
  },
  {
    id: "facebook",
    label: "Facebook",
    labelEn: "Facebook",
    className: "bg-[#1877F2] text-white hover:opacity-90",
  },
  {
    id: "telegram",
    label: "Telegram",
    labelEn: "Telegram",
    className: "bg-[#0088cc] text-white hover:opacity-90",
  },
  {
    id: "twitter",
    label: "X",
    labelEn: "X",
    className: "bg-slate-900 text-white hover:opacity-90",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    labelEn: "LinkedIn",
    className: "bg-[#0A66C2] text-white hover:opacity-90",
  },
  {
    id: "messenger",
    label: "Messenger",
    labelEn: "Messenger",
    className: "bg-gradient-to-br from-[#00B2FF] to-[#006AFF] text-white hover:opacity-90",
  },
  {
    id: "email",
    label: "אימייל",
    labelEn: "Email",
    className: "bg-slate-600 text-white hover:opacity-90",
  },
  {
    id: "sms",
    label: "SMS",
    labelEn: "SMS",
    className: "bg-emerald-600 text-white hover:opacity-90",
  },
  {
    id: "reddit",
    label: "Reddit",
    labelEn: "Reddit",
    className: "bg-[#FF4500] text-white hover:opacity-90",
  },
  {
    id: "viber",
    label: "Viber",
    labelEn: "Viber",
    className: "bg-[#7360F2] text-white hover:opacity-90",
  },
  {
    id: "copy",
    label: "העתק קישור",
    labelEn: "Copy link",
    className: "bg-brand-600 text-white hover:opacity-90",
  },
  {
    id: "native",
    label: "שיתוף מהמכשיר",
    labelEn: "Share device",
    className: "bg-teal-600 text-white hover:opacity-90",
  },
];

export function getAppShareUrl(
  platform?: SharePlatform,
  baseUrl?: string,
): string {
  const origin =
    baseUrl ??
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "https://divorce.vercel.app");

  const url = new URL("/welcome", origin);
  if (platform && platform !== "copy" && platform !== "native") {
    url.searchParams.set("utm_source", "share");
    url.searchParams.set("utm_medium", platform);
    url.searchParams.set("utm_campaign", "tagarshan-li");
  }
  return url.toString();
}

export function getDefaultShareContent(
  lang: ShareLang = "he",
  url?: string,
): ShareContent {
  const shareUrl = url ?? getAppShareUrl();

  if (lang === "en") {
    return {
      url: shareUrl,
      title: `${BRAND.nameEn} — ${BRAND.taglineEn}`,
      text: [
        "Divorce in Israel? Tagarshan Li — knowledge, tools & your personal roadmap.",
        "Child support · Custody · Checklist · Calculators · Free · Hebrew",
        shareUrl,
      ].join("\n"),
      hashtags: ["Divorce", "Israel", "TagarshanLi"],
    };
  }

  return {
    url: shareUrl,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    text: [
      "גירושין בישראל? תגרשן לי — ידע, כלים ומסלול אישי במקום אחד.",
      "מזונות · משמורת · צ'ק-ליסט · מחשבונים · חינם · בעברית",
      shareUrl,
    ].join("\n"),
    hashtags: ["גירושין", "מזונות", "תגרשנלי"],
  };
}

export function buildPlatformShareUrl(
  platform: SharePlatform,
  content: ShareContent,
): string | null {
  const { url, title, text, hashtags = [] } = content;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);
  const tagString = hashtags.map(encodeURIComponent).join(",");

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedText}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${tagString ? `&hashtags=${tagString}` : ""}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    case "email":
      return `mailto:?subject=${encodedTitle}&body=${encodedText}`;
    case "sms":
      return `sms:?body=${encodedText}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    case "messenger":
      return `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=87741124305&redirect_uri=${encodedUrl}`;
    case "viber":
      return `viber://forward?text=${encodedText}`;
    case "copy":
    case "native":
      return null;
    default:
      return null;
  }
}

export async function copyShareContent(content: ShareContent): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content.text);
    return true;
  } catch {
    return false;
  }
}

export async function nativeShare(content: ShareContent): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    await navigator.share({
      title: content.title,
      text: content.text.replace(content.url, "").trim(),
      url: content.url,
    });
    return true;
  } catch {
    return false;
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.share);
}
