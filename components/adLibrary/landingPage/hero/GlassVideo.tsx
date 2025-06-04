"use client";

import React from "react";

interface GlassVideoProps {
  src: string;
  poster?: string;
  glass?: boolean;
}

const GlassVideo: React.FC<GlassVideoProps> = ({
  src,
  poster,
  glass = true,
}) => {
  return (
    <div className="group relative mx-auto inline-block max-w-7xl px-4 py-6">
      {/* wrapper that sizes to video */}
      <div className="relative inline-block p-2">
        {/* 🔮 Glassmorphism overlay */}
        {glass && (
          <div
            className="absolute inset-0 rounded-2xl bg-clip-padding backdrop-filter transition-shadow duration-300 group-hover:shadow-2xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          />
        )}

        {/* 🎥 Video element */}
        <div className="relative z-10 overflow-hidden rounded-2xl">
          <video
            className="h-auto w-full max-w-full rounded-2xl object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={poster}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* ✨ Gradient glow on hover */}
        <div className="via-purple-500/8 absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* 🌟 Hover ring effect */}
        <div className="absolute inset-0 rounded-2xl ring-0 ring-blue-300/40 transition-all duration-300 group-hover:ring-2" />
      </div>

      {/* Backdrop blur style */}
      <style jsx>{`
        .backdrop-filter {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
};

export default GlassVideo;
