"use client";

import { BarChart3, TrendingUp } from "lucide-react";

import { AuroraText } from "../hero/AuroraText";
import { CTAButton } from "./cta-button";
import FanOutCard, { type CardData } from "./fan-out-card";

const TREND_CONFIG = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline: {
    prefix: "Discover",
    highlight: "Trending Ads",
    suffix: "That Convert",
  },
  subtitle:
    "Uncover winning ad strategies with our advanced analytics platform. Find the ads that drive results and scale your campaigns with confidence.",
  ctaText: "Start Discovering",
  sampleAds: [
    {
      id: "ad-1",
      image:
        "https://help.apple.com/assets/67EAFA00341984D9AE00EC98/67EAFA0586243791BA0154F5/fr_FR/4e069c10221c319aaf55b730d1313856.png",
      alt: "Trending Facebook Ad",
    },
    {
      id: "ad-2",
      image:
        "https://help.apple.com/assets/67EAFA00341984D9AE00EC98/67EAFA0586243791BA0154F5/fr_FR/4e069c10221c319aaf55b730d1313856.png",
      alt: "High Converting Instagram Ad",
    },
    {
      id: "ad-3",
      image:
        "https://cdn-useast1.kapwing.com/static/templates/blank-iphone-x-and-11-frame-mockup-template-full-4521e68d.webp",
      alt: "Viral TikTok Ad",
    },
    {
      id: "ad-2",
      image:
        "https://help.apple.com/assets/67EAFA00341984D9AE00EC98/67EAFA0586243791BA0154F5/fr_FR/4e069c10221c319aaf55b730d1313856.png",
      alt: "High Converting Instagram Ad",
    },
    {
      id: "ad-3",
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Viral TikTok Ad",
    },
  ] as CardData[],
};

interface TrendSectionProps {
  customAds?: CardData[];
  className?: string;
}

export default function TrendSection({
  customAds,
  className = "",
}: TrendSectionProps) {
  const ads = customAds || TREND_CONFIG.sampleAds;

  return (
    <section className={`relative w-full py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          {/* 🌟 Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-cyan-500/5" />

          <div className="relative z-10 px-6 py-12 sm:px-8 lg:px-12">
            {/* 📝 Header Content */}
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="h-8 w-8 text-pink-400" />
                <span className="text-sm font-medium uppercase tracking-wider text-pink-400">
                  Trend
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {TREND_CONFIG.headline.prefix}{" "}
                <AuroraText
                  colors={TREND_CONFIG.gradientColors}
                  className="inline-block"
                >
                  {TREND_CONFIG.headline.highlight}
                </AuroraText>
                <br className="hidden sm:block" />
                {TREND_CONFIG.headline.suffix}
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
                {TREND_CONFIG.subtitle}
              </p>

              <CTAButton
                onClick={() => console.log("Trends CTA clicked")}
                icon="search"
                size="lg"
                className="shadow-xl"
              >
                {TREND_CONFIG.ctaText}
              </CTAButton>
            </div>

            {/* 🃏 Fan-out Cards */}
            <div className="w-full">
              <FanOutCard cards={ads} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
