"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AuroraText } from "../hero/AuroraText";

// Centralized configuration for easy customization
const EXTENSION_CONFIG = {
  // Theme colors
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],

  // Animation settings
  staggerDelay: 0.1,
  animationDuration: 0.8,
  carouselSpeed: 60, // seconds for one complete cycle (slowed down from 20)

  // Content
  headline: {
    prefix: "Powerful",
    highlight: "Browser Extension",
    suffix: "For Ad Research",
  },
  subtitle:
    "Analyze ads directly from your browser. Save time and boost productivity with our powerful extension that integrates seamlessly with your workflow.",
  ctaText: "Install Extension",
  ctaLink: "https://chrome.google.com/webstore",

  // Sample screenshots - easily replaceable
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
    {
      id: 4,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Settings Panel",
    },
    {
      id: 5,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Integration Options",
    },
  ],
};

interface ExtensionSectionProps {
  customScreenshots?: Array<{ id: number; image: string; alt: string }>;
  className?: string;
  onCtaClick?: () => void;
}

const ExtensionSection: React.FC<ExtensionSectionProps> = ({
  customScreenshots,
  className = "",
  onCtaClick,
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const inView = useInView(carouselRef, { once: false, amount: 0.2 });
  const controls = useAnimation();

  const screenshots = customScreenshots || EXTENSION_CONFIG.screenshots;
  const totalSlides = screenshots.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Auto-scroll effect with the ability to pause
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoPlay && inView) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 5000); // Change slide every 5 seconds
    }

    return () => clearInterval(interval);
  }, [autoPlay, inView, totalSlides]);

  // Navigation functions
  const goToNext = () => {
    setAutoPlay(false); // Pause auto-scroll when manually navigating
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const goToPrev = () => {
    setAutoPlay(false); // Pause auto-scroll when manually navigating
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  // Resume auto-play after user interaction
  const handleMouseLeave = () => {
    setAutoPlay(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: EXTENSION_CONFIG.staggerDelay,
        duration: EXTENSION_CONFIG.animationDuration,
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
        duration: EXTENSION_CONFIG.animationDuration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const handleCtaClick = () => {
    onCtaClick?.();
    window.open(EXTENSION_CONFIG.ctaLink, "_blank");
    console.log("CTA clicked");
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
            backgroundColor: "#000000",
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
                background: `radial-gradient(circle, ${EXTENSION_CONFIG.gradientColors[0]} 0%, transparent 70%)`,
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
                background: `radial-gradient(circle, ${EXTENSION_CONFIG.gradientColors[1]} 0%, transparent 70%)`,
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
                  color: "#ffffff",
                }}
              >
                {EXTENSION_CONFIG.headline.prefix}{" "}
                <AuroraText
                  colors={EXTENSION_CONFIG.gradientColors}
                  className="inline-block"
                >
                  {EXTENSION_CONFIG.headline.highlight}
                </AuroraText>
                <br className="hidden sm:block" />
                {EXTENSION_CONFIG.headline.suffix}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mx-auto mb-6 max-w-3xl text-base leading-relaxed sm:text-lg md:text-xl"
                variants={itemVariants}
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {EXTENSION_CONFIG.subtitle}
              </motion.p>

              {/* CTA Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  className="relative overflow-hidden rounded-full px-6 py-3 text-base font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${EXTENSION_CONFIG.gradientColors.join(", ")})`,
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 15px 30px rgba(139, 92, 246, 0.3)`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCtaClick}
                >
                  <span className="relative z-10">
                    {EXTENSION_CONFIG.ctaText}
                  </span>

                  {/* Button background animation */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: `linear-gradient(135deg, ${EXTENSION_CONFIG.gradientColors.slice().reverse().join(", ")})`,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Screenshots carousel section - Redesigned */}
            <motion.div
              ref={carouselRef}
              className="w-full overflow-hidden rounded-xl"
              variants={itemVariants}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative">
                {/* Navigation arrows */}
                <button
                  onClick={goToPrev}
                  className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70"
                  aria-label="Next slide"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Carousel container with centered active slide */}
                <div className="relative h-[350px] w-full overflow-hidden py-6">
                  <div
                    className="flex h-full items-center justify-center"
                    style={{
                      perspective: "1000px",
                    }}
                  >
                    {screenshots.map((screenshot, index) => {
                      // Calculate position relative to current index
                      const position =
                        (index - currentIndex + totalSlides) % totalSlides;
                      const isActive = position === 0;
                      const isPrev = position === totalSlides - 1;
                      const isNext = position === 1;

                      // Determine styling based on position
                      let translateX = "0%";
                      let scale = 0.7;
                      let zIndex = 0;
                      let opacity = 0.4;

                      if (isActive) {
                        translateX = "0%";
                        scale = 1;
                        zIndex = 10;
                        opacity = 1;
                      } else if (isPrev) {
                        translateX = "-70%";
                        zIndex = 5;
                      } else if (isNext) {
                        translateX = "70%";
                        zIndex = 5;
                      } else {
                        // Hide other slides
                        opacity = 0;
                      }

                      return (
                        <motion.div
                          key={screenshot.id}
                          className="absolute h-[300px] w-[500px] overflow-hidden rounded-lg border border-white/10 bg-black/20"
                          initial={false}
                          animate={{
                            x: translateX,
                            scale,
                            zIndex,
                            opacity,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          <img
                            src={screenshot.image || "/placeholder.svg"}
                            alt={screenshot.alt}
                            className="h-full w-full object-contain p-2"
                            loading="lazy"
                            decoding="async"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Slide indicators */}
                <div className="mt-4 flex justify-center gap-2">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setAutoPlay(false);
                      }}
                      className={`h-2 w-2 rounded-full transition-all ${
                        currentIndex === index
                          ? "w-6 bg-white"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
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

export default ExtensionSection;

// Export configuration for easy customization
export { EXTENSION_CONFIG };
