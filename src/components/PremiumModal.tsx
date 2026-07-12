"use client";

import { useState } from "react";
import { X, Crown, Sparkles, Infinity, BarChart, Headphones } from "lucide-react";

const plans = [
  {
    id: "premium",
    name: "Premium",
    price: 299,
    period: "month",
    features: ["Unlimited vents", "Priority AI (no waiting)", "No ads", "Mood reports", "Badge"],
    icon: Crown,
    color: "text-yellow-500",
    bg: "bg-yellow-50 border-yellow-200",
    btn: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    period: "year (₹83/mo)",
    features: ["Everything in Premium", "Custom AI personalities", "Voice sessions (coming soon)", "Export all data", "Early access features"],
    icon: Sparkles,
    color: "text-pink-500",
    bg: "bg-pink-50 border-pink-200",
    btn: "bg-pink-500 hover:bg-pink-600",
  },
];

interface Props {
  deviceId: string;
  onClose: () => void;
  onSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PremiumModal({ deviceId, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    setError(null);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const order = await orderRes.json();
      if (!order.id) throw new Error(order.error || "Failed to create order");

      const email = prompt("Enter your email for the receipt:") || "user@email.com";

      const rzp = new (window as any).Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Chatpatti Baddie",
        description: planId === "pro" ? "Pro Plan (Yearly)" : "Premium Plan (Monthly)",
        order_id: order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceId,
              email,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              plan: planId,
            }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            localStorage.setItem("baddie_premium", "true");
            localStorage.setItem("baddie_plan", planId);
            onSuccess();
          } else {
            setError(data.error || "Verification failed");
          }
        },
        modal: {
          ondismiss: () => setLoading(null),
        },
        prefill: { email },
        theme: { color: "#ec4899" },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">Go Premium</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500 text-center">Unlock the full Baddie experience. No limits, no ads, pure emotional processing.</p>

          <div className="grid gap-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div key={plan.id} className={`rounded-xl border p-4 ${plan.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${plan.color}`} />
                      <span className="font-bold text-gray-900">{plan.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-gray-900">₹{plan.price}</span>
                      <span className="text-xs text-gray-500">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <span className="text-green-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading !== null}
                    className={`w-full py-2 rounded-full text-white text-sm font-medium transition-all disabled:opacity-50 ${plan.btn}`}
                  >
                    {loading === plan.id ? "Processing..." : `Buy ${plan.name} — ₹${plan.price}`}
                  </button>
                </div>
              );
            })}
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <p className="text-xs text-gray-400 text-center">Secure payment via Razorpay. Cancel anytime. No questions asked refunds within 7 days.</p>
        </div>
      </div>
    </div>
  );
}
