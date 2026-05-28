import type { ChecklistItem } from "@/lib/types";

export const roadmapSteps = [
  {
    id: "consult",
    title: "ייעוץ ראשוני",
    description: "פגישה עם עו\"ד או טוען רבני להבנת המצב",
  },
  {
    id: "mediation",
    title: "בקשה ליישוב סכסוך",
    description: "שלב חובה לפני הגשת תביעה — כולל פגישות ביחידת סיוע",
  },
  {
    id: "choose-court",
    title: "בחירת ערכאה",
    description: "בית דין רבני (גט) או בית משפט למשפחה (נושאים נלווים)",
  },
  {
    id: "file-case",
    title: "הגשת תביעה / הסכם",
    description: "פתיחת תיק גירושין או הגשת הסכם גירושין",
  },
  {
    id: "negotiate",
    title: "משא ומתן / דיונים",
    description: "משמורת, מזונות, רכוש — גישור או הליך משפטי",
  },
  {
    id: "agreement",
    title: "פסק דין / הסכם מאושר",
    description: "אישור הסדרים על ידי הערכאה",
  },
  {
    id: "get",
    title: "סידור גט",
    description: "טקס הגירושין עם עדים בבית הדין הרבני",
  },
  {
    id: "registry",
    title: "עדכון מרשם + חלוקה",
    description: "תעודת גירושין, חלוקת נכסים בפועל",
  },
];

export const checklistTemplates: ChecklistItem[] = [
  {
    id: "id-cards",
    title: "ת.ז. + ספח מעודכן",
    description: "לשני הצדדים",
    phase: "documents",
  },
  {
    id: "marriage-cert",
    title: "תעודת נישואין מקורית",
    phase: "documents",
  },
  {
    id: "ketuba",
    title: "שטר כתובה",
    phase: "documents",
  },
  {
    id: "fee",
    title: "אישור תשלום אגרה",
    phase: "documents",
  },
  {
    id: "bank-3y",
    title: "דפי חשבון בנק — 3 שנים",
    phase: "financial",
  },
  {
    id: "payslips",
    title: "תלושי שכר / אישורי הכנסה",
    phase: "financial",
  },
  {
    id: "pension",
    title: "דוחות פנסיה וקופות גמל",
    phase: "financial",
  },
  {
    id: "property",
    title: "נסחי טאבו / רישום רכב",
    phase: "financial",
  },
  {
    id: "debts",
    title: "פירוט חובות (משכנתא, הלוואות)",
    phase: "financial",
  },
  {
    id: "mediation-request",
    title: "הגשת בקשה ליישוב סכסוך",
    phase: "process",
  },
  {
    id: "witnesses",
    title: "2 עדים לסידור גט",
    description: "מכירים את שני הצדדים",
    phase: "get",
  },
];

export const courtComparison = [
  {
    topic: "מתן גט",
    rabbinical: "סמכות בלעדית",
    family: "אין סמכות",
  },
  {
    topic: "מזונות ילדים 6+",
    rabbinical: "גישה הלכתית — לעיתים שונה מ-919/15",
    family: "הלכת בע\"מ 919/15",
  },
  {
    topic: "מזונות אישה",
    rabbinical: "עקרון \"עולה עמו\"",
    family: "תקופה מוגבלת + בחינת הכנסות",
  },
  {
    topic: "חלוקת רכוש",
    rabbinical: "חוק יח\"מ — 50/50",
    family: "חוק יח\"מ — 50/50",
  },
  {
    topic: "משמורת",
    rabbinical: "טובת הילד",
    family: "טובת הילד + מגמת משמורת משותפת",
  },
];
