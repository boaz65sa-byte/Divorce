import type { ExpenseItem } from "../types";

export interface ExpenseSplitResult {
  parentA: number;
  parentB: number;
  perChild: number[];
}

function emptyChildSplit(childCount: number): number[] {
  return Array.from({ length: childCount }, () => 0);
}

function normalizePercents(values: number[]): number[] {
  const sum = values.reduce((total, value) => total + value, 0);
  if (sum <= 0) {
    const even = 100 / Math.max(values.length, 1);
    return values.map(() => even);
  }
  return values.map((value) => (value / sum) * 100);
}

export function splitExpense(
  expense: ExpenseItem,
  incomeA: number,
  incomeB: number,
  childCount = 0,
): ExpenseSplitResult {
  const { amount, split } = expense;

  if (split === "50-50") {
    return {
      parentA: amount / 2,
      parentB: amount / 2,
      perChild: emptyChildSplit(childCount),
    };
  }

  if (split === "by-income") {
    const total = incomeA + incomeB;
    if (total <= 0) {
      return {
        parentA: amount / 2,
        parentB: amount / 2,
        perChild: emptyChildSplit(childCount),
      };
    }
    const ratioA = incomeA / total;
    return {
      parentA: amount * ratioA,
      parentB: amount * (1 - ratioA),
      perChild: emptyChildSplit(childCount),
    };
  }

  if (split === "by-children") {
    const childPercents =
      expense.childPercents && expense.childPercents.length === childCount
        ? expense.childPercents
        : childCount > 0
          ? Array.from({ length: childCount }, () =>
              Math.round(100 / (childCount + 2)),
            )
          : [];

    const parentA = expense.percentA ?? 40;
    const parentB = expense.percentB ?? 40;
    const percents = normalizePercents([parentA, parentB, ...childPercents]);

    const perChild = childPercents.map((_, index) =>
      (amount * percents[index + 2]) / 100,
    );

    return {
      parentA: (amount * percents[0]) / 100,
      parentB: (amount * percents[1]) / 100,
      perChild,
    };
  }

  const percentA = expense.percentA ?? 50;
  const percentB = expense.percentB ?? 50;
  const sum = percentA + percentB;
  if (sum <= 0) {
    return {
      parentA: amount / 2,
      parentB: amount / 2,
      perChild: emptyChildSplit(childCount),
    };
  }

  return {
    parentA: amount * (percentA / sum),
    parentB: amount * (percentB / sum),
    perChild: emptyChildSplit(childCount),
  };
}

export function calcAllExpenses(
  expenses: ExpenseItem[],
  incomeA: number,
  incomeB: number,
  childCount = 0,
): {
  rows: Array<ExpenseItem & ExpenseSplitResult>;
  totalA: number;
  totalB: number;
  totalPerChild: number[];
} {
  const rows = expenses.map((expense) => ({
    ...expense,
    ...splitExpense(expense, incomeA, incomeB, childCount),
  }));

  const totalA = rows.reduce((sum, row) => sum + row.parentA, 0);
  const totalB = rows.reduce((sum, row) => sum + row.parentB, 0);
  const totalPerChild = Array.from({ length: childCount }, (_, index) =>
    rows.reduce((sum, row) => sum + (row.perChild[index] ?? 0), 0),
  );

  return { rows, totalA, totalB, totalPerChild };
}

export function defaultChildPercents(childCount: number): number[] {
  if (childCount <= 0) return [];
  const parentShare = 40;
  const remaining = Math.max(0, 100 - parentShare * 2);
  const each = Math.round(remaining / childCount);
  return Array.from({ length: childCount }, () => each);
}
