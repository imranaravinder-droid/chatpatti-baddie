import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions, dailyUsage } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

const FREE_DAILY_LIMIT = 5;

export async function POST(request: NextRequest) {
  try {
    const { deviceId } = await request.json();
    if (!deviceId) {
      return NextResponse.json({ premium: false, remaining: 0, error: "No device ID" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);

    const sub = await db.select().from(subscriptions).where(eq(subscriptions.deviceId, deviceId)).limit(1);
    const isPremium = sub.length > 0 && sub[0].status === "active" && (!sub[0].expiresAt || new Date(sub[0].expiresAt) > new Date());

    let usageCount = 0;
    if (!isPremium) {
      const usage = await db.select().from(dailyUsage).where(and(eq(dailyUsage.deviceId, deviceId), eq(dailyUsage.date, today))).limit(1);
      usageCount = usage.length > 0 ? usage[0].count : 0;
    }

    return NextResponse.json({
      premium: isPremium,
      usedToday: usageCount,
      remaining: isPremium ? Infinity : Math.max(0, FREE_DAILY_LIMIT - usageCount),
      plan: isPremium ? sub[0].plan : "free",
    });
  } catch {
    return NextResponse.json({ premium: false, remaining: 5, usedToday: 0, plan: "free" });
  }
}
