// @/components/adLibrary/microComponents/DisplayPixelPlatformPayment.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { detectPixelPlatformPayment } from "@/actions/detectPixelPlatformPayment";
import {
  isNonTrackableWebsite,
  paymentDetectors,
  platformDetectors,
  trackingPixelDetectors,
} from "@/utils/Scrape_Detectorpatterns_NonTrackableWebsites";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileScan,
  FileWarning,
  Info,
  Layers,
  Link2Off,
  Radar,
  Radio,
  ScanSearch,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Loading } from "./Loading";

const maxFeatures = 7; // max number of features to display for each Pixel, Platform, Payment

interface TrackingDetectorProps {
  url?: string | undefined;
  usePuppeteer?: boolean;
  keepBrowserOpen?: boolean;
  useCache?: boolean;
  dynamicTimeout?: number;
  autoDetect?: boolean;
}

interface DetectionResult {
  pixels: string[];
  platforms: string[];
  payments: string[];
}

export default function DisplayPixelPlatformPayment({
  url,
  usePuppeteer,
  keepBrowserOpen,
  useCache,
  dynamicTimeout,
  autoDetect = false,
}: TrackingDetectorProps) {
  const [detectedFeatures, setDetectedFeatures] = useState<DetectionResult>({
    pixels: [],
    platforms: [],
    payments: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState({
    pixels: 0,
    platforms: 0,
    payments: 0,
  });

  useEffect(() => {
    if (autoDetect && componentRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            detectFeatures();
          }
        },
        { threshold: 1.0 },
      );

      observer.observe(componentRef.current);

      return () => observer.disconnect();
    }
  }, [autoDetect, url]);

  const detectFeatures = async () => {
    if (!url || isLoading || isNonTrackableWebsite(url)) return;

    setIsLoading(true);
    try {
      const result = await detectPixelPlatformPayment(url);
      setDetectedFeatures(result);
      setError(null);
      setIsAnalyzed(true);
    } catch (err) {
      console.error("Detection failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze the website",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryIcons = (
    category: keyof DetectionResult,
    icon: React.ReactNode,
    label: string,
  ) => {
    const features = detectedFeatures[category];
    const startIndex = currentIndex[category];
    const visibleFeatures = features.slice(
      startIndex,
      startIndex + maxFeatures,
    );

    return (
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 p-1.5 text-gray-700 transition-colors duration-300 hover:bg-white/40 dark:text-gray-200">
                {icon}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {!isAnalyzed ? (
          <span className="w-20 text-xs font-medium text-gray-700 dark:text-gray-200">
            {label}
          </span>
        ) : (
          <div className="flex w-20 items-center space-x-1">
            {features.length === 0 ? (
              <XCircle className="h-4 w-4 text-gray-400" />
            ) : (
              <>
                {features.length > maxFeatures && startIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex({
                        ...currentIndex,
                        [category]: startIndex - 1,
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                {visibleFeatures.map((featureName, index) => {
                  const feature = [
                    ...trackingPixelDetectors,
                    ...platformDetectors,
                    ...paymentDetectors,
                  ].find((d) => d.name === featureName);
                  return (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 p-1 transition-all duration-300 hover:scale-110 hover:bg-white/40">
                            {feature && feature.icon ? (
                              <Image
                                src={feature.icon}
                                alt={featureName}
                                width={20}
                                height={20}
                              />
                            ) : (
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                {featureName.charAt(0)}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{featureName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
                {features.length > maxFeatures &&
                  startIndex < features.length - maxFeatures && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex({
                          ...currentIndex,
                          [category]: startIndex + 1,
                        });
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const getComponentStyle = () => {
    if (!url) {
      return "bg-gray-100 dark:bg-gray-800";
    } else if (isNonTrackableWebsite(url)) {
      return "bg-gray-100 dark:bg-gray-800";
    } else {
      return "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer hover:from-purple-100 hover:to-pink-100 dark:hover:from-gray-700 dark:hover:to-gray-600";
    }
  };

  const getAnalyzeIcon = () => {
    if (!url) {
      return <Link2Off className="h-8 w-8 text-gray-400" />;
    } else if (isNonTrackableWebsite(url)) {
      return <ShieldAlert className="h-8 w-8 text-gray-400" />;
    } else {
      return <ScanSearch className="h-8 w-8 text-purple-500" />;
    }
  };

  if (error) {
    return (
      <div className="flex items-center rounded-lg bg-red-50 p-2 text-red-500 dark:bg-red-900 dark:text-red-200">
        <AlertCircle className="mr-2 h-5 w-5" /> {error}
      </div>
    );
  }

  return (
    <div
      ref={componentRef}
      onClick={
        !isAnalyzed && url && !isNonTrackableWebsite(url)
          ? detectFeatures
          : undefined
      }
      className={`flex items-center justify-between rounded-lg px-0 py-0.5 transition-all duration-300 ${getComponentStyle()}`}
    >
      <div className="flex flex-1 flex-col space-y-0 pl-1">
        {renderCategoryIcons("pixels", <Radio className="h-5 w-5" />, "Pixel")}
        {renderCategoryIcons(
          "platforms",
          <Layers className="h-5 w-5" />,
          "Platform",
        )}
        {renderCategoryIcons(
          "payments",
          <CreditCard className="h-5 w-5" />,
          "Payment",
        )}
      </div>
      <div className="flex items-center justify-center pr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-all duration-300 hover:bg-white/40 ${isAnalyzed ? "opacity-0" : "opacity-100"}`}
              >
                {isLoading ? <Loading size="small" /> : getAnalyzeIcon()}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!url
                  ? "No URL to analyze"
                  : isNonTrackableWebsite(url)
                    ? "This is a known platform where tracking is not applicable"
                    : "Analyze the Pixels, Platforms & Payments used in the website"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
