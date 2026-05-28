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
    <nav className="bs-glass-nav fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-lg px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="flex items-stretch justify-around gap-1 rounded-2xl bg-white/50 p-1">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] transition-all duration-200 ${
                  active
                    ? "bs-nav-active font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function AppHeader() {
  const reminders = useProfileStore((s) => s.reminders);
  const upcomingCount = getUpcomingReminders(reminders).length;

  return (
    <header className="bs-glass-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <BsBrandMark size="sm" />
          <div className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-slate-900 group-hover:text-brand-700">
              תגרשן לי
            </span>
            <span className="block text-[9px] font-medium tracking-widest text-slate-400 uppercase">
              bs-simple
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/assistant"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-base transition hover:bg-indigo-50"
            aria-label="עוזר חכם"
          >
            💬
          </Link>
          <Link
            href="/reminders"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-base transition hover:bg-indigo-50"
            aria-label="תזכורות"
          >
            🔔
            {upcomingCount > 0 && (
              <span className="absolute left-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 px-1 text-[9px] font-bold text-white shadow-sm">
                {upcomingCount}
              </span>
            )}
          </Link>
          <Link
            href="/onboarding"
            className="mr-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-brand-700"
          >
            פרופיל
          </Link>
        </div>
      </div>
    </header>
  );
}
