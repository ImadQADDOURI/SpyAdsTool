import React from "react";

// 🎨 Centralized gradient configuration
const GRADIENT_CONFIG = {
  colors: {
    purple: "#8b5cf6",
    pink: "#ec4899",
    blue: "#3b82f6",
    cyan: "#06b6d4",
  },
  // 🌈 Soft, light gradients optimized for both themes
  gradients: {
    light:
      "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.06) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(6, 182, 212, 0.07) 0%, transparent 50%)",
    dark: "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(6, 182, 212, 0.10) 0%, transparent 50%)",
  },
};

interface GradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: "subtle" | "normal" | "vibrant";
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  className = "",
  intensity = "normal",
}) => {
  // 🎯 Higher intensity multipliers for very vivid backgrounds
  const intensityMap = {
    subtle: 0.5,
    normal: 1,
    vibrant: 2,
  };

  const multiplier = intensityMap[intensity];

  return (
    <div
      className={`relative min-h-screen w-full ${className}`}
      style={{
        // 🌅 Light theme gradient
        background: `
          ${GRADIENT_CONFIG.gradients.light.replace(
            /rgba\((\d+,\s*\d+,\s*\d+),\s*([\d.]+)\)/g,
            (match, rgb, alpha) =>
              `rgba(${rgb}, ${Math.min(parseFloat(alpha) * multiplier, 0.8)})`,
          )}, 
          rgb(255, 255, 255)
        `,
      }}
    >
      {/* 🌙 Dark theme overlay with CSS custom properties */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100"
        style={{
          background: `
            ${GRADIENT_CONFIG.gradients.dark.replace(
              /rgba\((\d+,\s*\d+,\s*\d+),\s*([\d.]+)\)/g,
              (match, rgb, alpha) =>
                `rgba(${rgb}, ${Math.min(parseFloat(alpha) * multiplier, 0.9)})`,
            )}, 
            rgb(0, 0, 0)
          `,
        }}
      />

      {/* 📱 Content container with proper z-index */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GradientBackground;
