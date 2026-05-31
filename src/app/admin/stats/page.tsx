"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Input, PageHeader, StatBox } from "@/components/ui";
import type { AnalyticsStats } from "@/lib/analytics/types";

const SECRET_STORAGE_KEY = "tagarshan-admin-secret";

export default function AdminStatsPage() {
  const [secret, setSecret] = useState("");
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async (adminSecret: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/analytics/stats?secret=${encodeURIComponent(adminSecret)}`,
      );
      if (!response.ok) {
        setStats(null);
        setError("סיסמה שגויה או אין הרשאה");
        return;
      }
      const data = (await response.json()) as AnalyticsStats;
      setStats(data);
      sessionStorage.setItem(SECRET_STORAGE_KEY, adminSecret);
    } catch {
      setError("שגיאה בטעינת הנתונים");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(SECRET_STORAGE_KEY);
    if (saved) {
      setSecret(saved);
      void loadStats(saved);
    }
  }, [loadStats]);

  return (
    <div>
      <PageHeader
        title="סטטיסטיקות שימוש"
        subtitle="מונה כניסות, צפיות ושימוש בכלים — לבעלי האפליקציה בלבד"
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <Input
          label="סיסמת מנהל (ADMIN_STATS_SECRET)"
          type="password"
          value={secret}
          onChange={setSecret}
          hint="הגדר/י ב-Vercel: Environment Variables → ADMIN_STATS_SECRET"
        />
        <Button
          className="mt-3 w-full"
          onClick={() => loadStats(secret)}
          disabled={!secret || loading}
        >
          {loading ? "טוען..." : "טען סטטיסטיקות"}
        </Button>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </div>

      {stats && (
        <>
          <div className="mb-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
            אחסון:{" "}
            {stats.storage === "redis"
              ? "Upstash Redis (פרודקשן)"
              : stats.storage === "file"
                ? "קובץ מקומי (פיתוח)"
                : "לא מוגדר — הוסף/י Upstash Redis ב-Vercel"}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="סה״כ כניסות"
              value={String(stats.totalVisits)}
              highlight
            />
            <StatBox
              label="משתמשים ייחודיים"
              value={String(stats.uniqueSessions)}
            />
            <StatBox
              label="צפיות בדפים"
              value={String(stats.totalPageViews)}
            />
            <StatBox
              label="שימוש בכלים"
              value={String(stats.totalFeatureUses)}
            />
          </div>

          {stats.daily.length > 0 && (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-3 font-semibold">30 ימים אחרונים</h2>
              <div className="space-y-2 text-sm">
                {stats.daily.map((day) => (
                  <div
                    key={day.date}
                    className="flex justify-between border-b border-slate-100 pb-2"
                  >
                    <span>{day.date}</span>
                    <span>
                      {day.visits} כניסות · {day.pageViews} צפיות
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {stats.topPages.length > 0 && (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-3 font-semibold">דפים פופולריים</h2>
              <ul className="space-y-2 text-sm">
                {stats.topPages.map((row) => (
                  <li key={row.path} className="flex justify-between">
                    <span dir="ltr">{row.path}</span>
                    <span className="font-medium">{row.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {stats.topFeatures.length > 0 && (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-3 font-semibold">כלים בשימוש</h2>
              <ul className="space-y-2 text-sm">
                {stats.topFeatures.map((row) => (
                  <li key={row.feature} className="flex justify-between">
                    <span>{row.feature}</span>
                    <span className="font-medium">{row.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="mt-4 text-xs text-slate-500">
            עודכן: {new Date(stats.updatedAt).toLocaleString("he-IL")}
          </p>
        </>
      )}

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-semibold">הגדרה ב-Vercel (חובה לפרודקשן)</p>
        <ol className="mt-2 list-decimal space-y-1 pr-5">
          <li>Vercel → Storage → Create Upstash Redis</li>
          <li>Environment: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN</li>
          <li>Environment: ADMIN_STATS_SECRET (סיסמה שלך)</li>
          <li>Redeploy</li>
        </ol>
        <p className="mt-2">
          דף זה: <code dir="ltr">/admin/stats</code>
        </p>
      </div>
    </div>
  );
}
