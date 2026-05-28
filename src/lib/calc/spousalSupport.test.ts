import { describe, expect, it } from "vitest";
import { calcSpousalSupport } from "./spousalSupport";

describe("calcSpousalSupport", () => {
  it("returns low range when wife earns close to husband", () => {
    const result = calcSpousalSupport({
      husbandIncome: 15000,
      wifeIncome: 12000,
      court: "family",
      marriageYears: 5,
      wifeWorks: true,
    });

    expect(result.estimatedMax).toBeLessThanOrEqual(1500);
  });

  it("returns higher range when wife does not work", () => {
    const result = calcSpousalSupport({
      husbandIncome: 20000,
      wifeIncome: 0,
      court: "rabbinical",
      marriageYears: 8,
      wifeWorks: false,
    });

    expect(result.estimatedMid).toBeGreaterThan(2000);
  });

  it("reduces estimate for short marriage", () => {
    const long = calcSpousalSupport({
      husbandIncome: 18000,
      wifeIncome: 3000,
      court: "family",
      marriageYears: 12,
      wifeWorks: true,
    });

    const short = calcSpousalSupport({
      husbandIncome: 18000,
      wifeIncome: 3000,
      court: "family",
      marriageYears: 2,
      wifeWorks: true,
    });

    expect(short.estimatedMid).toBeLessThan(long.estimatedMid);
  });
});
