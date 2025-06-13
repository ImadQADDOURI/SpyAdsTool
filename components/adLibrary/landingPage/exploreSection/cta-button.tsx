"use client";

import type React from "react";
import {
  ArrowRight,
  Download,
  ExternalLink,
  Package,
  Search,
  Store,
} from "lucide-react";

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: "arrow" | "download" | "external" | "search" | "store" | "package";
  disabled?: boolean;
  className?: string;
  href?: string;
}

const iconMap = {
  arrow: ArrowRight,
  download: Download,
  external: ExternalLink,
  search: Search,
  store: Store,
  package: Package,
};

export function CTAButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  className = "",
  href,
}: CTAButtonProps) {
  const IconComponent = icon ? iconMap[icon] : null;

  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-violet-500 via-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-violet-500/25 focus:ring-violet-500",
    secondary:
      "bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-pink-500/25 focus:ring-pink-500",
    outline:
      "border-2 border-white/20 text-white hover:bg-white/10 focus:ring-white/50",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {children}
      {IconComponent && (
        <IconComponent size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
