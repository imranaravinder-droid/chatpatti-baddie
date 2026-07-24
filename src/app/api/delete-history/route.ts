import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vents } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await db.delete(vents).where(eq(vents.email, email));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete history error:", err);
    return NextResponse.json({ error: "Failed to delete history" }, { status: 500 });
  }
}
