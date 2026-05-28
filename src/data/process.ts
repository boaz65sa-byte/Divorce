import type {
  AgreementType,
  ChecklistItem,
  CourtType,
  UserProfile,
} from "@/lib/types";

export function getChecklistForProfile(profile: UserProfile): ChecklistItem[] {
  return checklistTemplates.filter((item) => {
    const agreementOk =
      !item.forAgreement ||
      item.forAgreement === "both" ||
      item.forAgreement === profile.agreement;

    const courtOk =
      !item.forCourt ||
      item.forCourt === "both" ||
      item.forCourt === profile.court;

    return agreementOk && courtOk;
  });
}

export function getSuggestedDueDate(
  onboardingDate: string,
  suggestedDueDays?: number,
): string | null {
  if (suggestedDueDays == null) return null;
  const base = new Date(onboardingDate + "T12:00:00");
  base.setDate(base.getDate() + suggestedDueDays);
  return base.toISOString().slice(0, 10);
}

export const checklistTemplates: ChecklistItem[] = [
  {
    id: "id-cards",
    title: "ת.ז. + ספח מעודכן",
    description: "לשני הצדדים",
    phase: "documents",
    suggestedDueDays: 7,
  },
  {
    id: "marriage-cert",
    title: "תעודת נישואין מקורית",
    phase: "documents",
    suggestedDueDays: 7,
  },
  {
    id: "ketuba",
    title: "שטר כתובה",
    phase: "documents",
    forCourt: "rabbinical",
    suggestedDueDays: 14,
  },
  {
    id: "fee",
    title: "אישור תשלום אגרה",
    phase: "documents",
    suggestedDueDays: 21,
  },
  {
    id: "bank-3y",
    title: "דפי חשבון בנק — 3 שנים",
    phase: "financial",
    suggestedDueDays: 14,
  },
  {
    id: "payslips",
    title: "תלושי שכר / אישורי הכנסה",
    phase: "financial",
    suggestedDueDays: 14,
  },
  {
    id: "pension",
    title: "דוחות פנסיה וקופות גמל",
    phase: "financial",
    suggestedDueDays: 21,
  },
  {
    id: "property",
    title: "נסחי טאבו / רישום רכב",
    phase: "financial",
    suggestedDueDays: 21,
  },
  {
    id: "debts",
    title: "פירוט חובות (משכנתא, הלוואות)",
    phase: "financial",
    suggestedDueDays: 21,
  },
  {
    id: "mediation-request",
    title: "הגשת בקשה ליישוב סכסוך",
    phase: "process",
    forAgreement: "dispute",
    suggestedDueDays: 7,
  },
  {
    id: "consensus-draft",
    title: "טיוטת הסכם גירושין",
    description: "לסקירה עם עו\"ד",
    phase: "process",
    forAgreement: "consensus",
    suggestedDueDays: 14,
  },
  {
    id: "family-court-filing",
    title: "הגשה לבית משפט למשפחה",
    description: "נושאים נלווים / אישור הסכם",
    phase: "process",
    forCourt: "family",
    suggestedDueDays: 30,
  },
  {
    id: "rabbinical-filing",
    title: "פתיחת תיק בבית הדין הרבני",
    phase: "process",
    forCourt: "rabbinical",
    suggestedDueDays: 30,
  },
  {
    id: "witnesses",
    title: "2 עדים לסידור גט",
    description: "מכירים את שני הצדדים",
    phase: "get",
    forCourt: "rabbinical",
    suggestedDueDays: 60,
  },
];

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
