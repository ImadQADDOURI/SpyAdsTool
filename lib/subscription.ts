// @lib/subscription.ts
import { pricingData } from "@/configuration/pricing-config";
import Stripe from "stripe";

import { UserSubscriptionPlan } from "types";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// 🔒 Trustworthy subscription resolver with Stripe validation
export async function getUserSubscriptionPlan(
  userId: string,
): Promise<UserSubscriptionPlan> {
  if (!userId) throw new Error("Authentication required");

  // 1️⃣ Fetch base user data from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) throw new Error("User not found");

  // 2️⃣ Initialize safe defaults
  let stripeSubscription: Stripe.Subscription | null = null;
  let isPaid = false;
  let isCanceled = false;
  let interval: "month" | "year" | null = null;

  // 3️⃣ Validate with Stripe when possible using a single API call with expanded price details!
  try {
    if (user.stripeSubscriptionId) {
      // 🎯 Expand the price object to include recurring interval, eliminating extra API calls.
      stripeSubscription = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId,
        { expand: ["items.data.price"] },
      );

      // 🕵️‍♂️ Directly get the cancelation flag from Stripe
      isCanceled = stripeSubscription.cancel_at_period_end;

      // ⏳ Use Stripe's period end if available (convert from seconds to milliseconds)
      const currentPeriodEnd = stripeSubscription.current_period_end * 1000;

      // ✅ Validate if the subscription is active, trialing, or canceled but still valid
      isPaid =
        stripeSubscription.status === "active" ||
        stripeSubscription.status === "trialing" ||
        (isCanceled && currentPeriodEnd > Date.now());

      // 🔄 Retrieve interval directly from the expanded price data
      const price = stripeSubscription.items.data[0].price as Stripe.Price;
      interval = (price.recurring?.interval as "month" | "year") ?? null;
    }
  } catch (error) {
    console.error("⚠️ Stripe fetch failed, using DB fallback:", error);
    // Fallback to database values
    isPaid = (user.stripeCurrentPeriodEnd?.getTime() ?? 0) > Date.now();
  }

  // 4️⃣ Determine the active plan details from our pricing config
  const activePriceId =
    stripeSubscription?.items.data[0].price.id || user.stripePriceId;
  const userPlan = pricingData.find((p) =>
    [p.stripeIds.monthly, p.stripeIds.yearly].includes(activePriceId),
  );

  // 🛡️ Default to free plan if no valid subscription is found
  const plan = userPlan || pricingData[0];

  return {
    ...plan,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    stripePriceId: activePriceId,
    stripeCurrentPeriodEnd: stripeSubscription?.current_period_end
      ? stripeSubscription.current_period_end * 1000
      : (user.stripeCurrentPeriodEnd?.getTime() ?? 0),
    isPaid,
    isCanceled,
    // 🎉 Determine interval: prioritize fetched interval, otherwise infer from the active price ID.
    interval:
      interval ||
      (userPlan?.stripeIds.monthly === activePriceId ? "month" : "year") ||
      null,
  };
}
