"use client";

import { useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string; // 🎨 Added custom color property
  image: string;
  alt: string;
}

interface AnalyticsTabProps {
  tabs: Tab[];
  className?: string;
}

export function AnalyticsTab({ tabs, className }: AnalyticsTabProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  return (
    <div className={cn("w-full", className)}>
      {/* 🧭 Tab Navigation - Centered in one row */}
      <div className="mb-8 flex items-center justify-center gap-2 overflow-x-auto pb-2 sm:gap-3">
        {tabs.map((tab, index) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 font-medium transition-all duration-300 sm:px-4 sm:py-3",
                "border hover:scale-105 hover:shadow-lg",
                isActive
                  ? `border-white/20 bg-gradient-to-r ${tab.color} text-white shadow-lg backdrop-blur-sm`
                  : "dark:to-white/2 border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-gray-700 shadow-sm shadow-black/10 backdrop-blur-sm hover:from-white/15 hover:to-white/10 hover:shadow-md dark:border-white/5 dark:from-white/5 dark:text-gray-300 dark:hover:from-white/10 dark:hover:to-white/5",
              )}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <IconComponent
                size={16}
                className={cn(
                  "transition-transform duration-300 sm:size-[18px]",
                  isActive
                    ? "scale-110 drop-shadow-sm"
                    : "group-hover:scale-110",
                )}
              />
              {/* 📱 Hide label on small screens for cleaner UI */}
              <span className="hidden text-sm font-medium sm:inline sm:text-base">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 🖼️ Tab Content with Enhanced Glassmorphism */}
      <div className="relative mx-auto w-full max-w-4xl">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "transition-all duration-500 ease-out",
              activeTab === tab.id
                ? "translate-y-0 scale-100 opacity-100"
                : "pointer-events-none absolute inset-0 translate-y-4 scale-95 opacity-0",
            )}
          >
            {/* 🌟 Enhanced Glassmorphism Container */}
            <div className="dark:to-white/2 relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-lg shadow-black/20 backdrop-blur-sm dark:border-white/5 dark:from-white/5 dark:shadow-black/40">
              {/* 🖼️ Image container with responsive contain */}
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={tab.image || "/placeholder.svg"}
                  alt={tab.alt}
                  fill
                  className="object-contain p-6 transition-transform duration-700 ease-out"
                  priority={activeTab === tab.id}
                />

                {/* 🌈 Subtle inner glow for premium feel */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5" />
              </div>

              {/* ✨ Premium border highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-lg border border-white/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
