// components/FeaturesSection.tsx
"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart,
  Cpu,
  Filter,
  Folder,
  LucideIcon,
  Search,
} from "lucide-react";

import { AuroraText } from "../hero/AuroraText";
import FloatingGlassImage from "../hero/FloatingGlassImage";
import ProgressNavigation, { NavFeature } from "./ProgressNavigation";

interface Stat {
  label: string;
  value: string;
}

export interface Feature {
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
      "Instantly find profitable products and high-performing ads with our AI-powered discovery engine. Access millions of active campaigns across Meta’s entire advertising ecosystem with real-time data analysis.",
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
  onInViewStatusChange: (featureId: string, isInView: boolean) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  index,
  onInViewStatusChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-40% 0px -40% 0px",
  });

  useEffect(() => {
    onInViewStatusChange(feature.id, isInView);
  }, [isInView, feature.id, onInViewStatusChange]);

  return (
    <div
      ref={ref}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-16"
      style={{
        background: feature.background,
      }}
    >
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
      <div className="container relative z-10 mx-auto flex h-full w-full items-center px-6 sm:px-8 lg:px-12">
        <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            className={`space-y-6 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : index % 2 === 0 ? -30 : 30,
            }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isInView ? 1 : 0,
                scale: isInView ? 1 : 0.9,
              }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <feature.Icon size={18} stroke={feature.accentColor} />
              <span className="text-xs font-semibold tracking-wide text-white/80">
                Feature {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
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
            </motion.div>
            <motion.p
              className="max-w-xl text-lg font-light leading-relaxed text-white/70 sm:text-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              {feature.description}
            </motion.p>
            {feature.stats && (
              <motion.div
                className="grid grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                {feature.stats.map((stat, statIndex) => (
                  <motion.div
                    key={statIndex}
                    className="group text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    <div
                      className="mb-1 text-2xl font-bold transition-colors duration-300 sm:text-3xl"
                      style={{ color: feature.accentColor }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-white/50 sm:text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <motion.button
                aria-label={`Explore feature: ${feature.title} - ${feature.highlightText}`}
                className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300"
                whileHover={{
                  scale: 1.03,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 text-base">
                  Explore This Feature
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            className={`flex justify-center ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0.8,
            }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
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
                lens
                zoomFactor={1.4}
                lensSize={140}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const MemoizedFeatureCard = memo(FeatureCard);

const FeaturesSection: React.FC = () => {
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  const featureInViewStatusRef = useRef<Record<string, boolean>>({});

  const sectionRef = useRef<HTMLElement>(null);
  // Corrected margin to use percentage, which is a valid MarginType for Framer Motion.
  // This margin means the section is considered "in view" if its top edge is at or above
  // the viewport's top, AND its bottom edge is below the viewport's top.
  // This ensures visibility when the first feature is at the top, and invisibility
  // once the entire section has scrolled past the top of the viewport.
  const isSectionInView = useInView(sectionRef, {
    once: false,
    margin: "0px 0px -100% 0px",
  });

  useEffect(() => {
    if (features.length > 0 && features[0]) {
      setActiveFeatureId(features[0].id);
      const initialStatuses: Record<string, boolean> = {};
      features.forEach((f) => {
        initialStatuses[f.id] = f.id === features[0]!.id;
      });
      featureInViewStatusRef.current = initialStatuses;
    }
  }, []);

  const handleInViewStatusChange = useCallback(
    (featureId: string, isInView: boolean) => {
      featureInViewStatusRef.current = {
        ...featureInViewStatusRef.current,
        [featureId]: isInView,
      };

      let newActiveId: string | null = null;
      // Determine the active feature: the one with the highest index (visually on top)
      // that is currently marked as inView.
      for (let i = 0; i < features.length; i++) {
        if (featureInViewStatusRef.current[features[i]!.id]) {
          newActiveId = features[i]!.id;
        }
      }

      if (newActiveId) {
        setActiveFeatureId(newActiveId);
      } else if (features.length > 0 && features[0]) {
        // Fallback if no specific feature is "inView" by its own detector,
        // or to ensure something is active.
        setActiveFeatureId((current) => current || features[0]!.id);
      }
    },
    [],
  );

  const handleNavigationClick = useCallback((featureId: string) => {
    const element = document.getElementById(featureId);
    if (element) {
      const featureIndex = features.findIndex((f) => f.id === featureId);
      if (featureIndex !== -1) {
        const targetScrollTop = featureIndex * window.innerHeight;
        window.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const navFeatures: NavFeature[] = features.map((f) => ({
    id: f.id,
    title: f.title,
    accentColor: f.accentColor,
    Icon: f.Icon,
  }));

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        height: `${features.length * 100}vh`,
      }}
    >
      <ProgressNavigation
        features={navFeatures}
        activeFeatureId={activeFeatureId}
        onNavigate={handleNavigationClick}
        isVisible={isSectionInView}
      />

      {features.map((feature, index) => (
        <div
          key={feature.id}
          id={feature.id}
          className="sticky top-0 flex h-screen items-center justify-center"
          style={{
            zIndex: index + 1,
          }}
        >
          <MemoizedFeatureCard
            feature={feature}
            index={index}
            onInViewStatusChange={handleInViewStatusChange}
          />
        </div>
      ))}

      <style jsx global>{`
        .container {
          max-width: 1400px;
        }
        html {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth !important;
        }
        html::-webkit-scrollbar {
          display: none;
        }
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ::selection {
          background: rgba(59, 130, 246, 0.3);
          color: white;
        }
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .backdrop-blur-md {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
