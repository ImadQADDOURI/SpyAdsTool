"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { AuroraText } from "../hero/AuroraText";
import FanOutCard, { type CardData } from "./fan-out-card";

// Centralized configuration for easy customization
const TREND_CONFIG = {
  // Theme colors
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],

  // Animation settings
  staggerDelay: 0.1,
  animationDuration: 0.8,

  // Content
  headline: {
    prefix: "Discover",
    highlight: "Trending Ads",
    suffix: "That Convert",
  },
  subtitle:
    "Uncover winning ad strategies with our advanced analytics platform. Find the ads that drive results and scale your campaigns with confidence.",
  ctaText: "Start Discovering",

  // Sample ad data - easily replaceable
  sampleAds: [
    {
      id: "ad-1",
      image: "/placeholder.svg?height=400&width=300",
      alt: "Trending Facebook Ad",
    },
    {
      id: "ad-2",
      image: "/placeholder.svg?height=400&width=300",
      alt: "High Converting Instagram Ad",
    },
    {
      id: "ad-3",
      image: "/placeholder.svg?height=400&width=300",
      alt: "Viral TikTok Ad",
    },
    {
      id: "ad-4",
      image: "/placeholder.svg?height=400&width=300",
      alt: "Successful Google Ad",
    },
    {
      id: "ad-5",
      image: "/placeholder.svg?height=400&width=300",
      alt: "Top Performing YouTube Ad",
    },
  ] as CardData[],
};

interface TrendSectionProps {
  theme?: "dark" | "light";
  customAds?: CardData[];
  className?: string;
}

const TrendSection: React.FC<TrendSectionProps> = ({
  theme = "dark",
  customAds,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";
  const ads = customAds || TREND_CONFIG.sampleAds;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: TREND_CONFIG.staggerDelay,
        duration: TREND_CONFIG.animationDuration,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: TREND_CONFIG.animationDuration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <section className={`relative w-full py-12 sm:py-16 lg:py-20 ${className}`}>
      {/* Background with theme support */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
        }}
      />

      {/* Card container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{
            backgroundColor: isDark ? "#000000" : "#ffffff",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Animated background elements inside card */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full opacity-5"
              style={{
                background: `radial-gradient(circle, ${TREND_CONFIG.gradientColors[0]} 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full opacity-5"
              style={{
                background: `radial-gradient(circle, ${TREND_CONFIG.gradientColors[1]} 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>

          {/* Main content container */}
          <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-12 lg:px-12">
            {/* Header content */}
            <div className="mx-auto mb-6 max-w-4xl text-center">
              {/* Main headline */}
              <motion.h1
                className="mb-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
                variants={itemVariants}
                style={{
                  color: isDark ? "#ffffff" : "#1a202c",
                }}
              >
                {TREND_CONFIG.headline.prefix}{" "}
                <AuroraText
                  colors={TREND_CONFIG.gradientColors}
                  className="inline-block"
                >
                  {TREND_CONFIG.headline.highlight}
                </AuroraText>
                <br className="hidden sm:block" />
                {TREND_CONFIG.headline.suffix}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mx-auto mb-6 max-w-3xl text-base leading-relaxed sm:text-lg md:text-xl"
                variants={itemVariants}
                style={{
                  color: isDark
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(26, 32, 44, 0.8)",
                }}
              >
                {TREND_CONFIG.subtitle}
              </motion.p>

              {/* CTA Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  className="relative overflow-hidden rounded-full px-6 py-3 text-base font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${TREND_CONFIG.gradientColors.join(", ")})`,
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 15px 30px rgba(139, 92, 246, 0.3)`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Add your CTA action here
                    console.log("CTA clicked");
                  }}
                >
                  <span className="relative z-10">{TREND_CONFIG.ctaText}</span>

                  {/* Button background animation */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: `linear-gradient(135deg, ${TREND_CONFIG.gradientColors.slice().reverse().join(", ")})`,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Fan-out cards section */}
            <motion.div className="w-full" variants={itemVariants}>
              <FanOutCard cards={ads} containerHeight={400} className="mt-2" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Inline styles for additional customization */}
      <style jsx>{`
        section {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
        }

        @media (max-width: 640px) {
          section {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TrendSection;

// Export configuration for easy customization
export { TREND_CONFIG };
export type { CardData };
