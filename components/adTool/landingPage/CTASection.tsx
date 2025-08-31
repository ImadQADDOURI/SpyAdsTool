"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { CTA_CONFIG } from "../../../configuration/landing-config";
import { Header } from "./header";

export function CTASection() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        {/* Header - Made Big */}
        <Header
          gradientColors={CTA_CONFIG.gradientColors}
          headline={CTA_CONFIG.headline}
          subtitle={CTA_CONFIG.subtitle}
          headlineClassName="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
          subtitleClassName="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
          containerClassName="max-w-5xl"
        />

        {/* Enhanced CTA Button */}
        <div className="mb-8">
          <Link
            href={CTA_CONFIG.button.href}
            className="group inline-flex items-center rounded-full border-2 border-gray-300 bg-black px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-out hover:border-gray-400 hover:shadow-2xl hover:shadow-black/25 dark:border-gray-600 dark:bg-white dark:text-black dark:hover:border-gray-500 dark:hover:shadow-2xl dark:hover:shadow-white/25"
          >
            {CTA_CONFIG.button.text}
            <svg
              className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap justify-center gap-4">
          {CTA_CONFIG.pills.map((pill) => (
            <div
              key={pill.text}
              className="flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              <Check className="h-4 w-4 text-green-500" />
              <span className="ml-2">{pill.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
