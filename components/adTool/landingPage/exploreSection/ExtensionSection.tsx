"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Chrome, Download } from "lucide-react";

import { EXTENSION_CONFIG } from "../../../../configuration/landing-config";
import { Header } from "../header";
import { AuroraText } from "../hero/AuroraText";
import { CTAButton } from "./CTAButton";

interface ExtensionSectionProps {
  customScreenshots?: Array<{ id: number; image: string; alt: string }>;
  className?: string;
  onCtaClick?: () => void;
}

export default function ExtensionSection({
  customScreenshots,
  className = "",
  onCtaClick,
}: ExtensionSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const screenshots = customScreenshots || EXTENSION_CONFIG.screenshots;
  const totalSlides = screenshots.length;

  // 🎯 Auto-scroll with pause on interaction
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 2000);

    return () => clearInterval(interval);
  }, [autoPlay, totalSlides]);

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  return (
    <section className={`relative w-full ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          {/* 🌟 Enhanced radial gradient with better positioning */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.4),rgba(139,92,246,0.2),transparent)] opacity-70 blur-3xl" />
            <div className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.3),transparent)] opacity-50 blur-2xl" />
          </div>

          <div className="relative z-10 px-6 py-10 sm:px-8 lg:px-12">
            {/* 📝 Compact Header Content */}
            <div className="relative mx-auto mb-8 max-w-5xl text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Chrome className="h-6 w-6 animate-pulse text-pink-500" />
                <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-400 backdrop-blur-sm">
                  Browser Extension
                </span>
              </div>

              {/* 📝Header */}
              <Header
                gradientColors={EXTENSION_CONFIG.gradientColors}
                headline={EXTENSION_CONFIG.headline}
                subtitle={EXTENSION_CONFIG.subtitle}
                className="px-4"
                // headlineClassName="text-6xl"
                // subtitleClassName="text-xl"
                // containerClassName="max-w-4xl"
                forceDarkMode={true}
              />

              <CTAButton
                href={EXTENSION_CONFIG.ctaLink}
                forceMode="dark"
                icon={Download}
                iconPosition="right"
                size="md"
                onClick={onCtaClick}
              >
                {EXTENSION_CONFIG.ctaText}
              </CTAButton>
            </div>

            {/* 🖼️ Screenshots Carousel */}
            <div className="relative">
              {/* Main carousel container */}
              <div className="relative mx-auto h-64 max-w-6xl overflow-visible rounded-xl sm:h-80 lg:h-96">
                <div className="flex h-full items-center justify-center">
                  {screenshots.map((screenshot, index) => {
                    const isActive = index === currentIndex;
                    const isPrev =
                      index === (currentIndex - 1 + totalSlides) % totalSlides;
                    const isNext = index === (currentIndex + 1) % totalSlides;

                    return (
                      <div
                        key={screenshot.id}
                        className={`absolute transition-all duration-500 ease-out ${
                          isActive
                            ? "z-10 h-full w-full scale-100 opacity-100 sm:w-4/5 lg:w-3/5"
                            : isPrev
                              ? "z-5 h-3/4 w-3/4 -translate-x-[45%] scale-90 opacity-60 sm:h-4/5 sm:w-3/5 sm:-translate-x-[55%] sm:scale-75 lg:-translate-x-[65%]"
                              : isNext
                                ? "z-5 h-3/4 w-3/4 translate-x-[45%] scale-90 opacity-60 sm:h-4/5 sm:w-3/5 sm:translate-x-[55%] sm:scale-75 lg:translate-x-[65%]"
                                : "scale-50 opacity-0"
                        }`}
                      >
                        <div className="h-full w-full overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-lg shadow-black/20 backdrop-blur-sm">
                          <div className="flex h-full w-full items-center justify-center p-2 sm:p-4">
                            <img
                              src={
                                screenshot.image ||
                                "/placeholder.svg?height=400&width=600"
                              }
                              alt={screenshot.alt}
                              className="max-h-full max-w-full rounded-md object-contain"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🎮 Navigation Controls - Positioned below carousel */}
              <div className="mt-6 flex items-center justify-center gap-4">
                {/* Previous Button */}
                <button
                  onClick={goToPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 active:scale-95"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* 🔘 Slide Indicators */}
                <div className="flex gap-2">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIndex === index
                          ? "w-8 bg-gradient-to-r from-pink-400 to-purple-400"
                          : "w-2 bg-white/30 hover:scale-125 hover:bg-white/50"
                      }`}
                      aria-label={`Go to screenshot ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 active:scale-95"
                  aria-label="Next screenshot"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
