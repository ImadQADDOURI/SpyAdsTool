import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, ExternalLink, MoreVertical } from "lucide-react";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MediaItem {
  link_url?: string;
}

interface Snapshot {
  link_url?: string;
  cards?: MediaItem[];
  page_id?: string;
  page_profile_uri?: string;
}

export function AdOptions({ ad }: { ad: AdData }) {
  const { ad_archive_id, snapshot } = ad;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ad_archive_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const OptionItem = ({
    icon,
    urlIcon,
    label,
    href,
    disabled,
  }: {
    icon: string;
    urlIcon?: string;
    label: string;
    href?: string;
    disabled?: boolean;
  }) => {
    const className = `
      group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm
      transition-colors duration-150
      ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-accent/50 cursor-pointer active:bg-accent/70"
      }
    `;

    const content = (
      <>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-white shadow-sm dark:from-purple-900/40 dark:to-transparent">
          {urlIcon ? (
            <div className="relative h-full w-full overflow-hidden rounded-full border border-purple-600 dark:border-purple-50">
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
        <span className="flex-grow font-medium">{label}</span>
        <ExternalLink
          className={`h-4 w-4 transition-all duration-150 ${
            disabled
              ? "text-muted-foreground/30"
              : "text-muted-foreground/50 group-hover:text-muted-foreground/70"
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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-8 w-8 rounded-full p-0 transition-colors duration-150 hover:bg-accent/50 hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-accent active:bg-accent/70"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 border border-border/50 bg-background/95 p-2 shadow-lg backdrop-blur-sm dark:bg-background/95"
        sideOffset={5}
      >
        {/* Ad ID Section */}
        <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Library ID:
          </span>
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground/70">
            {ad_archive_id}
          </code>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-6 w-6 p-0 transition-colors duration-150 hover:bg-accent/50"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Meta Section */}
        <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground">
          Meta
        </DropdownMenuLabel>

        <OptionItem
          icon="meta.svg"
          label="View on Meta Ad Library"
          href={`https://www.facebook.com/ads/library/?id=${ad_archive_id}`}
        />

        <OptionItem
          icon="meta.svg"
          urlIcon={snapshot.page_profile_picture_url || ""}
          label="View All Page Ads"
          href={snapshot.page_id ? `/adlibrary/${snapshot.page_id}` : undefined}
          disabled={!snapshot.page_id}
        />

        <OptionItem
          icon="facebook.svg"
          label="Go to Facebook Page"
          href={snapshot.page_profile_uri}
          disabled={!snapshot.page_profile_uri}
        />

        {domain && (
          <>
            <DropdownMenuSeparator className="my-1.5" />

            {/* Analytics Section */}
            <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground">
              Analytics
            </DropdownMenuLabel>

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
            />

            <DropdownMenuSeparator className="my-1.5" />

            {/* Store Section */}
            <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground">
              Store
            </DropdownMenuLabel>

            <OptionItem
              icon="shopify.svg"
              label="Best Selling Products"
              href={`https://${domain}/collections/all?sort_by=best-selling`}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdOptions;
