"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { brandIcons, type BrandIconName } from "@/components/brand/BrandIcons";
import { BRAND } from "@/lib/brand/brand";
import {
  getUpcomingReminders,
  useProfileStore,
} from "@/lib/store/profileStore";

const navItems: { href: string; label: string; icon: BrandIconName }[] = [
  { href: "/", label: "בית", icon: "home" },
  { href: "/roadmap", label: "מסלול", icon: "roadmap" },
  { href: "/calculators", label: "כלים", icon: "calculators" },
  { href: "/knowledge", label: "ידע", icon: "knowledge" },
  { href: "/checklist", label: "רשימה", icon: "checklist" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/onboarding" || pathname === "/welcome" || pathname.startsWith("/admin")) return null;

  return (
    <nav className="bs-glass-nav fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-lg px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="flex items-stretch justify-around gap-1 rounded-2xl bg-white/50 p-1">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = brandIcons[item.icon];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] transition-all duration-200 ${
                  active
                    ? "bs-nav-active font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={active ? 2.5 : 2}
                  aria-hidden
                />
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
  const AssistantIcon = brandIcons.assistant;
  const RemindersIcon = brandIcons.reminders;

  return (
    <header className="bs-glass-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Link href="/" className="group flex items-center gap-2.5">
          <LogoMark size={36} className="transition group-hover:scale-105" />
          <div className="leading-tight">
            <span className="block text-base font-black tracking-tight text-slate-900 group-hover:text-brand-700">
              {BRAND.name}
            </span>
            <span className="block text-[9px] font-medium tracking-widest text-slate-400">
              {BRAND.promise}
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/assistant"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-indigo-700 transition hover:bg-indigo-50"
            aria-label="עוזר חכם"
          >
            <AssistantIcon className="h-5 w-5" strokeWidth={2} />
          </Link>
          <Link
            href="/reminders"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-indigo-700 transition hover:bg-indigo-50"
            aria-label="תזכורות"
          >
            <RemindersIcon className="h-5 w-5" strokeWidth={2} />
            {upcomingCount > 0 && (
              <span className="absolute left-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 px-1 text-[9px] font-bold text-white shadow-sm">
                {upcomingCount}
              </span>
            )}
          </Link>
          <Link
            href="/settings"
            className="mr-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-brand-700"
          >
            פרופיל
          </Link>
        </div>
      </div>
    </header>
  );
}
