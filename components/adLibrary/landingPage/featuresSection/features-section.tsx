"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart,
  Cpu,
  Filter,
  Folder,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { CTAButton } from "../exploreSection/CTAButton";
import { AuroraText } from "../hero/AuroraText";
import FloatingGlassImage from "../hero/FloatingGlassImage";

interface Stat {
  label: string;
  value: string;
}

interface Feature {
  id: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  darkImage?: string;
  background: string;
  accentColor: string;
  stats?: Stat[];
  Icon: LucideIcon;
}

const features: Feature[] = [
  {
    id: "discover",
    title: "Discover",
    highlightText: "Winning Products & Ads",
    description:
      "Instantly find profitable products and high-performing ads with our AI-powered discovery engine. Access millions of active campaigns across Meta's entire advertising ecosystem with real-time data analysis.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
    background:
      "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 30%, #16213e 70%, #0f1419 100%)",
    accentColor: "#3b82f6",
    stats: [
      { label: "Active Ads", value: "10M+" },
      { label: "Success Rate", value: "94%" },
      { label: "Daily Updates", value: "24/7" },
    ],
    Icon: Search,
  },
  {
    id: "search",
    title: "Advanced",
    highlightText: "Search & Filters",
    description:
      "Search through our comprehensive database with 10+ powerful filter types. Find exactly what you need with precision targeting, advanced analytics, and intelligent recommendations powered by machine learning.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/1.svg",
    background:
      "linear-gradient(135deg, #0f0a0f 0%, #1a0f1a 30%, #2d1b3d 70%, #1a0f1a 100%)",
    accentColor: "#8b5cf6",
    stats: [
      { label: "Filter Types", value: "15+" },
      { label: "Database Size", value: "50M+" },
      { label: "Search Speed", value: "<0.1s" },
    ],
    Icon: Filter,
  },
  {
    id: "analytics",
    title: "Visual",
    highlightText: "Analytics & Charts",
    description:
      "Get deep insights with our visual analytics dashboard. Track performance, identify trends, and make data-driven decisions with comprehensive charts, heatmaps, and predictive analytics that reveal hidden opportunities.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
    background:
      "linear-gradient(135deg, #0a0f0a 0%, #1a1a0f 30%, #2d2d1b 70%, #1a1a0f 100%)",
    accentColor: "#10b981",
    stats: [
      { label: "Data Points", value: "1B+" },
      { label: "Accuracy", value: "99.9%" },
      { label: "Real-time", value: "Live" },
    ],
    Icon: BarChart,
  },
  {
    id: "ai-tools",
    title: "Built-in",
    highlightText: "AI Tools & Calculators",
    description:
      "Leverage our AI-powered tools and profit calculators to optimize your campaigns. Get instant recommendations, profit projections, and automated insights that help you scale faster and smarter.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/2.svg",
    background:
      "linear-gradient(135deg, #0f0a0f 0%, #1a0f1a 30%, #3d1b2d 70%, #1a0f1a 100%)",
    accentColor: "#f59e0b",
    stats: [
      { label: "AI Models", value: "8+" },
      { label: "Accuracy", value: "96%" },
      { label: "Processing", value: "Instant" },
    ],
    Icon: Cpu,
  },
  {
    id: "organize",
    title: "Save &",
    highlightText: "Organize Everything",
    description:
      "Download ad media easily and organize your findings into custom boards. Keep track of winning strategies, collaborate with your team, and build your competitive advantage with unlimited cloud storage.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
    background:
      "linear-gradient(135deg, #0f0f0f 0%, #0f1a1a 30%, #1b2d3d 70%, #0f1a1a 100%)",
    accentColor: "#06b6d4",
    stats: [
      { label: "Downloads", value: "∞" },
      { label: "Storage", value: "Cloud" },
      { label: "Boards", value: "Custom" },
    ],
    Icon: Folder,
  },
];

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-40% 0px -40% 0px",
  });

  return (
    <div
      ref={ref}
      className="relative flex w-full flex-col overflow-hidden"
      style={{ background: feature.background }}
    >
      <div className="relative h-screen">
        {/* 🌟 Subtle background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${feature.accentColor}1A 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
            <div className="h-full w-full bg-gradient-to-br from-white/5 via-transparent to-black/10" />
          </div>
        </div>

        <div className="container relative z-10 mx-auto flex h-full items-center px-6 sm:px-8 lg:px-12">
          <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* 📝 Text Column */}
            <div
              className={`space-y-8 transition-all duration-700 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"} ${
                isInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              {/* 🏷️ Feature Badge */}
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${feature.accentColor}20` }}
                >
                  <feature.Icon
                    size={16}
                    style={{ color: feature.accentColor }}
                  />
                </div>
                <span className="text-sm font-semibold tracking-wide text-white/80">
                  Feature {String(index + 1).padStart(1, "0")}
                </span>
                {/* <TrendingUp size={14} className="text-white/60" /> */}
              </div>

              {/* 🎯 Title & Highlight */}
              <div>
                <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {feature.title}
                </h2>
                <div className="mt-2">
                  <AuroraText
                    className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                    colors={[
                      feature.accentColor,
                      "#ffffff",
                      feature.accentColor,
                      "#ffffff",
                    ]}
                    speed={1.5}
                  >
                    {feature.highlightText}
                  </AuroraText>
                </div>
              </div>

              {/* 📄 Description */}
              <p className="max-w-xl text-lg font-light leading-relaxed text-white/70 sm:text-xl">
                {feature.description}
              </p>

              {/* 📊 Stats Grid */}
              {feature.stats && (
                <div className="grid grid-cols-3 gap-6">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="group text-center">
                      <div
                        className="mb-1 text-2xl font-bold transition-colors duration-300 sm:text-3xl"
                        style={{ color: feature.accentColor }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs font-medium uppercase tracking-wider text-white/50 sm:text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 🚀 CTA Button */}
              <CTAButton
                href={`/explore`}
                variant="outline"
                size="lg"
                iconPosition="right"
                icon={ArrowRight}
                forceMode="dark"
              >
                Explore This Feature
              </CTAButton>
            </div>

            {/* 🖼️ Image Column */}
            <div
              className={`flex justify-center transition-all duration-700 ${
                index % 2 === 0 ? "lg:order-2" : "lg:order-1"
              } ${isInView ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
              <div className="relative">
                <FloatingGlassImage
                  src={feature.image}
                  darkSrc={feature.darkImage}
                  alt={`${feature.title} – ${feature.highlightText}`}
                  delay={0.6}
                  floatAmplitude={10}
                  floatSpeed={6}
                  glass
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative bg-[#0a0a0f]"
      style={{ height: `${features.length * 100}vh` }}
    >
      {features.map((feature, index) => (
        <div
          key={feature.id}
          id={feature.id}
          className="sticky top-0 h-screen"
          style={{ zIndex: index }}
        >
          <FeatureCard feature={feature} index={index} />
        </div>
      ))}

      <style jsx>{`
        .container {
          max-width: 1400px;
        }

        /* 🎨 Enhanced scrolling experience */
        :global(html) {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
        }

        :global(html::-webkit-scrollbar) {
          display: none;
        }

        /* 🔍 Enhanced backdrop blur support */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        /* ✨ Custom selection colors */
        :global(::selection) {
          background: rgba(59, 130, 246, 0.3);
          color: white;
        }

        /* 🎯 Smooth font rendering */
        :global(body) {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* 📱 Responsive improvements */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

        /* ♿ Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .transition-all {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
