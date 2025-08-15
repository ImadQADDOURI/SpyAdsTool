"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { analyticsConfig } from "../../configuration/landing-config";
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
      className={cn("relative py-12 lg:py-16", className)} // 📏 Reduced padding for compact view
    >
      {/* 🌟 Subtle background enhancement */}
      <div className="via-white/2 pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* 📝 Header - Compact Design */}
        <div className="mb-8 text-center lg:mb-12">
          <div
            className={cn(
              "transform transition-all duration-700",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            {/* 🎯 Enhanced headline with subtle text shadow */}
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight drop-shadow-sm sm:text-5xl">
              {analyticsConfig.headline.prefix}{" "}
              <AuroraText
                colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                className="inline-block"
              >
                {analyticsConfig.headline.highlight}
              </AuroraText>{" "}
              {analyticsConfig.headline.suffix}
            </h2>
          </div>

          <div
            className={cn(
              "transform transition-all delay-200 duration-700",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            {/* 🎯 Enhanced subtitle with better contrast */}
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600/90 drop-shadow-sm dark:text-gray-400/90 sm:text-lg">
              {analyticsConfig.subtitle}
            </p>
          </div>
        </div>

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
