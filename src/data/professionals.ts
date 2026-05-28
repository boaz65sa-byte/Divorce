import type { Professional } from "@/lib/types";

export const professionals: Professional[] = [
  {
    id: "1",
    name: "עו\"ד דיני משפחה — דוגמה",
    role: "lawyer",
    specialty: "גירושין, משמורת, מזונות",
    city: "תל אביב",
    phone: "03-0000000",
    email: "example@law.co.il",
    languages: ["עברית", "אנגלית"],
  },
  {
    id: "2",
    name: "טוען רבני — דוגמה",
    role: "rabbinical-advocate",
    specialty: "בית דין רבני, גט, כתובה",
    city: "ירושלים",
    phone: "02-0000000",
    languages: ["עברית"],
  },
  {
    id: "3",
    name: "מגשר משפחה — דוגמה",
    role: "mediator",
    specialty: "יישוב סכסוך, הסכמי גירושין",
    city: "חיפה",
    phone: "04-0000000",
    email: "mediator@example.co.il",
    languages: ["עברית", "ערבית"],
  },
  {
    id: "4",
    name: "עו\"ד דיני משפחה — דוגמה",
    role: "lawyer",
    specialty: "איזון משאבים, חלוקת רכוש",
    city: "באר שבע",
    phone: "08-0000000",
    languages: ["עברית"],
  },
];

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
