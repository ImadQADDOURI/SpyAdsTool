"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface FloatingGlassImageProps {
  /** 🖼️ Image URL */
  src: string;
  /** 🌙 Dark mode image URL (optional) */
  darkSrc?: string;
  /** 📝 Alt text */
  alt?: string;
  /** 📏 Image dimensions */
  width?: number;
  height?: number;
  /** ⚡ High priority loading */
  priority?: boolean;
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
  /** 🎨 Additional CSS classes */
  className?: string;
}

const FloatingGlassImage: React.FC<FloatingGlassImageProps> = ({
  src,
  darkSrc,
  alt = "Image",
  width = 400,
  height = 300,
  priority = false,
  floatAmplitude = 8,
  floatSpeed = 6,
  delay = 0,
  glass = true,
  glassPadding = 8,
  className = "",
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 🚀 Handle hydration
  useEffect(() => setMounted(true), []);

  // 👁️ Visibility detection for performance
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  // 🎯 Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`inline-block ${className}`} style={{ width, height }} />
    );
  }

  // 🖼️ Image source selection
  const imageSrc = theme === "dark" && darkSrc ? darkSrc : src;

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

        {/* 🖼️ Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            quality={90}
            className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
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

export default FloatingGlassImage;
