"use client";

import { useEffect, useState } from "react";

import { AnalyticsSection } from "@/components/adLibrary/landingPage/analyticsSection/AnalyticsSection";
import { CTASection } from "@/components/adLibrary/landingPage/CTASection";
import ExtensionSection from "@/components/adLibrary/landingPage/exploreSection/ExtensionSection";
import TopProductsStoresSection from "@/components/adLibrary/landingPage/exploreSection/TopProductsStoresSection";
import TrendSection from "@/components/adLibrary/landingPage/exploreSection/TrendSection";
import FeaturesSection from "@/components/adLibrary/landingPage/featuresSection/features-section";
import { FooterSection } from "@/components/adLibrary/landingPage/FooterSection";
import AnimatedBackground from "@/components/adLibrary/landingPage/hero/animated-background";
import HeroSection from "@/components/adLibrary/landingPage/hero/hero-section";
import { ReviewSection } from "@/components/adLibrary/landingPage/reviewSection/ReviewSection";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

export default function HomePage() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 500); // Or use 1000ms for 1 second

  //   return () => clearTimeout(timeout);
  // }, []);

  // if (isLoading) {
  //   return (
  //     <div className="h-screen">
  //       <Loading message="" size="large" />
  //     </div>
  //   );
  // }
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <section className={`relative w-full py-12 sm:py-16 lg:py-20`}>
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* <AnimatedBackground /> */}
        </div>

        {/* Explore Section Content */}
        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {/* Trend Section Card */}
          <TrendSection />

          {/* Top Products & Stores Section Card */}
          <TopProductsStoresSection />

          {/* Extension Section Card */}
          <ExtensionSection />

          <AnalyticsSection />
        </div>
      </section>

      <ReviewSection />
      {/* CTA Section */}
      <CTASection />

      {/* Footer Section in layout */}
    </div>
  );
}
