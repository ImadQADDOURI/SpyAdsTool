"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";

import { DotPattern } from "./dot-pattern";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";

// 🌟 Enhanced testimonials with star ratings
const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    text: "This tool transformed our ad strategy overnight—finding winning products is now effortless. We saw a 3× ROI in just two weeks!",
    author: "Alex P. – TrendyShop",
    rating: 5,
  },
  {
    id: 2,
    text: "The advanced filters let me slice through millions of ads from 2018 to today in seconds. My campaigns are sharper than ever.",
    author: "Maria L. – FashionHub",
    rating: 5,
  },
  {
    id: 3,
    text: "Visual analytics & performance charts are a game-changer. We doubled our average order value in under a month!",
    author: "Jordan K. – SmartGadgets",
    rating: 5,
  },
  {
    id: 4,
    text: "Built-in AI tools and profit calculators save us hours of manual work. It's like having a marketing team in your pocket.",
    author: "Samantha R. – TechPulse",
    rating: 4,
  },
  {
    id: 5,
    text: "Downloading ad media and organizing custom boards has never been smoother. Finally, an all-in-one solution for scaling eCom profits.",
    author: "Darien C. – PeakPerformance",
    rating: 5,
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
    <section className="relative overflow-hidden bg-gradient-to-bl from-gray-900 to-gray-800 px-4 py-16 sm:px-6 lg:px-8">
      {/* 📏 Reduced padding from py-24 to py-16 */}
      {/* 🎨 Beautiful dot pattern background */}
      <DotPattern
        width={16}
        height={16}
        cx={1}
        cy={1}
        cr={1}
        className="absolute inset-0 fill-[#B977F8]/60 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]" // 📏 Reduced mask radius
      />
      {/* 📝 Compact header */}
      <div className="relative z-10 mx-auto mb-8 max-w-4xl text-center">
        {/* 📏 Reduced margin from mb-12 to mb-8 */}
        <motion.h2
          className="mb-3 text-2xl font-extrabold text-gray-100 sm:text-3xl" // 📏 Reduced text size and margin
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          What Our Users Are Saying
        </motion.h2>
        <motion.p
          className="text-sm tracking-wide text-gray-300 sm:text-base" // 📏 Reduced text size
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Real feedback from our community—see how they&apos;re scaling faster
          with our platform.
        </motion.p>
      </div>
      {/* 🎴 Expanded testimonial cards container for better spread */}
      <div className="relative z-10 mx-auto h-[280px] w-full max-w-[350px] sm:h-[300px] sm:max-w-[380px]">
        {SAMPLE_TESTIMONIALS.map((t, idx) => (
          <TestimonialCard
            key={t.id}
            testimonial={t}
            position={positions[idx] || "back"}
            onShuffle={shufflePositions}
          />
        ))}
      </div>
      {/* 🔄 Compact shuffle button */}
      <div className="relative z-10 mt-6 flex justify-center">
        {/* 📏 Reduced margin from mt-8 to mt-6 */}
        <button
          onClick={shufflePositions}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-indigo-600/90" // 📏 Reduced padding and enhanced styling
        >
          <Shuffle size={16} />
          <span>Shuffle Reviews</span>
        </button>
      </div>
    </section>
  );
};
