import type { ExpenseItem } from "../types";

export interface ExpenseSplitResult {
  parentA: number;
  parentB: number;
}

export function splitExpense(
  expense: ExpenseItem,
  incomeA: number,
  incomeB: number,
): ExpenseSplitResult {
  const { amount, split } = expense;

  if (split === "50-50") {
    return { parentA: amount / 2, parentB: amount / 2 };
  }

  if (split === "by-income") {
    const total = incomeA + incomeB;
    if (total <= 0) return { parentA: amount / 2, parentB: amount / 2 };
    const ratioA = incomeA / total;
    return { parentA: amount * ratioA, parentB: amount * (1 - ratioA) };
  }

  const percentA = expense.percentA ?? 50;
  const percentB = expense.percentB ?? 50;
  const sum = percentA + percentB;
  if (sum <= 0) return { parentA: amount / 2, parentB: amount / 2 };

  return {
    parentA: amount * (percentA / sum),
    parentB: amount * (percentB / sum),
  };
}

export function calcAllExpenses(
  expenses: ExpenseItem[],
  incomeA: number,
  incomeB: number,
): { rows: Array<ExpenseItem & ExpenseSplitResult>; totalA: number; totalB: number } {
  const rows = expenses.map((expense) => ({
    ...expense,
    ...splitExpense(expense, incomeA, incomeB),
  }));

  const totalA = rows.reduce((sum, row) => sum + row.parentA, 0);
  const totalB = rows.reduce((sum, row) => sum + row.parentB, 0);

  return { rows, totalA, totalB };
}
