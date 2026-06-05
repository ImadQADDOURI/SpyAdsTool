// @/components/adTool/sharedComponents/DownloadMedia.tsx
import React from "react";
import { DownloadCloud, Image, Video } from "lucide-react";

import { Media } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DownloadMediaProps {
  item: Media;
}

const DownloadMedia: React.FC<DownloadMediaProps> = ({ item }) => {
  // Construct the proxy endpoint URL with proper query parameters
  const proxyDownload = (remoteUrl: string, filename: string) => {
    const proxyUrl = `/api/download?url=${encodeURIComponent(remoteUrl)}&filename=${encodeURIComponent(
      filename,
    )}`;
    // Create an invisible anchor to trigger download
    const anchor = document.createElement("a");
    anchor.href = proxyUrl;
    // Some browsers use the "download" attribute if the resource is same-origin.
    // In our case, our API endpoint sets headers to force a download.
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-[50%] border border-indigo-200 bg-gradient-to-r from-indigo-50/80 to-indigo-100/80 pl-2 pr-3 text-xs font-medium transition-colors duration-200 hover:from-indigo-100/90 hover:to-indigo-200/90 dark:border-indigo-700 dark:from-indigo-900/50 dark:to-indigo-800/50 dark:hover:from-indigo-800/60 dark:hover:to-indigo-700/60"
              >
                <DownloadCloud className="mr-1 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                Media
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border border-purple-200 bg-white dark:border-purple-700 dark:bg-gray-800">
              {item.original_image_url && (
                <DownloadMenuItem
                  label="Original Image"
                  icon={
                    <Image className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    item.original_image_url &&
                    proxyDownload(item.original_image_url, "original_image.jpg")
                  }
                />
              )}
              {item.resized_image_url && (
                <DownloadMenuItem
                  label="Resized Image"
                  icon={
                    <Image className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    item.resized_image_url &&
                    proxyDownload(item.resized_image_url, "resized_image.jpg")
                  }
                />
              )}
              {item.watermarked_resized_image_url && (
                <DownloadMenuItem
                  label="Watermarked Image"
                  icon={
                    <Image className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    item.watermarked_resized_image_url &&
                    proxyDownload(
                      item.watermarked_resized_image_url,
                      "watermarked_image.jpg",
                    )
                  }
                />
              )}
              {item.video_preview_image_url && (
                <DownloadMenuItem
                  label="Video Thumbnail"
                  icon={
                    <Image className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    item.video_preview_image_url &&
                    proxyDownload(
                      item.video_preview_image_url,
                      "video_thumbnail.jpg",
                    )
                  }
                />
              )}
              {item.video_sd_url && (
                <DownloadMenuItem
                  label="SD Video"
                  icon={
                    <Video className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    item.video_sd_url &&
                    proxyDownload(item.video_sd_url, "video_sd.mp4")
                  }
                />
              )}
              {item.video_hd_url && (
                <DownloadMenuItem
                  label="HD Video"
                  icon={
                    <Video className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    item.video_hd_url &&
                    proxyDownload(item.video_hd_url, "video_hd.mp4")
                  }
                />
              )}
              {item.watermarked_video_sd_url && (
                <DownloadMenuItem
                  label="Watermarked SD Video"
                  icon={
                    <Video className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    item.watermarked_video_sd_url &&
                    proxyDownload(
                      item.watermarked_video_sd_url,
                      "watermarked_video_sd.mp4",
                    )
                  }
                />
              )}
              {item.watermarked_video_hd_url && (
                <DownloadMenuItem
                  label="Watermarked HD Video"
                  icon={
                    <Video className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    item.watermarked_video_hd_url &&
                    proxyDownload(
                      item.watermarked_video_hd_url,
                      "watermarked_video_hd.mp4",
                    )
                  }
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent className="border border-purple-200 bg-white text-gray-900 dark:border-purple-700 dark:bg-gray-800 dark:text-gray-100">
          <p>Download or View Media</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const DownloadMenuItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ label, icon, onClick }) => (
  <DropdownMenuItem
    onClick={onClick}
    className="flex items-center text-gray-700 hover:bg-purple-50 focus:bg-purple-100 dark:text-gray-300 dark:hover:bg-purple-900 dark:focus:bg-purple-800"
  >
    {icon}
    <span>{label}</span>
  </DropdownMenuItem>
);

export default DownloadMedia;
