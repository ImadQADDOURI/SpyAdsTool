"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * CTA Button Props
 */
interface CTAButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Link URL (renders as anchor) */
  href?: string;
  /** Click handler (renders as button) */
  onClick?: () => void;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Icon position */
  iconPosition?: "left" | "right";
  /** Button variant */
  variant?: "default" | "outline" | "ghost";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Force dark mode styling */
  forceDarkMode?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Enable spinning border animation */
  animate?: boolean;
  /** ARIA label for accessibility */
  "aria-label"?: string;
}

/**
 * Customizable CTA Button with gradient animations
 *
 * @example
 * \`\`\`tsx
 * <CTAButton href="/signup" icon={ArrowRight}>
 *   Get Started
 * </CTAButton>
 * \`\`\`
 */
const CTAButton = React.memo(
  React.forwardRef<HTMLElement, CTAButtonProps>(
    (
      {
        children,
        href,
        onClick,
        icon: Icon,
        iconPosition = "left",
        variant = "default",
        size = "md",
        forceDarkMode = false,
        disabled = false,
        className,
        animate = true,
        "aria-label": ariaLabel,
        ...props
      },
      ref,
    ) => {
      // Size configurations
      const sizes = {
        sm: "px-6 py-2 text-sm gap-1.5",
        md: "px-8 py-3 text-base gap-2",
        lg: "px-10 py-4 text-lg gap-2.5",
      };

      // Base button styles
      const baseStyles = cn(
        "group relative inline-flex items-center justify-center w-full h-full rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        sizes[size],
        className,
      );

      // Gradient styles based on variant
      const variantStyles = {
        default: forceDarkMode
          ? "border border-white/10 bg-gradient-to-tr from-blue-500/10 via-purple-500/20 to-pink-500/10 text-white hover:from-blue-500/20 hover:via-purple-500/30 hover:to-pink-500/20"
          : "border border-black/10 bg-gradient-to-tr from-blue-300/20 via-purple-400/30 to-pink-300/20 text-gray-900 hover:from-blue-300/30 hover:via-purple-400/40 hover:to-pink-300/30 dark:border-white/10 dark:from-blue-500/10 dark:via-purple-500/20 dark:to-pink-500/10 dark:text-white dark:hover:from-blue-500/20 dark:hover:via-purple-500/30 dark:hover:to-pink-500/20",

        outline: forceDarkMode
          ? "border-2 border-purple-400/50 bg-transparent text-white hover:border-purple-300 hover:bg-purple-500/10"
          : "border-2 border-purple-400/50 bg-transparent text-gray-900 hover:border-purple-500 hover:bg-purple-50 dark:border-purple-400/50 dark:text-white dark:hover:border-purple-300 dark:hover:bg-purple-500/10",

        ghost: forceDarkMode
          ? "border border-transparent bg-transparent text-white hover:bg-purple-500/10"
          : "border border-transparent bg-transparent text-gray-900 hover:bg-purple-50 dark:text-white dark:hover:bg-purple-500/10",
      };

      // Button content
      const content = (
        <>
          {Icon && iconPosition === "left" && (
            <Icon
              className="h-6 w-6 transition-transform group-hover:scale-110"
              aria-hidden="true"
            />
          )}
          <span>{children}</span>
          {Icon && iconPosition === "right" && (
            <Icon
              className="h-6 w-6 transition-transform group-hover:scale-110"
              aria-hidden="true"
            />
          )}
        </>
      );

      // Common props for both button and anchor
      const commonProps = {
        className: cn(baseStyles, variantStyles[variant]),
        disabled,
        "aria-label": ariaLabel,
        ...props,
      };

      // Animated wrapper for default variant
      if (variant === "default" && animate) {
        const Component = href ? "a" : "button";

        return (
          <div className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
            <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_33%,#EC4899_66%,#3B82F6_100%)]" />
            <div
              className={cn(
                "relative inline-flex h-full w-full rounded-full backdrop-blur-3xl",
                forceDarkMode ? "bg-gray-950" : "bg-white dark:bg-gray-950",
              )}
            >
              <Component
                ref={ref as any}
                href={href}
                onClick={onClick}
                type={href ? undefined : "button"}
                {...commonProps}
              >
                {content}
              </Component>
            </div>
          </div>
        );
      }

      // Standard button/anchor without animation
      const Component = href ? "a" : "button";

      return (
        <Component
          ref={ref as any}
          href={href}
          onClick={onClick}
          type={href ? undefined : "button"}
          {...commonProps}
        >
          {content}
        </Component>
      );
    },
  ),
);

CTAButton.displayName = "CTAButton";

export { CTAButton, type CTAButtonProps };
