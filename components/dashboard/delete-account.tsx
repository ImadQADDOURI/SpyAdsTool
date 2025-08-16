// @components\dashboard\delete-account.tsx
"use client";

import { useState } from "react";
import { siteConfig } from "@/configuration/site-config";
import { UserSubscriptionPlan } from "@/types";

import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Icons } from "@/components/shared/icons";

interface DeleteAccountSectionProps {
  subscriptionPlan: UserSubscriptionPlan;
}

export function DeleteAccountSection({
  subscriptionPlan,
}: DeleteAccountSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const hasActiveSubscription =
    subscriptionPlan.isPaid && !subscriptionPlan.isCanceled;

  return (
    <>
      <DeleteAccountModal
        showModal={showModal}
        setShowModal={setShowModal}
        subscriptionPlan={subscriptionPlan}
      />
      <Card className="w-full border border-red-400 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Icons.trash className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription className="text-red-500">
            Danger Zone – proceed with caution!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium">Are you sure?</span>
              {hasActiveSubscription && (
                <div className="ml-auto">
                  <Badge
                    variant="destructive"
                    className="text-md flex items-center gap-1 uppercase tracking-wider"
                  >
                    <Icons.alertTriangle className="h-4 w-4" />
                    Active Subscription
                  </Badge>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Permanently<span className="text-red-500"> delete</span> your
              {siteConfig.name} account and
              <span className="text-red-500"> cancel</span> your subscription.{" "}
              <span className="text-red-500">
                This action cannot be undone.
              </span>
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={() => setShowModal(true)}
            aria-label="Initiate account deletion"
            className="flex w-full items-center justify-center gap-2"
          >
            <Icons.trash className="h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
