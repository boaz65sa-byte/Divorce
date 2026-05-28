import { PageHeader, Card } from "@/components/ui";

const resources = [
  {
    title: "כל-זכות — גירושין",
    url: "https://www.kolzchut.org.il/he/%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F",
    description: "מידע על זכויות והליכים",
  },
  {
    title: "בקשה ליישוב סכסוך",
    url: "https://www.kolzchut.org.il/he/%D7%91%D7%A7%D7%A9%D7%94_%D7%9C%D7%99%D7%99%D7%A9%D7%95%D7%91_%D7%A1%D7%9B%D7%A1%D7%95%D7%9A_%D7%91%D7%9E%D7%A9%D7%A4%D7%97%D7%94",
    description: "שלב חובה לפני תביעה",
  },
  {
    title: "מזונות ילדים — כל-זכות",
    url: "https://www.kolzchut.org.il/he/%D7%9E%D7%96%D7%95%D7%A0%D7%95%D7%AA_%D7%99%D7%9C%D7%93%D7%99%D7%9D",
    description: "זכויות וחובות הורים",
  },
  {
    title: "רשות האכיפה והגבייה",
    url: "https://www.gov.il/he/departments/the_enforcement_and_collection_authority",
    description: "גביית מזונות שלא שולמו",
  },
  {
    title: "ביטוח לאומי — קצבת מזונות",
    url: "https://www.btl.gov.il",
    description: "כשיש פסק דין והחייב לא משלם",
  },
  {
    title: "יחידות סיוע (מהו\"ת)",
    url: "https://www.gov.il/he/departments/topics/family-court-mediation",
    description: "גישור לפני הליך משפטי",
  },
];

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader
        title="קישורים שימושיים"
        subtitle="מקורות רשמיים ומידע נוסף"
      />

      <div className="space-y-3">
        {resources.map((resource) => (
          <Card key={resource.url}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <h2 className="font-semibold text-brand-700">{resource.title}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {resource.description}
              </p>
              <p className="mt-2 text-xs text-slate-400">פתיחה בחלון חדש →</p>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
