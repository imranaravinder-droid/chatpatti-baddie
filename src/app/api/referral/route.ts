import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Referral code required" }, { status: 400 });
  }

  const count = await db
    .select({ count: users.id })
    .from(users)
    .where(eq(users.referredBy, code));

  return NextResponse.json({ count: count.length });
}
