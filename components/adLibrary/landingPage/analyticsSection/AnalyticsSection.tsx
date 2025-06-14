"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  BarChart3,
  Brain,
  Download,
  FileText,
  TrendingUp,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { AuroraText } from "../hero/AuroraText";
import { AnalyticsTab } from "./AnalyticsTab";

export const analyticsConfig = {
  headline: {
    prefix: "Powerful",
    highlight: "Analytics",
    suffix: "Dashboard",
  },
  subtitle:
    "Get deep insights into your ad performance with our comprehensive analytics suite. Track metrics, analyze trends, and make data-driven decisions.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Analytics Overview Dashboard",
    },
    {
      id: "performance",
      label: "Performance",
      icon: TrendingUp,
      image:
        "https://cdn-useast1.kapwing.com/static/templates/blank-iphone-x-and-11-frame-mockup-template-full-4521e68d.webp?height=600&width=800",
      alt: "Performance Analytics",
    },
    {
      id: "insights",
      label: "Insights",
      icon: Brain,
      image: "/placeholder.svg?height=540&width=960",
      alt: "AI-Powered Insights",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      image: "/placeholder.svg?height=540&width=960",
      alt: "Custom Reports",
    },
  ],
  stats: [
    { label: "Data Points Analyzed", value: "10M+", icon: "BarChart" },
    { label: "Real-time Updates", value: "24/7", icon: "Zap" },
    { label: "Custom Reports", value: "Unlimited", icon: "TrendingUp" },
    { label: "Export Formats", value: "5+", icon: "Download" },
  ],
  animation: {
    stagger: 0.1,
    duration: 0.6,
  },
};

interface AnalyticsSectionProps {
  className?: string;
}

export function AnalyticsSection({ className }: AnalyticsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const stats = [
    { label: "Data Points", value: "10M+", icon: BarChart },
    { label: "Real-time Updates", value: "24/7", icon: Zap },
    { label: "Custom Reports", value: "∞", icon: TrendingUp },
    { label: "Export Formats", value: "5+", icon: Download },
  ];

  return (
    <section
      ref={sectionRef}
      className={cn("relative py-20 lg:py-32", className)}
    >
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-16 text-center lg:mb-20">
          <div
            className={cn(
              "transform transition-all duration-700",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
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
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl">
              {analyticsConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Analytics Tabs */}
        <div
          className={cn(
            "transform transition-all delay-300 duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <AnalyticsTab tabs={analyticsConfig.tabs} />
        </div>

        {/* Stats Grid */}
        <div
          className={cn(
            "mx-auto max-w-4xl transform transition-all delay-500 duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <div className="mt-16 grid grid-cols-2 gap-4 md:gap-6 lg:mt-20 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white/80 to-gray-50/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/10 dark:border-gray-700/60 dark:from-gray-800/80 dark:to-gray-900/80 dark:hover:shadow-violet-500/20 md:p-8"
                  style={{
                    animationDelay: `${600 + index * 100}ms`,
                    animation: isVisible
                      ? "slideInUp 0.6s ease-out forwards"
                      : "none",
                  }}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3 transition-transform duration-300 group-hover:scale-110 dark:from-violet-900/30 dark:to-purple-900/30">
                        <IconComponent
                          size={24}
                          className="text-violet-600 dark:text-violet-400"
                        />
                      </div>
                    </div>
                    <div className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 md:text-base">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
