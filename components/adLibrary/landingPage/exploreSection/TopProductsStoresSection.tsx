"use client";

import { Package, Star, Store } from "lucide-react";

import { AuroraText } from "../hero/AuroraText";
import { CTAButton } from "./cta-button";
import { MarqueeColumn } from "./MarqueeColumn";

const TOP_PRODUCTS_STORES_CONFIG = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline: {
    prefix: "Top",
    highlight: "Products & Stores",
    suffix: "Trending Now",
  },
  subtitle:
    "Discover the most successful products and stores dominating the market. Get insights from top performers and scale your business.",
  ctas: {
    products: "Explore Products",
    stores: "Browse Stores",
  },
  sampleProducts: [
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=200",
      name: "Wireless Earbuds Pro",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=300&width=200",
      name: "Smart Fitness Watch",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=300&width=200",
      name: "Portable Phone Charger",
    },
    {
      id: 4,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      name: "LED Strip Lights",
    },
  ],
  sampleStores: [
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=200",
      name: "TechGadgets Pro",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=300&width=200",
      name: "Fashion Forward",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=300&width=200",
      name: "Home & Living",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=300&width=200",
      name: "Sports Central",
    },
  ],
};

interface TopProductsStoresSectionProps {
  customProducts?: Array<{ id: number; image: string; name: string }>;
  customStores?: Array<{ id: number; image: string; name: string }>;
  className?: string;
  onProductsClick?: () => void;
  onStoresClick?: () => void;
}

export default function TopProductsStoresSection({
  customProducts,
  customStores,
  className = "",
  onProductsClick,
  onStoresClick,
}: TopProductsStoresSectionProps) {
  const products = customProducts || TOP_PRODUCTS_STORES_CONFIG.sampleProducts;
  const stores = customStores || TOP_PRODUCTS_STORES_CONFIG.sampleStores;

  return (
    <section className={`relative w-full py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          {/* 🌟 Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />

          <div className="relative z-10 px-6 py-12 sm:px-8 lg:px-12">
            {/* 📝 Header Content */}
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Store className="h-8 w-8 text-violet-400" />
                <span className="text-sm font-medium uppercase tracking-wider text-violet-400">
                  Top Performers
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {TOP_PRODUCTS_STORES_CONFIG.headline.prefix}{" "}
                <AuroraText
                  colors={TOP_PRODUCTS_STORES_CONFIG.gradientColors}
                  className="inline-block"
                >
                  {TOP_PRODUCTS_STORES_CONFIG.headline.highlight}
                </AuroraText>
                <br className="hidden sm:block" />
                {TOP_PRODUCTS_STORES_CONFIG.headline.suffix}
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
                {TOP_PRODUCTS_STORES_CONFIG.subtitle}
              </p>
            </div>

            {/* 🏪 Products & Stores Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Products Column */}
              <div className="space-y-6">
                <div className="text-center">
                  <CTAButton
                    onClick={() => {
                      onProductsClick?.();
                      console.log("Products CTA clicked");
                    }}
                    icon="package"
                    size="lg"
                    variant="primary"
                  >
                    {TOP_PRODUCTS_STORES_CONFIG.ctas.products}
                  </CTAButton>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <MarqueeColumn
                    items={products}
                    direction="up"
                    duration={20}
                  />
                </div>
              </div>

              {/* Stores Column */}
              <div className="space-y-6">
                <div className="text-center">
                  <CTAButton
                    onClick={() => {
                      onStoresClick?.();
                      console.log("Stores CTA clicked");
                    }}
                    icon="store"
                    size="lg"
                    variant="secondary"
                  >
                    {TOP_PRODUCTS_STORES_CONFIG.ctas.stores}
                  </CTAButton>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <MarqueeColumn
                    items={stores}
                    direction="down"
                    duration={20}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
