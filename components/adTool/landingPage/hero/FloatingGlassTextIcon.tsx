"use client";

import React, { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface FloatingGlassTextIconProps {
  /** 📝 Text content */
  text: string;
  /** 🎨 Lucide icon component */
  Icon: LucideIcon;
  /** 🌊 Float amplitude (px) */
  floatAmplitude?: number;
  /** ⏰ Float speed (seconds) */
  floatSpeed?: number;
  /** ⏳ Animation delay (seconds) */
  delay?: number;
  /** 🔮 Glassmorphism effect */
  glass?: boolean;
  /** 📦 Glass padding (px) */
  glassPadding?: number;
  /** 📝 Text styling */
  textClass?: string;
  /** 🎯 Icon styling */
  iconClass?: string;
  /** 🎨 Additional CSS classes */
  className?: string;
}

const FloatingGlassTextIcon: React.FC<FloatingGlassTextIconProps> = ({
  text,
  Icon,
  floatAmplitude = 6,
  floatSpeed = 5,
  delay = 0,
  glass = true,
  glassPadding = 8,
  textClass = "text-gray-800 dark:text-gray-100 font-medium",
  iconClass = "w-5 h-5 text-gray-600 dark:text-gray-300",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 👁️ Visibility detection for performance
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`group relative inline-block ${className}`}
      style={{
        animation: isVisible
          ? `float-${floatSpeed}-${floatAmplitude} ${floatSpeed}s ease-in-out ${delay}s infinite`
          : "none",
      }}
    >
      {/* 🔮 Glass container */}
      <div className="relative" style={{ padding: glass ? glassPadding : 0 }}>
        {/* Glass overlay */}
        {glass && (
          <div
            className="absolute inset-0 rounded-2xl backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}

        {/* 📄 Content container */}
        <div className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:scale-[1.02]">
          <Icon className={iconClass} />
          <span className={textClass}>{text}</span>
        </div>

        {/* ✨ Hover effects */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-blue-400/30 transition-all duration-300 group-hover:ring-1" />
      </div>

      {/* 🎭 Animation keyframes */}
      {isVisible && (
        <style jsx>{`
          @keyframes float-${floatSpeed}-${floatAmplitude} {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-${floatAmplitude}px);
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default FloatingGlassTextIcon;
