import type { Professional } from "@/lib/types";

/**
 * No in-app professional directory. Fake example contacts (phones/emails)
 * were removed for App Store Guideline 5.6 / misleading content.
 * The /professionals page is official resource links only.
 */
export const professionals: Professional[] = [];

export const roleLabels: Record<Professional["role"], string> = {
  lawyer: "עורך/ת דין",
  "rabbinical-advocate": "טוען/ת רבני/ת",
  mediator: "מגשר/ת",
};

export const roleFilters: Array<{ value: Professional["role"] | "all"; label: string }> = [
  { value: "all", label: "הכל" },
  { value: "lawyer", label: "עורכי דין" },
  { value: "rabbinical-advocate", label: "טוענים רבניים" },
  { value: "mediator", label: "מגשרים" },
];

export type OfficialResourceLink = {
  id: string;
  title: string;
  description: string;
  href: string;
};

/** Public official resources only — not referrals or a lawyer directory. */
export const officialProfessionalResources: OfficialResourceLink[] = [
  {
    id: "kolzchut-family",
    title: "כל זכות — דיני משפחה וגירושין",
    description: "מידע ציבורי על הליכים, זכויות ומוסדות רלוונטיים.",
    href: "https://www.kolzchut.org.il/he/%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F",
  },
  {
    id: "israel-bar-search",
    title: "לשכת עורכי הדין — איתור עורך דין",
    description: "חיפוש רשמי ברשימת חברי הלשכה (לא המלצה של האפליקציה).",
    href: "https://www.israelbar.org.il/lawyer_search",
  },
  {
    id: "kolzchut-mediation",
    title: "כל זכות — גישור ויישוב סכסוכים",
    description: "מידע על גישור והליכי יישוב סכסוך במשפחה.",
    href: "https://www.kolzchut.org.il/he/%D7%92%D7%99%D7%A9%D7%95%D7%A8",
  },
  {
    id: "gov-family-courts",
    title: "מערכת בתי המשפט — בתי המשפט לענייני משפחה",
    description: "מידע מוסדי על בתי המשפט לענייני משפחה.",
    href: "https://www.gov.il/he/departments/the_judicial_authority",
  },
];
