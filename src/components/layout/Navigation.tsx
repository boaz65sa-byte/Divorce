"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsBrandMark } from "@/components/brand/BsSimple";
import {
  getUpcomingReminders,
  useProfileStore,
} from "@/lib/store/profileStore";

const navItems = [
  { href: "/", label: "בית", icon: "🏠" },
  { href: "/roadmap", label: "מסלול", icon: "🗺️" },
  { href: "/calculators", label: "כלים", icon: "🧮" },
  { href: "/knowledge", label: "ידע", icon: "📚" },
  { href: "/checklist", label: "רשימה", icon: "✅" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/onboarding" || pathname === "/welcome") return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="bs-accent-line absolute inset-x-0 top-0 h-0.5 opacity-50" />
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 py-2">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-0.5 py-1 text-[11px] transition ${
                active
                  ? "font-semibold text-brand-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppHeader() {
  const reminders = useProfileStore((s) => s.reminders);
  const upcomingCount = getUpcomingReminders(reminders).length;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="bs-accent-line absolute inset-x-0 bottom-0 h-0.5 opacity-40" />
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <BsBrandMark size="sm" />
          <span className="text-lg font-bold text-brand-700">תגרשן לי</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/assistant"
            className="text-sm text-slate-600 hover:text-brand-700"
            aria-label="עוזר חכם"
          >
            💬
          </Link>
          <Link
            href="/reminders"
            className="relative text-sm text-slate-600 hover:text-brand-700"
            aria-label="תזכורות"
          >
            🔔
            {upcomingCount > 0 && (
              <span className="absolute -left-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {upcomingCount}
              </span>
            )}
          </Link>
          <Link
            href="/onboarding"
            className="text-sm text-slate-600 hover:text-brand-700"
          >
            פרופיל
          </Link>
        </div>
      </div>
    </header>
  );
}
