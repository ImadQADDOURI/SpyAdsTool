"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import type { SubscriptionPlan, UserSubscriptionPlan } from "@/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const priceId = offer.stripeIds[year ? "yearly" : "monthly"];

  const handleClick = () => {
    if (!priceId) return;
    startTransition(async () => {
      try {
        await generateUserStripe(priceId);
      } catch (error) {
        console.error("🔴 Failed to initiate Stripe session:", error);
      }
    });
  };

  const isCurrentPlan =
    subscriptionPlan.stripePriceId === priceId && !subscriptionPlan.isCanceled;

  return (
    <Button
      variant={isCurrentPlan ? "default" : "outline"}
      className="flex w-full items-center justify-center gap-2"
      disabled={isPending}
      onClick={handleClick}
      aria-label={isCurrentPlan ? "Manage subscription" : "Upgrade plan"}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 h-5 w-5 animate-spin" aria-hidden />
          Processing...
        </>
      ) : isCurrentPlan ? (
        <>
          <Icons.settings className="mr-2 h-5 w-5" />
          Manage Subscription
        </>
      ) : (
        <>
          <Icons.arrowUpRight className="mr-2 h-5 w-5" />
          Upgrade
        </>
      )}
    </Button>
  );
}
