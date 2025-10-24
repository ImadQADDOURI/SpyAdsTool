"use client";

import { useEffect, useState } from "react";

import { AnalyticsSection } from "@/components/adTool/landingPage/analyticsSection/AnalyticsSection";
import { CTASection } from "@/components/adTool/landingPage/CTASection";
import ExtensionSection from "@/components/adTool/landingPage/exploreSection/ExtensionSection";
import TrendingSection from "@/components/adTool/landingPage/exploreSection/TrendingSection";
import FeaturesSection from "@/components/adTool/landingPage/features-section";
import GradientBackground from "@/components/adTool/landingPage/hero/gradient-background";
import HeroSection from "@/components/adTool/landingPage/hero/hero-section";
import { WorldMap } from "@/components/adTool/landingPage/map";
import { PricingCTA } from "@/components/adTool/landingPage/pricing-cta";
import { TestimonialsSection } from "@/components/adTool/landingPage/reviewSection/testimonials-with-marquee";
import { SeparatorLine } from "@/components/adTool/landingPage/separator-line";
import TrustedBySection from "@/components/adTool/landingPage/TrustedBySection";
import { Loading } from "@/components/adTool/sharedComponents/Loading";
import { ScrollButtons } from "@/components/adTool/sharedComponents/ScrollButtons";

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Or use 1000ms for 1 second

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen">
        <Loading size="large" />
      </div>
    );
  }
  return (
    <div className="space-y-8 sm:space-y-16">
      <GradientBackground intensity="vibrant">
        <HeroSection />
        <TrustedBySection />
      </GradientBackground>
      <FeaturesSection />
      <SeparatorLine className="my-8 sm:my-16" />
      <TrendingSection />
      <ExtensionSection />
      <SeparatorLine className="my-8 sm:my-16" />
      <AnalyticsSection />
      <SeparatorLine className="my-8 sm:my-16" />
      <PricingCTA />
      <SeparatorLine className="my-8 sm:my-16" />
      <TestimonialsSection />
      <SeparatorLine className="my-8 sm:my-16" />
      {/* <WorldMap /> */}
      <CTASection />
      {/* Footer Section in layout */}

      {/* Scroll Buttons */}
      <ScrollButtons />
    </div>
  );
}
