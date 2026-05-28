import type { Metadata, Viewport } from "next";
import { BottomNav, AppHeader } from "@/components/layout/Navigation";
import { BsPageAccent, BsPatternBg, BsSignature } from "@/components/brand/BsSimple";
import { RegisterServiceWorker } from "@/components/brand/RegisterServiceWorker";
import { ReminderNotificationSync } from "@/components/brand/ReminderNotificationSync";
import { LegalDisclaimer } from "@/components/ui";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "תגרשן לי — מדריך וכלים לגירושין",
  description:
    "ידע משפטי, צ'ק-ליסט, מחשבוני מזונות וחלוקת הוצאות לגירושין בישראל · bs-simple · בועז סעדה",
  manifest: "/manifest.json",
  authors: [{ name: BS_SIMPLE.author }],
  creator: BS_SIMPLE.signature,
  keywords: ["גירושין", "מזונות", "משמורת", "bs-simple", "בועז סעדה"],
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    title: "תגרשן לי — מדריך וכלים לגירושין בישראל",
    description:
      "גירושין בישראל — ידע משפטי, מחשבונים, לוח משמורת ומפת דרכים. חינם, בעברית, פרטי.",
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: "/images/cover.jpeg",
        width: 1024,
        height: 683,
        alt: "תגרשן לי — מלווה דיגיטלי לגירושין בישראל",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "תגרשן לי",
    description: BS_SIMPLE.tagline,
    images: ["/images/cover.jpeg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen antialiased">
        <RegisterServiceWorker />
        <ReminderNotificationSync />
        <BsPatternBg>
          <AppHeader />
          <main className="relative mx-auto min-h-screen max-w-lg px-4 pb-28 pt-4">
            <BsPageAccent />
            <div className="relative">{children}</div>
            <div className="relative mt-8">
              <LegalDisclaimer compact />
              <BsSignature compact />
            </div>
          </main>
          <BottomNav />
        </BsPatternBg>
      </body>
    </html>
  );
}
