"use client";

import type { CalendarDay, ParentSide } from "@/lib/types";

const weekdayLabels = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

interface MonthGridProps {
  days: CalendarDay[];
  parentAName: string;
  parentBName: string;
  onDayClick: (date: string, currentParent: ParentSide) => void;
}

export function MonthGrid({
  days,
  parentAName,
  parentBName,
  onDayClick,
}: MonthGridProps) {
  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-500">
        {weekdayLabels.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isA = day.parent === "a";
          const bg = !day.isCurrentMonth
            ? "bg-slate-50 text-slate-300"
            : isA
              ? "bg-blue-100 text-blue-900"
              : "bg-amber-100 text-amber-900";

          const border = day.isToday
            ? "ring-2 ring-brand-600 ring-offset-1"
            : day.isSaturday
              ? "border border-purple-300"
              : day.isFriday
                ? "border border-purple-200"
                : "border border-transparent";

          return (
            <button
              key={day.date}
              type="button"
              onClick={() =>
                day.isCurrentMonth && onDayClick(day.date, day.parent)
              }
              disabled={!day.isCurrentMonth}
              title={
                day.isCurrentMonth
                  ? `${day.date} — ${isA ? parentAName : parentBName}${
                      day.holiday ? ` (${day.holiday.name})` : ""
                    }`
                  : undefined
              }
              className={`relative flex min-h-[52px] flex-col items-center rounded-lg p-1 text-xs transition hover:opacity-80 disabled:cursor-default disabled:hover:opacity-100 ${bg} ${border}`}
            >
              <span className="font-semibold">{day.dayOfMonth}</span>
              {day.holiday && day.isCurrentMonth && (
                <span className="mt-0.5 line-clamp-2 text-[9px] leading-tight opacity-80">
                  {day.holiday.name}
                </span>
              )}
              {day.isSaturday && day.isCurrentMonth && (
                <span className="absolute left-0.5 top-0.5 text-[8px] text-purple-600">
                  ש
                </span>
              )}
              {day.source === "override" && day.isCurrentMonth && (
                <span className="absolute bottom-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-slate-700" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
