"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import { DotPattern } from "./dot-pattern";
import { Testimonial, TestimonialCard } from "./TestimonialCard";

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    text: "This tool transformed our ad strategy overnight—finding winning products is now effortless. We saw a 3× ROI in just two weeks!",
    author: "Alex P. – Founder @ TrendyShop",
  },
  {
    id: 2,
    text: "The advanced filters let me slice through millions of ads from 2018 to today in seconds. My campaigns are sharper than ever.",
    author: "Maria L. – eCommerce Manager @ FashionHub",
  },
  {
    id: 3,
    text: "Visual analytics & performance charts are a game-changer. We doubled our average order value in under a month!",
    author: "Jordan K. – Head of Growth @ SmartGadgets",
  },
  {
    id: 4,
    text: "Built-in AI tools and profit calculators save us hours of manual work. It’s like having a marketing team in your pocket.",
    author: "Samantha R. – Director @ TechPulse",
  },
  {
    id: 5,
    text: "Downloading ad media and organizing custom boards has never been smoother. Finally, an all-in-one solution for scaling eCom profits.",
    author: "Darien C. – CMO @ PeakPerformance",
  },
];

export const ReviewSection: React.FC = () => {
  const initialPositions = SAMPLE_TESTIMONIALS.map((_, idx) =>
    idx === 0 ? "front" : idx === 1 ? "middle" : "back",
  ) as ("front" | "middle" | "back")[];

  const [positions, setPositions] =
    useState<("front" | "middle" | "back")[]>(initialPositions);

  const shufflePositions = () => {
    setPositions((prev) => {
      const copy = [...prev];
      copy.unshift(copy.pop()!);
      return copy;
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-gray-900 to-gray-800 px-4 py-24 sm:px-6 lg:px-8">
      {/* 
        • Fade radius enlarged to 500px. 
        • Dot circle radius (cr) set to 2 for larger dots. 
      */}
      <DotPattern
        width={16}
        height={16}
        cx={1}
        cy={1}
        cr={2}
        className="absolute inset-0 fill-[#B977F8]/30 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
      />

      <div className="relative z-10 mx-auto mb-12 max-w-7xl text-center">
        <motion.h2
          className="mb-4 text-3xl font-extrabold text-gray-100 sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          What Our Users Are Saying
        </motion.h2>
        <motion.p
          className="text-base tracking-wide text-gray-300 sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Real feedback from our community—see how they’re using our all-in-one
          ad & eCom growth platform to scale faster.
        </motion.p>
      </div>

      <div className="relative z-10 mx-auto h-[380px] w-full max-w-[320px] sm:h-[420px] sm:max-w-[400px]">
        {SAMPLE_TESTIMONIALS.map((t, idx) => (
          <TestimonialCard
            key={t.id}
            testimonial={t}
            position={positions[idx] || "back"}
            onShuffle={shufflePositions}
          />
        ))}
      </div>

      <div className="relative z-10 mt-8 flex justify-center">
        <button
          onClick={shufflePositions}
          className="inline-flex items-center space-x-2 rounded-full bg-indigo-500 px-5 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:bg-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v6h6M20 20v-6h-6M4 20l5.5-5.5M19.5 4.5L14 10"
            />
          </svg>
          <span className="text-sm sm:text-base">Shuffle Reviews</span>
        </button>
      </div>
    </section>
  );
};
