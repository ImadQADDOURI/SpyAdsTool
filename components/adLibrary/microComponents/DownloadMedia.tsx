import React from "react";
import { saveAs } from "file-saver";
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
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const openVideoInNewTab = (url: string) => {
    window.open(url, "_blank");
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
                className="h-8 border border-indigo-200 bg-gradient-to-r from-indigo-50/80 to-indigo-100/80 pl-2 pr-3 text-xs font-medium transition-colors duration-200 hover:from-indigo-100/90 hover:to-indigo-200/90 dark:border-indigo-700 dark:from-indigo-900/50 dark:to-indigo-800/50 dark:hover:from-indigo-800/60 dark:hover:to-indigo-700/60"
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
                    downloadImage(
                      item.original_image_url!,
                      "original_image.jpg",
                    )
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
                    downloadImage(item.resized_image_url!, "resized_image.jpg")
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
                    downloadImage(
                      item.watermarked_resized_image_url!,
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
                    downloadImage(
                      item.video_preview_image_url!,
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
                  onClick={() => openVideoInNewTab(item.video_sd_url!)}
                />
              )}
              {item.video_hd_url && (
                <DownloadMenuItem
                  label="HD Video"
                  icon={
                    <Video className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() => openVideoInNewTab(item.video_hd_url!)}
                />
              )}
              {item.watermarked_video_sd_url && (
                <DownloadMenuItem
                  label="Watermarked SD Video"
                  icon={
                    <Video className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  }
                  onClick={() =>
                    openVideoInNewTab(item.watermarked_video_sd_url!)
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
                    openVideoInNewTab(item.watermarked_video_hd_url!)
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
