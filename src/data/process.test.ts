import { describe, expect, it } from "vitest";
import { getChecklistForProfile } from "@/data/process";
import type { UserProfile } from "@/lib/types";

const baseProfile: UserProfile = {
  onboardingComplete: true,
  religion: "jewish",
  hasChildren: true,
  children: [],
  court: "rabbinical",
  agreement: "dispute",
  incomeA: 10000,
  incomeB: 8000,
  parentAName: "א'",
  parentBName: "ב'",
};

describe("getChecklistForProfile", () => {
  it("includes mediation for dispute", () => {
    const items = getChecklistForProfile(baseProfile);
    expect(items.some((i) => i.id === "mediation-request")).toBe(true);
    expect(items.some((i) => i.id === "consensus-draft")).toBe(false);
  });

  it("includes consensus draft for agreement", () => {
    const items = getChecklistForProfile({
      ...baseProfile,
      agreement: "consensus",
    });
    expect(items.some((i) => i.id === "consensus-draft")).toBe(true);
    expect(items.some((i) => i.id === "mediation-request")).toBe(false);
  });

  it("includes ketuba only for rabbinical court", () => {
    const rabbinical = getChecklistForProfile(baseProfile);
    const family = getChecklistForProfile({
      ...baseProfile,
      court: "family",
    });
    expect(rabbinical.some((i) => i.id === "ketuba")).toBe(true);
    expect(family.some((i) => i.id === "ketuba")).toBe(false);
  });
});
