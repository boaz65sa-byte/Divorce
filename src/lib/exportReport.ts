import { BRAND } from "@/lib/brand/brand";
import { BS_SIMPLE } from "@/lib/brand/bsSimple";

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
    `${BRAND.name} — דוח הערכה`,
    BS_SIMPLE.signature,
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
    "",
    `── ${BS_SIMPLE.signature} ──`,
  ];

  return parts.join("\n");
}

export function buildReportHtml(
  title: string,
  sections: ReportSection[],
  disclaimer: string,
): string {
  const date = new Date().toLocaleDateString("he-IL");
  const sectionHtml = sections
    .map(
      (section) => `
    <section class="section">
      <h2>${escapeHtml(section.title)}</h2>
      ${section.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
    </section>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} — ${BRAND.name}</title>
  <style>
    body { font-family: "Rubik", "Segoe UI", Arial, sans-serif; padding: 40px; color: #1e1b4b; font-size: 16px; line-height: 1.6; }
    h1 { font-size: 24px; margin: 0 0 8px; color: #4338ca; }
    .meta { color: #64748b; margin-bottom: 28px; font-size: 14px; }
    .section { margin-bottom: 24px; page-break-inside: avoid; }
    h2 { font-size: 17px; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 2px solid #e0e7ff; color: #312e81; }
    p { margin: 4px 0; }
    .disclaimer { margin-top: 32px; padding: 16px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; font-size: 14px; }
    .brand { margin-top: 36px; padding-top: 16px; border-top: 2px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
    .brand-line { height: 3px; width: 80px; margin: 0 auto 10px; background: linear-gradient(90deg, #4338ca, #0d9488, #7c3aed); border-radius: 999px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(BRAND.name)} — ${escapeHtml(title)}</h1>
  <p class="meta">${date} · ${escapeHtml(BS_SIMPLE.signature)}</p>
  ${sectionHtml}
  <div class="disclaimer">${escapeHtml(disclaimer)}</div>
  <div class="brand">
    <div class="brand-line"></div>
    <p>${escapeHtml(BS_SIMPLE.signature)}</p>
    <p>${escapeHtml(BRAND.tagline)}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  triggerDownload(filename, blob);
}

export function downloadHtmlReport(
  filename: string,
  title: string,
  sections: ReportSection[],
  disclaimer: string,
): void {
  const html = buildReportHtml(title, sections, disclaimer);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  triggerDownload(filename.replace(/\.txt$/i, ".html"), blob);
}

export async function downloadPdfReport(
  filename: string,
  title: string,
  sections: ReportSection[],
  disclaimer: string,
): Promise<void> {
  const html = buildReportHtml(title, sections, disclaimer);
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = "210mm";
  document.body.appendChild(container);

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf()
      .set({
        margin: [12, 12, 12, 12],
        filename: filename.replace(/\.(txt|html)$/i, ".pdf"),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save();
  } finally {
    document.body.removeChild(container);
  }
}

export function printReport(
  title: string,
  sections: ReportSection[],
  disclaimer: string,
): void {
  const html = buildReportHtml(title, sections, disclaimer);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

function triggerDownload(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function shareCalculationUrl(
  path: string,
  params: Record<string, string | number>,
): void {
  const search = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  );
  const url = `${window.location.origin}${path}?${search.toString()}`;

  if (navigator.share) {
    navigator.share({ title: `${BRAND.name} — חישוב`, url }).catch(() => {
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
