"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

import {
  affiliateConfig,
  AffiliateLink,
  affiliateLinks,
} from "@/config/affiliateLinks";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AffiliateLinks() {
  const [open, setOpen] = useState(false);
  const [visibleLinks, setVisibleLinks] = useState<AffiliateLink[]>([]);
  const [popoverLinks, setPopoverLinks] = useState<AffiliateLink[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine how many links to show based on config or responsive calculation
  useEffect(() => {
    // If maxNavbarLinks is set to a specific number, use that
    if (affiliateConfig.maxNavbarLinks >= 0) {
      const maxLinks = Math.min(
        affiliateConfig.maxNavbarLinks,
        affiliateLinks.length,
      );
      setVisibleLinks(affiliateLinks.slice(0, maxLinks));
      setPopoverLinks(affiliateLinks);
      return;
    }

    // Otherwise, implement responsive calculation logic
    setVisibleLinks(affiliateLinks.slice(0, 2));
    setPopoverLinks(affiliateLinks);

    // Add resize listener here for responsive calculation if needed
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full max-w-full items-center gap-2 overflow-hidden"
    >
      {/* 🔗 Main affiliate links visible in navbar */}
      {visibleLinks.map((link) => (
        <AffiliateButton key={link.id} link={link} />
      ))}

      {/* 🔽 Popover for additional links */}
      {affiliateLinks.length > visibleLinks.length && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 transition-all hover:shadow-md dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
            {open ? (
              <ChevronUp className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="grid w-full gap-2 p-3">
            <div className="mb-1">
              <h3 className="text-lg font-semibold">Affiliate Links</h3>
              <p className="text-sm text-muted-foreground">
                Special offers and discounts from our partners
              </p>
            </div>

            <div className="grid gap-2">
              {popoverLinks.map((link) => (
                <AffiliatePopoverItem key={link.id} link={link} />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

// 🔘 Individual affiliate button component for navbar
function AffiliateButton({ link }: { link: AffiliateLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex items-center gap-2 rounded-lg px-1 py-1",
        "text-sm font-medium transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        "border border-gray-200 dark:border-gray-700",
        "max-w-xs overflow-hidden",
      )}
      style={{
        background: `linear-gradient(135deg, ${link.gradient.from}20, ${link.gradient.to}30)`,
      }}
      aria-label={`${link.title}: ${link.description}`}
    >
      {/* Icon with stronger gradient background */}
      <span
        className="inline-flex flex-shrink-0 rounded-md p-1"
        style={{
          background: `linear-gradient(135deg, ${link.gradient.from}, ${link.gradient.to})`,
        }}
      >
        <link.icon className="h-4 w-4 text-white" />
      </span>

      {/* Content container */}
      <div className="flex flex-col overflow-hidden">
        {/* Title with discount code and external icon */}
        <div className="flex items-center gap-1">
          <span className="truncate font-medium">{link.title}</span>
          {link.discountCode && (
            <span
              className="flex-shrink-0 rounded px-1 py-0.5 text-xs font-medium text-white"
              style={{
                background: `linear-gradient(135deg, ${link.gradient.from}, ${link.gradient.to})`,
              }}
            >
              {link.discountCode}
            </span>
          )}
          {/* <ExternalLink className="h-3 w-3 flex-shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" /> */}
        </div>

        {/* Description with truncation */}
        <span className="truncate text-xs text-gray-600 dark:text-gray-300">
          {link.description}
        </span>
      </div>
    </a>
  );
}

// 🔘 Enhanced affiliate item for popover - styled like tools popover
function AffiliatePopoverItem({ link }: { link: AffiliateLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-start gap-3 rounded-lg p-2 transition-all",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      {/* Icon with gradient background */}
      <span
        className="mt-0.5 inline-flex flex-shrink-0 rounded-md p-2"
        style={{
          background: `linear-gradient(135deg, ${link.gradient.from}, ${link.gradient.to})`,
        }}
      >
        <link.icon className="h-4 w-4 text-white" />
      </span>

      {/* Content container */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{link.title}</span>

          {/* Discount code badge */}
          {link.discountCode && (
            <span
              className="rounded px-1.5 py-0.5 text-xs font-medium text-white"
              style={{
                background: `linear-gradient(135deg, ${link.gradient.from}, ${link.gradient.to})`,
              }}
            >
              {link.discountCode}
            </span>
          )}

          {/* External link indicator */}
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </div>

        {/* Description */}
        <span className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
          {link.description}
        </span>
      </div>
    </a>
  );
}
