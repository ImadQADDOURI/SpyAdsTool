"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// 🏢 Trusted by leading teams section with marquee animation
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
    <div className="relative">
      {/* 📝 Section title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Trusted by Leading Teams
        </p>
      </motion.div>

      {/* 🎠 Marquee container with smooth transparency edges */}
      <div className="relative">
        <div className="group flex max-w-full flex-row overflow-hidden p-2 [--duration:40s] [--gap:2rem] [gap:var(--gap)]">
          {/* 🔄 Marquee content - duplicated for seamless loop */}
          {[...Array(4)].map((_, groupIndex) => (
            <div
              key={groupIndex}
              className="animate-marquee flex shrink-0 flex-row justify-around [gap:var(--gap)]"
            >
              {companies.map((company, index) => (
                <motion.div
                  key={`${groupIndex}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: (groupIndex * companies.length + index) * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="flex items-center justify-center"
                >
                  <Image
                    alt={company.name}
                    width={112}
                    height={40}
                    src={company.logo || "/placeholder.svg"}
                    className="h-8 w-24 object-contain opacity-40 grayscale filter transition-all duration-500 hover:opacity-80 hover:grayscale-0 hover:filter-none dark:brightness-0 dark:invert dark:hover:brightness-100 dark:hover:invert-0 lg:h-10 lg:w-28"
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* 🌫️ Smooth transparency gradient edges */}
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-gray-50 via-gray-50/80 via-gray-50/40 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:via-gray-900/40 dark:to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-gray-50 via-gray-50/80 via-gray-50/40 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:via-gray-900/40 dark:to-transparent" />
         */}
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee var(--duration) linear infinite;
          will-change: transform;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
