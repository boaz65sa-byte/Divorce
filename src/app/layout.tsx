import type { Metadata, Viewport } from "next";
import { BottomNav, AppHeader } from "@/components/layout/Navigation";
import { LegalDisclaimer } from "@/components/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "תגרשן לי — מדריך וכלים לגירושין",
  description:
    "ידע משפטי, צ'ק-ליסט, מחשבוני מזונות וחלוקת הוצאות לגירושין בישראל",
  manifest: "/manifest.json",
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
        <AppHeader />
        <main className="mx-auto min-h-screen max-w-lg px-4 pb-28 pt-4">
          {children}
          <div className="mt-8">
            <LegalDisclaimer compact />
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
