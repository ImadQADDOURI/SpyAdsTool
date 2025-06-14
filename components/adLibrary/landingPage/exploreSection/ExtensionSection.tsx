"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Chrome, Download } from "lucide-react";

import { AuroraText } from "../hero/AuroraText";
import { CTAButton } from "./CTAButton";

const EXTENSION_CONFIG = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline: {
    prefix: "Powerful",
    highlight: "Browser Extension",
    suffix: "For Ad Research",
  },
  subtitle:
    "Analyze ads directly from your browser. Save time and boost productivity with our powerful extension that integrates seamlessly with your workflow.",
  ctaText: "Install Extension",
  ctaLink: "https://chrome.google.com/webstore",
  screenshots: [
    {
      id: 1,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Extension Dashboard",
    },
    {
      id: 2,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Ad Analysis Feature",
    },
    {
      id: 3,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Quick Save Feature",
    },
  ],
};

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
    }, 4000);

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

  return (
    <section className={`relative w-full ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          {/* 🌟 Radial gradient “soft halo” */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-full w-full -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.35),transparent)] opacity-65 blur-3xl" />

          <div className="relative z-10 px-6 py-12 sm:px-8 lg:px-12">
            {/* 📝 Header Content */}
            <div className="relative mx-auto mb-12 max-w-4xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Chrome className="h-8 w-8 text-pink-500" />
                <span className="rounded-full bg-pink-500/20 px-4 py-1.5 text-sm font-medium uppercase tracking-wider text-pink-400">
                  Browser Extension
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {EXTENSION_CONFIG.headline.prefix}{" "}
                <AuroraText
                  colors={EXTENSION_CONFIG.gradientColors}
                  className="inline-block"
                >
                  {EXTENSION_CONFIG.headline.highlight}
                </AuroraText>
                <br className="hidden sm:block" />
                {EXTENSION_CONFIG.headline.suffix}
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
                {EXTENSION_CONFIG.subtitle}
              </p>

              <CTAButton
                href="/explore"
                forceDarkMode
                icon={Download}
                iconPosition="right"
                size="lg"
              >
                {EXTENSION_CONFIG.ctaText}
              </CTAButton>
            </div>

            {/* 🖼️ Screenshots Carousel */}
            <div className="relative">
              <div className="relative h-[400px] overflow-hidden rounded-xl">
                {/* Navigation Buttons */}
                <button
                  onClick={goToPrev}
                  className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80"
                  aria-label="Next screenshot"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Screenshots */}
                <div className="flex h-full items-center justify-center">
                  {screenshots.map((screenshot, index) => {
                    const isActive = index === currentIndex;
                    const isPrev =
                      index === (currentIndex - 1 + totalSlides) % totalSlides;
                    const isNext = index === (currentIndex + 1) % totalSlides;

                    return (
                      <div
                        key={screenshot.id}
                        className={`absolute h-[350px] w-[600px] transition-all duration-500 ease-out ${
                          isActive
                            ? "z-10 scale-100 opacity-100"
                            : isPrev
                              ? "z-5 -translate-x-[60%] scale-75 opacity-40"
                              : isNext
                                ? "z-5 translate-x-[60%] scale-75 opacity-40"
                                : "scale-50 opacity-0"
                        }`}
                      >
                        <div className="h-full w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
                          <img
                            src={screenshot.image || "/placeholder.svg"}
                            alt={screenshot.alt}
                            className="h-full w-full object-contain p-4"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🔘 Slide Indicators */}
              <div className="mt-6 flex justify-center gap-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setAutoPlay(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === index
                        ? "w-8 bg-white"
                        : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to screenshot ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
