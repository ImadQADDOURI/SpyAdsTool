"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/configuration/landing-config";

import { AnalyticsSection } from "@/components/adTool/landingPage/analyticsSection/AnalyticsSection";
import { CTASection } from "@/components/adTool/landingPage/CTASection";
import Demo from "@/components/adTool/landingPage/demo";
import ExtensionSection from "@/components/adTool/landingPage/exploreSection/ExtensionSection";
import TrendingSection from "@/components/adTool/landingPage/exploreSection/TrendingSection";
import FeaturesSection from "@/components/adTool/landingPage/featuresSection/features-section";
import GradientBackground from "@/components/adTool/landingPage/hero/gradient-background";
import HeroSection from "@/components/adTool/landingPage/hero/hero-section";
import TrustedBySection from "@/components/adTool/landingPage/hero/TrustedBySection";
import { TestimonialsSection } from "@/components/adTool/landingPage/reviewSection/testimonials-with-marquee";
import { Loading } from "@/components/adTool/sharedComponents/Loading";

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
    <div>
      <GradientBackground intensity={"vibrant"}>
        <HeroSection />
        <TrustedBySection />
      </GradientBackground>

      <FeaturesSection />
      <TrendingSection className="pt-8 sm:pt-12" />
      <ExtensionSection className="pt-8 sm:pt-12" />
      <AnalyticsSection />
      {/* <ReviewSection /> */}
      <TestimonialsSection
        title="What Our Users Are Saying"
        description="Real feedback from our community—see how they're scaling faster with our platform."
        testimonials={testimonials}
      />
      <Demo />
      <CTASection />
      {/* Footer Section in layout */}
    </div>
  );
}
