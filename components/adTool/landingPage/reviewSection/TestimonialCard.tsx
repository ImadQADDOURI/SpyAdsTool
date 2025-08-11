"use client";

import React from "react";
import { motion, PanInfo } from "framer-motion";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export type Testimonial = {
  id: number;
  text: string;
  author: string;
  rating: number; // ⭐ Added rating property
  avatarUrl?: string;
};

type TestimonialCardProps = {
  testimonial: Testimonial;
  position: "front" | "middle" | "back";
  onShuffle: () => void;
};

/**
 * 🎯 Compact testimonial card with stars and repositioned author name
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  position,
  onShuffle,
}) => {
  const isFront = position === "front";

  // 🎨 Determine layering, rotation, and positioning
  const zIndex = isFront ? 3 : position === "middle" ? 2 : 1;
  const rotateDeg = isFront ? "-3deg" : position === "middle" ? "0deg" : "3deg"; // 📏 Reduced rotation for compact feel
  const xOffset = isFront ? "0%" : position === "middle" ? "25%" : "50%"; // 📏 Reduced offsets
  const scale = isFront ? 1.0 : position === "middle" ? 0.96 : 0.92; // 📏 Less dramatic scaling

  // ⭐ Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={cn(
          "transition-colors duration-200",
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-600 text-gray-600",
        )}
      />
    ));
  };

  return (
    <motion.div
      className={cn(
        "absolute left-0 top-0 flex select-none flex-col items-center rounded-2xl border border-gray-700 bg-gray-800/90 p-4 shadow-2xl backdrop-blur-md",
        "h-[280px] w-[240px] sm:h-[300px] sm:w-[260px]", // 📏 Significantly reduced height and width
        isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
      )}
      style={{ zIndex }}
      drag={isFront}
      dragElastic={0.3}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: scale }}
      viewport={{ once: true, amount: 0.3 }}
      animate={{ rotate: rotateDeg, x: xOffset }}
      transition={{ type: "spring", stiffness: 140, damping: 25 }}
      onDragEnd={(_, info: PanInfo) => {
        if (info.offset.x < -60) {
          // 📏 Reduced drag threshold
          onShuffle();
        }
      }}
      whileHover={isFront ? { scale: 1.02 } : {}}
      whileTap={isFront ? { scale: 0.98 } : {}}
    >
      {/* 👤 Avatar */}
      <img
        src={
          testimonial.avatarUrl ??
          `https://i.pravatar.cc/96?img=${testimonial.id + 5 || "/placeholder.svg"}`
        }
        alt={`Avatar of ${testimonial.author}`}
        className="h-14 w-14 rounded-full border-2 border-gray-600 bg-gray-600 object-cover sm:h-16 sm:w-16" // 📏 Reduced avatar size
      />

      {/* 👤 Author name directly under avatar */}
      <span className="mt-2 text-center text-xs font-semibold text-indigo-400 sm:text-sm">
        {testimonial.author}
      </span>

      {/* ⭐ Star rating */}
      <div className="mt-2 flex items-center gap-1">
        {renderStars(testimonial.rating)}
      </div>

      {/* 💬 Review text */}
      <p className="mt-3 flex-1 text-center text-xs italic leading-relaxed tracking-wide text-gray-200 sm:text-sm">
        &quot;{testimonial.text}&quot;
      </p>

      {/* 🎨 Subtle glow effect */}
      <style jsx>{`
        .cursor-grab:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </motion.div>
  );
};
