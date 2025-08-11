"use client";

import { memo } from "react";

interface LoadingProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

// 🚀 Optimized Loading component with pure CSS animations
export const Loading = memo(({ message, size = "medium" }: LoadingProps) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner-wrapper">
        <div className={`loading-spinner loading-spinner--${size}`} />
        <div className={`loading-pulse loading-pulse--${size}`} />
      </div>

      {message && <p className="loading-message">{message}</p>}

      {/* 🎨 Optimized CSS animations - no JavaScript overhead */}
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
        }

        .loading-spinner-wrapper {
          position: relative;
          display: inline-block;
        }

        .loading-spinner {
          border-radius: 50%;
          border-style: solid;
          border-color: #b977f8 transparent #6566f1 transparent;
          animation: spin 1s linear infinite;
          will-change: transform;
        }

        .loading-spinner--small {
          height: 2rem;
          width: 2rem;
          border-width: 2px;
        }

        .loading-spinner--medium {
          height: 3rem;
          width: 3rem;
          border-width: 3px;
        }

        .loading-spinner--large {
          height: 4rem;
          width: 4rem;
          border-width: 4px;
        }

        .loading-pulse {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          background: linear-gradient(to right, #6566f1, #b977f8);
          opacity: 0.2;
          animation: pulse 2s ease-in-out infinite;
          will-change: opacity;
        }

        .loading-pulse--small {
          height: 2rem;
          width: 2rem;
        }

        .loading-pulse--medium {
          height: 3rem;
          width: 3rem;
        }

        .loading-pulse--large {
          height: 4rem;
          width: 4rem;
        }

        .loading-message {
          margin-top: 1rem;
          font-size: 1.125rem;
          font-weight: 600;
          background: linear-gradient(to right, #6566f1, #b977f8);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: textPulse 2s ease-in-out infinite;
          will-change: opacity;
        }

        /* 🎯 Optimized keyframes */
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes textPulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        /* 🚀 Performance optimizations */
        .loading-spinner,
        .loading-pulse {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
});

Loading.displayName = "Loading";
