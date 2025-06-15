"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";

// 🏢 Trusted by leading teams section with optimized marquee animation
export default function TrustedBySection() {
  const companies = [
    { name: "Google", logo: "https://cdn.magicui.design/companies/Google.svg" },
    {
      name: "Microsoft",
      logo: "https://cdn.magicui.design/companies/Microsoft.svg",
    },
    { name: "Amazon", logo: "https://cdn.magicui.design/companies/Amazon.svg" },
    {
      name: "Netflix",
      logo: "https://cdn.magicui.design/companies/Netflix.svg",
    },
    {
      name: "YouTube",
      logo: "https://cdn.magicui.design/companies/YouTube.svg",
    },
    {
      name: "Instagram",
      logo: "https://cdn.magicui.design/companies/Instagram.svg",
    },
    { name: "Uber", logo: "https://cdn.magicui.design/companies/Uber.svg" },
    {
      name: "Spotify",
      logo: "https://cdn.magicui.design/companies/Spotify.svg",
    },
  ];

  return (
    <div className="relative py-8">
      {/* 📝 Section title */}
      <div className="mb-8 animate-fade-in text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Trusted by Leading Teams
          </p>
        </div>
        <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
      </div>

      {/* 🎠 Optimized marquee container */}
      <div className="relative overflow-hidden">
        <div className="animate-marquee flex">
          {/* 🔄 First set of logos */}
          <div className="flex shrink-0 items-center justify-around gap-8 px-4">
            {companies.map((company, index) => (
              <div
                key={`set1-${index}`}
                className="flex items-center justify-center transition-transform duration-300 hover:scale-110"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Image
                  alt={`${company.name} logo`}
                  width={112}
                  height={40}
                  src={company.logo || "/placeholder.svg"}
                  className="h-8 w-24 object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-80 hover:grayscale-0 dark:brightness-0 dark:invert dark:hover:brightness-100 dark:hover:invert-0 lg:h-10 lg:w-28"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* 🔄 Second set of logos for seamless loop */}
          <div className="flex shrink-0 items-center justify-around gap-8 px-4">
            {companies.map((company, index) => (
              <div
                key={`set2-${index}`}
                className="flex items-center justify-center transition-transform duration-300 hover:scale-110"
              >
                <Image
                  alt={`${company.name} logo`}
                  width={112}
                  height={40}
                  src={company.logo || "/placeholder.svg"}
                  className="h-8 w-24 object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-80 hover:grayscale-0 dark:brightness-0 dark:invert dark:hover:brightness-100 dark:hover:invert-0 lg:h-10 lg:w-28"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 🌫️ Smooth fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900" />
      </div>

      {/* 🎨 Optimized CSS animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
          will-change: transform;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* ♿ Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none !important;
          }

          .animate-fade-in {
            animation: none !important;
            opacity: 1 !important;
          }
        }

        /* 📱 Mobile optimizations */
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  );
}
