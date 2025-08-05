"use client";

import { useEffect, useState } from "react";

import { AnalyticsSection } from "@/components/adLibrary/landingPage/analyticsSection/AnalyticsSection";
import { CTASection } from "@/components/adLibrary/landingPage/CTASection";
import ExtensionSection from "@/components/adLibrary/landingPage/exploreSection/ExtensionSection";
// import TopProductsStoresSection from "@/components/adLibrary/landingPage/exploreSection/TopProductsStoresSection";
import TrendingSection from "@/components/adLibrary/landingPage/exploreSection/TrendingSection";
// import TrendSection from "@/components/adLibrary/landingPage/exploreSection/TrendSection";
import FeaturesSection from "@/components/adLibrary/landingPage/featuresSection/features-section";
import GradientBackground from "@/components/adLibrary/landingPage/hero/gradient-background";
// import { FooterSection } from "@/components/adLibrary/landingPage/FooterSection";
// import AnimatedBackground from "@/components/adLibrary/landingPage/hero/animated-background";
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
      {/* <GradientBackground intensity={"vibrant"}> */}
      <TrendingSection className="pt-8 sm:pt-12" />
      <ExtensionSection className="pt-8 sm:pt-12" />
      <AnalyticsSection />
      {/* </GradientBackground> */}
      <ReviewSection />
      <CTASection />
      {/* Footer Section in layout */}
    </div>
  );
}
