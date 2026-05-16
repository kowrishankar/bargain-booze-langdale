"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DELIVERY_FEE, STORE } from "@/lib/constants";
import { formatGBP } from "@/lib/pricing";

type PaymentMethod = "STRIPE" | "PAY_IN_STORE";

type Props = {
  subtotal: number;
  stripeEnabled: boolean;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
};

export function CheckoutForm({
  subtotal,
  stripeEnabled,
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
}: Props) {
  const router = useRouter();
  const [fulfillment, setFulfillment] = useState<"COLLECTION" | "DELIVERY">("COLLECTION");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PAY_IN_STORE");
  const [postcodeStatus, setPostcodeStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [postcodeMessage, setPostcodeMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = fulfillment === "DELIVERY" ? DELIVERY_FEE : 0;
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;
  const mustPayOnline = fulfillment === "DELIVERY";

  useEffect(() => {
    if (mustPayOnline) {
      setPaymentMethod("STRIPE");
    }
  }, [mustPayOnline]);

  async function validatePostcode(postcode: string) {
    const res = await fetch("/api/postcodes/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcode }),
    });
    const data = await res.json();
    setPostcodeStatus(data.valid ? "valid" : "invalid");
    setPostcodeMessage(data.message ?? data.area ?? "");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const resolvedPayment: PaymentMethod = mustPayOnline ? "STRIPE" : paymentMethod;

    if (resolvedPayment === "STRIPE" && !stripeEnabled) {
      setError(
        mustPayOnline
          ? "Online payment is required for delivery but is not available right now. Please contact the store."
          : "Online payment is not available. Please choose pay in store.",
      );
      setLoading(false);
      return;
    }

    const payload = {
      fulfillmentType: fulfillment,
      paymentMethod: resolvedPayment,
      contactName: String(form.get("contactName")),
      contactEmail: String(form.get("contactEmail")),
      contactPhone: String(form.get("contactPhone")),
      addressLine1: fulfillment === "DELIVERY" ? String(form.get("addressLine1")) : undefined,
      addressLine2: fulfillment === "DELIVERY" ? String(form.get("addressLine2") || "") : undefined,
      city: fulfillment === "DELIVERY" ? String(form.get("city")) : undefined,
      postcode: fulfillment === "DELIVERY" ? String(form.get("postcode")) : undefined,
    };

    if (fulfillment === "DELIVERY" && postcodeStatus !== "valid") {
      setError("Please enter a valid delivery postcode in our local area.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        setLoading(false);
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      router.push(`/account/orders/${data.orderId}?placed=1`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const submitLabel =
    mustPayOnline || paymentMethod === "STRIPE"
      ? loading
        ? "Processing…"
        : `Pay online ${formatGBP(total)}`
      : loading
        ? "Placing order…"
        : `Place order — pay in store (${formatGBP(total)})`;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-stone-800">How would you like your order?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={`cursor-pointer rounded-2xl border-2 p-4 ${fulfillment === "COLLECTION" ? "border-brand bg-brand-light" : "border-stone-200"}`}
          >
            <input
              type="radio"
              name="fulfillment"
              className="sr-only"
              checked={fulfillment === "COLLECTION"}
              onChange={() => setFulfillment("COLLECTION")}
            />
            <p className="font-semibold">Collect in store</p>
            <p className="mt-1 text-sm text-stone-600">{STORE.fullAddress}</p>
            <p className="mt-1 text-sm font-medium text-green-700">Free</p>
          </label>
          <label
            className={`cursor-pointer rounded-2xl border-2 p-4 ${fulfillment === "DELIVERY" ? "border-brand bg-brand-light" : "border-stone-200"}`}
          >
            <input
              type="radio"
              name="fulfillment"
              className="sr-only"
              checked={fulfillment === "DELIVERY"}
              onChange={() => setFulfillment("DELIVERY")}
            />
            <p className="font-semibold">Local delivery</p>
            <p className="mt-1 text-sm text-stone-600">Dunstable &amp; surrounding LU6 postcodes</p>
            <p className="mt-1 text-sm font-medium">{formatGBP(DELIVERY_FEE)}</p>
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
        <legend className="text-sm font-semibold text-stone-900">Payment</legend>
        {mustPayOnline ? (
          <p className="text-sm text-stone-600">
            Delivery orders must be paid online securely via Stripe before we dispatch your order.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={`cursor-pointer rounded-xl border-2 p-3 ${paymentMethod === "PAY_IN_STORE" ? "border-brand bg-brand-light" : "border-stone-200"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                className="sr-only"
                checked={paymentMethod === "PAY_IN_STORE"}
                onChange={() => setPaymentMethod("PAY_IN_STORE")}
              />
              <p className="font-semibold">Pay in store</p>
              <p className="mt-1 text-xs text-stone-600">Pay when you collect at the till</p>
            </label>
            <label
              className={`cursor-pointer rounded-xl border-2 p-3 ${paymentMethod === "STRIPE" ? "border-brand bg-brand-light" : "border-stone-200"} ${!stripeEnabled ? "opacity-50" : ""}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                className="sr-only"
                checked={paymentMethod === "STRIPE"}
                onChange={() => setPaymentMethod("STRIPE")}
                disabled={!stripeEnabled}
              />
              <p className="font-semibold">Pay online</p>
              <p className="mt-1 text-xs text-stone-600">Secure card payment via Stripe</p>
            </label>
          </div>
        )}
        {!stripeEnabled && mustPayOnline && (
          <p className="text-sm font-medium text-red-600">
            Online payment is not configured. Delivery is unavailable until Stripe is set up.
          </p>
        )}
      </fieldset>

      <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4">
        <h2 className="font-semibold text-stone-900">Your contact details</h2>
        <p className="text-sm text-stone-500">We&apos;ll use these to update you on your order.</p>
        <Input label="Full name" name="contactName" required defaultValue={defaultName} autoComplete="name" />
        <Input label="Email" name="contactEmail" type="email" required defaultValue={defaultEmail} autoComplete="email" />
        <Input label="Mobile number" name="contactPhone" type="tel" required defaultValue={defaultPhone} autoComplete="tel" />
      </div>

      {fulfillment === "DELIVERY" && (
        <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4">
          <h2 className="font-semibold text-stone-900">Delivery address</h2>
          <Input label="Address line 1" name="addressLine1" required autoComplete="address-line1" />
          <Input label="Address line 2 (optional)" name="addressLine2" autoComplete="address-line2" />
          <Input label="Town / city" name="city" required defaultValue="Dunstable" autoComplete="address-level2" />
          <div>
            <Input
              label="Postcode"
              name="postcode"
              required
              placeholder="e.g. LU6 3BS"
              autoComplete="postal-code"
              onBlur={(e) => e.target.value && validatePostcode(e.target.value)}
            />
            {postcodeMessage && (
              <p className={`mt-1 text-xs ${postcodeStatus === "valid" ? "text-green-700" : "text-red-600"}`}>
                {postcodeMessage}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-stone-100 p-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatGBP(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="mt-1 flex justify-between">
            <span>Delivery</span>
            <span>{formatGBP(deliveryFee)}</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-stone-300 pt-2 text-base font-bold">
          <span>Total</span>
          <span>{formatGBP(total)}</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || (mustPayOnline && !stripeEnabled)}
      >
        {submitLabel}
      </Button>
      <p className="text-center text-xs text-stone-500">
        You must be 18+ to purchase alcohol. ID may be required on delivery or collection.
      </p>
    </form>
  );
}

