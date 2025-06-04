"use client";

import React from "react";
import { motion, PanInfo } from "framer-motion";

export type Testimonial = {
  id: number;
  text: string;
  author: string;
  avatarUrl?: string;
};

type TestimonialCardProps = {
  testimonial: Testimonial;
  position: "front" | "middle" | "back";
  onShuffle: () => void;
};

/**
 * A single card in the testimonial stack.
 * Positions:
 *   - "front": highest z-index, draggable
 *   - "middle": behind front, slight rotation/offset
 *   - "back": furthest behind
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  position,
  onShuffle,
}) => {
  const isFront = position === "front";

  // Determine layering, rotation, and x-offset based on `position`
  const zIndex = isFront ? 3 : position === "middle" ? 2 : 1;
  const rotateDeg = isFront ? "-5deg" : position === "middle" ? "0deg" : "5deg";
  const xOffset = isFront ? "0%" : position === "middle" ? "30%" : "60%";
  const scale = isFront ? 1.0 : position === "middle" ? 0.95 : 0.9;

  return (
    <motion.div
      className={`absolute left-0 top-0 flex h-[380px] w-[280px] select-none flex-col items-center rounded-3xl border border-gray-700 bg-gray-800/90 p-6 shadow-2xl backdrop-blur-md sm:h-[420px] sm:w-[320px] ${isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"} `}
      style={{ zIndex }}
      drag={isFront}
      dragElastic={0.3}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: scale }}
      viewport={{ once: true, amount: 0.3 }}
      animate={{ rotate: rotateDeg, x: xOffset }}
      transition={{ type: "spring", stiffness: 130, damping: 22 }}
      onDragEnd={(_, info: PanInfo) => {
        // If dragged left more than 80px, shuffle
        if (info.offset.x < -80) {
          onShuffle();
        }
      }}
      whileHover={isFront ? { scale: 1.02 } : {}}
      whileTap={isFront ? { scale: 0.98 } : {}}
    >
      <img
        src={
          testimonial.avatarUrl ??
          `https://i.pravatar.cc/128?img=${testimonial.id + 5}`
        }
        alt={`Avatar of ${testimonial.author}`}
        className="mb-4 h-20 w-20 rounded-full border-2 border-gray-600 bg-gray-600 object-cover sm:h-24 sm:w-24"
      />
      <p className="flex-1 text-center text-sm italic tracking-wide text-gray-200 sm:text-base">
        “{testimonial.text}”
      </p>
      <span className="mt-4 text-center text-xs font-semibold text-indigo-400 sm:text-sm">
        — {testimonial.author}
      </span>

      {/* Additional styled-JSX overrides if needed */}
      <style jsx>{`
        /* Example: add a subtle glow on hover for the front card */
        .cursor-grab:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </motion.div>
  );
};
