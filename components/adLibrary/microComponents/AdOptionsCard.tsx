"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock, Copy, ExternalLink, Eye, Star } from "lucide-react";

import type { AdData } from "@/types/ad";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AdOptionsCard({ ad }: { ad: AdData }) {
  const { ad_archive_id, snapshot } = ad;
  const [copied, setCopied] = useState(false);

  // 🔍 Extract domain for analytics
  const getDomain = (): string | null => {
    try {
      const url = snapshot.link_url || snapshot.cards?.[0]?.link_url;
      if (!url) return null;
      return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      return null;
    }
  };

  const domain = getDomain();

  // 📋 Copy handler with feedback
  const handleCopy = async () => {
    await navigator.clipboard.writeText(ad_archive_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 🔗 Clean option item component
  const OptionItem = ({
    icon,
    urlIcon,
    label,
    href,
    disabled,
    primary = false,
  }: {
    icon: string;
    urlIcon?: string;
    label: string;
    href?: string;
    disabled?: boolean;
    primary?: boolean;
  }) => {
    const content = (
      <>
        <div className="relative h-5 w-5 flex-shrink-0 overflow-hidden rounded-full">
          {urlIcon ? (
            <Image
              src={urlIcon || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-110"
            />
          ) : (
            <Image
              src={`/icons/${icon}`}
              alt=""
              width={20}
              height={20}
              className="transition-transform duration-200 group-hover:scale-105"
            />
          )}
        </div>
        <span
          className={`flex-1 truncate text-sm ${primary ? "font-medium" : "font-normal"}`}
        >
          {label}
        </span>
        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-60" />
      </>
    );

    if (disabled || !href) {
      return (
        <div className="flex cursor-not-allowed items-center gap-2.5 px-2.5 py-2 opacity-40">
          {content}
        </div>
      );
    }

    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-accent/50 active:scale-[0.99] ${primary ? "bg-purple-50/50 dark:bg-purple-950/30" : ""} `}
      >
        {content}
      </Link>
    );
  };

  // 🎯 Section component
  const Section = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="min-w-0 flex-1">
      <div className="mb-3 flex items-center gap-2 px-1">
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
          {title}
        </h3>
      </div>
      <div className="space-y-1 rounded-xl bg-muted/30 p-2">{children}</div>
    </div>
  );

  return (
    <TooltipProvider>
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:shadow-md hover:ring-border">
        {/* ✨ Accent gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
        <CardContent className="p-4">
          {/* 🏷️ Enhanced Header */}
          <div className="mb-4 flex items-center gap-3">
            <Badge
              variant="secondary"
              className="border-purple-200/50 bg-gradient-to-r from-purple-100 to-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:border-purple-800/30 dark:from-purple-950/50 dark:to-purple-900/30 dark:text-purple-300"
            >
              Library ID
            </Badge>
            <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/50 px-2.5 py-0.5">
              <code className="font-mono text-xs text-muted-foreground">
                {ad_archive_id}
              </code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-6 w-6 rounded-md p-0 transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-950/50"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground/70 hover:text-purple-600" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Copy ID"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* 📱 Responsive sections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Meta */}
            <Section
              title="Meta"
              icon={<Star className="h-3.5 w-3.5 text-blue-500" />}
            >
              <OptionItem
                icon="meta.svg"
                label="Ad Library"
                href={`https://www.facebook.com/ads/library/?id=${ad_archive_id}`}
              />
              <OptionItem
                icon="meta.svg"
                urlIcon={snapshot.page_profile_picture_url || ""}
                label="All Page Ads"
                href={
                  snapshot.page_id
                    ? `/adsearch/${snapshot.page_id}?page_id=${snapshot.page_id}&active_status=ALL`
                    : undefined
                }
                disabled={!snapshot.page_id}
                primary={true}
              />
              <OptionItem
                icon="facebook.svg"
                label="Facebook Page"
                href={snapshot.page_profile_uri}
                disabled={!snapshot.page_profile_uri}
              />
            </Section>

            {domain && (
              <>
                {/* Analytics */}
                <Section
                  title="Analytics"
                  icon={<Eye className="h-3.5 w-3.5 text-emerald-500" />}
                >
                  <OptionItem
                    icon="smwb.svg"
                    label="SimilarWeb"
                    href={`https://www.similarweb.com/website/${domain}`}
                  />
                  <OptionItem
                    icon="semrush2.svg"
                    label="Semrush"
                    href={`https://www.semrush.com/analytics/overview/?q=${domain}`}
                  />
                  <OptionItem
                    icon="google-trends.svg"
                    label="Google Trends"
                    href={`https://trends.google.com/trends/explore?q=${domain}`}
                    primary={true}
                  />
                </Section>

                {/* Store */}
                <Section
                  title="Store"
                  icon={<Clock className="h-3.5 w-3.5 text-amber-500" />}
                >
                  <OptionItem
                    icon="shopify.svg"
                    label="Best Sellers"
                    href={`https://${domain}/collections/all?sort_by=best-selling`}
                  />
                </Section>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="text-purple-500">•</span> Ad Options
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

export default AdOptionsCard;
