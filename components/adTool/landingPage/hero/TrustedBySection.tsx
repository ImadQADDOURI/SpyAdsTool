"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";

import { trustedBySectionConfig } from "../../../../configuration/landing-config";

export default function TrustedBySection() {
  return (
    <div className="relative py-8">
      {/* 📝 Section title */}
      <div className="mb-4 animate-fade-in text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Trusted by Leading Teams
          </p>
        </div>
        <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
      </div>

      {/* Marquee container */}
      <div className="relative overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 40s linear infinite",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {/* Triple the logos for smooth infinite scroll */}
          {[...Array(3)].map((_, setIndex) => (
            <div key={setIndex} className="flex shrink-0">
              {trustedBySectionConfig.map((company, index) => (
                <div
                  key={`${setIndex}-${index}`}
                  className="mx-6 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                >
                  <Image
                    alt={`${company.name} logo`}
                    width={112}
                    height={40}
                    src={company.logo || "/placeholder.svg"}
                    className="h-8 w-28 object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-80 hover:grayscale-0 dark:brightness-0 dark:invert dark:hover:brightness-100 dark:hover:invert-0 lg:h-10 lg:w-32"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900" />
      </div>

      {/* CSS animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          
          @media (prefers-reduced-motion: reduce) {
            [style*="animation: marquee"] {
              animation: none !important;
            }
          }
          
          @media (max-width: 640px) {
            [style*="animation: marquee"] {
              animation-duration: 30s !important;
            }
          }
        `,
        }}
      />
    </div>
  );
}
