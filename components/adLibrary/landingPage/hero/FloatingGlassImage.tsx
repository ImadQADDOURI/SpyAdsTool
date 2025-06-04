"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Lens } from "./lens";

interface FloatingGlassImageProps {
  /** light‐mode image URL */
  src: string;
  /** dark‐mode image URL (optional) */
  darkSrc?: string;
  alt?: string;
  priority?: boolean;
  floatAmplitude?: number;
  floatSpeed?: number;
  /** animation delay in seconds */
  delay?: number;
  /** whether to wrap image in glassmorphism box */
  glass?: boolean;
  /** enable lens zoom effect on the image */
  lens?: boolean;
  /** how much to zoom inside lens */
  zoomFactor?: number;
  /** diameter of lens in px */
  lensSize?: number;
  /** show a static lens at position */
  isStaticLens?: boolean;
  /** static lens position if used */
  lensPosition?: { x: number; y: number };
}

const FloatingGlassImage: React.FC<FloatingGlassImageProps> = ({
  src,
  darkSrc,
  alt = "Floating glass image",
  priority = false,
  floatAmplitude = 7,
  floatSpeed = 7,
  delay = 0,
  glass = true,
  lens = true,
  zoomFactor = 1.5,
  lensSize = 150,
  isStaticLens = false,
  lensPosition = { x: 100, y: 100 },
}) => {
  const { theme } = useTheme();
  // avoid hydration mismatches around next-themes
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  // pick the right src
  const actualSrc = theme === "dark" && darkSrc ? darkSrc : src;

  return (
    <span
      className="group relative inline-block"
      style={{
        animation: `float ${floatSpeed}s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* inner wrapper still inline-block */}
      <span className="relative inline-block p-2">
        {/* 🔮 Optional glass overlay */}
        {glass && (
          <span
            className="absolute inset-0 rounded-2xl bg-clip-padding backdrop-filter transition-shadow duration-300 group-hover:shadow-2xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          />
        )}

        {/* 🖼️ Image with optional Lens */}
        {lens ? (
          <Lens
            zoomFactor={zoomFactor}
            lensSize={lensSize}
            isStatic={isStaticLens}
            position={lensPosition}
          >
            <img
              src={actualSrc}
              alt={alt}
              className="h-auto max-w-full rounded-2xl object-contain"
              loading={priority ? "eager" : "lazy"}
            />
          </Lens>
        ) : (
          <img
            src={actualSrc}
            alt={alt}
            className="h-auto max-w-full rounded-2xl object-contain"
            loading={priority ? "eager" : "lazy"}
          />
        )}

        {/* ✨ Gradient glow on hover */}
        <span className="via-purple-500/8 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* 🌟 Hover ring effect */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-blue-300/40 transition-all duration-300 group-hover:ring-2" />
      </span>

      {/* keyframes + backdrop blur shim */}
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

export default FloatingGlassImage;
