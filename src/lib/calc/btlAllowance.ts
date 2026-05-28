export interface BtlAllowanceInput {
  courtOrderAmount: number;
  childrenInCustody: number;
  maritalStatus: "single" | "remarried" | "separated";
  isBelowRetirementAge: boolean;
}

export interface BtlAllowanceResult {
  estimatedAllowance: number;
  maxCap: number;
  eligible: boolean;
  reasons: string[];
  disclaimer: string;
}

const MAX_PER_CHILD = 520;
const BASE_ALLOWANCE = 890;

export function calcBtlAllowance(input: BtlAllowanceInput): BtlAllowanceResult {
  const reasons: string[] = [];
  let eligible = true;

  if (!input.isBelowRetirementAge) {
    eligible = false;
    reasons.push("מעל גיל פרישה — יש לפנות לסניף הביטוח הלאומי");
  }

  if (input.maritalStatus === "remarried") {
    eligible = false;
    reasons.push("נישואין שניים / ידועים בציבור — לא זכאים לקצבה");
  }

  if (input.courtOrderAmount <= 0) {
    eligible = false;
    reasons.push("נדרש פסק דין למזונות עם סכום חיובי");
  }

  if (input.childrenInCustody <= 0) {
    eligible = false;
    reasons.push("נדרש לפחות ילד אחד בגיל 0–18 באחזקתך");
  }

  const childBonus = Math.min(input.childrenInCustody, 4) * MAX_PER_CHILD;
  const maxCap = BASE_ALLOWANCE + childBonus;
  const estimatedAllowance = Math.min(input.courtOrderAmount, maxCap);

  if (eligible) {
    reasons.push(
      `הביטוח הלאומי משלם עד ${maxCap.toLocaleString("he-IL")} ₪ — הנמוך מפסק הדין`,
    );
    reasons.push(
      "אם החייב משלם חלקית — הביטוח לאומי משלים את ההפרש",
    );
  }

  return {
    estimatedAllowance: eligible ? estimatedAllowance : 0,
    maxCap,
    eligible,
    reasons,
    disclaimer:
      "הערכה בלבד. הסכום הסופי נקבע על ידי פקיד תביעות בביטוח הלאומי.",
  };
}
