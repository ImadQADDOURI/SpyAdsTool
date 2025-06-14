"use client";

import { useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
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
      {/* Tab Navigation */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {tabs.map((tab, index) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-300",
                "border hover:scale-105 hover:shadow-lg",
                activeTab === tab.id
                  ? "border-transparent bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                  : "border-gray-200 bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700/80",
              )}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <IconComponent
                size={18}
                className={cn(
                  "transition-transform duration-300",
                  activeTab === tab.id ? "scale-110" : "group-hover:scale-110",
                )}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative mx-auto w-full max-w-5xl">
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
            <div className="relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-2xl shadow-gray-900/10 dark:border-gray-800/50 dark:bg-gray-900 dark:shadow-gray-900/30">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={tab.image || "/placeholder.svg"}
                  alt={tab.alt}
                  fill
                  className="object-contain p-4"
                  priority={activeTab === tab.id}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
