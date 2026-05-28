import { describe, expect, it } from "vitest";
import { calcAssetBalance } from "./assetBalance";

describe("calcAssetBalance", () => {
  it("calculates 50/50 share of marital net", () => {
    const result = calcAssetBalance(
      [
        { id: "1", name: "דירה", value: 1000000, acquiredDuringMarriage: true },
        { id: "2", name: "ירושה", value: 200000, acquiredDuringMarriage: false },
      ],
      [{ id: "d1", name: "משכנתא", amount: 400000, isHouseholdDebt: true }],
    );

    expect(result.maritalAssets).toBe(1000000);
    expect(result.excludedAssets).toBe(200000);
    expect(result.netMarital).toBe(600000);
    expect(result.sharePerSpouse).toBe(300000);
  });

  it("excludes personal debts from marital net", () => {
    const result = calcAssetBalance(
      [{ id: "1", name: "חיסכון", value: 100000, acquiredDuringMarriage: true }],
      [
        { id: "d1", name: "הלוואה אישית", amount: 30000, isHouseholdDebt: false },
        { id: "d2", name: "חוב משותף", amount: 20000, isHouseholdDebt: true },
      ],
    );

    expect(result.personalDebts).toBe(30000);
    expect(result.sharedDebts).toBe(20000);
    expect(result.netMarital).toBe(80000);
    expect(result.sharePerSpouse).toBe(40000);
  });
});
