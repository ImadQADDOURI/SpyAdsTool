"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { analyticsConfig } from "../../../../configuration/landing-config";
import { Header } from "../header";
import { AuroraText } from "../hero/AuroraText";
import { AnalyticsTab } from "./AnalyticsTab";

interface AnalyticsSectionProps {
  className?: string;
}

export function AnalyticsSection({ className }: AnalyticsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // 👀 Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn("relative", className)} // 📏 Reduced padding for compact view
    >
      {/* 🌟 Subtle background enhancement */}
      <div className="via-white/2 pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* 📝Header */}
        <Header
          gradientColors={analyticsConfig.gradientColors}
          headline={analyticsConfig.headline}
          subtitle={analyticsConfig.subtitle}
          className="px-4"
          // headlineClassName="text-6xl"
          // subtitleClassName="text-xl"
          // containerClassName="max-w-4xl"
          // forceDarkMode={true}
        />

        {/* 📊 Analytics Tabs */}
        <div
          className={cn(
            "transform transition-all delay-300 duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <AnalyticsTab tabs={analyticsConfig.tabs} />
        </div>
      </div>

      {/* 🎨 Enhanced CSS animations with GPU acceleration */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        /* 🚀 GPU acceleration for smooth animations */
        .transform {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
