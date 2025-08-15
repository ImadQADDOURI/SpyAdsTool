"use client";

import { Flame, Package, Store, TrendingUp } from "lucide-react";

import { TrendingConfig } from "../../configuration/landing-config";
import { AuroraText } from "../hero/AuroraText";
import { CTAButton } from "./CTAButton";
import { MarqueeColumn } from "./MarqueeColumn";

interface TrendingSectionProps {
  customAds?: Array<{ id: number; image: string; name: string }>;
  customProducts?: Array<{ id: number; image: string; name: string }>;
  customStores?: Array<{ id: number; image: string; name: string }>;
  className?: string;
}

export default function TrendingSection({
  customAds,
  customProducts,
  customStores,
  className = "",
}: TrendingSectionProps) {
  const ads = customAds || TrendingConfig.sampleAds;
  const products = customProducts || TrendingConfig.sampleProducts;
  const stores = customStores || TrendingConfig.sampleStores;

  return (
    <section className={`relative w-full ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          {/* 🌟 Enhanced radial gradient with better positioning */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.4),rgba(236,72,153,0.2),transparent)] opacity-70 blur-3xl" />
            <div className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.3),transparent)] opacity-50 blur-2xl" />
          </div>

          <div className="relative z-10 px-6 py-10 sm:px-8 lg:px-12">
            {/* 📝 Compact Header Content */}
            <div className="relative mx-auto max-w-5xl text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Flame className="h-6 w-6 animate-pulse text-purple-500" />
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-400 backdrop-blur-sm">
                  Trending Now
                </span>
              </div>

              <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {TrendingConfig.headline.prefix}{" "}
                <AuroraText
                  colors={TrendingConfig.gradientColors}
                  className="inline-block"
                >
                  {TrendingConfig.headline.highlight}
                </AuroraText>
                <br className="hidden sm:block" />
                <span className="text-white/90">
                  {TrendingConfig.headline.suffix}
                </span>
              </h1>

              <p className="mx-auto mb-6 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
                {TrendingConfig.subtitle}
              </p>

              {/* 🚀 Horizontal Three-Column Layout - Always Side by Side */}
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {/* 🏪 Stores Column */}
                <div className="flex flex-col space-y-2">
                  <div className="text-center">
                    <CTAButton
                      href="/stores"
                      forceMode="dark"
                      icon={Store}
                      iconPosition="right"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">
                        {TrendingConfig.ctas.stores}
                      </span>
                      <span className="sm:hidden">Stores</span>
                    </CTAButton>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur-sm">
                    <div className="h-64 sm:h-80 lg:h-96">
                      <MarqueeColumn
                        items={stores}
                        direction="down"
                        duration={28}
                      />
                    </div>
                  </div>
                </div>

                {/* 📊 Trending Ads Column */}
                <div className="flex flex-col space-y-2">
                  <div className="text-center">
                    <CTAButton
                      href="/ads"
                      forceMode="dark"
                      icon={TrendingUp}
                      iconPosition="right"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">
                        {TrendingConfig.ctas.ads}
                      </span>
                      <span className="sm:hidden">Ads</span>
                    </CTAButton>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur-sm">
                    <div className="h-64 sm:h-80 lg:h-96">
                      <MarqueeColumn items={ads} direction="up" duration={25} />
                    </div>
                  </div>
                </div>

                {/* 📦 Products Column */}
                <div className="flex flex-col space-y-2">
                  <div className="text-center">
                    <CTAButton
                      href="/products"
                      forceMode="dark"
                      icon={Package}
                      iconPosition="right"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">
                        {TrendingConfig.ctas.products}
                      </span>
                      <span className="sm:hidden">Products</span>
                    </CTAButton>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur-sm">
                    <div className="h-64 sm:h-80 lg:h-96">
                      <MarqueeColumn
                        items={products}
                        direction="down"
                        duration={22}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
