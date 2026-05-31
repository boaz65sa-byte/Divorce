import { NextResponse } from "next/server";
import { getAnalyticsStats, verifyAdminSecret } from "@/lib/analytics/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret =
    searchParams.get("secret") ??
    request.headers.get("x-admin-secret");

  if (!verifyAdminSecret(secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getAnalyticsStats();
  return NextResponse.json(stats);
}
