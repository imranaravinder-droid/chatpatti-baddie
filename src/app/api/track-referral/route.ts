import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { referrals } from "@/lib/schema";

export async function POST(request: NextRequest) {
  try {
    const { source, deviceId } = await request.json();
    if (!source) {
      return NextResponse.json({ error: "Source is required" }, { status: 400 });
    }
    await db.insert(referrals).values({ deviceId: deviceId || "unknown", source });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Track referral error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
