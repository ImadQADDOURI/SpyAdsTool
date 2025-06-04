"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bookmark,
  Bot,
  Calculator,
  Chrome,
  CreditCard,
  Database,
  Download,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// Import the provided components
import AnimatedBackground from "./animated-background";
import { AuroraText } from "./AuroraText";
import AvatarTrustedby from "./AvatarTrustedby";
import { FlipWords } from "./flip-words";
import FloatingGlassImage from "./FloatingGlassImage";
import FloatingGlassTextIcon from "./FloatingGlassTextIcon";
import GlassVideo from "./GlassVideo";
import ParticlesLayer from "./particles-layer";
import TrustedBySection from "./TrustedBySection";

// 🎛️ Configuration - Easy to customize
const CONFIG = {
  // Animation settings
  animations: {
    staggerDelay: 0.15,
    itemDuration: 0.6,
    flipWordsDuration: 2500,
  },
  // Background settings
  background: {
    opacity: 0.4,
    mouseInfluence: 0.3,
    colors: {
      blue: "59, 130, 246",
      purple: "147, 51, 234",
      pink: "236, 72, 153",
    },
  },
  // Particles settings
  particles: {
    quantity: 12,
    preset: "cosmic" as const,
    size: 0.3,
    speed: 0.8,
  },
  // Content
  flipWords: ["products", "ads", "insights", "profits"],
  heroImages: [
    "https://adsparo.com/home/assets/svg/hero-banner/1.svg",
    "https://adsparo.com/home/assets/svg/hero-banner/2.svg",
    "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
    "https://adsparo.com/home/assets/svg/hero-banner/4.svg",
    "https://adsparo.com/home/assets/svg/hero-banner/5.svg",
  ],
  videoUrl:
    "https://assets-static.invideo.io/files/Invideo_Demo_HP_18_10_2024_V001_1921f1aee3.mp4",
};

const HeroSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: CONFIG.animations.staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: CONFIG.animations.itemDuration,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative min-h-[75vh] overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground
        className="absolute inset-0"
        horizontalPosition={20}
        verticalPosition={30}
        opacity={CONFIG.background.opacity}
        enableMouseInteraction={true}
        mouseInfluence={CONFIG.background.mouseInfluence}
        colors={CONFIG.background.colors}
      />

      {/* Particles Layer */}
      <ParticlesLayer
        quantity={CONFIG.particles.quantity}
        preset={CONFIG.particles.preset}
        size={CONFIG.particles.size}
        speed={CONFIG.particles.speed}
        className="absolute inset-0"
      />

      {/* Main Hero Content */}
      <div className="relative z-10">
        {/* Main Grid Container */}
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid min-h-[70vh] grid-cols-1 items-center gap-12 pt-16 lg:grid-cols-2 lg:gap-16"
          >
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Main Headline with Aurora Text and Flip Words */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                  <div className="mb-2">
                    Discover winning{" "}
                    <FlipWords
                      words={CONFIG.flipWords}
                      duration={CONFIG.animations.flipWordsDuration}
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text font-bold text-transparent"
                    />
                  </div>
                  <div>
                    instantly with{" "}
                    <AuroraText
                      colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                      className="inline-block"
                    >
                      advanced
                    </AuroraText>{" "}
                    filters
                  </div>
                </div>
              </motion.div>

              {/* Supporting Subtitle */}
              <motion.p
                variants={itemVariants}
                className="max-w-lg text-lg leading-relaxed text-gray-600 dark:text-gray-300"
              >
                All-in-one tool for scaling sales & boosting eCom profits.
                Search millions of ads from 2018 to today with unmatched
                precision and{" "}
                <AuroraText
                  colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
                  className="inline"
                >
                  AI-powered
                </AuroraText>{" "}
                insights.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-purple-500/25"
                >
                  <Search className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Start Spying Now
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="group border-2 border-gray-300 px-8 py-4 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-blue-950/20"
                >
                  <Chrome className="mr-2 h-5 w-5 text-blue-600 transition-transform group-hover:scale-110" />
                  Install Extension
                </Button>
              </motion.div>

              {/* Trusted By Avatars */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-6"
              >
                <AvatarTrustedby />
              </motion.div>

              {/* No Credit Card Required */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <CreditCard className="h-4 w-4" />
                <span>No credit card required</span>
              </motion.div>
            </div>

            {/* Right Column - Floating Images with Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="relative flex h-[450px] items-center justify-center lg:h-[500px]"
            >
              {/* Main Center Image */}
              <div className="relative z-20">
                <FloatingGlassImage
                  src={CONFIG.heroImages[2]}
                  alt="Main hero banner"
                  floatAmplitude={8}
                  floatSpeed={6}
                  delay={0}
                  glass={true}
                  lens={true}
                  zoomFactor={1.3}
                  priority={true}
                />
              </div>

              {/* Top Left Image */}
              <div className="absolute left-0 top-0 z-10">
                <FloatingGlassImage
                  src={CONFIG.heroImages[0]}
                  alt="Hero banner 1"
                  floatAmplitude={6}
                  floatSpeed={8}
                  delay={0.5}
                  glass={true}
                  lens={true}
                />
              </div>

              {/* Top Right Image */}
              <div className="absolute right-0 top-8 z-10">
                <FloatingGlassImage
                  src={CONFIG.heroImages[1]}
                  alt="Hero banner 2"
                  floatAmplitude={7}
                  floatSpeed={7}
                  delay={1}
                  glass={true}
                  lens={true}
                />
              </div>

              {/* Bottom Left Image */}
              <div className="absolute bottom-8 left-8 z-10">
                <FloatingGlassImage
                  src={CONFIG.heroImages[3]}
                  alt="Hero banner 4"
                  floatAmplitude={5}
                  floatSpeed={9}
                  delay={1.5}
                  glass={true}
                  lens={true}
                />
              </div>

              {/* Bottom Right Image */}
              <div className="absolute bottom-0 right-8 z-10">
                <FloatingGlassImage
                  src={CONFIG.heroImages[4]}
                  alt="Hero banner 5"
                  floatAmplitude={6}
                  floatSpeed={8}
                  delay={2}
                  glass={true}
                  lens={true}
                />
              </div>

              {/* Feature Pills - Positioned around the edges */}

              {/* Top Left Feature */}
              <div className="absolute -left-8 top-16 z-30">
                <FloatingGlassTextIcon
                  text="AI-Powered Insights"
                  Icon={Bot}
                  floatAmplitude={4}
                  floatSpeed={6}
                  delay={0.8}
                  textClass="text-gray-600 dark:text-gray-800 font-semibold text-sm"
                  iconClass="w-4 h-4 text-blue-400 dark:text-blue-500"
                />
              </div>

              {/* Top Right Feature */}
              <div className="absolute -right-8 top-4 z-30">
                <FloatingGlassTextIcon
                  text="10M+ Ads Database"
                  Icon={Database}
                  floatAmplitude={5}
                  floatSpeed={7}
                  delay={1.2}
                  textClass="text-purple-700 dark:text-purple-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-purple-600 dark:text-purple-400"
                />
              </div>

              {/* Middle Left Feature */}
              <div className="absolute -left-12 top-1/2 z-30">
                <FloatingGlassTextIcon
                  text="Visual Analytics"
                  Icon={BarChart3}
                  floatAmplitude={6}
                  floatSpeed={8}
                  delay={1.6}
                  textClass="text-pink-700 dark:text-pink-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-pink-600 dark:text-pink-400"
                />
              </div>

              {/* Middle Right Feature */}
              <div className="absolute -right-12 top-1/2 z-30">
                <FloatingGlassTextIcon
                  text="Download Media"
                  Icon={Download}
                  floatAmplitude={4}
                  floatSpeed={6}
                  delay={2}
                  textClass="text-cyan-700 dark:text-cyan-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-cyan-600 dark:text-cyan-400"
                />
              </div>

              {/* Bottom Left Feature */}
              <div className="absolute -left-8 bottom-4 z-30">
                <FloatingGlassTextIcon
                  text="Save to Boards"
                  Icon={Bookmark}
                  floatAmplitude={5}
                  floatSpeed={7}
                  delay={2.4}
                  textClass="text-emerald-700 dark:text-emerald-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                />
              </div>

              {/* Bottom Right Feature */}
              <div className="absolute -right-8 bottom-16 z-30">
                <FloatingGlassTextIcon
                  text="Profit Calculator"
                  Icon={Calculator}
                  floatAmplitude={6}
                  floatSpeed={8}
                  delay={2.8}
                  textClass="text-orange-700 dark:text-orange-300 font-semibold text-sm"
                  iconClass="w-4 h-4 text-orange-600 dark:text-orange-400"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Video Section - Positioned to be partially visible */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="relative z-10 flex justify-center px-6 pb-12 pt-4"
        >
          <GlassVideo src={CONFIG.videoUrl} glass={true} />
        </motion.div>

        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="relative z-10 pb-16"
        >
          <TrustedBySection />
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .container {
          max-width: 1280px;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .min-h-[70vh] {
            min-height: auto;
            padding-top: 1rem;
            padding-bottom: 1rem;
          }

          /* Hide feature pills on mobile for cleaner look */
          .absolute.-left-8,
          .absolute.-right-8,
          .absolute.-left-12,
          .absolute.-right-12 {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2.5rem;
            line-height: 1.2;
          }

          .text-5xl {
            font-size: 3rem;
            line-height: 1.2;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
