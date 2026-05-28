import type { CourtType } from "../types";

export interface SpousalSupportInput {
  husbandIncome: number;
  wifeIncome: number;
  court: CourtType;
  marriageYears: number;
  wifeWorks: boolean;
  monthlyLifestyle?: number;
}

export interface SpousalSupportResult {
  estimatedMin: number;
  estimatedMax: number;
  estimatedMid: number;
  factors: string[];
  durationMonths: string;
  disclaimer: string;
}

export function calcSpousalSupport(
  input: SpousalSupportInput,
): SpousalSupportResult {
  const {
    husbandIncome,
    wifeIncome,
    court,
    marriageYears,
    wifeWorks,
  } = input;

  const lifestyle =
    input.monthlyLifestyle ??
    Math.max(husbandIncome * 0.7, wifeIncome + 3000);

  const factors: string[] = [];
  let baseMin = 0;
  let baseMax = 0;

  const incomeGap = Math.max(0, lifestyle - wifeIncome);

  if (wifeWorks && wifeIncome >= husbandIncome * 0.65) {
    factors.push('עקרון "צאי מעשה ידייך" — הכנסת האישה מכסה חלק ניכר');
    baseMin = 0;
    baseMax = court === "rabbinical" ? 1500 : 800;
  } else if (wifeWorks && wifeIncome > 0) {
    factors.push("האישה עובדת — הפער בין ההכנסות מצטמצם");
    baseMin = incomeGap * 0.15;
    baseMax = incomeGap * 0.45;
  } else {
    factors.push("האישה אינה עובדת / הכנסה נמוכה — חובת שמירת רמת חיים");
    baseMin = incomeGap * 0.35;
    baseMax = incomeGap * 0.75;
  }

  if (court === "rabbinical") {
    factors.push("בית דין רבני — נוטה לפסיקה שמרנית יותר");
    baseMin *= 1.15;
    baseMax *= 1.25;
  } else {
    factors.push("בית משפט למשפחה — נוטה לתקופה מוגבלת ולצמצום");
    baseMax *= 0.85;
  }

  if (marriageYears < 3) {
    factors.push("נישואין קצרים — הפחתה משמעותית");
    baseMin *= 0.5;
    baseMax *= 0.6;
  } else if (marriageYears >= 10) {
    factors.push("נישואין ארוכים — עלול להגדיל את ההערכה");
    baseMin *= 1.1;
    baseMax *= 1.15;
  }

  const cap = husbandIncome * (court === "rabbinical" ? 0.45 : 0.3);
  baseMin = Math.min(Math.max(0, baseMin), cap);
  baseMax = Math.min(Math.max(baseMin, baseMax), cap);

  const estimatedMin = Math.round(baseMin / 50) * 50;
  const estimatedMax = Math.round(baseMax / 50) * 50;
  const estimatedMid = Math.round((estimatedMin + estimatedMax) / 2 / 50) * 50;

  const durationMonths =
    court === "rabbinical"
      ? "עד מתן הגט (ללא הגבלת זמן קבועה)"
      : marriageYears >= 10
        ? "12–36 חודשים (הערכה)"
        : "6–18 חודשים (הערכה)";

  return {
    estimatedMin,
    estimatedMax,
    estimatedMid,
    factors,
    durationMonths,
    disclaimer:
      "הערכה בלבד — לא ייעוץ משפטי. מזונות אישה נקבעים לפי נסיבות קונקרטיות.",
  };
}
