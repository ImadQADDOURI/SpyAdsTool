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

import { CTAButton } from "../exploreSection/CTAButton";
import { AuroraText } from "./AuroraText";
import AvatarTrustedby from "./AvatarTrustedby";
import { FlipWords } from "./flip-words";
import FloatingGlassImage from "./FloatingGlassImage";
import FloatingGlassTextIcon from "./FloatingGlassTextIcon";
import GlassVideo from "./GlassVideo";
import GradientBackground from "./gradient-background";
import TrustedBySection from "./TrustedBySection";

// 🎛️ Centralized Configuration - Easy to customize everything in one place
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
  flipWords: ["Ads", "Products", "Stores", "Trends"],
  videoUrl:
    "https://assets-static.invideo.io/files/Invideo_Demo_HP_18_10_2024_V001_1921f1aee3.mp4",

  // 🖼️ Floating Images Configuration - Centralized positioning and settings
  heroImages: [
    {
      id: "main-center",
      src: "https://adsparo.com/home/assets/svg/hero-banner/2.svg",
      alt: "Main hero banner",
      position: {
        className: "relative z-20",
      },
      animation: {
        floatAmplitude: 8,
        floatSpeed: 6,
        delay: 0,
      },
      settings: {
        glass: true,
        lens: true,
        zoomFactor: 1.3,
        priority: true,
      },
    },
    {
      id: "top-left",
      src: "https://adsparo.com/home/assets/svg/hero-banner/1.svg",
      alt: "Hero banner 1",
      position: {
        className: "absolute left-0 top-0 z-10",
      },
      animation: {
        floatAmplitude: 6,
        floatSpeed: 8,
        delay: 0.5,
      },
      settings: {
        glass: true,
        lens: true,
        priority: true,
      },
    },
    {
      id: "top-right",
      src: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
      alt: "Hero banner 2",
      position: {
        className: "absolute right-0 top-8 z-10",
      },
      animation: {
        floatAmplitude: 7,
        floatSpeed: 7,
        delay: 1,
      },
      settings: {
        glass: true,
        lens: true,
      },
    },
    {
      id: "bottom-left",
      src: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
      alt: "Hero banner 4",
      position: {
        className: "absolute bottom-8 left-8 z-10",
      },
      animation: {
        floatAmplitude: 5,
        floatSpeed: 9,
        delay: 1.5,
      },
      settings: {
        glass: true,
        lens: true,
      },
    },
    {
      id: "bottom-right",
      src: "https://adsparo.com/home/assets/svg/hero-banner/1.svg",
      alt: "Hero banner 5",
      position: {
        className: "absolute bottom-0 right-8 z-10",
      },
      animation: {
        floatAmplitude: 6,
        floatSpeed: 8,
        delay: 2,
      },
      settings: {
        glass: true,
        lens: true,
      },
    },
  ],

  // 🏷️ Feature Pills Configuration - Centralized positioning and styling
  featurePills: [
    {
      id: "ai-insights",
      text: "AI-Insights",
      icon: Bot,
      position: {
        className: "absolute -left-8 top-16 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 4,
        floatSpeed: 6,
        delay: 0.8,
      },
      styling: {
        textClass: "text-gray-600 dark:text-gray-800 font-semibold text-sm",
        iconClass: "w-4 h-4 text-blue-400 dark:text-blue-500",
      },
    },
    {
      id: "ads-database",
      text: "10M+ Ads",
      icon: Database,
      position: {
        className: "absolute -right-8 top-4 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 5,
        floatSpeed: 7,
        delay: 1.2,
      },
      styling: {
        textClass: "text-purple-700 dark:text-purple-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-purple-600 dark:text-purple-400",
      },
    },
    // {
    //   id: "visual-analytics",
    //   text: "Analytics",
    //   icon: BarChart3,
    //   position: {
    //     className: "absolute -left-12 top-1/2 z-30 hidden lg:block",
    //   },
    //   animation: {
    //     floatAmplitude: 6,
    //     floatSpeed: 8,
    //     delay: 1.6,
    //   },
    //   styling: {
    //     textClass: "text-pink-700 dark:text-pink-300 font-semibold text-sm",
    //     iconClass: "w-4 h-4 text-pink-600 dark:text-pink-400",
    //   },
    // },
    {
      id: "download-media",
      text: "Media",
      icon: Download,
      position: {
        className: "absolute -right-12 top-1/2 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 4,
        floatSpeed: 6,
        delay: 2,
      },
      styling: {
        textClass: "text-cyan-700 dark:text-cyan-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-cyan-600 dark:text-cyan-400",
      },
    },
    {
      id: "save-boards",
      text: "Boards",
      icon: Bookmark,
      position: {
        className: "absolute -left-8 bottom-4 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 5,
        floatSpeed: 7,
        delay: 2.4,
      },
      styling: {
        textClass:
          "text-emerald-700 dark:text-emerald-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-emerald-600 dark:text-emerald-400",
      },
    },
    {
      id: "profit-calculator",
      text: "Calculator",
      icon: Calculator,
      position: {
        className: "absolute -right-8 bottom-16 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 6,
        floatSpeed: 8,
        delay: 2.8,
      },
      styling: {
        textClass: "text-orange-700 dark:text-orange-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-orange-600 dark:text-orange-400",
      },
    },
  ],
};

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
                        words={CONFIG.flipWords}
                        duration={CONFIG.animations.flipWordsDuration}
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
                {/* 🖼️ Render Floating Images from Configuration */}
                {CONFIG.heroImages.map((image) => (
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

                {/* 🏷️ Render Feature Pills from Configuration */}
                {CONFIG.featurePills.map((pill) => (
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
