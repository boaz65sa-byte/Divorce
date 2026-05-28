"use client";

import { useMemo } from "react";
import {
  Button,
  ExportButtons,
  PageHeader,
  StatBox,
} from "@/components/ui";
import { formatCurrency } from "@/lib/exportReport";
import { useProfileStore } from "@/lib/store/profileStore";

export default function AgreementDraftPage() {
  const profile = useProfileStore((s) => s.profile);

  const draft = useMemo(() => {
    const courtLabel =
      profile.court === "rabbinical"
        ? "בית הדין הרבני"
        : "בית המשפט לענייני משפחה";

    const lines = [
      "טיוטת הסכם גירושין — לצורך דיון בלבד",
      "",
      `1. הצדדים: ${profile.parentAName} ו-${profile.parentBName}.`,
      `2. ההליך יתנהל ב${courtLabel}.`,
      `3. סוג ההליך: ${profile.agreement === "consensus" ? "גירושין בהסכמה" : "גירושין עם מחלוקות"}.`,
      "",
      "4. משמורת וזמני שהות:",
      profile.hasChildren
        ? "   • ייקבעו זמני שהות בהתאם לטובת הקטינים, בגישה של שיתוף פעולה בין ההורים."
        : "   • לא רלוונטי — אין ילדים קטינים.",
      "",
      "5. מזונות ילדים:",
      profile.hasChildren
        ? `   • ייקבעו לפי דין, בהתחשב בהכנסות (${formatCurrency(profile.incomeA)} / ${formatCurrency(profile.incomeB)}).`
        : "   • לא רלוונטי.",
      "",
      "6. מזונות אישה:",
      "   • ייקבעו עד מתן הגט, בהתאם לדין ולנסיבות.",
      "",
      '7. חלוקת רכוש — איזון משאבים לפי חוק יחסי ממון בין בני זוג, תשל"ג-1973:',
      "   • כל צד זכאי ל-50% מנכסים שנצברו במהלך הנישואין.",
      "   • נכסים שהיו לפני הנישואין / ירושות — לפי הדין.",
      "",
      "8. הוצאות חריגות (חינוך, בריאות, חוגים):",
      "   • יחולקו בין ההורים — לרוב חצי-חצי או לפי יחס הכנסות.",
      "",
      "9. סידור גט:",
      "   • יתקיים בבית הדין הרבני לאחר אישור ההסכם.",
      "",
      "10. סופיות:",
      "   • הצדדים מצהירים כי ההסכם מהווה את מלוא הסדרי הגירושין ביניהם.",
      "",
      "────────────────────────────────────",
      "הערה: טיוטה זו אינה הסכם משפטי מחייב.",
      "יש לאשר ולנסח על ידי עורך דין / טוען רבני.",
    ];

    return lines.join("\n");
  }, [profile]);

  const sections = [
    {
      title: "טיוטת הסכם",
      lines: draft.split("\n"),
    },
  ];

  return (
    <div>
      <PageHeader
        title="טיוטת הסכם גירושין"
        subtitle="מבוסס על הפרופיל שלכם — לעריכה עם עו״ד"
      />

      <div className="mb-4 grid grid-cols-2 gap-3">
        <StatBox
          label="ערכאה"
          value={
            profile.court === "rabbinical" ? "רבני" : "משפחה"
          }
        />
        <StatBox
          label="סוג הליך"
          value={profile.agreement === "consensus" ? "הסכמה" : "סכסוך"}
        />
      </div>

      <pre className="mb-6 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800">
        {draft}
      </pre>

      <ExportButtons
        title="טיוטת הסכם גירושין"
        sections={sections}
        disclaimer="טיוטה בלבד — אינה מהווה הסכם משפטי. יש לאשר עם עורך דין."
        filename="heskem-girushin-draft.txt"
      />

      <Button
        variant="secondary"
        className="mt-3 w-full"
        onClick={() => {
          navigator.clipboard.writeText(draft);
        }}
      >
        העתק ללוח
      </Button>
    </div>
  );
}
