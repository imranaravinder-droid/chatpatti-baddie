import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, vents } from "@/lib/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    const sourceStats = await db.select({ source: users.referralSource, count: sql<number>`count(*)` }).from(users).groupBy(users.referralSource);
    const ageStats = await db.select({ age: users.age, count: sql<number>`count(*)` }).from(users).groupBy(users.age);
    const totalVents = await db.select({ count: sql<number>`count(*)` }).from(vents);
    const today = new Date().toISOString().slice(0, 10);
    const todayUsers = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`date(created_at) = ${today}`);

    return NextResponse.json({
      totalUsers: totalUsers[0]?.count || 0,
      totalVents: totalVents[0]?.count || 0,
      todaySignups: todayUsers[0]?.count || 0,
      bySource: sourceStats.filter(s => s.source).map(s => ({ source: s.source, count: s.count })),
      byAge: ageStats.filter(a => a.age).map(a => ({ age: a.age, count: a.count })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
