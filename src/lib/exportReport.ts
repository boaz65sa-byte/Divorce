export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface ReportSection {
  title: string;
  lines: string[];
}

export function buildReportText(
  title: string,
  sections: ReportSection[],
  disclaimer: string,
): string {
  const date = new Date().toLocaleDateString("he-IL");
  const parts = [
    "תגרשן לי — דוח הערכה",
    title,
    `תאריך: ${date}`,
    "",
    ...sections.flatMap((section) => [
      `── ${section.title} ──`,
      ...section.lines,
      "",
    ]),
    "── הערה משפטית ──",
    disclaimer,
    "",
    "מסמך זה אינו מהווה ייעוץ משפטי.",
  ];

  return parts.join("\n");
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function printReport(title: string, sections: ReportSection[], disclaimer: string): void {
  const html = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .meta { color: #555; margin-bottom: 24px; }
    h2 { font-size: 16px; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    p { margin: 6px 0; line-height: 1.5; }
    .disclaimer { margin-top: 24px; padding: 12px; background: #fffbeb; border: 1px solid #fcd34d; font-size: 12px; }
  </style>
</head>
<body>
  <h1>תגרשן לי — ${title}</h1>
  <p class="meta">${new Date().toLocaleDateString("he-IL")}</p>
  ${sections
    .map(
      (s) => `
    <h2>${s.title}</h2>
    ${s.lines.map((line) => `<p>${line}</p>`).join("")}
  `,
    )
    .join("")}
  <div class="disclaimer">${disclaimer}</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export function shareCalculationUrl(path: string, params: Record<string, string | number>): void {
  const search = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  );
  const url = `${window.location.origin}${path}?${search.toString()}`;

  if (navigator.share) {
    navigator.share({ title: "תגרשן לי — חישוב", url }).catch(() => {
      copyToClipboard(url);
    });
  } else {
    copyToClipboard(url);
  }
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(() => {
    window.prompt("העתיקו את הקישור:", text);
  });
}
