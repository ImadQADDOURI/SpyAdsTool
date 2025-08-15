"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { UserSubscriptionPlan } from "@/types";
import {
  CircleCheckBig,
  CreditCard,
  Crown,
  Rocket,
  Star,
  Zap,
} from "lucide-react";

import type { SubscriptionPlan } from "@/types/index";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import {
  paymentMethods,
  pricingData,
} from "../adTool/configuration/pricing-config";
import TitleSection from "../adTool/sharedComponents/TitleSection";

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function PricingCards({ userId, subscriptionPlan }: PricingCardsProps) {
  const [isYearly, setIsYearly] = useState(
    subscriptionPlan?.interval === "year" || false,
  );
  const { setShowSignInModal } = useContext(ModalContext);

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  const getCardStyles = (title: string) => {
    switch (title.toLowerCase()) {
      case "starter":
        return {
          border:
            "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700",
          background:
            "bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10",
          headerBg:
            "bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20",
          accent: "text-blue-600 dark:text-blue-400",
          icon: Zap,
          shadow: "shadow-blue-100 dark:shadow-blue-900/20",
        };
      case "pro":
        return {
          border:
            "border-pink-300 dark:border-pink-700 hover:border-pink-400 dark:hover:border-pink-600 ring-2 ring-pink-200 dark:ring-pink-800",
          background:
            "bg-gradient-to-br from-pink-50/50 to-rose-100/30 dark:from-pink-950/20 dark:to-rose-900/10",
          headerBg:
            "bg-gradient-to-r from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20",
          accent: "text-pink-600 dark:text-pink-400",
          icon: Crown,
          shadow: "shadow-pink-200 dark:shadow-pink-900/30",
        };
      default:
        return {
          border:
            "border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700",
          background:
            "bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10",
          headerBg:
            "bg-gradient-to-r from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20",
          accent: "text-green-600 dark:text-green-400",
          icon: Star,
          shadow: "shadow-green-100 dark:shadow-green-900/20",
        };
    }
  };

  const PricingCard = ({ offer }: { offer: SubscriptionPlan }) => {
    const styles = getCardStyles(offer.title);
    const IconComponent = styles.icon;
    const isPro = offer.title.toLowerCase() === "pro";

    return (
      <div
        className={cn(
          "relative flex flex-col overflow-visible rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl",
          styles.border,
          styles.background,
          styles.shadow,
          isPro ? "z-10 scale-105 transform" : "",
        )}
        key={offer.title}
      >
        {isPro && (
          <div className="absolute -top-3 left-1/2 z-50 flex -translate-x-1/2 transform items-center space-x-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-1 text-xs font-bold uppercase text-white shadow-lg">
            <Crown className="h-4 w-4" />
            <span>Most Popular</span>
          </div>
        )}
        <div
          className={cn(
            "min-h-[180px] items-start space-y-4 p-6",
            styles.headerBg,
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-lg bg-white/80 p-2 dark:bg-gray-800/80",
                styles.accent,
              )}
            >
              <IconComponent className="size-6" />
            </div>
            <div>
              <p
                className={cn(
                  "font-urban text-lg font-bold uppercase tracking-wider",
                  styles.accent,
                )}
              >
                {offer.title}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {offer.description}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-end">
            <div className="flex items-end">
              <div className="flex text-left text-4xl font-bold leading-6">
                {isYearly && offer.prices.monthly > 0 ? (
                  <>
                    <span className="mr-2 text-2xl text-muted-foreground/60 line-through">
                      ${offer.prices.monthly}
                    </span>
                    <span className={styles.accent}>
                      ${offer.prices.yearly / 12}
                    </span>
                  </>
                ) : (
                  <span className={styles.accent}>${offer.prices.monthly}</span>
                )}
              </div>
              <div className="-mb-1 ml-2 text-left text-sm font-medium text-muted-foreground">
                <div>/month</div>
              </div>
            </div>
          </div>
          {offer.prices.monthly > 0 ? (
            <div className="text-left text-sm font-medium text-muted-foreground">
              {isYearly
                ? `$${offer.prices.yearly} billed annually`
                : "billed monthly"}
            </div>
          ) : (
            <div className="text-left text-sm font-medium text-green-600 dark:text-green-400">
              Forever free
            </div>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-6 p-6">
          <ul className="space-y-3 text-left text-sm font-medium leading-normal">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-3" key={feature}>
                <Icons.check
                  className={cn("mt-0.5 size-5 shrink-0", styles.accent)}
                />
                <p className="text-foreground">{feature}</p>
              </li>
            ))}

            {offer.limitations.length > 0 &&
              offer.limitations.map((feature) => (
                <li
                  className="flex items-start text-muted-foreground/80"
                  key={feature}
                >
                  <Icons.close className="mr-3 mt-0.5 size-5 shrink-0 text-muted-foreground/60" />
                  <p>{feature}</p>
                </li>
              ))}
          </ul>

          {userId && subscriptionPlan ? (
            offer.title === "Starter" ? (
              <Link
                href="/settings"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "h-12 w-full border-2 font-semibold transition-all duration-200 hover:scale-105",
                  "border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/20",
                )}
              >
                Go to Profile
              </Link>
            ) : (
              <BillingFormButton
                year={isYearly}
                offer={offer}
                subscriptionPlan={subscriptionPlan}
              />
            )
          ) : (
            <Button
              variant={isPro ? "default" : "outline"}
              className={cn(
                "h-12 w-full font-semibold transition-all duration-200 hover:scale-105",
                isPro
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
                  : offer.title.toLowerCase() === "starter"
                    ? "border-2 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/20"
                    : "border-2 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/20",
              )}
              onClick={() => setShowSignInModal(true)}
            >
              {isPro ? (
                <span className="flex items-center gap-2">
                  <Crown className="size-4" />
                  Get Started
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center">
        <TitleSection
          icon={CircleCheckBig}
          iconColor="text-purple-500 dark:text-purple-400"
          badgeText="Pricing"
          image={Rocket}
          imageColor="text-pink-600 dark:text-pink-400"
          highlightedText="Start"
          remainingTitle="at full speed !"
          auroraColors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
          description=""
        />

        <div className="mb-8 flex items-center gap-5">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={isYearly ? "yearly" : "monthly"}
            onValueChange={toggleBilling}
            aria-label="toggle-year"
            className="h-12 overflow-hidden rounded-full border-2 bg-background p-1.5 shadow-lg *:h-9 *:text-muted-foreground"
          >
            <ToggleGroupItem
              value="yearly"
              className="rounded-full px-6 font-semibold transition-all duration-200 data-[state=on]:!bg-gradient-to-r data-[state=on]:!from-pink-500 data-[state=on]:!to-rose-500 data-[state=on]:!text-white data-[state=on]:shadow-md"
              aria-label="Toggle yearly billing"
            >
              Yearly (-20%)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="monthly"
              className="rounded-full px-6 font-semibold transition-all duration-200 data-[state=on]:!bg-gradient-to-r data-[state=on]:!from-blue-500 data-[state=on]:!to-blue-600 data-[state=on]:!text-white data-[state=on]:shadow-md"
              aria-label="Toggle monthly billing"
            >
              Monthly
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex w-full justify-center">
          <div
            className={cn("flex flex-col gap-8 bg-inherit py-5 md:flex-row")}
          >
            {pricingData.map((offer) => (
              <div key={offer.title} className="flex-1">
                <PricingCard offer={offer} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 w-full max-w-5xl">
          <div className="rounded-2xl border bg-gradient-to-br from-gray-50/50 to-gray-100/30 p-8 dark:from-gray-950/20 dark:to-gray-900/10">
            <div className="text-center">
              {/* <div className="mb-4 flex items-center justify-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-2xl font-bold text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-gray-100">
                  Secure Payment Methods
                </h3>
              </div> */}

              <p className="mb-12 text-lg text-gray-600/90 dark:text-gray-400/90">
                Powered by Stripe with support for{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-semibold text-transparent dark:from-purple-400 dark:to-pink-400">
                  125+ payment methods
                </span>{" "}
                worldwide
              </p>

              {/* Payment methods with no containers - cleaner look */}
              <div className="flex flex-wrap items-center justify-center gap-8">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="transition-all duration-300 hover:scale-110"
                  >
                    <Image
                      src={method.logo || "/placeholder.svg"}
                      alt={method.name}
                      width={40}
                      height={24}
                      className="h-6 w-auto object-contain opacity-70 transition-all duration-300 hover:opacity-100 dark:drop-shadow-[0_0_0.5px_white]"
                      crossOrigin="anonymous"
                    />
                  </div>
                ))}
              </div>

              {/* Trust indicators */}
              {/* <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>Global coverage</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <p className="mt-8 text-balance text-center text-base text-muted-foreground">
          Login to contact our{" "}
          <a
            className="font-medium text-primary transition-colors hover:underline"
            href="/support"
          >
            Support
          </a>{" "}
          team for personalized assistance.
          <br />
        </p>
      </section>
    </MaxWidthWrapper>
  );
}
