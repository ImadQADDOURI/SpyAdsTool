"use client";

import { useTransition } from "react";
import { openCustomerPortal } from "@/actions/open-customer-portal";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface CustomerPortalButtonProps {
  userStripeId: string;
}

export function CustomerPortalButton({
  userStripeId,
}: CustomerPortalButtonProps) {
  const [isPending, startTransition] = useTransition();
  const isValidCustomer = userStripeId.startsWith("cus_");

  const handleClick = () => {
    startTransition(async () => {
      try {
        await openCustomerPortal(userStripeId);
      } catch (error) {
        console.error("🔴 Failed to access billing portal:", error);
      }
    });
  };

  return (
    <Button
      className="flex w-full items-center justify-center gap-2"
      disabled={!isValidCustomer || isPending}
      onClick={handleClick}
      aria-label="Manage billing information"
    >
      {isPending ? (
        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" aria-hidden />
      ) : (
        <Icons.creditCard className="mr-2 h-5 w-5" />
      )}
      {isValidCustomer ? "Billing Portal" : "Invalid Customer ID"}
    </Button>
  );
}
