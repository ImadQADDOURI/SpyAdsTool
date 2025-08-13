"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

interface Particle {
  id: number;
  rotationSpeed: number;
  flashDelay: number;
  flashDuration: number;
  moveKeyframes: string;
  startX: number;
  startY: number;
}

interface ParticlesLayerProps {
  quantity?: number;
  particleColor?: string; // Main color of the particle
  glowColor?: string; // Color of the glow effect
  shadowColor?: string; // Color of the shadow/depth effect
  size?: number; // in vw units
  speed?: number; // animation duration multiplier
  opacity?: number;
  glowIntensity?: number; // glow size multiplier
  className?: string;
  preset?:
    | "lightPurple"
    | "firefly"
    | "cosmic"
    | "ethereal"
    | "ember"
    | "aurora"
    | "neon";
}

type ThemeColors = {
  light: {
    particleColor: string;
    glowColor: string;
    shadowColor: string;
    opacity: number;
    glowIntensity: number;
  };
  dark: {
    particleColor: string;
    glowColor: string;
    shadowColor: string;
    opacity: number;
    glowIntensity: number;
  };
};

export default function ParticlesLayer({
  quantity = 15,
  particleColor,
  glowColor,
  shadowColor,
  size = 0.4,
  speed = 1,
  opacity,
  glowIntensity,
  className = "",
  preset = "firefly",
}: ParticlesLayerProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme || theme || "light" : "light";
  const isDarkTheme = currentTheme === "dark";

  // Define color presets with dedicated light/dark variations
  const presets: Record<string, ThemeColors> = {
    lightPurple: {
      light: {
        particleColor: "`#f8fafc`", // slate-50 - very light particle for contrast
        glowColor: "`#6366f1`", // indigo-500 - vibrant blue-purple
        shadowColor: "rgba(30, 27, 75, 0.2)", // deep indigo shadow for depth
        opacity: 1,
        glowIntensity: 1.1, // Higher glow for visibility on light gray
      },
      dark: {
        particleColor: "`#ffffff`", // pure white particle
        glowColor: "`#a5b4fc`", // indigo-300 - lighter blue-purple for dark mode
        shadowColor: "rgba(67, 56, 202, 0.4)", // indigo-700 shadow
        opacity: 1,
        glowIntensity: 1.1, // Moderate glow for dark background
      },
    },
    firefly: {
      light: {
        particleColor: "#ffffff",
        glowColor: "#eab308", // yellow-500
        shadowColor: "rgba(0, 0, 0, 0.5)",
        opacity: 0.85,
        glowIntensity: 1.2,
      },
      dark: {
        particleColor: "#ffffff",
        glowColor: "#facc15", // yellow-400
        shadowColor: "rgba(0, 0, 0, 0.3)",
        opacity: 0.7,
        glowIntensity: 0.9,
      },
    },
    cosmic: {
      light: {
        particleColor: "#f5f3ff", // violet-50
        glowColor: "#7c3aed", // violet-600
        shadowColor: "rgba(76, 29, 149, 0.5)", // violet-900 with opacity
        opacity: 0.9,
        glowIntensity: 1.3,
      },
      dark: {
        particleColor: "#ffffff",
        glowColor: "#a78bfa", // violet-400
        shadowColor: "rgba(91, 33, 182, 0.3)", // violet-800 with opacity
        opacity: 0.75,
        glowIntensity: 0.85,
      },
    },
    ethereal: {
      light: {
        particleColor: "#f0fdfa", // teal-50
        glowColor: "#0d9488", // teal-600
        shadowColor: "rgba(19, 78, 74, 0.5)", // teal-900 with opacity
        opacity: 0.85,
        glowIntensity: 1.1,
      },
      dark: {
        particleColor: "#ffffff",
        glowColor: "#2dd4bf", // teal-400
        shadowColor: "rgba(17, 94, 89, 0.3)", // teal-800 with opacity
        opacity: 0.7,
        glowIntensity: 0.9,
      },
    },
    ember: {
      light: {
        particleColor: "#fef2f2", // red-50
        glowColor: "#dc2626", // red-600
        shadowColor: "rgba(127, 29, 29, 0.5)", // red-900 with opacity
        opacity: 0.85,
        glowIntensity: 1.2,
      },
      dark: {
        particleColor: "#ffffff",
        glowColor: "#f87171", // red-400
        shadowColor: "rgba(153, 27, 27, 0.3)", // red-800 with opacity
        opacity: 0.7,
        glowIntensity: 0.8,
      },
    },
    aurora: {
      light: {
        particleColor: "#ecfeff", // cyan-50
        glowColor: "#0891b2", // cyan-600
        shadowColor: "rgba(22, 78, 99, 0.5)", // cyan-900 with opacity
        opacity: 0.85,
        glowIntensity: 1.1,
      },
      dark: {
        particleColor: "#ffffff",
        glowColor: "#22d3ee", // cyan-400
        shadowColor: "rgba(21, 94, 117, 0.3)", // cyan-800 with opacity
        opacity: 0.7,
        glowIntensity: 0.9,
      },
    },
    neon: {
      light: {
        particleColor: "#ffffff",
        glowColor: "#ec4899", // pink-500
        shadowColor: "rgba(131, 24, 67, 0.5)", // pink-900 with opacity
        opacity: 0.9,
        glowIntensity: 1.4,
      },
      dark: {
        particleColor: "#ffffff",
        glowColor: "#f472b6", // pink-400
        shadowColor: "rgba(157, 23, 77, 0.3)", // pink-800 with opacity
        opacity: 0.8,
        glowIntensity: 1.1,
      },
    },
  };

  // Get the selected preset
  const selectedPreset = presets[preset] || presets.firefly;
  const themePreset = isDarkTheme ? selectedPreset.dark : selectedPreset.light;

  const finalParticleColor = particleColor || themePreset.particleColor;
  const finalGlowColor = glowColor || themePreset.glowColor;
  const finalShadowColor = shadowColor || themePreset.shadowColor;
  const finalOpacity = opacity ?? themePreset.opacity;
  const finalGlowIntensity = glowIntensity ?? themePreset.glowIntensity;

  const particles = useMemo((): Particle[] => {
    return Array.from({ length: quantity }, (_, i) => {
      const steps = Math.floor(Math.random() * 12) + 16;
      const rotationSpeed = (Math.random() * 10 + 8) * speed;
      const flashDelay = Math.random() * 8000 + 500;
      const flashDuration = Math.random() * 6000 + 5000;

      const moveKeyframes = Array.from({ length: steps + 1 }, (_, step) => {
        const percentage = (step * (100 / steps)).toFixed(1);
        const translateX = (Math.random() * 100 - 50).toFixed(1);
        const translateY = (Math.random() * 100 - 50).toFixed(1);
        const scale = ((Math.random() * 0.75 + 0.25) * (size / 0.4)).toFixed(2);
        return `${percentage}% { transform: translateX(${translateX}vw) translateY(${translateY}vh) scale(${scale}); }`;
      }).join("\n");

      return {
        id: i,
        rotationSpeed,
        flashDelay,
        flashDuration,
        moveKeyframes,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
      };
    });
  }, [quantity, speed, size]);

  if (!mounted) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <style jsx>{`
        .firefly {
          position: absolute;
          width: ${size}vw;
          height: ${size}vw;
          animation: ease ${200 * speed}s alternate infinite;
          pointer-events: none;
          mix-blend-mode: ${isDarkTheme ? "screen" : "normal"};
        }

        .firefly::before,
        .firefly::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform-origin: center;
        }

        .firefly::before {
          background: ${finalShadowColor};
          animation: drift ease alternate infinite;
        }

        .firefly::after {
          background: ${finalParticleColor};
          opacity: 0;
          box-shadow: 0 0 0vw 0vw ${finalGlowColor};
          animation:
            drift ease alternate infinite,
            flash ease infinite;
        }

        @keyframes drift {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes flash {
          0%,
          30%,
          100% {
            opacity: 0;
            box-shadow: 0 0 0vw 0vw ${finalGlowColor};
          }
          5% {
            opacity: ${finalOpacity};
            box-shadow: 0 0 ${2 * finalGlowIntensity}vw
              ${0.4 * finalGlowIntensity}vw ${finalGlowColor};
          }
        }

        ${particles
          .map(
            (particle) => `
          .firefly:nth-child(${particle.id + 1}) {
            animation-name: move${particle.id};
          }

          .firefly:nth-child(${particle.id + 1}) {
            /* Inline start position applied via style prop */
          }

          .firefly:nth-child(${particle.id + 1})::before {
            animation-duration: ${particle.rotationSpeed}s;
          }

          .firefly:nth-child(${particle.id + 1})::after {
            animation-duration: ${particle.rotationSpeed}s, ${particle.flashDuration}ms;
            animation-delay: 0ms, ${particle.flashDelay}ms;
          }

          @keyframes move${particle.id} {
            ${particle.moveKeyframes}
          }
        `,
          )
          .join("\n")}
      `}</style>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="firefly"
          style={{ left: `${particle.startX}%`, top: `${particle.startY}%` }}
        />
      ))}
    </div>
  );
}
