import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();
    const prices: Record<string, number> = { premium: 299, pro: 999 };
    const amount = prices[plan] || 299;
    const order = await createOrder(amount);
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
