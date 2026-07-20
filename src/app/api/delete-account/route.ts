import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, vents, subscriptions, dailyUsage } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await db.delete(vents).where(eq(vents.email, email));
    await db.delete(subscriptions).where(eq(subscriptions.email, email));
    await db.delete(users).where(eq(users.email, email));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
