import { describe, expect, it } from "vitest";
import { applyAnalyticsEvent } from "./aggregate";
import { emptyStore } from "./types";

describe("applyAnalyticsEvent", () => {
  it("counts visits and unique sessions", () => {
    const store = applyAnalyticsEvent(emptyStore(), {
      type: "visit",
      sessionId: "s1",
    }, "2026-05-31");

    expect(store.totalVisits).toBe(1);
    expect(store.sessions).toEqual(["s1"]);
    expect(store.daily["2026-05-31"].visits).toBe(1);
  });

  it("counts page views", () => {
    const store = applyAnalyticsEvent(emptyStore(), {
      type: "page_view",
      sessionId: "s1",
      path: "/calculators/child-support",
    }, "2026-05-31");

    expect(store.totalPageViews).toBe(1);
    expect(store.pages["/calculators/child-support"]).toBe(1);
  });

  it("counts feature usage", () => {
    const store = applyAnalyticsEvent(emptyStore(), {
      type: "feature",
      sessionId: "s2",
      feature: "calculator_child_support",
    }, "2026-05-31");

    expect(store.totalFeatureUses).toBe(1);
    expect(store.features.calculator_child_support).toBe(1);
  });
});
