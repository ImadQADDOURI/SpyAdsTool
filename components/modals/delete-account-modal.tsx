"use client";

import { useState } from "react";
import { UserSubscriptionPlan } from "@/types";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/shared/icons";
import { UserAvatar } from "@/components/shared/user-avatar";

interface DeleteAccountModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  subscriptionPlan: UserSubscriptionPlan;
}

export function DeleteAccountModal({
  showModal,
  setShowModal,
  subscriptionPlan,
}: DeleteAccountModalProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const hasActiveSubscription =
    subscriptionPlan.isPaid && !subscriptionPlan.isCanceled;

  // Determine plan status
  const status = hasActiveSubscription
    ? "Active"
    : subscriptionPlan.isCanceled
      ? "Canceled"
      : "Inactive";
  const badgeVariant = hasActiveSubscription
    ? "secondary"
    : subscriptionPlan.isCanceled
      ? "destructive"
      : "outline";

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/user`, { method: "DELETE" });
      if (!response.ok) throw new Error(await response.text());

      toast.success("Account deleted successfully");
      setTimeout(() => signOut({ callbackUrl: "/" }), 500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
      setIsDeleting(false);
    }
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col items-center space-y-6 p-6 text-center">
        <UserAvatar
          user={{
            name: session?.user?.name ?? null,
            image: session?.user?.image ?? null,
          }}
          className="h-16 w-16"
        />
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <Icons.alertCircle className="h-5 w-5" />
          Delete Account Permanently
        </h3>

        <div className="w-full rounded-lg bg-accent p-4 text-left">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium">Current Plan</p>
            <Badge
              variant={badgeVariant}
              className="text-xs uppercase tracking-wide"
            >
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-purple-200 px-1 font-semibold text-foreground dark:bg-purple-700">
              {subscriptionPlan.title}
            </span>
          </div>
          {subscriptionPlan.stripeCurrentPeriodEnd && (
            <p className="mt-1 text-sm text-muted-foreground">
              {subscriptionPlan.isCanceled
                ? `Access until ${formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}`
                : subscriptionPlan.isPaid &&
                  `Next renewal ${formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}`}
            </p>
          )}
        </div>

        <form onSubmit={handleDelete} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Type <strong>confirm delete account</strong> to verify:
            </label>
            <Input
              required
              pattern="confirm delete account"
              placeholder="Enter verification phrase"
              className="text-center"
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            disabled={isDeleting}
            className="flex w-full items-center justify-center gap-2"
          >
            {isDeleting ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.trash className="h-4 w-4" />
            )}
            Confirm Permanent Deletion
          </Button>
        </form>
      </div>
    </Modal>
  );
}
