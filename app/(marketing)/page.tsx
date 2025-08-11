// import { infos } from "@/config/landing";
// import BentoGrid from "@/components/sections/bentogrid";
// import Features from "@/components/sections/features";
// import HeroLanding from "@/components/sections/hero-landing";
// import InfoLanding from "@/components/sections/info-landing";
// import Powered from "@/components/sections/powered";
// import PreviewLanding from "@/components/sections/preview-landing";
// import Testimonials from "@/components/sections/testimonials";

// export default function IndexPage() {
//   return (
//     <>
//       <HeroLanding />
//       <PreviewLanding />
//       <Powered />
//       <BentoGrid />
//       <InfoLanding data={infos[0]} reverse={true} />
//       {/* <InfoLanding data={infos[1]} /> */}
//       <Features />
//       <Testimonials />
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";

import { AnalyticsSection } from "@/components/adLibrary/landingPage/analyticsSection/AnalyticsSection";
import { CTASection } from "@/components/adLibrary/landingPage/CTASection";
import ExtensionSection from "@/components/adLibrary/landingPage/exploreSection/ExtensionSection";
import TrendingSection from "@/components/adLibrary/landingPage/exploreSection/TrendingSection";
import FeaturesSection from "@/components/adLibrary/landingPage/featuresSection/features-section";
import GradientBackground from "@/components/adLibrary/landingPage/hero/gradient-background";
import HeroSection from "@/components/adLibrary/landingPage/hero/hero-section";
import { ReviewSection } from "@/components/adLibrary/landingPage/reviewSection/ReviewSection";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

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
