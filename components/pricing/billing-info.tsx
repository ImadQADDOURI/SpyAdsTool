// @components/pricing/billing-info.tsx
import * as React from "react";
import Link from "next/link";
import { UserSubscriptionPlan } from "@/types";

import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { Icons } from "@/components/shared/icons";

interface BillingInfoProps {
  userSubscriptionPlan: UserSubscriptionPlan;
  className?: string;
}

export function BillingInfo({
  userSubscriptionPlan,
  className,
}: BillingInfoProps) {
  const {
    title,
    description,
    stripeCustomerId,
    isPaid,
    isCanceled,
    stripeCurrentPeriodEnd,
  } = userSubscriptionPlan;

  // Determine the subscription status for display.
  const status =
    isPaid && !isCanceled ? "Active" : isCanceled ? "Canceled" : "Inactive";
  const badgeVariant =
    isPaid && !isCanceled
      ? "secondary"
      : isCanceled
        ? "destructive"
        : "outline";

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Icons.creditCard className="h-5 w-5" />
            Your Subscription
          </CardTitle>
          <Badge
            variant={badgeVariant}
            className="text-md uppercase tracking-wider"
          >
            {status}
          </Badge>
        </div>
        <CardDescription className="text-md mt-2 text-muted-foreground">
          You’re currently subscribed to the{" "}
          <span className="rounded bg-purple-200 px-1 font-semibold text-foreground dark:bg-purple-700">
            {title}
          </span>{" "}
          plan.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm">{description}</p>

        {stripeCurrentPeriodEnd && (
          <div className="text-md text-muted-foreground">
            {isCanceled ? (
              <>Access ends on {formatDate(stripeCurrentPeriodEnd)}</>
            ) : (
              isPaid && <>Renews on {formatDate(stripeCurrentPeriodEnd)}</>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t p-6">
        {isPaid && stripeCustomerId ? (
          <CustomerPortalButton userStripeId={stripeCustomerId} />
        ) : (
          <Link href="/pricing" className={cn(buttonVariants(), "w-full")}>
            Choose Plan
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
