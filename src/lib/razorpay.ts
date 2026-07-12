const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export function getRazorpayAuth(): string {
  return Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
}

export async function createOrder(amount: number, currency = "INR"): Promise<{ id: string; amount: number; currency: string }> {
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${getRazorpayAuth()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    }),
  });
  if (!res.ok) throw new Error("Failed to create Razorpay order");
  return res.json();
}

export async function verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  const text = `${orderId}|${paymentId}`;
  const crypto = await import("node:crypto");
  const expected = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(text).digest("hex");
  return expected === signature;
}
