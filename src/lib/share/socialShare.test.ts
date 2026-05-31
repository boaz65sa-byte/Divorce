import { describe, expect, it } from "vitest";
import {
  buildPlatformShareUrl,
  getDefaultShareContent,
} from "./socialShare";

describe("socialShare", () => {
  it("builds default hebrew share content with url", () => {
    const content = getDefaultShareContent("he", "https://example.com/welcome");
    expect(content.title).toContain("תגרשן לי");
    expect(content.text).toContain("https://example.com/welcome");
  });

  it("builds whatsapp share url", () => {
    const content = getDefaultShareContent("he", "https://example.com/welcome");
    const url = buildPlatformShareUrl("whatsapp", content);
    expect(url).toContain("wa.me");
    expect(url).toContain(encodeURIComponent("https://example.com/welcome"));
  });

  it("builds facebook share url", () => {
    const content = getDefaultShareContent("en", "https://example.com/welcome");
    const url = buildPlatformShareUrl("facebook", content);
    expect(url).toContain("facebook.com/sharer");
  });

  it("builds linkedin and telegram urls", () => {
    const content = getDefaultShareContent("he", "https://example.com/welcome");
    expect(buildPlatformShareUrl("linkedin", content)).toContain("linkedin.com");
    expect(buildPlatformShareUrl("telegram", content)).toContain("t.me/share");
  });
});
