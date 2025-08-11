"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import AnimatedBackground from "../hero/animated-background";
import ExtensionSection from "./ExtensionSection";
import TopProductsStoresSection from "./TopProductsStoresSection";
import TrendSection from "./TrendSection";

interface ExploreSectionProps {
  className?: string;
  // TrendSection props

  // TopProductsStoresSection props
  customProducts?: Array<{ id: number; image: string; name: string }>;
  customStores?: Array<{ id: number; image: string; name: string }>;
  onProductsClick?: () => void;
  onStoresClick?: () => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({
  className = "",

  customProducts,
  customStores,
  onProductsClick,
  onStoresClick,
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <section className={`relative w-full py-12 sm:py-16 lg:py-20 ${className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>

      {/* Explore Section Content */}
      <div className="space-y-8 sm:space-y-12 lg:space-y-16">
        {/* Trend Section Card */}
        <TrendSection />

        {/* Top Products & Stores Section Card */}
        <TopProductsStoresSection
          customProducts={customProducts}
          customStores={customStores}
          onProductsClick={onProductsClick}
          onStoresClick={onStoresClick}
        />
        <ExtensionSection />
      </div>

      {/* Inline styles */}
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

export default ExploreSection;
