import type { ReligionType } from "@/lib/types";

export interface ReligiousCourtInfo {
  religion: ReligionType;
  label: string;
  divorceCourt: string;
  divorceProcess: string;
  propertyLaw: string;
  childSupport: string;
  notes: string[];
}

export const religiousCourts: ReligiousCourtInfo[] = [
  {
    religion: "jewish",
    label: "יהודים",
    divorceCourt: "בית הדין הרבני — סמכות בלעדית לגט",
    divorceProcess: "גט + יישוב סכסוך + סידור גט עם עדים",
    propertyLaw: 'חוק יח"מ — איזון משאבים 50/50',
    childSupport: "עד גיל 6 — חובת אב; 6+ — 919/15 (משפחה)",
    notes: [
      "נושאים נלווים — גם בבית משפט למשפחה",
      "כריכת תביעות אפשרית ברבני",
    ],
  },
  {
    religion: "muslim",
    label: "מוסלמים",
    divorceCourt: "בית הדין השרעי / בית הדין לענייני משפחה",
    divorceProcess: "טלאק / פירוק נישואין לפי דין שרעי",
    propertyLaw: "דין אישי מוסלמי + חוקי ישראל (לפי נושא)",
    childSupport: "לפי פסיקת בתי הדין השרעיים והמשפחה",
    notes: [
      "יישוב סכסוך — חובה לפני תביעה",
      "מזונות ילדים — לפי יכולת וצרכי הילד",
    ],
  },
  {
    religion: "christian",
    label: "נוצרים",
    divorceCourt: "בית הדין הנוצרי / בית משפט למשפחה",
    divorceProcess: "פירוק נישואין לפי דין הנוצרי",
    propertyLaw: "דין אישי + חוקי ישראל",
    childSupport: "לפי פסיקת הערכאה הדתית או המשפחה",
    notes: [
      "הערכאה תלויה בעדה (קתולים, אורתודוקסים וכו')",
      "יישוב סכסוך — חובה",
    ],
  },
  {
    religion: "druze",
    label: "דרוזים",
    divorceCourt: "בית הדין הדרוזי / בית משפט למשפחה",
    divorceProcess: "גירושין לפי דין דruze",
    propertyLaw: "דין אישי דruze + חוקי ישראל",
    childSupport: "לפי פסיקת בית הדין הדרוזי",
    notes: [
      "יישוב סכסוך — חובה",
      "משמורת ומזונות — לפי טובת הילד",
    ],
  },
];

export function getReligiousCourt(religion: ReligionType): ReligiousCourtInfo {
  return (
    religiousCourts.find((c) => c.religion === religion) ?? religiousCourts[0]
  );
}

export const religionLabels: Record<ReligionType, string> = {
  jewish: "יהודי/ה",
  muslim: "מוסלמי/ת",
  christian: "נוצרי/ת",
  druze: "דרוזי/ת",
};
