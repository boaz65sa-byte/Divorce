import { describe, expect, it } from "vitest";
import { buildReportHtml, buildReportText } from "./exportReport";

describe("exportReport", () => {
  const sections = [
    { title: "תוצאה", lines: ["שורה 1", "שורה 2"] },
  ];
  const disclaimer = "הערכה בלבד";

  it("builds plain text report", () => {
    const text = buildReportText("מזונות", sections, disclaimer);
    expect(text).toContain("מזונות");
    expect(text).toContain("שורה 1");
    expect(text).toContain(disclaimer);
  });

  it("builds html report with rtl", () => {
    const html = buildReportHtml("מזונות", sections, disclaimer);
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("lang=\"he\"");
    expect(html).toContain("שורה 1");
  });

  it("escapes html in content", () => {
    const html = buildReportHtml(
      "test",
      [{ title: "<script>", lines: ["<b>bad</b>"] }],
      disclaimer,
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
