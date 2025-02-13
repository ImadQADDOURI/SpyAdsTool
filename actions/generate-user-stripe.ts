// @actions/generate-user-stripe.ts
"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
};

const billingUrl = absoluteUrl("/pricing");

export async function generateUserStripe(
  priceId: string,
): Promise<responseAction> {
  let redirectUrl: string | null = null;

  try {
    // 🔐 Validate user session first
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      throw new Error("Unauthorized: No valid session found");
    }

    // 🚦 Check existing subscription status
    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);

    // 🏦 Handle billing portal or new subscription
    if (subscriptionPlan.isPaid && subscriptionPlan.stripeCustomerId) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });
      redirectUrl = portalSession.url;
    } else {
      const checkoutSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: session.user.email,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId: session.user.id },
      });
      redirectUrl = checkoutSession.url;
    }
  } catch (error) {
    console.error("🔴 Stripe session creation failed:", error);
    return { status: "error" };
  }

  // 🚨 Critical: Redirect outside try/catch to avoid catching Next.js special errors
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  // Fallback error if all paths fail
  return { status: "error" };
}
