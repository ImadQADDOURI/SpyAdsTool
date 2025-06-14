"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ColorConfig {
  blue: string;
  purple: string;
  pink: string;
}

interface AnimatedBackgroundProps {
  className?: string;
  horizontalPosition?: number; // 0-100, controls left/right position
  verticalPosition?: number; // 0-100, controls up/down position
  opacity?: number; // 0-1, controls transparency
  blur?: number; // blur amount in pixels
  colors?: Partial<ColorConfig>;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number; // 0-1, controls how much mouse affects position
}

const defaultColors: ColorConfig = {
  blue: "147, 197, 253",
  purple: "216, 180, 254",
  pink: "244, 114, 182",
};

export default function AnimatedBackground({
  className = "",
  horizontalPosition = 30,
  verticalPosition = 30,
  opacity = 0.3,
  blur = 100,
  colors = {},
  enableMouseInteraction = true,
  mouseInfluence = 0.2,
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(true);

  // 🎨 Merge default colors with custom colors
  const finalColors = { ...defaultColors, ...colors };

  // 🖱️ Handle mouse movement with throttling for better performance
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enableMouseInteraction) return;

      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth) * 100;
      const y = (clientY / innerHeight) * 100;

      setMousePosition({ x, y });
    },
    [enableMouseInteraction],
  );

  // 👁️ Handle visibility change for performance
  const handleVisibilityChange = useCallback(() => {
    setIsVisible(!document.hidden);
  }, []);

  useEffect(() => {
    let throttleTimer: NodeJS.Timeout;

    const throttledMouseMove = (event: MouseEvent) => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleMouseMove(event);
        throttleTimer = null as any;
      }, 16); // ~60fps
    };

    if (enableMouseInteraction) {
      window.addEventListener("mousemove", throttledMouseMove, {
        passive: true,
      });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (throttleTimer) clearTimeout(throttleTimer);
      window.removeEventListener("mousemove", throttledMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enableMouseInteraction, handleMouseMove, handleVisibilityChange]);

  // 🎯 Calculate positions with mouse influence
  const pos1 = enableMouseInteraction
    ? {
        x:
          horizontalPosition +
          (mousePosition.x - horizontalPosition) * mouseInfluence,
        y:
          verticalPosition +
          (mousePosition.y - verticalPosition) * mouseInfluence,
      }
    : { x: horizontalPosition, y: verticalPosition };

  const pos2 = enableMouseInteraction
    ? {
        x:
          horizontalPosition +
          40 +
          (mousePosition.x - (horizontalPosition + 40)) * mouseInfluence * 0.7,
        y:
          verticalPosition +
          30 +
          (mousePosition.y - (verticalPosition + 30)) * mouseInfluence * 0.7,
      }
    : { x: horizontalPosition + 40, y: verticalPosition + 30 };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 overflow-hidden ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {/* 🌈 Base background */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900" />

      {/* 🎨 Animated gradients using CSS animations for better performance */}
      <div
        className={`absolute -inset-[25%] transition-all duration-1000 ease-out ${
          isVisible ? "animate-gradient-1" : ""
        }`}
        style={{
          opacity: Math.max(0, Math.min(1, opacity)),
          background: `radial-gradient(circle at ${pos1.x}% ${pos1.y}%, rgba(${finalColors.blue}, 0.7) 0%, transparent 50%)`,
          transform: enableMouseInteraction
            ? `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`
            : "none",
        }}
      />

      <div
        className={`absolute -inset-[25%] transition-all duration-1000 ease-out ${
          isVisible ? "animate-gradient-2" : ""
        }`}
        style={{
          opacity: Math.max(0, Math.min(1, opacity)),
          background: `radial-gradient(circle at ${pos2.x}% ${pos2.y}%, rgba(${finalColors.pink}, 0.6) 0%, transparent 50%)`,
          transform: enableMouseInteraction
            ? `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)`
            : "none",
        }}
      />

      <div
        className={`absolute -inset-[25%] transition-all duration-1000 ease-out ${
          isVisible ? "animate-gradient-3" : ""
        }`}
        style={{
          opacity: Math.max(0, Math.min(1, opacity * 0.8)),
          background: `radial-gradient(circle at ${(pos1.x + pos2.x) / 2}% ${(pos1.y + pos2.y) / 2}%, rgba(${
            finalColors.purple
          }, 0.5) 0%, transparent 50%)`,
          transform: enableMouseInteraction
            ? `translate(${(mousePosition.x - 50) * 0.08}px, ${(mousePosition.y - 50) * 0.08}px)`
            : "none",
        }}
      />

      {/* 🌫️ Blur overlay */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${Math.max(0, Math.min(200, blur))}px)`,
          WebkitBackdropFilter: `blur(${Math.max(0, Math.min(200, blur))}px)`,
        }}
      />

      {/* 🎭 CSS Animations for better performance */}
      <style jsx>{`
        @keyframes gradient-1 {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          33% {
            transform: scale(1.1) rotate(120deg);
          }
          66% {
            transform: scale(0.9) rotate(240deg);
          }
        }

        @keyframes gradient-2 {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
        }

        @keyframes gradient-3 {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(0.8) rotate(90deg);
          }
          75% {
            transform: scale(1.1) rotate(270deg);
          }
        }

        .animate-gradient-1 {
          animation: gradient-1 20s ease-in-out infinite;
        }

        .animate-gradient-2 {
          animation: gradient-2 25s ease-in-out infinite reverse;
        }

        .animate-gradient-3 {
          animation: gradient-3 30s ease-in-out infinite;
        }

        /* ♿ Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient-1,
          .animate-gradient-2,
          .animate-gradient-3 {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
