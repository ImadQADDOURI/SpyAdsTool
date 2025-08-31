"use client";

import { useState } from "react";
import Link from "next/link";
import { pricing_CTA_Config } from "@/configuration/landing-config";
import { pricingData } from "@/configuration/pricing-config";
import { Check, Crown, Shield, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Header } from "./header";
import { AuroraText } from "./hero/AuroraText";

export function PricingCTA() {
  const [isYearly, setIsYearly] = useState(false);

  const starterPlan = pricingData.find((plan) => plan.title === "Starter");
  const proPlan = pricingData.find((plan) => plan.title === "Pro");

  if (!proPlan) return null;

  const toggleBilling = (value: string) => {
    setIsYearly(value === "yearly");
  };

  const currentPrice = isYearly
    ? proPlan.prices.yearly
    : proPlan.prices.monthly;
  const yearlyDiscount = proPlan.prices.monthly * 12 - proPlan.prices.yearly;

  const benefitsColumn1 = proPlan.benefits.slice(0, 5);
  const benefitsColumn2 = proPlan.benefits.slice(5, 10);

  return (
    <section className="w-full overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 space-y-4 text-center">
          {/* 📝Header */}
          <Header
            gradientColors={pricing_CTA_Config.gradientColors}
            headline={pricing_CTA_Config.headline}
            subtitle={pricing_CTA_Config.subtitle}
            className="px-4"
            // headlineClassName="text-6xl"
            // subtitleClassName="text-xl"
            // containerClassName="max-w-4xl"
            // forceDarkMode={true}
          />

          <div className="mb-6 flex items-center justify-center">
            <ToggleGroup
              type="single"
              size="sm"
              defaultValue={isYearly ? "yearly" : "monthly"}
              onValueChange={toggleBilling}
              aria-label="toggle-year"
              className="h-10 overflow-hidden rounded-full border-2 bg-background p-1 shadow-lg *:h-8 *:text-muted-foreground sm:h-12 sm:p-1.5 sm:*:h-9"
            >
              <ToggleGroupItem
                value="monthly"
                className="rounded-full px-4 text-sm font-semibold transition-all duration-200 data-[state=on]:!bg-gradient-to-r data-[state=on]:!from-pink-500 data-[state=on]:!to-rose-500 data-[state=on]:!text-white data-[state=on]:shadow-md sm:px-6 sm:text-base"
                aria-label="Toggle monthly billing"
              >
                Monthly
              </ToggleGroupItem>
              <ToggleGroupItem
                value="yearly"
                className="rounded-full px-4 text-sm font-semibold transition-all duration-200 data-[state=on]:!bg-gradient-to-r data-[state=on]:!from-emerald-400 data-[state=on]:!to-emerald-600 data-[state=on]:!text-white data-[state=on]:shadow-md sm:px-6 sm:text-base"
                aria-label="Toggle yearly billing"
              >
                Yearly
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="relative">
          <div
            className={`absolute -top-3 left-1/2 z-50 flex -translate-x-1/2 transform items-center space-x-1 rounded-full px-3 py-1 text-xs font-bold uppercase text-white shadow-lg sm:left-6 sm:translate-x-0 sm:px-4 sm:text-xs lg:left-8 ${
              isYearly
                ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                : "bg-gradient-to-r from-pink-500 to-rose-500"
            }`}
          >
            <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{isYearly ? "Recommended" : "Most Popular"}</span>
          </div>

          <Card className="overflow-hidden border-pink-200 bg-white shadow-xl ring-1 ring-pink-100 transition-all duration-300 hover:border-pink-300 hover:shadow-2xl dark:border-pink-700 dark:bg-gray-950 dark:ring-pink-800 dark:hover:border-pink-600">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 p-3 text-center dark:from-pink-600 dark:to-rose-700 sm:p-5 lg:w-1/3 lg:text-left">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-transparent"></div>
                  <div className="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-white/10 sm:h-20 sm:w-20 sm:-translate-y-10 sm:translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 h-12 w-12 -translate-x-6 translate-y-6 rounded-full bg-white/5 sm:h-16 sm:w-16 sm:-translate-x-8 sm:translate-y-8"></div>

                  <div className="relative z-10 pt-2">
                    <div className="mb-3">
                      <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                        <Crown className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        <h3 className="text-xl font-bold text-white sm:text-2xl">
                          {proPlan.title}
                        </h3>
                      </div>
                      <p className="mb-3 text-sm font-medium text-pink-100 sm:text-base">
                        {proPlan.description}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 flex items-baseline justify-center gap-1 lg:justify-start">
                        <span className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                          $
                          {isYearly
                            ? Math.round(proPlan.prices.yearly / 12)
                            : proPlan.prices.monthly}
                        </span>
                        <span className="text-sm text-pink-100 sm:text-base">
                          /month
                        </span>
                      </div>
                      {isYearly && (
                        <>
                          <div className="mb-2 text-xs text-pink-100 sm:text-sm">
                            or ${proPlan.prices.yearly}/year
                          </div>
                          <div className="inline-block rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-semibold text-yellow-200 sm:px-3 sm:text-sm">
                            <Sparkles className="mr-1 inline h-3 w-3" />
                            Save ${yearlyDiscount} annually
                          </div>
                        </>
                      )}
                    </div>

                    <Link href="/pricing">
                      <Button className="w-full border-0 bg-white text-sm font-semibold text-pink-600 shadow-lg transition-all duration-200 hover:bg-pink-50 hover:text-pink-700 hover:shadow-xl sm:text-base">
                        View All Plans
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50/50 to-white p-3 dark:from-gray-900/50 dark:to-gray-950 sm:p-5 lg:w-2/3">
                  <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-lg">
                    Everything you get with Pro
                  </h4>

                  <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                    <div className="space-y-1.5 sm:space-y-2">
                      {benefitsColumn1.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:gap-3"
                        >
                          <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-sm sm:h-5 sm:w-5">
                            <Check className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      {benefitsColumn2.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:gap-3"
                        >
                          <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-sm sm:h-5 sm:w-5">
                            <Check className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-2 sm:gap-3 md:grid-cols-3">
              <div className="flex flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 p-2.5 text-center shadow-sm transition-all duration-200 hover:shadow-md dark:from-green-900/20 dark:to-green-800/10 sm:gap-3 sm:p-3 sm:text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm sm:h-10 sm:w-10">
                  <Shield className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-700 dark:text-green-300 sm:text-base">
                    2 days money back
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 sm:text-sm">
                    Guarantee
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-2.5 text-center shadow-sm transition-all duration-200 hover:shadow-md dark:from-blue-900/20 dark:to-blue-800/10 sm:gap-3 sm:p-3 sm:text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm sm:h-10 sm:w-10">
                  <Check className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 sm:text-base">
                    No setup fees
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 sm:text-sm">
                    100% hassle-free
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 p-2.5 text-center shadow-sm transition-all duration-200 hover:shadow-md dark:from-red-900/20 dark:to-red-800/10 sm:gap-3 sm:p-3 sm:text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-sm sm:h-10 sm:w-10">
                  <X className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-red-700 dark:text-red-300 sm:text-base">
                    Cancel anytime
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400 sm:text-sm">
                    No questions asked
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-rose-600 hover:shadow-xl sm:px-8 sm:py-3 sm:text-lg"
              >
                {starterPlan?.title} for ${starterPlan?.prices.monthly} - Try
                Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
