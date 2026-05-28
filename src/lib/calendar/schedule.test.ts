import { describe, expect, it } from "vitest";
import {
  buildMonthCalendar,
  calcRolling14DayStats,
  getDefaultCycle,
  getDefaultScheduleSettings,
  resolveDay,
} from "./schedule";

describe("custody schedule", () => {
  it("2-2-3 cycle repeats every 14 days", () => {
    const settings = getDefaultScheduleSettings();
    settings.cycleStartDate = "2026-05-01";

    const day0 = resolveDay(settings, "2026-05-01").parent;
    const day14 = resolveDay(settings, "2026-05-15").parent;
    expect(day0).toBe(day14);
  });

  it("day override takes precedence", () => {
    const settings = getDefaultScheduleSettings();
    settings.dayOverrides["2026-05-10"] = "b";

    expect(resolveDay(settings, "2026-05-10").parent).toBe("b");
    expect(resolveDay(settings, "2026-05-10").source).toBe("override");
  });

  it("rolling 14 days sums to 14", () => {
    const settings = getDefaultScheduleSettings();
    settings.cycleStartDate = "2026-05-01";
    const stats = calcRolling14DayStats(settings, "2026-05-28");
    expect(stats.nightsA + stats.nightsB).toBe(14);
  });

  it("week-alternate gives 7+7 in cycle", () => {
    const cycle = getDefaultCycle("week-alternate");
    const aCount = cycle.filter((d) => d === "a").length;
    const bCount = cycle.filter((d) => d === "b").length;
    expect(aCount).toBe(7);
    expect(bCount).toBe(7);
  });

  it("builds 42 day grid", () => {
    const settings = getDefaultScheduleSettings();
    const days = buildMonthCalendar(settings, 2026, 4);
    expect(days).toHaveLength(42);
    expect(days.filter((d) => d.isCurrentMonth).length).toBe(31);
  });
});
