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
  Search,
} from "lucide-react";

import { heroConfig } from "../../../../configuration/landing-config";
import { CTAButton } from "../exploreSection/CTAButton";
import { AuroraText } from "./AuroraText";
import AvatarTrustedby from "./AvatarTrustedby";
import { FlipWords } from "./flip-words";
import FloatingGlassImage from "./FloatingGlassImage";
import FloatingGlassTextIcon from "./FloatingGlassTextIcon";
import GradientBackground from "./gradient-background";
import GlassVideo from "./hero-v0/GlassVideo";
import TrustedBySection from "./TrustedBySection";

const HeroSection = () => {
  return (
    <div className="relative min-h-[75vh] overflow-hidden">
      {/* 🎨 Animated background */}
      <GradientBackground intensity={"vibrant"}>
        {/* 🎯 Main Hero Content */}
        <div className="relative z-10">
          {/* Main Grid Container */}
          <div className="container mx-auto mb-4 px-6 lg:px-8">
            <div className="grid min-h-[70vh] grid-cols-1 items-center gap-12 pt-16 lg:grid-cols-2 lg:gap-16">
              {/* 📝 Left Column - Content */}
              <div className="animate-fade-in-up space-y-8">
                {/* 🎨 Main Headline with Aurora Text and Flip Words */}
                <div className="space-y-4">
                  <div className="text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                    <div className="mb-2">
                      <AuroraText
                        colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                        className="inline-block"
                      >
                        Dominate
                      </AuroraText>{" "}
                      <FlipWords
                        words={heroConfig.flipWords}
                        duration={heroConfig.animations.flipWordsDuration}
                        className="text-4xl sm:text-6xl"
                      />
                    </div>

                    <div>
                      With{" "}
                      <AuroraText
                        colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                        className="inline-block"
                      >
                        Filters
                      </AuroraText>{" "}
                      +{" "}
                      <AuroraText
                        colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                        className="inline-block"
                      >
                        AI
                      </AuroraText>{" "}
                      Slice &amp; Dice Instantly.
                    </div>
                  </div>
                </div>

                {/* 📄 Supporting Subtitle */}
                <p className="max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                  Tap into{" "}
                  <AuroraText
                    colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                    className="inline"
                  >
                    millions of ads
                  </AuroraText>
                  , unleash{" "}
                  <AuroraText
                    colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                    className="inline"
                  >
                    10+ advanced filters
                  </AuroraText>
                  , and leverage{" "}
                  <AuroraText
                    colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                    className="inline"
                  >
                    AI-powered insights
                  </AuroraText>{" "}
                  to skyrocket your eCom profits.
                </p>

                {/* 🚀 CTA Buttons */}
                <div className="flex flex-row gap-4">
                  <CTAButton
                    href="/explore"
                    forceMode="dark"
                    size="md"
                    icon={Search}
                  >
                    Start Now
                  </CTAButton>

                  <CTAButton
                    href="/extension"
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
              <div className="animate-fade-in-scale relative flex h-[250px] items-center justify-center lg:h-[500px]">
                {/* 🖼️ Render Floating Images from heroConfiguration */}
                {heroConfig.heroImages.map((image) => (
                  <div key={image.id} className={image.position.className}>
                    <FloatingGlassImage
                      src={image.src}
                      alt={image.alt}
                      floatAmplitude={image.animation.floatAmplitude}
                      floatSpeed={image.animation.floatSpeed}
                      delay={image.animation.delay}
                      glass={image.settings.glass}
                      priority={image.settings.priority}
                    />
                  </div>
                ))}

                {/* 🏷️ Render Feature Pills from heroConfiguration */}
                {heroConfig.featurePills.map((pill) => (
                  <div key={pill.id} className={pill.position.className}>
                    <FloatingGlassTextIcon
                      text={pill.text}
                      Icon={pill.icon}
                      floatAmplitude={pill.animation.floatAmplitude}
                      floatSpeed={pill.animation.floatSpeed}
                      delay={pill.animation.delay}
                      textClass={pill.styling.textClass}
                      iconClass={pill.styling.iconClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🏢 Trusted By Section */}
          <div className="animate-fade-in-up-delayed-2 relative z-10">
            <TrustedBySection />
          </div>
        </div>
      </GradientBackground>
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
