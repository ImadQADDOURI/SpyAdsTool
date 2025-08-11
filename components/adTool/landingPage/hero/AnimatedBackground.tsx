"use client";

import React, { useMemo } from "react";

export interface AnimatedBackgroundProps {
  colors?: string[];
  opacity?: number;
  count?: number;
  floatDuration?: number;
  hueDuration?: number;
  waveDuration?: number;
  waveAmplitude?: number;
  horizontalBias?: "left" | "center" | "right";
  verticalBias?: "top" | "center" | "bottom";
  biasSpread?: number;
  layerCount?: number;
  maxSize?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  colors = [
    "rgba(101,102,241,0.5)",
    "rgba(185,119,248,0.5)",
    "rgba(255,182,193,0.5)",
  ],
  opacity = 0.5,
  count = 5,
  floatDuration = 15,
  hueDuration = 40,
  waveDuration = 25,
  waveAmplitude = 40,
  horizontalBias = "center",
  verticalBias = "center",
  biasSpread = 0.5,
  layerCount = 3,
  maxSize = 500,
}) => {
  const biasedPosition = (
    bias: "left" | "center" | "right" | "top" | "bottom",
  ) => {
    const r = Math.random();
    const s = biasSpread;
    switch (bias) {
      case "left":
      case "top":
        return r * (s * 100);
      case "right":
      case "bottom":
        return 100 - r * (s * 100);
      default:
        return 50 + (r - 0.5) * (s * 100);
    }
  };

  const blobs = useMemo(
    () =>
      Array.from({ length: count }).flatMap((_, i) => {
        const top = biasedPosition(verticalBias);
        const left = biasedPosition(horizontalBias);
        const baseSize = 200 + Math.random() * (maxSize - 200);

        return Array.from({ length: layerCount }).map((_, layerIndex) => {
          const scale = 1 - layerIndex * 0.2;
          return {
            id: `${i}-${layerIndex}`,
            size: baseSize * scale,
            top,
            left,
            delay: Math.random() * floatDuration,
            layerIndex,
            zIndex: -layerIndex,
            direction: Math.random() < 0.5 ? "normal" : "reverse",
          };
        });
      }),
    [
      count,
      layerCount,
      verticalBias,
      horizontalBias,
      biasSpread,
      maxSize,
      floatDuration,
    ],
  );

  return (
    <div className="animated-bg-container">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="blob"
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            top: `${blob.top}%`,
            left: `${blob.left}%`,
            zIndex: blob.zIndex,
            animationDuration: `${floatDuration + blob.layerIndex * 2}s, ${hueDuration}s, ${waveDuration + blob.layerIndex * 2}s`,
            animationDelay: `-${blob.delay}s, 0s, 0s`,
            animationDirection: `${blob.direction}, normal, alternate`,
            background: `radial-gradient(circle at 30% 30%, ${colors.join(", ")})`,
            opacity: opacity * (1 - blob.layerIndex * 0.2),
          }}
        />
      ))}
      <style jsx>{`
        .animated-bg-container {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -1;
        }
        .blob {
          position: absolute;
          filter: blur(140px);
          animation-name: float, hueShift, wave;
          animation-timing-function: ease-in-out, linear, ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform, filter, opacity;
          border-radius: 50%;
        }

        @keyframes float {
          0% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-60px) scale(1.05);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
          }
        }

        @keyframes hueShift {
          0% {
            filter: blur(140px) hue-rotate(0deg);
          }
          50% {
            filter: blur(140px) hue-rotate(60deg);
          }
          100% {
            filter: blur(140px) hue-rotate(0deg);
          }
        }

        @keyframes wave {
          0% {
            transform: translate(-50%, -50%) translateX(0);
          }
          50% {
            transform: translate(-50%, -50%) translateX(${waveAmplitude}px);
          }
          100% {
            transform: translate(-50%, -50%) translateX(0);
          }
        }

        @media (prefers-color-scheme: dark) {
          .blob {
            filter: blur(180px);
            opacity: ${opacity * 0.6};
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
