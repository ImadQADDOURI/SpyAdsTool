import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { AuroraText } from "./landingPage/hero/AuroraText";

interface TitleSectionProps {
  // Row 1 props
  icon?: LucideIcon;
  badgeText?: string;
  iconColor?: string;

  // Row 2 props
  image?: LucideIcon;
  imageColor?: string;
  highlightedText?: string;
  remainingTitle?: string;
  auroraColors?: string[];

  // Row 3 props
  description?: string;

  // Styling props
  className?: string;
}

export default function TitleSection({
  icon: Icon,
  badgeText,
  iconColor = "text-purple-500 dark:text-purple-400",
  image: ImageIcon,
  imageColor = "text-gray-700 dark:text-gray-300",
  highlightedText,
  remainingTitle,
  auroraColors = ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  description,
  className,
}: TitleSectionProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl space-y-6 px-2 py-8 text-center",
        className,
      )}
    >
      {/* Row 1: Icon + Badge */}
      {(Icon || badgeText) && (
        <div className="flex items-center justify-center gap-4">
          {Icon && <Icon className={cn("h-6 w-6", iconColor)} />}
          {badgeText && (
            <Badge
              variant="secondary"
              className="border border-purple-200/50 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 text-sm font-semibold text-purple-500 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-purple-800/50 dark:from-purple-950/50 dark:to-blue-950/50 dark:text-purple-300"
            >
              {badgeText}
            </Badge>
          )}
        </div>
      )}

      {/* Row 2: Image + Title with Aurora Text */}
      {(ImageIcon || highlightedText || remainingTitle) && (
        <div className="flex items-start justify-center gap-5">
          {ImageIcon && (
            <ImageIcon className={cn("h-11 w-11 flex-shrink-0", imageColor)} />
          )}
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100 md:text-4xl lg:text-5xl">
            {highlightedText && (
              <AuroraText colors={auroraColors}>{highlightedText}</AuroraText>
            )}
            {highlightedText && remainingTitle && " "}
            {remainingTitle && (
              <span className="text-gray-900 dark:text-gray-100">
                {remainingTitle}
              </span>
            )}
          </h1>
        </div>
      )}

      {/* Row 3: Description + Separation Line */}
      {description && (
        <div className="space-y-6">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
            {description}
          </p>
          <div className="flex justify-center">
            <div className="h-0.5 w-40 rounded-full bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"></div>
          </div>
        </div>
      )}
    </div>
  );
}
