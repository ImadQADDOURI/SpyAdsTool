import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface FirefliesWrapperProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

interface FireflyProps {
  id: number;
  style: {
    left: string;
    top: string;
    scale: number;
    duration: number;
    delay: number;
    path: number;
  };
}

const FIREFLY_COUNTS = {
  low: 8,
  medium: 12,
  high: 15,
};

const FirefliesWrapper: React.FC<FirefliesWrapperProps> = ({
  children,
  className,
  intensity = "medium",
}) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fireflies: FireflyProps[] = React.useMemo(() => {
    const count = FIREFLY_COUNTS[intensity];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      style: {
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 90 + 5}%`,
        scale: Math.random() * 0.5 + 0.8, // Increased base size
        duration: Math.random() * 10 + 15,
        delay: Math.random() * -20,
        path: i % 3,
      },
    }));
  }, [intensity]);

  if (!mounted) return <div className={className}>{children}</div>;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {isVisible && (
        <div className="pointer-events-none absolute inset-0">
          {fireflies.map((firefly) => (
            <div
              key={firefly.id}
              className={cn(
                "absolute h-2 w-2 rounded-full", // Increased base size
                `firefly-path-${firefly.style.path}`,
              )}
              style={{
                left: firefly.style.left,
                top: firefly.style.top,
                opacity: 0,
                transform: `scale(${firefly.style.scale})`,
                animation: `
                  movement-${firefly.style.path} ${firefly.style.duration}s infinite ease-in-out,
                  glow ${Math.max(3, firefly.style.duration / 3)}s infinite alternate ease-in-out
                `,
                animationDelay: `${firefly.style.delay}s`,
              }}
            >
              {/* Core with increased brightness */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6566F1]/80 to-[#B977F8]/80 blur-[2px]"
                style={{
                  animation: `pulse ${firefly.style.duration / 4}s infinite alternate-reverse ease-in-out`,
                }}
              />
              {/* Enhanced glow effect */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] opacity-0"
                style={{
                  animation: `flash ${firefly.style.duration / 2}s infinite alternate ease-in-out`,
                  boxShadow: "0 0 30px 6px rgba(101, 102, 241, 0.6)",
                }}
              />
              {/* Additional outer glow for dark mode visibility */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-[4px] dark:from-[#6566F1]/30 dark:to-[#B977F8]/30" />
            </div>
          ))}
        </div>
      )}

      {children}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes flash {
          0%,
          75%,
          100% {
            opacity: 0;
            box-shadow: 0 0 0 0 rgba(101, 102, 241, 0);
          }
          25% {
            opacity: 1;
            box-shadow: 0 0 30px 8px rgba(101, 102, 241, 0.8);
          }
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.85;
          }
        }

        @keyframes movement-0 {
          0%,
          100% {
            transform: translate(0, 0) scale(var(--scale, 1));
          }
          25% {
            transform: translate(60px, -40px) scale(var(--scale, 1));
          }
          50% {
            transform: translate(0, -80px) scale(var(--scale, 1));
          }
          75% {
            transform: translate(-60px, -40px) scale(var(--scale, 1));
          }
        }

        @keyframes movement-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(var(--scale, 1));
          }
          33% {
            transform: translate(50px, -50px) scale(var(--scale, 1));
          }
          66% {
            transform: translate(-50px, -50px) scale(var(--scale, 1));
          }
        }

        @keyframes movement-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(var(--scale, 1)) rotate(0deg);
          }
          33% {
            transform: translate(70px, -40px) scale(var(--scale, 1))
              rotate(120deg);
          }
          66% {
            transform: translate(-70px, -40px) scale(var(--scale, 1))
              rotate(240deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FirefliesWrapper;
