import React from "react";

import { cn } from "@/lib/utils";

import { AuroraText } from "./hero/AuroraText";

interface HeaderProps {
  gradientColors?: string[];
  headline?: {
    prefix?: string;
    highlight?: string;
    suffix?: string;
  };
  subtitle?: string;
  forceDarkMode?: boolean;
  className?: string;
  headlineClassName?: string;
  subtitleClassName?: string;
  containerClassName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  gradientColors = ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline,
  subtitle,
  forceDarkMode = false,
  className,
  headlineClassName,
  subtitleClassName,
  containerClassName,
}) => {
  const baseHeadlineClasses =
    "mb-4 text-3xl font-bold leading-tight tracking-tight drop-shadow-sm sm:text-5xl";
  const baseSubtitleClasses =
    "mx-auto max-w-3xl text-base leading-relaxed drop-shadow-sm sm:text-lg";

  const headlineTextClasses = forceDarkMode ? "text-white" : "";

  const subtitleTextClasses = forceDarkMode
    ? "text-white/75"
    : "text-gray-600/90 dark:text-gray-400/90";

  const suffixClasses = forceDarkMode ? "text-white/90" : "";

  // Only render if there's content to show
  const hasHeadline =
    headline?.prefix || headline?.highlight || headline?.suffix;
  const hasSubtitle = subtitle;

  if (!hasHeadline && !hasSubtitle) {
    return null;
  }

  return (
    <div className={cn("mb-8 text-center lg:mb-12", className)}>
      {hasHeadline && (
        <div
          className={cn(
            "transform transition-all duration-700",
            containerClassName,
          )}
        >
          <h2
            className={cn(
              baseHeadlineClasses,
              headlineTextClasses,
              headlineClassName,
            )}
          >
            {headline?.prefix && <>{headline.prefix} </>}
            {headline?.highlight && (
              <AuroraText colors={gradientColors} className="inline-block">
                {headline.highlight}
              </AuroraText>
            )}
            {headline?.suffix && (
              <>
                {" "}
                <span className={suffixClasses}>{headline.suffix}</span>
              </>
            )}
          </h2>
        </div>
      )}

      {hasSubtitle && (
        <div className="transform transition-all delay-200 duration-700">
          <p
            className={cn(
              baseSubtitleClasses,
              subtitleTextClasses,
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
};
