import { describe, expect, it } from "vitest";
import { calcBtlAllowance } from "./btlAllowance";

describe("calcBtlAllowance", () => {
  it("caps allowance at max for children", () => {
    const result = calcBtlAllowance({
      courtOrderAmount: 8000,
      childrenInCustody: 2,
      maritalStatus: "single",
      isBelowRetirementAge: true,
    });

    expect(result.eligible).toBe(true);
    expect(result.estimatedAllowance).toBe(result.maxCap);
    expect(result.maxCap).toBe(890 + 520 * 2);
  });

  it("returns court amount when below cap", () => {
    const result = calcBtlAllowance({
      courtOrderAmount: 1200,
      childrenInCustody: 1,
      maritalStatus: "single",
      isBelowRetirementAge: true,
    });

    expect(result.estimatedAllowance).toBe(1200);
  });

  it("rejects remarried status", () => {
    const result = calcBtlAllowance({
      courtOrderAmount: 3000,
      childrenInCustody: 2,
      maritalStatus: "remarried",
      isBelowRetirementAge: true,
    });

    expect(result.eligible).toBe(false);
  });
});
