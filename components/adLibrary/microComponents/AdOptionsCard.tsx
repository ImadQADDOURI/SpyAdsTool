import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Clock, Copy, ExternalLink, Eye, Star } from "lucide-react";

import { AdData } from "@/types/ad";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MediaItem {
  link_url?: string;
}

export function AdOptionsCard({ ad }: { ad: AdData }) {
  const { ad_archive_id, snapshot } = ad;
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // ✨ Animate card in on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 🔍 Extract domain from URL - important for analytics links
  const getDomain = (): string | null => {
    try {
      const url = snapshot.link_url || snapshot.cards?.[0]?.link_url;
      if (!url) return null;
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      return null;
    }
  };

  const domain = getDomain();

  // 📋 Handle copy ID to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(ad_archive_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔗 Link option item component with enhanced hover effects
  const OptionItem = ({
    icon,
    urlIcon,
    label,
    href,
    disabled,
    highlight = false,
  }: {
    icon: string;
    urlIcon?: string;
    label: string;
    href?: string;
    disabled?: boolean;
    highlight?: boolean;
  }) => {
    const className = `
      group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm
      transition-all duration-200
      ${highlight ? "bg-gradient-to-r from-purple-50/30 to-transparent dark:from-purple-900/10 dark:to-transparent" : ""}
      ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-accent/60 hover:translate-x-0.5 cursor-pointer active:bg-accent/80"
      }
    `;

    const content = (
      <>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-white shadow-sm dark:from-purple-900/40 dark:to-transparent">
          {urlIcon ? (
            <div className="relative h-full w-full overflow-hidden rounded-full border border-purple-600 dark:border-purple-100">
              <Image
                src={urlIcon}
                alt=""
                fill
                className={`object-cover ${
                  disabled
                    ? "opacity-50"
                    : "transition-transform duration-200 group-hover:scale-110"
                }`}
              />
            </div>
          ) : (
            <Image
              src={`/icons/${icon}`}
              alt=""
              width={24}
              height={24}
              className={
                disabled
                  ? "opacity-50"
                  : "transition-transform duration-200 group-hover:scale-110"
              }
            />
          )}
        </div>
        <span
          className={`flex-grow font-medium ${highlight ? "text-purple-700 dark:text-purple-300" : ""}`}
        >
          {label}
        </span>
        <ExternalLink
          className={`h-4 w-4 transition-all duration-200 ${
            disabled
              ? "text-muted-foreground/30"
              : "text-muted-foreground/50 group-hover:scale-110 group-hover:text-purple-500"
          } `}
        />
      </>
    );

    if (disabled || !href) {
      return <div className={className}>{content}</div>;
    }

    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </Link>
    );
  };

  // 🎯 Card section component with enhanced styling
  const CardSection = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 px-3 py-1">
        {icon}
        <h3 className="text-xs font-semibold text-purple-700 dark:text-purple-300">
          {title}
        </h3>
      </div>
      <div className="space-y-0.5 rounded-md bg-accent/20 py-1">{children}</div>
    </div>
  );

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hidden md:block"
      >
        <Card className="overflow-hidden border border-purple-100/50 bg-background/95 shadow-md backdrop-blur-sm dark:border-purple-900/30 dark:bg-background/95">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-600" />

          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Badge
                variant="outline"
                className="bg-purple-50 px-1.5 py-0 text-xs font-normal text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
              >
                Library ID
              </Badge>
              <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground/70">
                {ad_archive_id}
              </code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-7 w-7 rounded-full p-0 transition-all duration-150 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{copied ? "Copied!" : "Copy ID"}</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 p-3 pt-0">
            {/* Meta Section */}
            <CardSection
              title="Meta"
              icon={<Star className="h-3.5 w-3.5 text-purple-500" />}
            >
              <OptionItem
                icon="meta.svg"
                label="View on Meta Ad Library"
                href={`https://www.facebook.com/ads/library/?id=${ad_archive_id}`}
              />
              <OptionItem
                icon="meta.svg"
                urlIcon={snapshot.page_profile_picture_url || ""}
                label="View All Page Ads"
                href={
                  snapshot.page_id
                    ? `/adlibrary/${snapshot.page_id}`
                    : undefined
                }
                disabled={!snapshot.page_id}
                highlight={true}
              />
              <OptionItem
                icon="facebook.svg"
                label="Go to Facebook Page"
                href={snapshot.page_profile_uri}
                disabled={!snapshot.page_profile_uri}
              />
            </CardSection>

            {domain && (
              <>
                <Separator className="my-2 bg-purple-100/50 dark:bg-purple-900/20" />

                {/* Analytics Section */}
                <CardSection
                  title="Analytics"
                  icon={<Eye className="h-3.5 w-3.5 text-purple-500" />}
                >
                  <OptionItem
                    icon="smwb.svg"
                    label="SimilarWeb Analytics"
                    href={`https://www.similarweb.com/website/${domain}`}
                  />
                  <OptionItem
                    icon="semrush2.svg"
                    label="Semrush Analytics"
                    href={`https://www.semrush.com/analytics/overview/?q=${domain}`}
                  />
                  <OptionItem
                    icon="google-trends.svg"
                    label="Google Trends"
                    href={`https://trends.google.com/trends/explore?q=${domain}`}
                    highlight={true}
                  />
                </CardSection>

                <Separator className="my-2 bg-purple-100/50 dark:bg-purple-900/20" />

                {/* Store Section */}
                <CardSection
                  title="Store"
                  icon={<Clock className="h-3.5 w-3.5 text-purple-500" />}
                >
                  <OptionItem
                    icon="shopify.svg"
                    label="Best Selling Products"
                    href={`https://${domain}/collections/all?sort_by=best-selling`}
                  />
                </CardSection>
              </>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-center p-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-purple-500">•</span> Ad Options
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}

export default AdOptionsCard;
