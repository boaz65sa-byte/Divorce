import { describe, expect, it } from "vitest";
import { calcAllExpenses, splitExpense } from "./expenseSplit";

describe("splitExpense", () => {
  it("splits 50-50", () => {
    const result = splitExpense(
      { id: "1", name: "test", amount: 1000, split: "50-50" },
      20000,
      8000,
    );
    expect(result.parentA).toBe(500);
    expect(result.parentB).toBe(500);
  });

  it("splits by income ratio", () => {
    const result = splitExpense(
      { id: "1", name: "test", amount: 1000, split: "by-income" },
      7500,
      2500,
    );
    expect(result.parentA).toBe(750);
    expect(result.parentB).toBe(250);
  });

  it("splits custom percentages", () => {
    const result = splitExpense(
      {
        id: "1",
        name: "test",
        amount: 900,
        split: "custom",
        percentA: 60,
        percentB: 40,
      },
      0,
      0,
    );
    expect(result.parentA).toBe(540);
    expect(result.parentB).toBe(360);
  });
});

describe("calcAllExpenses", () => {
  it("sums totals across expenses", () => {
    const { totalA, totalB } = calcAllExpenses(
      [
        { id: "1", name: "a", amount: 200, split: "50-50" },
        { id: "2", name: "b", amount: 300, split: "50-50" },
      ],
      10000,
      10000,
    );
    expect(totalA).toBe(250);
    expect(totalB).toBe(250);
  });
});
