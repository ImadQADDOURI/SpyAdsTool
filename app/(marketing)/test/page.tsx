import ExploreSection from "@/components/adLibrary/landingPage/exploreSection/ExploreSection";
import TopProductsStoresSection from "@/components/adLibrary/landingPage/exploreSection/TopProductsStoresSection";
import TrendSection from "@/components/adLibrary/landingPage/exploreSection/TrendSection";
import FeaturesSection from "@/components/adLibrary/landingPage/featuresSection/features-section";
import AnimatedBackground from "@/components/adLibrary/landingPage/hero/animated-background";
import { AuroraText } from "@/components/adLibrary/landingPage/hero/AuroraText";
import AvatarTrustedby from "@/components/adLibrary/landingPage/hero/AvatarTrustedby";
import { ContainerTextFlip } from "@/components/adLibrary/landingPage/hero/container-text-flip";
import FloatingGlassImage from "@/components/adLibrary/landingPage/hero/FloatingGlassImage";
import GlassVideo from "@/components/adLibrary/landingPage/hero/GlassVideo";
import HeroSection from "@/components/adLibrary/landingPage/hero/hero-section";
import ParticlesLayer from "@/components/adLibrary/landingPage/hero/particles-layer";
import TrustedBySection from "@/components/adLibrary/landingPage/hero/TrustedBySection";
import { ReviewSection } from "@/components/adLibrary/landingPage/reviewSection/ReviewSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <ExploreSection />
      {/* <TrendSection />
      <TopProductsStoresSection /> */}
      <FeaturesSection />

      <ReviewSection />
      {/* <AnimatedBackground
        horizontalPosition={40}
        verticalPosition={30}
        colors={{
          blue: "147, 197, 253", // blue-300
          purple: "216, 180, 254", // purple-300
          pink: "244, 114, 182", // pink-400
        }}
        opacity={0.3}
        blur={100}
        vividity={2}
        contrast={2}
      /> */}

      {/* Particles layer on top */}
      {/* <ParticlesLayer
        preset="lightPurple"
        quantity={15}
        size={0.35}
        speed={5}
      />
      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="my-10 flex flex-row">
          <FloatingGlassImage
            src="https://adsparo.com/home/assets/svg/hero-banner/1.svg"
            delay={1}
          />
          <FloatingGlassImage
            src="https://adsparo.com/home/assets/svg/hero-banner/2.svg"
            darkSrc="https://adsparo.com/home/assets/svg/hero-banner/3.svg"
          />
          <FloatingGlassImage
            src="https://adsparo.com/home/assets/svg/hero-banner/3.svg"
            delay={3}
          />
        </div>

        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
          Ship <AuroraText>beautiful</AuroraText>
        </h1>
        <ContainerTextFlip
          words={["better", "modern", "Tyler Durden", "awesome"]}
        />

        <AvatarTrustedby />

        <div className="">
          <GlassVideo src="https://assets-static.invideo.io/files/Invideo_Demo_HP_18_10_2024_V001_1921f1aee3.mp4" />
        </div>
        <TrustedBySection />
      </div> */}
    </div>
  );
}
