import { describe, expect, it } from "vitest";
import {
  calcChildSupport,
  calcMonthsUntilSupportEnd,
  formatSupportDuration,
  CHILD_SUPPORT_END_AGE,
} from "./childSupport";

describe("calcChildSupport", () => {
  it("calculates 919/15 transfer for one child over 6", () => {
    const result = calcChildSupport({
      children: [{ age: 8, daysWithParentA: 6 }],
      incomeA: 20000,
      incomeB: 13400,
      housingCost: 0,
      court: "family",
    });

    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0].transferFromAToB).toBeCloseTo(383, 0);
  });

  it("charges father for under-6 children", () => {
    const result = calcChildSupport({
      children: [{ age: 4, daysWithParentA: 0 }],
      incomeA: 15000,
      incomeB: 8000,
      housingCost: 0,
      court: "family",
      parentAIsFather: true,
    });

    expect(result.under6Total).toBe(2250);
    expect(result.direction).toBe("a-to-b");
  });

  it("returns zero transfer when income and custody are balanced", () => {
    const result = calcChildSupport({
      children: [{ age: 10, daysWithParentA: 7 }],
      incomeA: 10000,
      incomeB: 10000,
      housingCost: 0,
      court: "family",
    });

    expect(result.amount).toBeCloseTo(0, 0);
  });

  it("includes support duration until age 18", () => {
    const result = calcChildSupport({
      children: [
        { age: 8, daysWithParentA: 6 },
        { age: 14, daysWithParentA: 6 },
      ],
      incomeA: 15000,
      incomeB: 10000,
      housingCost: 0,
      court: "family",
    });

    expect(result.durations).toHaveLength(2);
    expect(result.durations[0].monthsRemaining).toBe(
      calcMonthsUntilSupportEnd(8),
    );
    expect(result.longestRemainingMonths).toBe(calcMonthsUntilSupportEnd(8));
    expect(result.totalEstimatedRemaining).toBeGreaterThan(0);
  });
});

describe("support duration helpers", () => {
  it("calculates months until age 18", () => {
    expect(calcMonthsUntilSupportEnd(8)).toBe(120);
    expect(calcMonthsUntilSupportEnd(18)).toBe(0);
    expect(calcMonthsUntilSupportEnd(17)).toBe(12);
  });

  it("formats duration in Hebrew", () => {
    expect(formatSupportDuration(0)).toContain("מסתיים");
    expect(formatSupportDuration(11)).toBe("11 חודשים");
    expect(formatSupportDuration(24)).toBe("2 שנים");
    expect(formatSupportDuration(26)).toBe("2 שנים ו-2 חודשים");
  });

  it("uses default end age constant", () => {
    expect(CHILD_SUPPORT_END_AGE).toBe(18);
  });
});
