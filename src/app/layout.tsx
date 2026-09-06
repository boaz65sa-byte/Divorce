import type { Metadata, Viewport } from "next";
import { BottomNav, AppHeader } from "@/components/layout/Navigation";
import { BsPageAccent, BsPatternBg, BsSignature } from "@/components/brand/BsSimple";
import { RegisterServiceWorker } from "@/components/brand/RegisterServiceWorker";
import { ReminderNotificationSync } from "@/components/brand/ReminderNotificationSync";
import { MonetizationInit } from "@/components/brand/MonetizationInit";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { LegalDisclaimer } from "@/components/ui";
import { BRAND } from "@/lib/brand/brand";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";
import { rubik } from "@/lib/fonts";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    `${BRAND.tagline}. ידע משפטי, צ'ק-ליסט, מחשבוני מזונות ולוח משמורת · ${BS_SIMPLE.signature}`,
  manifest: "/manifest.json",
  authors: [{ name: BS_SIMPLE.author }],
  creator: BS_SIMPLE.signature,
  keywords: ["גירושין", "מזונות", "משמורת", "bs-simple", "בועז סעדה"],
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.promise,
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
    title: BRAND.name,
    description: BRAND.tagline,
    images: ["/images/cover.jpeg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#4338ca",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body className={`${rubik.className} min-h-screen antialiased`}>
        <a href="#main-content" className="skip-link">
          דלג לתוכן הראשי
        </a>
        <RegisterServiceWorker />
        <ReminderNotificationSync />
        <MonetizationInit />
        <AnalyticsTracker />
        <BsPatternBg>
          <AppHeader />
          <main
            id="main-content"
            className="relative mx-auto min-h-screen max-w-lg px-4 pb-28 pt-4"
            tabIndex={-1}
          >
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
