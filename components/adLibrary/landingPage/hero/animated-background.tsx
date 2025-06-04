"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface ColorConfig {
  blue: string;
  purple: string;
  pink: string;
}

interface AnimatedBackgroundProps {
  className?: string;
  horizontalPosition?: number; // 0-100, controls left/right position
  verticalPosition?: number; // 0-100, controls up/down position
  animationDuration?: number; // animation speed in seconds
  opacity?: number; // 0-1, controls transparency
  blur?: number; // blur amount in pixels
  pauseOnTabHidden?: boolean; // pause animation when tab is not visible
  vividity?: number; // 0-2, controls color saturation (1 = normal)
  contrast?: number; // 0-2, controls color contrast (1 = normal)
  colors?: Partial<ColorConfig>;
  enableReducedMotion?: boolean; // respect user's motion preferences
  enableMouseInteraction?: boolean; // new prop
  mouseInfluence?: number; // 0-1, controls how much mouse affects position
  mouseSmoothing?: number; // spring animation config for mouse following
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
  animationDuration = 15,
  opacity = 0.3,
  blur = 100,
  pauseOnTabHidden = true,
  vividity = 1,
  contrast = 1,
  colors = {},
  enableReducedMotion = true,
  enableMouseInteraction = true, // new default
  mouseInfluence = 0.2, // new default
  mouseSmoothing = 0.1, // new default
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Motion values for smooth mouse following
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothMouseX = useSpring(mouseX, {
    damping: 20,
    stiffness: 100 * mouseSmoothing,
  });
  const smoothMouseY = useSpring(mouseY, {
    damping: 20,
    stiffness: 100 * mouseSmoothing,
  });
  const shouldReduceMotion = useReducedMotion();

  // Merge default colors with custom colors
  const finalColors = { ...defaultColors, ...colors };

  // Handle tab visibility
  const handleVisibilityChange = useCallback(() => {
    setIsTabVisible(!document.hidden);
  }, []);

  useEffect(() => {
    if (!pauseOnTabHidden) return;

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pauseOnTabHidden, handleVisibilityChange]);

  // Handle mouse movement
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enableMouseInteraction || shouldReduceMotion) return;

      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth) * 100;
      const y = (clientY / innerHeight) * 100;

      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    },
    [enableMouseInteraction, shouldReduceMotion, mouseX, mouseY],
  );

  // Handle mouse leave to reset position
  const handleMouseLeave = useCallback(() => {
    if (!enableMouseInteraction) return;

    mouseX.set(horizontalPosition);
    mouseY.set(verticalPosition);
  }, [
    enableMouseInteraction,
    horizontalPosition,
    verticalPosition,
    mouseX,
    mouseY,
  ]);

  useEffect(() => {
    if (!enableMouseInteraction) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enableMouseInteraction, handleMouseMove, handleMouseLeave]);

  // Apply vividity and contrast to colors
  const processColor = useCallback(
    (colorRgb: string, alpha = 0.7) => {
      const [r, g, b] = colorRgb.split(", ").map(Number);

      // Apply vividity (saturation)
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const processedR = Math.round(gray + (r - gray) * vividity);
      const processedG = Math.round(gray + (g - gray) * vividity);
      const processedB = Math.round(gray + (b - gray) * vividity);

      // Apply contrast
      const contrastR = Math.round(
        ((processedR / 255 - 0.5) * contrast + 0.5) * 255,
      );
      const contrastG = Math.round(
        ((processedG / 255 - 0.5) * contrast + 0.5) * 255,
      );
      const contrastB = Math.round(
        ((processedB / 255 - 0.5) * contrast + 0.5) * 255,
      );

      // Clamp values
      const finalR = Math.max(0, Math.min(255, contrastR));
      const finalG = Math.max(0, Math.min(255, contrastG));
      const finalB = Math.max(0, Math.min(255, contrastB));

      return `rgba(${finalR}, ${finalG}, ${finalB}, ${alpha})`;
    },
    [vividity, contrast],
  );

  // Calculate positions for the gradients with mouse influence
  const basePos1 = {
    x: Math.max(0, Math.min(100, horizontalPosition)),
    y: Math.max(0, Math.min(100, verticalPosition)),
  };

  const basePos2 = {
    x: Math.max(0, Math.min(100, horizontalPosition + 40)),
    y: Math.max(0, Math.min(100, verticalPosition + 30)),
  };

  // Blend base position with mouse position based on influence
  const pos1 = enableMouseInteraction
    ? {
        x: basePos1.x + (mousePosition.x - basePos1.x) * mouseInfluence,
        y: basePos1.y + (mousePosition.y - basePos1.y) * mouseInfluence,
      }
    : basePos1;

  const pos2 = enableMouseInteraction
    ? {
        x: basePos2.x + (mousePosition.x - basePos2.x) * mouseInfluence * 0.7, // Less influence on second gradient
        y: basePos2.y + (mousePosition.y - basePos2.y) * mouseInfluence * 0.7,
      }
    : basePos2;

  // Determine if animation should be paused
  const shouldPause =
    (pauseOnTabHidden && !isTabVisible) ||
    (enableReducedMotion && shouldReduceMotion);

  // Animation variants
  const createGradientAnimation = (
    positions: typeof pos1,
    colorSequence: string[],
  ) => ({
    background: colorSequence,
    transition: {
      duration: animationDuration,
      repeat: shouldPause ? 0 : Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  });

  const gradient1Colors = [
    `radial-gradient(circle at ${pos1.x}% ${pos1.y}%, ${processColor(finalColors.blue)} 0%, rgba(196, 181, 253, 0) 50%)`,
    `radial-gradient(circle at ${pos1.x + 10}% ${pos1.y - 10}%, ${processColor(finalColors.purple)} 0%, rgba(196, 181, 253, 0) 50%)`,
    `radial-gradient(circle at ${pos1.x + 20}% ${pos1.y - 20}%, ${processColor(finalColors.pink)} 0%, rgba(196, 181, 253, 0) 50%)`,
    `radial-gradient(circle at ${pos1.x}% ${pos1.y}%, ${processColor(finalColors.blue)} 0%, rgba(196, 181, 253, 0) 50%)`,
  ];

  const gradient2Colors = [
    `radial-gradient(circle at ${pos2.x}% ${pos2.y}%, ${processColor(finalColors.pink)} 0%, rgba(196, 181, 253, 0) 50%)`,
    `radial-gradient(circle at ${pos2.x - 10}% ${pos2.y + 10}%, ${processColor(finalColors.blue)} 0%, rgba(196, 181, 253, 0) 50%)`,
    `radial-gradient(circle at ${pos2.x - 20}% ${pos2.y + 20}%, ${processColor(finalColors.purple)} 0%, rgba(196, 181, 253, 0) 50%)`,
    `radial-gradient(circle at ${pos2.x}% ${pos2.y}%, ${processColor(finalColors.pink)} 0%, rgba(196, 181, 253, 0) 50%)`,
  ];

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 overflow-hidden ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900" />

      <motion.div
        className="absolute -inset-[25%]"
        style={{
          opacity: Math.max(0, Math.min(1, opacity)),
          x: enableMouseInteraction ? smoothMouseX : 0,
          y: enableMouseInteraction ? smoothMouseY : 0,
        }}
        animate={createGradientAnimation(pos1, gradient1Colors)}
        initial={{ background: gradient1Colors[0] }}
      />

      <motion.div
        className="absolute -inset-[25%]"
        style={{
          opacity: Math.max(0, Math.min(1, opacity)),
          x: enableMouseInteraction ? smoothMouseX : 0,
          y: enableMouseInteraction ? smoothMouseY : 0,
        }}
        animate={createGradientAnimation(pos2, gradient2Colors)}
        initial={{ background: gradient2Colors[0] }}
        transition={{
          duration: animationDuration + 5,
          repeat: shouldPause ? 0 : Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${Math.max(0, Math.min(200, blur))}px)`,
          WebkitBackdropFilter: `blur(${Math.max(0, Math.min(200, blur))}px)`, // Safari support
        }}
      />
    </div>
  );
}
