"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { AuroraText } from "../hero/AuroraText";
import { MarqueeColumn } from "../topPicksSection/MarqueeColumn";

// Centralized configuration for easy customization
const TOP_PRODUCTS_STORES_CONFIG = {
  // Theme colors
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],

  // Animation settings
  staggerDelay: 0.1,
  animationDuration: 0.8,
  marqueeDuration: 20, // seconds for one complete cycle

  // Content
  headline: {
    prefix: "Top",
    highlight: "Products & Stores",
    suffix: "Trending Now",
  },
  subtitle:
    "Discover the most successful products and stores dominating the market. Get insights from top performers and scale your business.",

  // CTA buttons
  ctas: {
    products: "Explore Products",
    stores: "Browse Stores",
  },

  // Sample products data
  sampleProducts: [
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=200",
      name: "Wireless Earbuds Pro",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=300&width=200",
      name: "Smart Fitness Watch",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=300&width=200",
      name: "Portable Phone Charger",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=300&width=200",
      name: "LED Strip Lights",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=300&width=200",
      name: "Bluetooth Speaker",
    },
    {
      id: 6,
      image: "/placeholder.svg?height=300&width=200",
      name: "Phone Camera Lens",
    },
    {
      id: 7,
      image: "/placeholder.svg?height=300&width=200",
      name: "Laptop Stand",
    },
    {
      id: 8,
      image: "/placeholder.svg?height=300&width=200",
      name: "Gaming Mouse Pad",
    },
  ],

  // Sample stores data
  sampleStores: [
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=200",
      name: "TechGadgets Pro",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=300&width=200",
      name: "Fashion Forward",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=300&width=200",
      name: "Home & Living",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=300&width=200",
      name: "Sports Central",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=300&width=200",
      name: "Beauty Essentials",
    },
    {
      id: 6,
      image: "/placeholder.svg?height=300&width=200",
      name: "Pet Paradise",
    },
    {
      id: 7,
      image: "/placeholder.svg?height=300&width=200",
      name: "Kitchen Masters",
    },
    {
      id: 8,
      image: "/placeholder.svg?height=300&width=200",
      name: "Auto Accessories",
    },
  ],
};

interface TopProductsStoresSectionProps {
  customProducts?: Array<{ id: number; image: string; name: string }>;
  customStores?: Array<{ id: number; image: string; name: string }>;
  className?: string;
  onProductsClick?: () => void;
  onStoresClick?: () => void;
}

const TopProductsStoresSection: React.FC<TopProductsStoresSectionProps> = ({
  customProducts,
  customStores,
  className = "",
  onProductsClick,
  onStoresClick,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = true; // Force dark theme for cards
  const products = customProducts || TOP_PRODUCTS_STORES_CONFIG.sampleProducts;
  const stores = customStores || TOP_PRODUCTS_STORES_CONFIG.sampleStores;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: TOP_PRODUCTS_STORES_CONFIG.staggerDelay,
        duration: TOP_PRODUCTS_STORES_CONFIG.animationDuration,
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
        duration: TOP_PRODUCTS_STORES_CONFIG.animationDuration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const handleProductsClick = () => {
    onProductsClick?.();
    console.log("Products CTA clicked");
  };

  const handleStoresClick = () => {
    onStoresClick?.();
    console.log("Stores CTA clicked");
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Card container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{
            backgroundColor: "#000000", // isDark ? "#000000" : "#ffffff", // Card background always black
            border: "1px solid rgba(255, 255, 255, 0.1)",
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
                background: `radial-gradient(circle, ${TOP_PRODUCTS_STORES_CONFIG.gradientColors[0]} 0%, transparent 70%)`,
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
                background: `radial-gradient(circle, ${TOP_PRODUCTS_STORES_CONFIG.gradientColors[1]} 0%, transparent 70%)`,
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
            <div className="mx-auto mb-8 max-w-4xl text-center">
              {/* Main headline */}
              <motion.h1
                className="mb-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
                variants={itemVariants}
                style={{
                  color: "#ffffff", // isDark ? "#ffffff" : "#1a202c", // Text always white
                }}
              >
                {TOP_PRODUCTS_STORES_CONFIG.headline.prefix}{" "}
                <AuroraText
                  colors={TOP_PRODUCTS_STORES_CONFIG.gradientColors}
                  className="inline-block"
                >
                  {TOP_PRODUCTS_STORES_CONFIG.headline.highlight}
                </AuroraText>
                <br className="hidden sm:block" />
                {TOP_PRODUCTS_STORES_CONFIG.headline.suffix}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mx-auto mb-6 max-w-3xl text-base leading-relaxed sm:text-lg md:text-xl"
                variants={itemVariants}
                style={{
                  color: "rgba(255, 255, 255, 0.8)", // isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(26, 32, 44, 0.8)", // Text always light
                }}
              >
                {TOP_PRODUCTS_STORES_CONFIG.subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                variants={itemVariants}
              >
                <motion.button
                  className="relative overflow-hidden rounded-full px-6 py-3 text-base font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${TOP_PRODUCTS_STORES_CONFIG.gradientColors.join(", ")})`,
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 15px 30px rgba(139, 92, 246, 0.3)`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProductsClick}
                >
                  <span className="relative z-10">
                    {TOP_PRODUCTS_STORES_CONFIG.ctas.products}
                  </span>
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: `linear-gradient(135deg, ${TOP_PRODUCTS_STORES_CONFIG.gradientColors.slice().reverse().join(", ")})`,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                <motion.button
                  className="relative overflow-hidden rounded-full px-6 py-3 text-base font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${TOP_PRODUCTS_STORES_CONFIG.gradientColors.slice().reverse().join(", ")})`,
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 15px 30px rgba(236, 72, 153, 0.3)`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStoresClick}
                >
                  <span className="relative z-10">
                    {TOP_PRODUCTS_STORES_CONFIG.ctas.stores}
                  </span>
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: `linear-gradient(135deg, ${TOP_PRODUCTS_STORES_CONFIG.gradientColors.join(", ")})`,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Marquee columns section */}
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
              variants={itemVariants}
            >
              {/* Products column */}
              <div className="space-y-4">
                <h3
                  className="text-center text-xl font-bold sm:text-2xl"
                  style={{
                    color: "#ffffff", // isDark ? "#ffffff" : "#1a202c", // Text always white
                  }}
                >
                  Top Products
                </h3>
                <div
                  className="overflow-hidden rounded-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)", // isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <MarqueeColumn
                    items={products}
                    direction="up"
                    duration={TOP_PRODUCTS_STORES_CONFIG.marqueeDuration}
                  />
                </div>
              </div>

              {/* Stores column */}
              <div className="space-y-4">
                <h3
                  className="text-center text-xl font-bold sm:text-2xl"
                  style={{
                    color: "#ffffff", // isDark ? "#ffffff" : "#1a202c", // Text always white
                  }}
                >
                  Top Stores
                </h3>
                <div
                  className="overflow-hidden rounded-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)", // isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <MarqueeColumn
                    items={stores}
                    direction="down"
                    duration={TOP_PRODUCTS_STORES_CONFIG.marqueeDuration}
                  />
                </div>
              </div>
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

        .background {
          --background: ${isDark ? "#000000" : "#ffffff"};
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
    </div>
  );
};

export default TopProductsStoresSection;

// Export configuration for easy customization
export { TOP_PRODUCTS_STORES_CONFIG };
