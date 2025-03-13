import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, Play } from "lucide-react";

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

import DownloadMedia from "./DownloadMedia";
import ExpandableText from "./expandableText";

interface RenderMediaProps {
  snapshot: AdData["snapshot"];
}

export const RenderMedia: React.FC<RenderMediaProps> = ({ snapshot }) => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const mediaItems = [
    ...(snapshot.cards || []),
    ...(snapshot.images || []),
    ...(snapshot.videos || []),
  ];

  if (mediaItems.length === 0) return null;

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
  };

  return (
    <div className="overflow-hidden rounded-lg bg-gray-50 shadow-sm dark:bg-gray-800">
      <Carousel className="relative w-full">
        <CarouselContent>
          {mediaItems.map((item, index) => (
            <CarouselItem key={index} className="">
              {/* Media Content */}
              <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-900">
                {item.resized_image_url && (
                  <Image
                    src={item.resized_image_url}
                    alt={item.title || `Ad image ${index + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                    priority={false}
                  />
                )}
                {item.video_preview_image_url && (
                  <>
                    {playingVideo === index ? (
                      <video
                        src={item.video_sd_url || undefined}
                        controls
                        autoPlay
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <>
                        <Image
                          src={item.video_preview_image_url}
                          alt={`Video preview ${index + 1}`}
                          fill
                          style={{ objectFit: "contain" }}
                          unoptimized
                          priority={false}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-black bg-opacity-50 text-white transition-all duration-300 hover:bg-opacity-70"
                          onClick={() => setPlayingVideo(index)}
                        >
                          <Play className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Text Content */}
              <div className="my-1 space-y-1 p-2">
                <ExpandableText
                  text={item.caption || snapshot.caption || ""}
                  className="text-xs font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  singleLine={true}
                  showIcon={true}
                />

                <ExpandableText
                  text={item.title || snapshot.title || ""}
                  className="text-xs text-gray-700 dark:text-gray-300"
                  singleLine={true}
                  showIcon={true}
                />
                <ExpandableText
                  text={
                    item.link_description || snapshot.link_description || ""
                  }
                  className="text-xs text-gray-600 dark:text-gray-400"
                  singleLine={true}
                  showIcon={true}
                />
                <ExpandableText
                  text={item.body || snapshot.body?.text || ""}
                  className="text-xs text-gray-700 dark:text-gray-300"
                  singleLine={true}
                  showIcon={true}
                />

                {/* CTA and Download Buttons */}
                <div className="flex items-center space-x-2">
                  <DownloadMedia item={item} />
                  {(item.link_url || snapshot.link_url) && (
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
                              href={item.link_url || snapshot.link_url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center"
                            >
                              <span className="truncate">
                                {truncateText(
                                  item.cta_text ||
                                    snapshot.cta_text ||
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
                            {item.cta_text || snapshot.cta_text || "Learn More"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {mediaItems.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 border-gray-200 bg-white text-gray-800 transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 border-gray-200 bg-white text-gray-800 transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default RenderMedia;
