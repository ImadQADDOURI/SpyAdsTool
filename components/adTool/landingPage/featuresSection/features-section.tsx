"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Filter,
  Folder,
  Pause,
  Play,
  Search,
  TypeIcon as type,
  type LucideIcon,
} from "lucide-react";

import { featuresConfig } from "../../configuration/landing";
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

interface FeatureSConfiglideProps {
  feature: Feature;
  index: number;
  isActive: boolean;
}

function FeatureSConfiglide({
  feature,
  index,
  isActive,
}: FeatureSConfiglideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });

  return (
    <div
      ref={ref}
      className="w-full flex-shrink-0 overflow-hidden"
      style={{ background: feature.background }}
    >
      <div className="relative py-16 sm:py-20 lg:py-24">
        {/* 🌟 Background effects */}
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

        <div className="container relative z-10 mx-auto px-6 sm:px-8 lg:px-20">
          <div className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* 📝 Text Column */}
            <div
              className={`w-full space-y-6 text-center transition-all duration-700 lg:text-left ${
                index % 2 === 0 ? "lg:order-1" : "lg:order-2"
              } ${isActive && isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              {/* 🏷️ Feature Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${feature.accentColor}20` }}
                >
                  <feature.Icon
                    size={14}
                    style={{ color: feature.accentColor }}
                  />
                </div>
                <span className="text-xs font-semibold tracking-wide text-white/80">
                  Feature {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* 🎯 Title & Highlight */}
              <div>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                  {feature.title}
                </h2>
                <div className="mt-1">
                  <AuroraText
                    className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
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
              <p className="mx-auto max-w-lg text-base leading-relaxed text-white/70 lg:mx-0">
                {feature.description}
              </p>

              {/* 📊 Stats Grid */}
              {feature.stats && (
                <div className="grid grid-cols-3 gap-4">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <div
                        className="mb-1 text-lg font-bold sm:text-xl"
                        style={{ color: feature.accentColor }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs font-medium uppercase tracking-wider text-white/50">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 🚀 CTA Button */}
              <div className="pt-2">
                <CTAButton
                  href="/explore"
                  variant="outline"
                  size="sm"
                  iconPosition="right"
                  icon={ArrowRight}
                  forceMode="dark"
                >
                  Explore Feature
                </CTAButton>
              </div>
            </div>

            {/* 🖼️ Image Column */}
            <div
              className={`flex w-full justify-center transition-all duration-700 ${
                index % 2 === 0 ? "lg:order-2" : "lg:order-1"
              } ${isActive && isInView ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
              <div className="relative max-w-sm lg:max-w-none">
                <FloatingGlassImage
                  src={feature.image}
                  darkSrc={feature.darkImage}
                  alt={`${feature.title} – ${feature.highlightText}`}
                  delay={0.6}
                  floatAmplitude={8}
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

export default function FeaturesConfigSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 👁️ Check if section is in view
  const isInView = useInView(sectionRef, { margin: "-20%" });

  // 📱 Touch/Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 🎯 Smooth slide transition
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;

    setIsTransitioning(true);
    setCurrentSlide(index);

    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % featuresConfig.length);
  };

  const prevSlide = () => {
    goToSlide(
      currentSlide === 0 ? featuresConfig.length - 1 : currentSlide - 1,
    );
  };

  // ⏯️ Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // 🎠 Auto-slide functionality - only when in view and playing
  useEffect(() => {
    if (!isAutoPlaying || !isInView) return;

    const autoSlideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuresConfig.length);
    }, 2000);

    return () => clearInterval(autoSlideInterval);
  }, [isAutoPlaying, isInView]);

  // 📱 Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 🎮 Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") {
        e.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  return (
    <section
      ref={sectionRef}
      id="featuresConfig"
      className="relative bg-[#0a0a0f]"
    >
      {/* 🎠 Slideshow Container */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {featuresConfig.map((feature, index) => (
            <FeatureSConfiglide
              key={feature.id}
              feature={feature}
              index={index}
              isActive={index === currentSlide}
            />
          ))}
        </div>
      </div>

      {/* 🎮 Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 px-4">
        {/* ⏯️ Play/Pause Button */}
        <button
          onClick={toggleAutoPlay}
          className="group flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl transition-all hover:border-white/40 hover:bg-black/60 active:scale-95"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? (
            <Pause
              size={14}
              className="text-white/80 transition-colors group-hover:text-white"
            />
          ) : (
            <Play
              size={14}
              className="ml-0.5 text-white/80 transition-colors group-hover:text-white"
            />
          )}
        </button>

        {/* ⬅️ Previous Button */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="group flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl transition-all hover:border-white/40 hover:bg-black/60 active:scale-95 disabled:opacity-50"
          aria-label="Previous feature"
        >
          <ChevronLeft
            size={16}
            className="text-white/80 transition-colors group-hover:text-white"
          />
        </button>

        {/* 🔘 Slide Indicators */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {featuresConfig.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className="group relative h-2 w-6 flex-shrink-0 rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor:
                  index === currentSlide
                    ? feature.accentColor
                    : "rgba(255,255,255,0.2)",
              }}
              aria-label={`Go to ${feature.title} feature`}
            >
              <div
                className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: feature.accentColor }}
              />
            </button>
          ))}
        </div>

        {/* ➡️ Next Button */}
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="group flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl transition-all hover:border-white/40 hover:bg-black/60 active:scale-95 disabled:opacity-50"
          aria-label="Next feature"
        >
          <ChevronRight
            size={16}
            className="text-white/80 transition-colors group-hover:text-white"
          />
        </button>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
        }

        /* 🎨 Enhanced scrolling experience */
        :global(html) {
          scroll-behavior: smooth;
        }

        /* 🔍 Enhanced backdrop blur support */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
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

        /* 📱 Touch improvements */
        .overflow-hidden {
          touch-action: pan-y pinch-zoom;
        }

        /* ♿ Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .transition-transform {
            transition: none !important;
          }
        }

        /* 🎮 Focus styles for navigation */
        button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* 📱 Mobile touch feedback */
        @media (hover: none) and (pointer: coarse) {
          button:active {
            transform: scale(0.95);
          }
        }
      `}</style>
    </section>
  );
}
