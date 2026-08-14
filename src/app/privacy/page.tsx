import { PageHeader, Card } from "@/components/ui";

export const metadata = {
  title: "מדיניות פרטיות — תגרשן לי",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="מדיניות פרטיות"
        subtitle="עדכון אחרון: אוגוסט 2026"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            עקרון מרכזי
          </h2>
          <p className="text-slate-700">
            תגרשן לי נבנתה כך שהמידע האישי שלך — פרטי המקרה, תשובות
            בצ׳ק-ליסט, תוצאות מחשבונים, רשומות יומן ותזכורות — נשמר{" "}
            <strong>במכשיר שלך בלבד</strong> (באמצעות אחסון מקומי בדפדפן או
            באפליקציה). אנחנו לא אוספים, לא רואים ולא מעבירים את התוכן הזה
            לשרת כלשהו.
          </p>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            מה כן נאסף
          </h2>
          <p className="mb-2 text-slate-700">
            בגרסת האתר (הדפדפן) בלבד — לא באפליקציה למכשירים ניידים — נאסף
            מידע שימוש אנונימי לצורך הבנת השימוש הכללי במוצר:
          </p>
          <ul className="list-inside list-disc space-y-1 text-slate-700">
            <li>מזהה סשן אקראי (לא מזהה אישי, נוצר מחדש בכל ביקור)</li>
            <li>עמודים שנצפו ופיצ׳רים שהופעלו</li>
            <li>מספר ביקורים כללי</li>
          </ul>
          <p className="mt-2 text-slate-700">
            מידע זה אינו כולל שם, מספר טלפון, אימייל, תעודת זהות או כל פרט
            מזהה אחר, ואינו מקושר לתוכן שהזנת במחשבונים או בצ׳ק-ליסט.
            באפליקציה הנייטיבית ל-iOS/Android מנגנון זה כבוי לחלוטין —
            האפליקציה פועלת באופן מלא במצב מקומי (offline) בלי לשלוח מידע
            לאף שרת.
          </p>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            התראות ותזכורות
          </h2>
          <p className="text-slate-700">
            אם תבחר/י להפעיל תזכורות, הן מתוזמנות ומוצגות ישירות על ידי
            המכשיר שלך (מערכת ההפעלה) על סמך התאריכים שהזנת. תוכן התזכורות
            לא נשלח לשום שרת חיצוני.
          </p>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            שיתוף עם צדדים שלישיים
          </h2>
          <p className="text-slate-700">
            אנחנו לא מוכרים, משתפים או מעבירים מידע לצדדים שלישיים למטרות
            שיווק. שירותי צד שלישי המשמשים להפעלת האתר (כגון אחסון ענן
            לנתוני שימוש אנונימיים) מקבלים רק את המידע האנונימי המפורט
            למעלה.
          </p>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            מחיקת מידע
          </h2>
          <p className="text-slate-700">
            מכיוון שהמידע האישי שלך נשמר במכשיר בלבד, מחיקתו היא בשליטתך
            המלאה — דרך &quot;איפוס כל הנתונים&quot; בהגדרות, או מחיקת
            האפליקציה/נתוני האתר מהמכשיר.
          </p>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            יצירת קשר
          </h2>
          <p className="text-slate-700">
            לשאלות בנוגע למדיניות זו ניתן לפנות ל־
            <a
              href="mailto:boaz65sa@gmail.com"
              className="text-brand-700 hover:underline"
            >
              boaz65sa@gmail.com
            </a>
            .
          </p>
        </Card>

        <p className="text-xs text-slate-500">
          הערה: מדיניות זו מתארת את התנהגות האפליקציה בפועל נכון למועד
          העדכון האחרון. היא אינה מהווה ייעוץ משפטי.
        </p>
      </div>
    </div>
  );
}
