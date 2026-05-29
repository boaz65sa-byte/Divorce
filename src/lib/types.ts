export type CourtType = "family" | "rabbinical";
export type AgreementType = "consensus" | "dispute";
export type Gender = "male" | "female" | "other";
export type ReligionType = "jewish" | "muslim" | "christian" | "druze";

export interface ChildProfile {
  id: string;
  age: number;
  daysWithParentA: number;
}

export interface UserProfile {
  onboardingComplete: boolean;
  gender?: Gender;
  religion: ReligionType;
  hasChildren: boolean;
  children: ChildProfile[];
  court: CourtType;
  agreement: AgreementType;
  incomeA: number;
  incomeB: number;
  parentAName: string;
  parentBName: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  phase: string;
  forAgreement?: AgreementType | "both";
  forCourt?: CourtType | "both";
  suggestedDueDays?: number;
}

export interface KnowledgeTopic {
  id: string;
  title: string;
  summary: string;
  content: string[];
  tags: string[];
  forSide?: "a" | "b" | "both";
  forCourt?: CourtType | "both";
}

export type ExpenseSplitMode = "50-50" | "by-income" | "custom";

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  split: ExpenseSplitMode;
  percentA?: number;
  percentB?: number;
}

export interface AssetItem {
  id: string;
  name: string;
  value: number;
  acquiredDuringMarriage: boolean;
}

export interface DebtItem {
  id: string;
  name: string;
  amount: number;
  isHouseholdDebt: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  type: "hearing" | "payment" | "document" | "other";
  done: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: "education" | "health" | "activities" | "clothing" | "other";
  paidBy: "a" | "b";
}

export interface Professional {
  id: string;
  name: string;
  role: "lawyer" | "rabbinical-advocate" | "mediator";
  specialty: string;
  city: string;
  phone?: string;
  email?: string;
  languages: string[];
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  topicId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export interface ShareCalcPayload {
  type: "child-support";
  incomeA: number;
  incomeB: number;
  housingCost: number;
  childAge: number;
  daysWithA: number;
  children?: { age: number; daysWithParentA: number }[];
  court: CourtType;
}

export type ParentSide = "a" | "b";

export type SchedulePattern =
  | "week-alternate"
  | "2-2-3"
  | "5-2"
  | "custom-cycle";

export type ShabbatMode = "follow-day" | "alternate" | "manual";
export type HolidayMode = "follow-day" | "alternate-years" | "manual";

export interface CustodyScheduleSettings {
  pattern: SchedulePattern;
  cycleStartDate: string;
  customCycle: ParentSide[];
  shabbatMode: ShabbatMode;
  shabbatFirstParent: ParentSide;
  holidayMode: HolidayMode;
  holidayAssignments: Record<string, ParentSide>;
  dayOverrides: Record<string, ParentSide>;
}

export interface CalendarDay {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFriday: boolean;
  isSaturday: boolean;
  parent: ParentSide;
  source: "pattern" | "shabbat" | "holiday" | "override";
  holiday?: { id: string; name: string };
}

export interface MonthStats {
  nightsA: number;
  nightsB: number;
  shabbatA: number;
  shabbatB: number;
  holidaysA: number;
  holidaysB: number;
}
