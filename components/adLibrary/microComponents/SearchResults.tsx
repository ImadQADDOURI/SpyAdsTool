"use client";

import type React from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { VirtuosoMasonry } from "@virtuoso.dev/masonry";
import {
  BarChart,
  Download,
  Filter,
  Globe,
  Languages,
  Search,
  Zap,
} from "lucide-react";

import type { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";

import { AdCard } from "../AdCard";
import { Loading } from "./Loading";

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  totalCount: number | null;
  searchResults: AdData[] | null;
  hasNextPage: boolean;
  remainingCount: number | null;
  handleLoadMore: () => void;
}

// 🚀 Enhanced window width hook with SSR safety and performance optimizations
const useWindowWidth = () => {
  const [width, setWidth] = useState(() => {
    if (typeof window === "undefined") return 1024; // SSR fallback
    return window.innerWidth;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;
    let rafId: number;

    const handleResize = () => {
      // Cancel previous calls
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);

      // Debounce resize events for performance
      timeoutId = setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          const newWidth = window.innerWidth;
          setWidth((prevWidth) => {
            // Only update if width actually changed significantly (avoid micro-updates)
            return Math.abs(newWidth - prevWidth) > 10 ? newWidth : prevWidth;
          });
        });
      }, 100); // Reduced debounce time for better responsiveness
    };

    // Initial width check
    const initialWidth = window.innerWidth;
    if (Math.abs(initialWidth - width) > 10) {
      setWidth(initialWidth);
    }

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [width]);

  return width;
};

// 🚀 Enhanced scroll-based load more with intelligent prefetching
const useScrollLoadMore = (
  handleLoadMore: () => void,
  hasNextPage: boolean,
  isLoading: boolean,
) => {
  const loadMoreRef = useRef<boolean>(false);
  const lastTriggerRef = useRef<number>(0);

  useEffect(() => {
    if (!hasNextPage || isLoading) return;

    const handleScroll = () => {
      const now = Date.now();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate scroll progress (0-1)
      const scrollProgress = scrollTop / (documentHeight - windowHeight);

      // Intelligent trigger points based on content and viewport
      const viewportTrigger = windowHeight * 1.5; // 1.5 viewports ahead
      const progressTrigger = 0.75; // 75% scrolled
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      // Multiple trigger conditions for optimal UX
      const shouldTrigger =
        distanceFromBottom <= viewportTrigger || // Distance-based
        scrollProgress >= progressTrigger || // Progress-based
        distanceFromBottom <= 400; // Fallback distance

      // Prevent multiple rapid triggers (debounce 300ms)
      if (
        shouldTrigger &&
        !loadMoreRef.current &&
        now - lastTriggerRef.current > 300
      ) {
        loadMoreRef.current = true;
        lastTriggerRef.current = now;
        handleLoadMore();

        // Reset after a delay to allow for multiple loads
        setTimeout(() => {
          loadMoreRef.current = false;
        }, 1000);
      }
    };

    // High-performance scroll handler with RAF
    let rafId: number;
    const optimizedScrollHandler = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = 0;
      });
    };

    window.addEventListener("scroll", optimizedScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", optimizedScrollHandler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleLoadMore, hasNextPage, isLoading]);

  // Reset trigger when loading state changes
  useEffect(() => {
    if (!isLoading) {
      loadMoreRef.current = false;
    }
  }, [isLoading]);
};

// 🎯 Highly optimized FeaturePill component
const FeaturePill = memo(
  ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="feature-pill">
      <Icon className="feature-pill__icon" />
      <span className="feature-pill__text">{text}</span>

      <style jsx>{`
        .feature-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          background: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          transition: transform 0.15s ease-out;
          will-change: transform;
          transform: translateZ(0);
        }

        :global(.dark) .feature-pill {
          background: rgb(55 65 81);
        }

        .feature-pill:hover {
          transform: translate3d(0, -2px, 0);
        }

        .feature-pill__icon {
          height: 1rem;
          width: 1rem;
          color: #a855f7;
        }

        .feature-pill__text {
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  ),
);

FeaturePill.displayName = "FeaturePill";

// 🎯 Optimized InitialState component with lazy loading
const InitialState = memo(() => (
  <div className="initial-state">
    <div className="initial-state__content">
      <div className="initial-state__image">
        <Image
          src="/search-illustration.svg"
          alt="Search ads"
          width={400}
          height={300}
          priority
          loading="eager"
        />
      </div>

      <div className="initial-state__info">
        <h2 className="initial-state__title">Discover High-Performing Ads</h2>

        <p className="initial-state__description">
          Search across millions of ads with our powerful filters to find
          winning creatives, analyze performance, and get inspiration.
        </p>

        <div className="initial-state__tips">
          <h3 className="tips__title">
            <Zap className="tips__icon" />
            Quick Start Tips
          </h3>

          <ul className="tips__list">
            <li className="tips__item">
              <span className="tips__bullet" />
              Try broad searches first, then refine with filters
            </li>
            <li className="tips__item">
              <span className="tips__bullet" />
              Use the AI Creative Generator for multilingual variations
            </li>
            <li className="tips__item">
              <span className="tips__bullet" />
              Save interesting ads to your boards for later reference
            </li>
          </ul>
        </div>

        <div className="initial-state__features">
          <FeaturePill icon={Filter} text="10+ Filter Types" />
          <FeaturePill icon={BarChart} text="Performance Analytics" />
          <FeaturePill icon={Globe} text="Global Coverage" />
          <FeaturePill icon={Download} text="Media Download" />
        </div>
      </div>
    </div>

    <style jsx>{`
      .initial-state {
        margin: 0 auto;
        max-width: 112rem;
        padding: 2rem;
        border-radius: 1rem;
        background: white;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        animation: fadeIn 0.4s ease-out;
        transform: translateZ(0);
      }

      :global(.dark) .initial-state {
        background: rgb(31 41 55);
      }

      .initial-state__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }

      @media (min-width: 768px) {
        .initial-state__content {
          flex-direction: row;
        }
      }

      .initial-state__image {
        flex: 1;
      }

      .initial-state__info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .initial-state__title {
        font-size: clamp(1.5rem, 4vw, 1.875rem);
        font-weight: 700;
        color: rgb(31 41 55);
      }

      :global(.dark) .initial-state__title {
        color: white;
      }

      .initial-state__description {
        font-size: clamp(1rem, 2.5vw, 1.125rem);
        color: rgb(75 85 99);
        line-height: 1.6;
      }

      :global(.dark) .initial-state__description {
        color: rgb(209 213 219);
      }

      .initial-state__tips {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .tips__title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: clamp(1rem, 2.5vw, 1.125rem);
        font-weight: 600;
        color: #9333ea;
      }

      :global(.dark) .tips__title {
        color: #c084fc;
      }

      .tips__icon {
        height: 1.25rem;
        width: 1.25rem;
      }

      .tips__list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .tips__item {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        color: rgb(55 65 81);
        line-height: 1.5;
      }

      :global(.dark) .tips__item {
        color: rgb(156 163 175);
      }

      .tips__bullet {
        margin-top: 0.25rem;
        height: 0.5rem;
        width: 0.5rem;
        border-radius: 50%;
        background: #a855f7;
        flex-shrink: 0;
      }

      .initial-state__features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `}</style>
  </div>
));

InitialState.displayName = "InitialState";

// 🎯 Optimized EmptyState component
const EmptyState = memo(
  ({ onResetFilters }: { onResetFilters?: () => void }) => (
    <div className="empty-state">
      <div className="empty-state__content">
        <Image
          src="/no-results.svg"
          alt="No results found"
          width={300}
          height={200}
          loading="lazy"
        />

        <div className="empty-state__info">
          <h2 className="empty-state__title">No Ads Found</h2>

          <p className="empty-state__description">
            Your search didn&apos;t match any ads. Try adjusting your filters or
            searching with different criteria.
          </p>

          <div className="empty-state__suggestions">
            <FeaturePill icon={Filter} text="Try fewer filters" />
            <FeaturePill icon={Search} text="Broader search terms" />
            <FeaturePill icon={Globe} text="Different countries" />
            <FeaturePill icon={Languages} text="Other languages" />
          </div>

          {onResetFilters && (
            <Button
              variant="outline"
              className="empty-state__button"
              onClick={onResetFilters}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      <style jsx>{`
        .empty-state {
          margin: 0 auto;
          max-width: 112rem;
          padding: 2rem;
          border-radius: 1rem;
          background: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.4s ease-out;
          transform: translateZ(0);
        }

        :global(.dark) .empty-state {
          background: rgb(31 41 55);
        }

        .empty-state__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          text-align: center;
        }

        .empty-state__info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .empty-state__title {
          font-size: clamp(1.5rem, 4vw, 1.875rem);
          font-weight: 700;
          color: rgb(31 41 55);
        }

        :global(.dark) .empty-state__title {
          color: white;
        }

        .empty-state__description {
          max-width: 32rem;
          font-size: clamp(1rem, 2.5vw, 1.125rem);
          color: rgb(75 85 99);
          line-height: 1.6;
        }

        :global(.dark) .empty-state__description {
          color: rgb(209 213 219);
        }

        .empty-state__suggestions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }

        .empty-state__button {
          margin-top: 1rem;
          border-radius: 9999px;
          border-color: #a855f7;
          color: #9333ea;
          transition: all 0.15s ease-out;
        }

        .empty-state__button:hover {
          background: rgb(250 245 255);
          transform: translateY(-1px);
        }

        :global(.dark) .empty-state__button {
          border-color: #c084fc;
          color: #d8b4fe;
        }

        :global(.dark) .empty-state__button:hover {
          background: rgb(55 65 81);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  ),
);

EmptyState.displayName = "EmptyState";

// 🚀 Optimized ItemContent component for VirtuosoMasonry
const ItemContent = memo<{ data: AdData; index: number; context?: any }>(
  ({ data }) => (
    <div className="masonry-item">
      <AdCard ad={data} />

      <style jsx>{`
        .masonry-item {
          padding: 0.5rem;
          transform: translateZ(0);
          will-change: transform;
        }
      `}</style>
    </div>
  ),
);

ItemContent.displayName = "ItemContent";

// 🚀 Main optimized SearchResults component
export const SearchResults = memo(
  ({
    isLoading,
    error,
    totalCount,
    searchResults,
    hasNextPage,
    remainingCount,
    handleLoadMore,
  }: SearchResultsProps) => {
    const windowWidth = useWindowWidth();

    // 🚀 Implement scroll-based load more
    useScrollLoadMore(handleLoadMore, hasNextPage, isLoading);

    // 🎯 Memoized computed values with shallow comparison
    const showInitialState = useMemo(
      () => !isLoading && searchResults === null,
      [isLoading, searchResults],
    );

    const showEmptyState = useMemo(
      () => !isLoading && searchResults?.length === 0,
      [isLoading, searchResults?.length],
    );

    const showResults = useMemo(
      () => Boolean(searchResults?.length),
      [searchResults?.length],
    );

    // 🚀 Dynamic column count based on container width
    const columnCount = useMemo(() => {
      if (windowWidth < 640) return 1; // sm: 1 column
      if (windowWidth < 768) return 2; // md: 2 columns
      if (windowWidth < 1024) return 3; // lg: 3 columns
      if (windowWidth < 1280) return 4; // xl: 4 columns
      return 5; // 2xl+: 5 columns
    }, [windowWidth]);

    // 🎯 Memoized formatted values
    const formattedTotalCount = useMemo(() => {
      if (totalCount === null) return null;
      return totalCount > 50000 ? "50,000+" : totalCount.toLocaleString();
    }, [totalCount]);

    const formattedRemainingCount = useMemo(() => {
      return remainingCount?.toLocaleString() || "0";
    }, [remainingCount]);

    // 🚀 Memoized data for VirtuosoMasonry
    const masonryData = useMemo(() => searchResults || [], [searchResults]);

    // 🎯 Reset filters callback
    const handleResetFilters = useCallback(() => {
      // You can implement this based on your filter state management
      console.log("Reset filters clicked");
    }, []);

    return (
      <div className="search-results">
        {/* 🔄 Initial Loading */}
        {isLoading && !showResults && <Loading size="large" />}

        {/* ❌ Error State */}
        {error && (
          <div className="error-state" role="alert">
            {error}
          </div>
        )}

        {/* 🎯 Initial State */}
        {showInitialState && <InitialState />}

        {/* 📭 Empty State */}
        {showEmptyState && <EmptyState onResetFilters={handleResetFilters} />}

        {/* 📊 Results Count */}
        {showResults && formattedTotalCount && (
          <div className="results-count">
            <span className="results-count__badge" aria-live="polite">
              {formattedTotalCount} ads found
            </span>
          </div>
        )}

        {/* 🚀 Production-optimized VirtuosoMasonry with enhanced performance */}
        {showResults && (
          <div className="results-container">
            <VirtuosoMasonry
              data={masonryData}
              columnCount={columnCount}
              useWindowScroll={true}
              initialItemCount={0}
              ItemContent={ItemContent}
              className="virtuoso-masonry"
              style={{
                minHeight: "50vh", // Prevent layout shift
                containIntrinsicSize: "auto 1000px", // CSS containment for better performance
              }}
            />

            {/* 🎯 Enhanced load more status with smooth transitions */}
            {hasNextPage && (
              <div className="load-more-status">
                {isLoading && (
                  <div className="loading-indicator">
                    <Loading size="large" />
                    <span className="loading-text">Loading more ads...</span>
                  </div>
                )}

                {!isLoading &&
                  remainingCount !== null &&
                  remainingCount > 0 && (
                    <div className="status-info">
                      <p className="remaining-count" aria-live="polite">
                        {formattedRemainingCount} more ads available
                      </p>
                      <div className="scroll-hint">
                        <span className="scroll-hint__text">
                          Keep scrolling for more
                        </span>
                        <div className="scroll-hint__arrow">↓</div>
                      </div>
                    </div>
                  )}

                {!isLoading && remainingCount === 0 && (
                  <div className="end-message">
                    <span className="end-message__text">
                      🎉 You&apos;ve reached the end!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 🎨 Optimized styles with hardware acceleration */}
        <style jsx>{`
          .search-results {
            margin: 0 auto;
            width: 100%;
            min-height: 50vh;
          }

          .error-state {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 0.5rem;
            background: rgb(254 242 242);
            color: rgb(185 28 28);
            animation: slideIn 0.3s ease-out;
            transform: translateZ(0);
          }

          :global(.dark) .error-state {
            background: rgb(127 29 29);
            color: rgb(254 202 202);
          }

          .results-count {
            text-align: center;
            animation: slideDown 0.3s ease-out;
            margin-bottom: 1rem;
          }

          .results-count__badge {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            background: linear-gradient(
              135deg,
              rgb(243 232 255),
              rgb(252 231 243)
            );
            font-size: clamp(1rem, 2.5vw, 1.125rem);
            font-weight: 700;
            color: rgb(107 33 168);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateZ(0);
          }

          :global(.dark) .results-count__badge {
            background: linear-gradient(135deg, rgb(88 28 135), rgb(157 23 77));
            color: rgb(196 181 253);
          }

          .results-container {
            position: relative;
            animation: fadeIn 0.3s ease-out;
            transform: translateZ(0);
            contain: layout style paint; /* CSS containment for better performance */
          }

          :global(.virtuoso-masonry) {
            padding: 0 clamp(0.5rem, 2vw, 1rem);
            will-change: scroll-position;
          }

          .load-more-status {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            padding: 2rem 1rem 3rem;
            margin-top: 2rem;
            min-height: 120px; /* Prevent layout shift */
          }

          .loading-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            animation: pulse 2s ease-in-out infinite;
          }

          .loading-text {
            font-size: clamp(0.875rem, 2vw, 1rem);
            color: rgb(107 114 128);
            font-weight: 500;
          }

          :global(.dark) .loading-text {
            color: rgb(156 163 175);
          }

          .status-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            text-align: center;
          }

          .remaining-count {
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            background: linear-gradient(
              135deg,
              rgb(243 232 255),
              rgb(252 231 243)
            );
            font-size: clamp(1rem, 2.5vw, 1.125rem);
            font-weight: 600;
            color: rgb(147 51 234);
            box-shadow: 0 4px 12px -2px rgba(147, 51, 234, 0.2);
            transform: translateZ(0);
            transition: all 0.3s ease;
          }

          .remaining-count:hover {
            transform: translateY(-2px) translateZ(0);
            box-shadow: 0 8px 20px -4px rgba(147, 51, 234, 0.3);
          }

          :global(.dark) .remaining-count {
            background: linear-gradient(135deg, rgb(88 28 135), rgb(157 23 77));
            color: rgb(196 181 253);
            box-shadow: 0 4px 12px -2px rgba(196, 181, 253, 0.2);
          }

          .scroll-hint {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            opacity: 0.7;
            animation: bounce 2s ease-in-out infinite;
          }

          .scroll-hint__text {
            font-size: 0.875rem;
            color: rgb(107 114 128);
            font-weight: 500;
          }

          :global(.dark) .scroll-hint__text {
            color: rgb(156 163 175);
          }

          .scroll-hint__arrow {
            font-size: 1.25rem;
            color: rgb(147 51 234);
            font-weight: bold;
          }

          :global(.dark) .scroll-hint__arrow {
            color: rgb(196 181 253);
          }

          .end-message {
            padding: 1.5rem 2rem;
            border-radius: 1rem;
            background: linear-gradient(
              135deg,
              rgb(236 254 255),
              rgb(243 232 255)
            );
            border: 2px solid rgb(147 51 234);
          }

          :global(.dark) .end-message {
            background: linear-gradient(135deg, rgb(55 65 81), rgb(88 28 135));
            border-color: rgb(196 181 253);
          }

          .end-message__text {
            font-size: clamp(1rem, 2.5vw, 1.125rem);
            font-weight: 600;
            color: rgb(147 51 234);
          }

          :global(.dark) .end-message__text {
            color: rgb(196 181 253);
          }

          /* 🚀 Production-grade hardware-accelerated animations */
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translate3d(-20px, 0, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translate3d(0, -20px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.02);
            }
          }

          @keyframes bounce {
            0%,
            20%,
            50%,
            80%,
            100% {
              transform: translateY(0) translateZ(0);
            }
            40% {
              transform: translateY(-8px) translateZ(0);
            }
            60% {
              transform: translateY(-4px) translateZ(0);
            }
          }

          /* 🎯 Enhanced performance optimizations with CSS containment */
          .results-container,
          .results-count,
          .error-state,
          .load-more-status {
            will-change: transform;
            transform: translateZ(0);
            contain: layout style;
          }

          /* 🚀 Reduced motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .scroll-hint,
            .loading-indicator,
            .feature-pill:hover,
            .remaining-count:hover {
              animation: none;
              transform: none;
            }

            * {
              transition-duration: 0.01ms !important;
              animation-duration: 0.01ms !important;
            }
          }

          /* 🎯 High contrast mode support */
          @media (prefers-contrast: high) {
            .results-count__badge,
            .remaining-count,
            .end-message {
              border: 2px solid currentColor;
            }
          }

          /* 📱 Enhanced mobile optimizations */
          @media (max-width: 640px) {
            .load-more-status {
              padding: 1.5rem 0.5rem 2rem;
            }

            .scroll-hint {
              display: none; /* Hide on mobile to reduce clutter */
            }
          }

          /* 🖥️ Enhanced desktop optimizations */
          @media (min-width: 1024px) {
            .results-container {
              contain: layout style paint;
            }

            :global(.virtuoso-masonry) {
              padding: 0 clamp(1rem, 3vw, 2rem);
            }
          }
        `}</style>
      </div>
    );
  },
);

SearchResults.displayName = "SearchResults";

export default SearchResults;
