"use client";

import {
  BarChart3,
  Bookmark,
  Bot,
  Calculator,
  Chrome,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  Search,
} from "lucide-react";

import { CTAButton } from "../exploreSection/CTAButton";
// Import the provided components
import AnimatedBackground from "./animated-background";
import { AuroraText } from "./AuroraText";
import AvatarTrustedby from "./AvatarTrustedby";
import { FlipWords } from "./flip-words";
import FloatingGlassImage from "./FloatingGlassImage";
import FloatingGlassTextIcon from "./FloatingGlassTextIcon";
import GlassVideo from "./GlassVideo";
import ParticlesLayer from "./particles-layer";
import TrustedBySection from "./TrustedBySection";

// 🎛️ Configuration - Easy to customize
const CONFIG = {
  // Animation settings
  animations: {
    flipWordsDuration: 2500,
  },
  // Background settings
  background: {
    opacity: 0.4,
    mouseInfluence: 0.3,
    colors: {
      blue: "59, 130, 246",
      purple: "147, 51, 234",
      pink: "236, 72, 153",
    },
  },
  // Particles settings
  particles: {
    quantity: 20,
    preset: "cosmic" as const,
    size: 0.3,
    speed: 0.8,
  },
  // Content
  flipWords: ["products", "ads", "insights", "profits"],
  heroImages: [
    "https://adsparo.com/home/assets/svg/hero-banner/1.svg",
    "https://adsparo.com/home/assets/svg/hero-banner/2.svg",
    "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
    "https://adsparo.com/home/assets/svg/hero-banner/4.svg",
    "https://adsparo.com/home/assets/svg/hero-banner/5.svg",
  ],
  videoUrl:
    "https://assets-static.invideo.io/files/Invideo_Demo_HP_18_10_2024_V001_1921f1aee3.mp4",
};

const HeroSection = () => {
  return (
    <div className="relative min-h-[75vh] overflow-hidden">
      {/* 🌌 Animated Background */}
      <AnimatedBackground
        className="absolute inset-0"
        horizontalPosition={20}
        verticalPosition={30}
        opacity={CONFIG.background.opacity}
        enableMouseInteraction={true}
        mouseInfluence={CONFIG.background.mouseInfluence}
        colors={CONFIG.background.colors}
      />

      {/* ✨ Particles Layer */}
      <ParticlesLayer
        quantity={CONFIG.particles.quantity}
        preset={CONFIG.particles.preset}
        size={CONFIG.particles.size}
        speed={CONFIG.particles.speed}
        className=""
      />

      {/* 🎯 Main Hero Content */}
      <div className="relative z-10">
        {/* Main Grid Container */}
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid min-h-[70vh] grid-cols-1 items-center gap-12 pt-16 lg:grid-cols-2 lg:gap-16">
            {/* 📝 Left Column - Content */}
            <div className="animate-fade-in-up space-y-8">
              {/* 🎨 Main Headline with Aurora Text and Flip Words */}
              <div className="space-y-4">
                <div className="text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                  <div className="mb-2">
                    Discover winning{" "}
                    <FlipWords
                      words={CONFIG.flipWords}
                      duration={CONFIG.animations.flipWordsDuration}
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text font-bold text-transparent"
                    />
                  </div>
                  <div>
                    instantly with{" "}
                    <AuroraText
                      colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                      className="inline-block"
                    >
                      advanced
                    </AuroraText>{" "}
                    filters
                  </div>
                </div>
              </div>

              {/* 📄 Supporting Subtitle */}
              <p className="max-w-lg text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                All-in-one tool for scaling sales & boosting eCom profits.
                Search millions of ads from 2018 to today with unmatched
                precision and{" "}
                <AuroraText
                  colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                  className="inline"
                >
                  AI-powered
                </AuroraText>{" "}
                insights.
              </p>

              {/* 🚀 CTA Buttons */}
              <div className="flex flex-row gap-4">
                <CTAButton
                  href="/explore"
                  forceMode="dark"
                  size="md"
                  icon={Search}
                >
                  Start Spying Now
                </CTAButton>

                <CTAButton
                  href="extension"
                  variant="outline"
                  size="md"
                  icon={Chrome}
                >
                  Install Extension
                </CTAButton>
              </div>

              {/* 👥 Trusted By Avatars */}
              <div className="flex items-center gap-6">
                <AvatarTrustedby />
              </div>

              {/* 💳 No Credit Card Required */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <CreditCard className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
            </div>

            {/* 🖼️ Right Column - Floating Images with Feature Pills */}
            <div className="animate-fade-in-scale relative flex h-[450px] items-center justify-center lg:h-[500px]">
              {/* 🎯 Main Center Image */}
              <div className="relative z-20">
                <FloatingGlassImage
                  src={CONFIG.heroImages[2]}
                  alt="Main hero banner"
                  floatAmplitude={8}
                  floatSpeed={6}
                  delay={0}
                  glass={true}
                  lens={true}
                  zoomFactor={1.3}
                  priority={true}
                />
              </div>

              {/* 🖼️ Surrounding Images */}
              <div className="absolute left-0 top-0 z-10">
                <FloatingGlassImage
                  src={CONFIG.heroImages[0]}
                  alt="Hero banner 1"
                  floatAmplitude={6}
                  floatSpeed={8}
                  delay={0.5}
                  glass={true}
                  lens={true}
                />
              </div>

              <div className="absolute right-0 top-8 z-10">
                <FloatingGlassImage
                  src={CONFIG.heroImages[1]}
                  alt="Hero banner 2"
                  floatAmplitude={7}
                  floatSpeed={7}
                  delay={1}
                  glass={true}
                  lens={true}
                />
              </div>

              <div className="absolute bottom-8 left-8 z-10">
                <FloatingGlassImage
                  src={CONFIG.heroImages[3]}
                  alt="Hero banner 4"
                  floatAmplitude={5}
                  floatSpeed={9}
                  delay={1.5}
                  glass={true}
                  lens={true}
                />
              </div>

              <div className="absolute bottom-0 right-8 z-10">
                <FloatingGlassImage
                  src={CONFIG.heroImages[4]}
                  alt="Hero banner 5"
                  floatAmplitude={6}
                  floatSpeed={8}
                  delay={2}
                  glass={true}
                  lens={true}
                />
              </div>

              {/* 🏷️ Feature Pills - Positioned around the edges */}
              <div className="absolute -left-8 top-16 z-30 hidden lg:block">
                <FloatingGlassTextIcon
                  text="AI-Powered Insights"
                  Icon={Bot}
                  floatAmplitude={4}
                  floatSpeed={6}
                  delay={0.8}
                  textClass="text-gray-600 dark:text-gray-800 font-semibold text-sm"
                  iconClass="w-4 h-4 text-blue-400 dark:text-blue-500"
                />
              </div>

              <div className="absolute -right-8 top-4 z-30 hidden lg:block">
                <FloatingGlassTextIcon
                  text="10M+ Ads Database"
                  Icon={Database}
                  floatAmplitude={5}
                  floatSpeed={7}
                  delay={1.2}
                  textClass="text-purple-700 dark:text-purple-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-purple-600 dark:text-purple-400"
                />
              </div>

              <div className="absolute -left-12 top-1/2 z-30 hidden lg:block">
                <FloatingGlassTextIcon
                  text="Visual Analytics"
                  Icon={BarChart3}
                  floatAmplitude={6}
                  floatSpeed={8}
                  delay={1.6}
                  textClass="text-pink-700 dark:text-pink-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-pink-600 dark:text-pink-400"
                />
              </div>

              <div className="absolute -right-12 top-1/2 z-30 hidden lg:block">
                <FloatingGlassTextIcon
                  text="Download Media"
                  Icon={Download}
                  floatAmplitude={4}
                  floatSpeed={6}
                  delay={2}
                  textClass="text-cyan-700 dark:text-cyan-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-cyan-600 dark:text-cyan-400"
                />
              </div>

              <div className="absolute -left-8 bottom-4 z-30 hidden lg:block">
                <FloatingGlassTextIcon
                  text="Save to Boards"
                  Icon={Bookmark}
                  floatAmplitude={5}
                  floatSpeed={7}
                  delay={2.4}
                  textClass="text-emerald-700 dark:text-emerald-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div className="absolute -right-8 bottom-16 z-30 hidden lg:block">
                <FloatingGlassTextIcon
                  text="Profit Calculator"
                  Icon={Calculator}
                  floatAmplitude={6}
                  floatSpeed={8}
                  delay={2.8}
                  textClass="text-orange-700 dark:text-orange-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-orange-600 dark:text-orange-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🎬 Hero Video Section */}
        <div className="animate-fade-in-up-delayed relative z-10 flex justify-center px-6 pb-12 pt-4">
          <GlassVideo src={CONFIG.videoUrl} glass={true} />
        </div>

        {/* 🏢 Trusted By Section */}
        <div className="animate-fade-in-up-delayed-2 relative z-10 pb-16">
          <TrustedBySection />
        </div>
      </div>

      {/* 🎨 Custom Styles */}
      <style jsx>{`
        .container {
          max-width: 1280px;
        }

        /* 🎭 Optimized animations using CSS instead of Framer Motion */
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-fade-in-scale {
          animation: fadeInScale 1s ease-out 0.3s forwards;
          opacity: 0;
          transform: scale(0.95);
        }

        .animate-fade-in-up-delayed {
          animation: fadeInUp 0.8s ease-out 1s forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-fade-in-up-delayed-2 {
          animation: fadeInUp 0.6s ease-out 1.3s forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* 📱 Responsive improvements */
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .min-h-[70vh] {
            min-height: auto;
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
        }

        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2.5rem;
            line-height: 1.2;
          }

          .text-5xl {
            font-size: 3rem;
            line-height: 1.2;
          }
        }

        /* ♿ Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-fade-in-scale,
          .animate-fade-in-up-delayed,
          .animate-fade-in-up-delayed-2 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        /* 🎯 Enhanced focus states for accessibility */
        button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
