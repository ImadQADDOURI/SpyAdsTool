"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";

import { trustedBySectionConfig } from "../../../configuration/landing-config";

export default function TrustedBySection() {
  return (
    <div className="relative">
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
      <div className="relative flex w-full overflow-hidden">
        <div className="group flex [--duration:40s] [--gap:3rem] [gap:var(--gap)]">
          {/* Track 1 */}
          <div className="animate-marquee flex shrink-0 flex-row items-center [gap:var(--gap)] group-hover:[animation-play-state:paused]">
            {trustedBySectionConfig.map((company, index) => (
              <Logo key={`track1-${index}`} {...company} />
            ))}
          </div>
          {/* Track 2 (duplicate) */}
          <div className="animate-marquee flex shrink-0 flex-row items-center [gap:var(--gap)] group-hover:[animation-play-state:paused]">
            {trustedBySectionConfig.map((company, index) => (
              <Logo key={`track2-${index}`} {...company} />
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900" />
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee var(--duration) linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

function Logo({ logo, name }: { logo: string; name: string }) {
  return (
    <div className="flex items-center justify-center transition-transform duration-300 hover:scale-110">
      <Image
        alt={`${name} logo`}
        width={112}
        height={40}
        src={logo || "/placeholder.svg"}
        className="h-8 w-28 object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-80 hover:grayscale-0 dark:brightness-0 dark:invert dark:hover:brightness-100 dark:hover:invert-0 lg:h-10 lg:w-32"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
