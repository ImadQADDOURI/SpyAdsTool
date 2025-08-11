"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { useTheme } from "next-themes";

import { AuroraText } from "./hero/AuroraText";

// 🎨 Centralized Configuration - Compact Version
const CTA_CONFIG = {
  content: {
    headline: {
      beforeText: "Start",
      highlightText: "Winning",
      highlightColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
    },
    button: {
      text: "Get Started Free",
      href: "/signup",
      external: false,
    },
    pills: [
      { text: "No credit card", icon: "credit-card" }, // 💳 Added credit card pill
      { text: "Cancel anytime", icon: "check" },
      { text: "No setup fees", icon: "check" },
    ],
  },
  styling: {
    section: {
      padding: "py-16 md:py-20 lg:py-24", // 📏 Reduced from py-32/40/48
    },
    headline: {
      sizes: "text-4xl md:text-6xl lg:text-7xl xl:text-8xl", // 📏 Significantly reduced from text-6xl/8xl/9xl/10rem
      spacing: "mb-8", // 📏 Reduced from mb-12
    },
    button: {
      padding: "px-8 py-4", // 📏 Reduced from px-16 py-8
      textSize: "text-lg", // 📏 Reduced from text-2xl
      borderRadius: "rounded-full",
    },
    pills: {
      spacing: "mt-6", // 📏 Reduced from mt-10
      gap: "gap-3", // 📏 Reduced from gap-4
      padding: "px-4 py-2", // 📏 Reduced from px-5 py-3
      textSize: "text-xs", // 📏 Reduced from text-sm
    },
  },
  animation: {
    backgroundBlur: "blur-3xl",
    pulseSpeed: "4s",
    delays: {
      button: "0.2s", // 📏 Reduced delays
      pills: "0.3s",
      pillStagger: "0.08s",
    },
  },
};

interface CTASectionProps {
  isDark?: boolean;
}

export function CTASection({ isDark }: CTASectionProps) {
  const { theme } = useTheme();
  const isThemeDark = theme === "dark";

  // 🎨 Render pill icons
  const renderPillIcon = (iconType: string) => {
    if (iconType === "credit-card") {
      return <CreditCard className="mr-2 h-3 w-3 text-blue-400" />;
    }
    return (
      <svg
        className="mr-2 h-3 w-3 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  };

  return (
    <section
      className={`relative w-full ${CTA_CONFIG.styling.section.padding} overflow-hidden ${
        isThemeDark ? "bg-black" : "bg-white"
      }`}
    >
      {/* 🌟 Background Effects - Compact */}
      <div className="absolute inset-0 opacity-15">
        {" "}
        {/* 📏 Reduced opacity */}
        <div
          className={`absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 ${CTA_CONFIG.animation.backgroundBlur} animate-pulse-slow`}
        ></div>{" "}
        {/* 📏 Reduced size */}
        <div
          className={`absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 ${CTA_CONFIG.animation.backgroundBlur} animate-pulse-slow-delayed`}
        ></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="animate-fade-in-up mx-auto max-w-4xl">
          {" "}
          {/* 📏 Reduced max-width */}
          {/* 📝 Compact Headline */}
          <h2
            className={`${CTA_CONFIG.styling.headline.sizes} font-bold ${CTA_CONFIG.styling.headline.spacing} leading-tight tracking-tight ${
              isThemeDark ? "text-white" : "text-black"
            }`}
          >
            {CTA_CONFIG.content.headline.beforeText}{" "}
            <AuroraText
              colors={CTA_CONFIG.content.headline.highlightColors}
              className="inline-block"
            >
              {CTA_CONFIG.content.headline.highlightText}
            </AuroraText>
          </h2>
          {/* 🚀 Enhanced CTA Button with Better Visibility */}
          <div className="animate-fade-in-up-delayed">
            <Link
              href={CTA_CONFIG.content.button.href}
              className={`group relative inline-flex items-center justify-center ${CTA_CONFIG.styling.button.padding} ${CTA_CONFIG.styling.button.textSize} bg-white font-semibold text-black ${CTA_CONFIG.styling.button.borderRadius} overflow-hidden shadow-lg shadow-black/10 ring-1 ring-black/5 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25 active:scale-95 dark:shadow-white/10 dark:ring-white/10`}
            >
              {/* ✨ Enhanced Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* 📝 Button Text */}
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                {CTA_CONFIG.content.button.text}
              </span>

              {/* ➡️ Compact Arrow Icon */}
              <svg
                className="relative z-10 ml-3 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
          {/* 💊 Compact Pills with Credit Card */}
          <div
            className={`flex flex-wrap justify-center ${CTA_CONFIG.styling.pills.gap} ${CTA_CONFIG.styling.pills.spacing} animate-fade-in-up-more-delayed`}
          >
            {CTA_CONFIG.content.pills.map((pill, index) => (
              <div
                key={pill.text}
                className={`${CTA_CONFIG.styling.pills.padding} rounded-full ${CTA_CONFIG.styling.pills.textSize} animate-fade-in-scale border font-medium backdrop-blur-sm transition-all duration-300 ${
                  isThemeDark
                    ? "border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
                    : "border-black/20 bg-black/10 text-gray-600 hover:bg-black/20"
                }`}
                style={{
                  animationDelay: `calc(${CTA_CONFIG.animation.delays.pills} + ${index} * ${CTA_CONFIG.animation.delays.pillStagger})`,
                }}
              >
                <span className="flex items-center whitespace-nowrap">
                  {" "}
                  {/* 🚫 Prevent text wrapping */}
                  {renderPillIcon(pill.icon)}
                  {pill.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🎨 Optimized CSS Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.08;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow ${CTA_CONFIG.animation.pulseSpeed} ease-in-out
            infinite;
        }

        .animate-pulse-slow-delayed {
          animation: pulse-slow ${CTA_CONFIG.animation.pulseSpeed} ease-in-out
            infinite;
          animation-delay: 1s;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.5s ease-out;
          animation-delay: ${CTA_CONFIG.animation.delays.button};
          animation-fill-mode: both;
        }

        .animate-fade-in-up-more-delayed {
          animation: fade-in-up 0.5s ease-out;
          animation-delay: ${CTA_CONFIG.animation.delays.pills};
          animation-fill-mode: both;
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out;
          animation-fill-mode: both;
        }

        /* 🚫 Prevent horizontal overflow */
        .container {
          max-width: 100%;
          overflow-x: hidden;
        }
      `}</style>
    </section>
  );
}
