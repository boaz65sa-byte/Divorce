import type { CourtType } from "../types";

export interface ChildSupportChildInput {
  age: number;
  daysWithParentA: number;
  needsAmount?: number;
}

export interface ChildSupportInput {
  children: ChildSupportChildInput[];
  incomeA: number;
  incomeB: number;
  housingCost: number;
  court: CourtType;
  defaultNeeds?: number;
  parentAIsFather?: boolean;
}

export interface ChildBreakdown {
  age: number;
  rule: "under6" | "919";
  needs: number;
  transferFromAToB: number;
}

export interface ChildSupportDuration {
  age: number;
  monthsRemaining: number;
  yearsRemaining: number;
  endsAtAge: number;
  monthlyShare: number;
  estimatedRemainingTotal: number;
}

export interface ChildSupportResult {
  under6Total: number;
  over6Transfer: number;
  housingTransfer: number;
  totalMonthly: number;
  direction: "a-to-b" | "b-to-a" | "none";
  amount: number;
  breakdown: ChildBreakdown[];
  durations: ChildSupportDuration[];
  longestRemainingMonths: number;
  totalEstimatedRemaining: number;
  disclaimer: string;
}

/** גיל סיום מזונות ילדים — ברירת מחדל (ניתן להאריך בנסיבות מיוחדות) */
export const CHILD_SUPPORT_END_AGE = 18;

const DEFAULT_NEEDS = 2250;

export function calcMonthsUntilSupportEnd(age: number, endAge = CHILD_SUPPORT_END_AGE): number {
  if (age >= endAge) return 0;
  return Math.max(0, Math.round((endAge - age) * 12));
}

export function formatSupportDuration(monthsRemaining: number): string {
  if (monthsRemaining <= 0) return "מסתיים בקרוב / הסתיים";
  const years = Math.floor(monthsRemaining / 12);
  const months = monthsRemaining % 12;
  if (years === 0) return `${months} חודשים`;
  if (months === 0) return `${years} שנים`;
  return `${years} שנים ו-${months} חודשים`;
}

function buildDurations(
  breakdown: ChildBreakdown[],
  monthlyTotal: number,
): Pick<ChildSupportResult, "durations" | "longestRemainingMonths" | "totalEstimatedRemaining"> {
  const breakdownTotal = breakdown.reduce(
    (sum, row) => sum + Math.abs(row.transferFromAToB),
    0,
  );

  const durations: ChildSupportDuration[] = breakdown.map((row) => {
    const monthsRemaining = calcMonthsUntilSupportEnd(row.age);
    const monthlyShare =
      breakdownTotal > 0
        ? monthlyTotal * (Math.abs(row.transferFromAToB) / breakdownTotal)
        : monthlyTotal / Math.max(breakdown.length, 1);

    return {
      age: row.age,
      monthsRemaining,
      yearsRemaining: Math.round((monthsRemaining / 12) * 10) / 10,
      endsAtAge: CHILD_SUPPORT_END_AGE,
      monthlyShare: Math.round(monthlyShare),
      estimatedRemainingTotal: Math.round(monthlyShare * monthsRemaining),
    };
  });

  const longestRemainingMonths = durations.reduce(
    (max, row) => Math.max(max, row.monthsRemaining),
    0,
  );
  const totalEstimatedRemaining = durations.reduce(
    (sum, row) => sum + row.estimatedRemainingTotal,
    0,
  );

  return { durations, longestRemainingMonths, totalEstimatedRemaining };
}

function calc919Transfer(
  needs: number,
  incomeA: number,
  incomeB: number,
  daysWithParentA: number,
): number {
  const totalIncome = incomeA + incomeB;
  if (totalIncome <= 0) return 0;

  const incomeShareA = needs * (incomeA / totalIncome);
  const stayShareA = needs * (daysWithParentA / 14);
  return incomeShareA - stayShareA;
}

function applyVerdEconomy(childrenCount: number, baseTotal: number): number {
  if (childrenCount <= 1) return baseTotal;
  const multiplier = 1 + 0.55 * (childrenCount - 1);
  return (baseTotal / childrenCount) * multiplier;
}

export function calcChildSupport(input: ChildSupportInput): ChildSupportResult {
  const defaultNeeds = input.defaultNeeds ?? DEFAULT_NEEDS;
  const parentAIsFather = input.parentAIsFather ?? true;
  const breakdown: ChildBreakdown[] = [];

  let under6Total = 0;
  let over6Raw = 0;

  const under6 = input.children.filter((c) => c.age < 6);
  const over6 = input.children.filter((c) => c.age >= 6);

  for (const child of under6) {
    const needs = child.needsAmount ?? defaultNeeds;
    let transfer = 0;

    if (input.court === "rabbinical" || parentAIsFather) {
      transfer = needs;
    } else {
      transfer = -needs;
    }

    under6Total += transfer;
    breakdown.push({
      age: child.age,
      rule: "under6",
      needs,
      transferFromAToB: transfer,
    });
  }

  for (const child of over6) {
    const needs = child.needsAmount ?? defaultNeeds;
    let transfer = calc919Transfer(
      needs,
      input.incomeA,
      input.incomeB,
      child.daysWithParentA,
    );

    if (input.court === "rabbinical") {
      transfer = Math.max(transfer, needs * 0.6);
    }

    over6Raw += transfer;
    breakdown.push({
      age: child.age,
      rule: "919",
      needs,
      transferFromAToB: transfer,
    });
  }

  const over6Count = over6.length;
  let over6Transfer = over6Raw;
  if (over6Count > 1) {
    over6Transfer = applyVerdEconomy(over6Count, over6Raw);
  }

  const totalIncome = input.incomeA + input.incomeB;
  let housingTransfer = 0;
  if (input.housingCost > 0 && totalIncome > 0) {
    const housingShareA = input.housingCost * (input.incomeA / totalIncome);
    const housingStayA = input.housingCost * 0.5;
    housingTransfer = housingShareA - housingStayA;
  }

  const net = under6Total + over6Transfer + housingTransfer;
  const direction =
    net > 0 ? "a-to-b" : net < 0 ? "b-to-a" : ("none" as const);
  const amount = Math.abs(net);
  const durationMeta = buildDurations(breakdown, amount);

  return {
    under6Total,
    over6Transfer,
    housingTransfer,
    totalMonthly: amount,
    direction,
    amount,
    breakdown,
    ...durationMeta,
    disclaimer:
      "הערכה בלבד — לא ייעוץ משפטי. מזונות לרוב עד גיל 18 (ייתכנו חריגים). כל מקרה נבחן לגופו בערכאה המוסמכת.",
  };
}

export { formatCurrency } from "../exportReport";
