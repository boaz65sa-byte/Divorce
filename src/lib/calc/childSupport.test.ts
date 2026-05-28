import { describe, expect, it } from "vitest";
import { calcChildSupport } from "./childSupport";

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
});
