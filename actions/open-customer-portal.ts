// @actions/open-customer-portal.ts
"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
};

const billingUrl = absoluteUrl("/settings/billing");

export async function openCustomerPortal(
  userStripeId: string,
): Promise<responseAction> {
  let redirectUrl: string | null = null;

  try {
    // 🔒 Double-check authentication before proceeding
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized: User not authenticated");
    }

    // 🛡️ Validate Stripe customer ID format
    if (!userStripeId.startsWith("cus_")) {
      throw new Error("Invalid Stripe customer ID format");
    }

    // 🏢 Create secure billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userStripeId,
      return_url: billingUrl,
    });
    redirectUrl = portalSession.url;
  } catch (error) {
    console.error("🔴 Billing portal access failed:", error);
    return { status: "error" };
  }

  // 🚀 Final redirect outside error-prone blocks
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return { status: "error" };
}
