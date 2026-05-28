import { BS_SIMPLE } from "@/lib/brand/bsSimple";

export const BRAND = {
  name: "תגרשן לי",
  nameEn: "Tagarshan Li",
  tagline: "מלווה דיגיטלי לגירושין בישראל",
  taglineEn: "Your digital divorce companion in Israel",
  promise: "פשוט. ברור. בדרך שלך.",
  studio: BS_SIMPLE,
  colors: {
    primary: "#4338ca",
    secondary: "#0d9488",
    accent: "#7c3aed",
    warm: "#d97706",
    surface: "#f7f5f2",
  },
} as const;

export type BrandColor = keyof typeof BRAND.colors;
