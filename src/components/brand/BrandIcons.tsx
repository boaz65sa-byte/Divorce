import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Calculator,
  Calendar,
  CheckSquare,
  FileText,
  Home,
  Landmark,
  Link2,
  Map,
  MessageCircle,
  Scale,
} from "lucide-react";

export type IconTone = "indigo" | "teal" | "violet" | "amber" | "rose" | "sky";

export const iconTones: Record<IconTone, string> = {
  indigo: "bs-icon-indigo text-indigo-700",
  teal: "bs-icon-teal text-teal-700",
  violet: "bs-icon-violet text-violet-700",
  amber: "bs-icon-amber text-amber-700",
  rose: "bs-icon-rose text-rose-700",
  sky: "bs-icon-sky text-sky-700",
};

export const brandIcons = {
  home: Home,
  roadmap: Map,
  calculators: Calculator,
  knowledge: Scale,
  checklist: CheckSquare,
  assistant: MessageCircle,
  calendar: Calendar,
  reminders: Bell,
  journal: BookOpen,
  professionals: Briefcase,
  courts: Landmark,
  agreement: FileText,
  resources: Link2,
} as const satisfies Record<string, LucideIcon>;

export type BrandIconName = keyof typeof brandIcons;

export function BrandIcon({
  name,
  tone = "indigo",
  size = "md",
  className = "",
}: {
  name: BrandIconName;
  tone?: IconTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = brandIcons[name];
  const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

  return (
    <div className={`bs-icon-wrap ${iconTones[tone]} ${className}`}>
      <Icon className={sizes[size]} strokeWidth={2.2} aria-hidden />
    </div>
  );
}
