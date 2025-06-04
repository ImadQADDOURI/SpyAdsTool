"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface FloatingGlassTextIconProps {
  /** Text to display */
  text: string;
  /** Icon component from lucide-react */
  Icon: LucideIcon;
  /** animation vertical amplitude in px */
  floatAmplitude?: number;
  /** animation duration in seconds */
  floatSpeed?: number;
  /** animation delay in seconds */
  delay?: number;
  /** text class to set color and style in dark / white themes */
  textClass?: string;
  /** icon class to set color and style in dark / white themes */
  iconClass?: string;
}

const FloatingGlassTextIcon: React.FC<FloatingGlassTextIconProps> = ({
  text,
  Icon,
  floatAmplitude = 5,
  floatSpeed = 5,
  delay = 0,
  textClass = "text-gray-800 dark:text-gray-100 font-medium",
  iconClass = "w-5 h-5 text-gray-800 dark:text-gray-100",
}) => {
  return (
    <span
      className="group relative inline-block"
      style={{
        animation: `float ${floatSpeed}s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* wrapper that sizes to content */}
      <span className="relative inline-block p-2">
        {/* 🔮 Glassmorphism overlay */}
        <span
          className="absolute inset-0 rounded-2xl bg-clip-padding backdrop-filter transition-shadow duration-300 group-hover:shadow-2xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        />

        {/* 📄 Text + Icon container */}
        <span className="relative z-10 flex items-center space-x-2">
          <Icon className={iconClass} />
          <span className={textClass}>{text}</span>
        </span>

        {/* ✨ Gradient glow on hover */}
        <span className="via-purple-500/8 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* 🌟 Hover ring effect */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-blue-300/40 transition-all duration-300 group-hover:ring-2" />
      </span>

      {/* Keyframes + backdrop blur shim */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-${floatAmplitude}px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .backdrop-filter {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      `}</style>
    </span>
  );
};

export default FloatingGlassTextIcon;
