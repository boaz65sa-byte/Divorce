import type { Metadata, Viewport } from "next";
import { BottomNav, AppHeader } from "@/components/layout/Navigation";
import { BsPageAccent, BsPatternBg, BsSignature } from "@/components/brand/BsSimple";
import { RegisterServiceWorker } from "@/components/brand/RegisterServiceWorker";
import { LegalDisclaimer } from "@/components/ui";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";
import "./globals.css";

export const metadata: Metadata = {
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
    title: "תגרשן לי",
    description: BS_SIMPLE.tagline,
    locale: "he_IL",
    type: "website",
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
