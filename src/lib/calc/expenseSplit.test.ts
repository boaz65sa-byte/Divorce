import { describe, expect, it } from "vitest";
import {
  calcAllExpenses,
  defaultChildPercents,
  splitExpense,
} from "./expenseSplit";

describe("splitExpense", () => {
  it("splits 50-50", () => {
    const result = splitExpense(
      { id: "1", name: "test", amount: 1000, split: "50-50" },
      20000,
      8000,
    );
    expect(result.parentA).toBe(500);
    expect(result.parentB).toBe(500);
    expect(result.perChild).toEqual([]);
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

  it("splits by children per PLAN example", () => {
    const result = splitExpense(
      {
        id: "1",
        name: "קייטנה",
        amount: 600,
        split: "by-children",
        percentA: 40,
        percentB: 40,
        childPercents: [10, 10],
      },
      12000,
      8000,
      2,
    );
    expect(result.parentA).toBe(240);
    expect(result.parentB).toBe(240);
    expect(result.perChild).toEqual([60, 60]);
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

  it("aggregates per-child totals", () => {
    const { totalPerChild } = calcAllExpenses(
      [
        {
          id: "1",
          name: "camp",
          amount: 600,
          split: "by-children",
          percentA: 40,
          percentB: 40,
          childPercents: [10, 10],
        },
      ],
      10000,
      10000,
      2,
    );
    expect(totalPerChild).toEqual([60, 60]);
  });
});

describe("defaultChildPercents", () => {
  it("returns even split for two children", () => {
    expect(defaultChildPercents(2)).toEqual([10, 10]);
  });
});
