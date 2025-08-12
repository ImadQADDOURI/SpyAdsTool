import React, { memo, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import SubscriptionAccessGuard from "../subscription/SubscriptionAccessGuard";
import DownloadMedia from "./DownloadMedia";
import ExpandableText from "./expandableText";

interface RenderMediaProps {
  snapshot: any;
  compact?: boolean;
}

// 🎬 Video Player Component - Lazy loaded for performance
const VideoPlayer: React.FC<{
  item: any;
  index: number;
  onPlay: () => void;
  isPlaying: boolean;
  compact?: boolean;
}> = memo(({ item, index, onPlay, isPlaying, compact = false }) => {
  if (!item.video_preview_image_url) return null;

  return (
    <div
      className={`relative bg-gray-100 dark:bg-gray-900 ${compact ? "w-full" : "aspect-square w-full"}`}
    >
      {!isPlaying ? (
        // 🖼️ Preview image with play button
        <>
          <Image
            src={item.video_preview_image_url}
            alt={`Video preview ${index + 1}`}
            {...(compact
              ? {
                  width: 0,
                  height: 0,
                  sizes: "100vw",
                  style: { width: "100%", height: "auto" },
                }
              : {
                  fill: true,
                  style: { objectFit: "contain" },
                })}
            unoptimized
            priority={false}
          />
          <button
            onClick={onPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-200 hover:bg-black/30"
            aria-label="Play video"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-200 hover:scale-110">
              <Play
                className="ml-1 h-8 w-8 text-gray-800"
                fill="currentColor"
              />
            </div>
          </button>
        </>
      ) : (
        // 🎥 Actual video player
        <video
          src={item.video_sd_url || undefined}
          controls
          autoPlay
          muted
          className={compact ? "h-auto w-full" : "h-full w-full object-contain"}
          onError={() =>
            console.warn(`Video failed to load: ${item.video_sd_url}`)
          }
        />
      )}
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";

export const RenderMedia: React.FC<RenderMediaProps> = memo(
  ({ snapshot, compact = false }) => {
    // 🎭 State for video playback
    const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set());

    // 📊 Memoized media items
    const mediaItems = useMemo(
      () => [
        ...(snapshot?.cards || []),
        ...(snapshot?.images || []),
        ...(snapshot?.videos || []),
      ],
      [snapshot],
    );

    // 🎮 Video play handler
    const handleVideoPlay = useCallback((index: number) => {
      setPlayingVideos((prev) => new Set(prev).add(index));
    }, []);

    // 📝 Text truncation utility
    const truncateText = useCallback((text: string, maxLength: number) => {
      return text.length > maxLength
        ? text.slice(0, maxLength - 1) + "…"
        : text;
    }, []);

    // 🛡️ Early return if no media
    if (mediaItems.length === 0) return null;

    return (
      <div className="overflow-hidden rounded-lg bg-gray-50 shadow-sm dark:bg-gray-800">
        <Carousel className="relative w-full">
          <CarouselContent>
            {mediaItems.map((item, index) => (
              <CarouselItem
                key={`${index}-${item.resized_image_url || item.video_preview_image_url}`}
              >
                {/* 🖼️ Media Content */}
                <div
                  className={`relative bg-gray-100 dark:bg-gray-900 ${compact ? "w-full" : "aspect-square w-full"}`}
                >
                  {item.video_preview_image_url ? (
                    <VideoPlayer
                      item={item}
                      index={index}
                      onPlay={() => handleVideoPlay(index)}
                      isPlaying={playingVideos.has(index)}
                      compact={compact}
                    />
                  ) : item.resized_image_url ? (
                    <Image
                      src={item.resized_image_url}
                      alt={item.title || `Ad image ${index + 1}`}
                      {...(compact
                        ? {
                            width: 0,
                            height: 0,
                            sizes: "100vw",
                            style: { width: "100%", height: "auto" },
                          }
                        : {
                            fill: true,
                            style: { objectFit: "contain" },
                          })}
                      unoptimized
                      priority={index === 0} // Only prioritize first image
                    />
                  ) : null}
                </div>

                {/* 📝 Text Content - hidden in compact mode */}
                {!compact && (
                  <div className="my-1 space-y-1 p-2">
                    <ExpandableText
                      text={item.caption || snapshot?.caption || ""}
                      className="text-xs font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                      singleLine={true}
                      showIcon={true}
                    />

                    <ExpandableText
                      text={item.title || snapshot?.title || ""}
                      className="text-xs text-gray-700 dark:text-gray-300"
                      singleLine={true}
                      showIcon={true}
                    />

                    <ExpandableText
                      text={
                        item.link_description ||
                        snapshot?.link_description ||
                        ""
                      }
                      className="text-xs text-gray-600 dark:text-gray-400"
                      singleLine={true}
                      showIcon={true}
                    />

                    <ExpandableText
                      text={item.body || snapshot?.body?.text || ""}
                      className="text-xs text-gray-700 dark:text-gray-300"
                      singleLine={true}
                      showIcon={true}
                    />
                  </div>
                )}

                <SubscriptionAccessGuard>
                  {/* 🎯 Action Buttons - require subscription */}
                  <div
                    className={`flex items-center space-x-2 ${compact ? "p-2" : "px-2"}`}
                  >
                    <DownloadMedia item={item} />

                    {(item.link_url || snapshot?.link_url) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 flex-grow border-gray-200 bg-white text-xs text-gray-800 transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                              asChild
                            >
                              <a
                                href={
                                  item.link_url || snapshot?.link_url || "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                              >
                                <span className="truncate">
                                  {truncateText(
                                    item.cta_text ||
                                      snapshot?.cta_text ||
                                      "Learn More",
                                    20,
                                  )}
                                </span>
                                <ExternalLink className="ml-1 h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="border border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                          >
                            <p>
                              {item.cta_text ||
                                snapshot?.cta_text ||
                                "Learn More"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </SubscriptionAccessGuard>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 🎛️ Navigation controls - only show if multiple items */}
          {mediaItems.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 border-gray-200 bg-white text-gray-800 transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 border-gray-200 bg-white text-gray-800 transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700" />
            </>
          )}
        </Carousel>
      </div>
    );
  },
);

// 🏷️ Display name for debugging
RenderMedia.displayName = "RenderMedia";

export default RenderMedia;
