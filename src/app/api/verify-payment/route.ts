import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/schema";
import { verifyPayment } from "@/lib/razorpay";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { deviceId, email, orderId, paymentId, signature, plan } = await request.json();

    const valid = await verifyPayment(orderId, paymentId, signature);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const existing = await db.select().from(subscriptions).where(eq(subscriptions.deviceId, deviceId)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
    }

    const months = plan === "pro" ? 12 : 1;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    await db.insert(subscriptions).values({
      deviceId,
      email,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      plan: plan || "premium",
      status: "active",
      expiresAt,
    });

    return NextResponse.json({ success: true, expiresAt: expiresAt.toISOString() });
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
