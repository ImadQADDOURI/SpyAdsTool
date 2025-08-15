// @app\(marketing)\pricing\page.tsx

import { constructMetadata } from "@/configuration/metadata-config";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata = constructMetadata({
  title: "Pricing – SaaS Starter",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {
  const user = await getCurrentUser();

  // if (user?.role === "ADMIN") {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center">
  //       <h1 className="text-5xl font-bold">Admin Access Detected</h1>
  //       <Image
  //         src="/_static/illustrations/call-waiting.svg"
  //         alt="Admin dashboard illustration"
  //         width={560}
  //         height={560}
  //         className="pointer-events-none -my-20 dark:invert"
  //         priority
  //       />
  //       <p className="text-balance px-4 text-center text-2xl font-medium">
  //         Redirecting to{" "}
  //         <Link
  //           href="/admin"
  //           className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-purple-500"
  //         >
  //           Admin Dashboard
  //         </Link>
  //       </p>
  //     </div>
  //   );
  // }

  let subscriptionPlan;
  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      <hr className="container" />
      <ComparePlans />
      <PricingFaq />
    </div>
  );
}
