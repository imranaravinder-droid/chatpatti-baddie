import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email, name, age, referralSource, ref, recaptchaToken } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name required" }, { status: 400 });
    }

    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
      const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
      const recaptchaData = await recaptchaRes.json();
      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json({ error: "Bot detected or verification failed." }, { status: 400 });
      }
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const referralCode = btoa(email).replace(/=/g, "").substring(0, 12);

    await db.insert(users).values({
      email,
      name,
      age: age || null,
      referralSource: referralSource || null,
      referralCode,
      referredBy: ref || null,
    });

    return NextResponse.json({ success: true, referralCode });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
