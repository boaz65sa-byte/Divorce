import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics/storage";
import type { AnalyticsTrackPayload } from "@/lib/analytics/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyticsTrackPayload>;

    if (!body.type || !body.sessionId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!["visit", "page_view", "feature"].includes(body.type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await recordAnalyticsEvent({
      type: body.type,
      sessionId: body.sessionId,
      path: body.path,
      feature: body.feature,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
