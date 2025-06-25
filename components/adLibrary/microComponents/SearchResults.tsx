"use client";

import type React from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { VirtuosoMasonry } from "@virtuoso.dev/masonry";
import {
  BarChart,
  CheckCircle,
  ChevronDown,
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

// 🚀 Enhanced window width hook with SSR safety
const useWindowWidth = () => {
  const [width, setWidth] = useState(() => {
    if (typeof window === "undefined") return 1024; // SSR fallback
    return window.innerWidth;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Cancel previous calls
      clearTimeout(timeoutId);
      // Debounce resize events for performance
      timeoutId = setTimeout(() => {
        const newWidth = window.innerWidth;
        setWidth((prevWidth) => {
          return Math.abs(newWidth - prevWidth) > 10 ? newWidth : prevWidth;
        });
      }, 100); // Reduced debounce time for better responsiveness
    };

    const initialWidth = window.innerWidth;
    if (Math.abs(initialWidth - width) > 10) {
      setWidth(initialWidth);
    }

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [width]);

  return width;
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

// 🎯 Optimized InitialState component
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
          contain: layout;
          min-height: 200px;
          max-height: 800px;
        }
      `}</style>
    </div>
  ),
  // 🔥 No second parameter = use default React memo comparison
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

    // 🎯 Memoized computed values
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
      if (windowWidth < 600) return 1;
      if (windowWidth < 900) return 2;
      if (windowWidth < 1200) return 3;
      if (windowWidth < 1600) return 4;
      return 5;
    }, [windowWidth]);

    // 🚀 Ref for VirtuosoMasonry
    const virtuosoRef = useRef<any>(null);
    const [recalcKey, setRecalcKey] = useState(0);

    // 🎯 Memoized formatted values
    const formattedTotalCount = useMemo(() => {
      if (totalCount === null) return null;
      return totalCount > 50000 ? "50,000+" : totalCount.toLocaleString();
    }, [totalCount]);

    const formattedRemainingCount = useMemo(() => {
      return remainingCount?.toLocaleString() || "0";
    }, [remainingCount]);

    // 🚀 Memoized data for VirtuosoMasonry
    const masonryData = useMemo(() => {
      return searchResults || [];
    }, [searchResults?.length]);

    // 🎯 Reset filters callback (placeholder)
    const handleResetFilters = () => {
      // You can implement this based on your filter state management
      console.log("Reset filters clicked");
    };

    useEffect(() => {
      if (searchResults?.length) {
        const timer = setTimeout(() => {
          setRecalcKey((prev) => prev + 1);
        }, 150);
        return () => clearTimeout(timer);
      }
    }, [searchResults?.length]);

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
            {isLoading ? (
              <Loading size="medium" />
            ) : (
              <span className="results-count__badge" aria-live="polite">
                {formattedTotalCount} ads found
              </span>
            )}
          </div>
        )}

        {/* 🚀 Results Grid */}
        {showResults && (
          <div className="results-container">
            <VirtuosoMasonry
              ref={virtuosoRef}
              key={`stable-${recalcKey}`}
              data={masonryData}
              columnCount={columnCount}
              useWindowScroll={true}
              initialItemCount={Math.min(columnCount * 4, masonryData.length)}
              ItemContent={ItemContent}
              className="virtuoso-masonry"
              style={{
                minHeight: "50vh",
                containIntrinsicSize: "auto 1000px",
              }}
            />

            {/* 🎯 Load More Section */}
            <div className="load-more-section mt-8 flex justify-center p-8">
              {hasNextPage ? (
                isLoading ? (
                  <>
                    <Loading size="small" />
                  </>
                ) : (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 px-6 py-3 font-bold text-purple-800 shadow-md hover:from-purple-300 hover:to-pink-300 disabled:opacity-50"
                  >
                    <ChevronDown className="h-5 w-5" />
                    Load More +{formattedRemainingCount} left
                  </button>
                )
              ) : (
                <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-md">
                  <CheckCircle className="mr-2 h-6 w-6" />
                  <span>End of Results</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🎨 Optimized styles */}
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
            contain: layout style paint;
            min-height: 50vh;
          }

          :global(.virtuoso-masonry) {
            padding: 0 clamp(0.5rem, 2vw, 1rem);
            will-change: scroll-position;
          }

          .load-more-section {
            display: flex;
            justify-content: center;
            padding: 3rem 1rem;
            margin-top: 2rem;
          }

          .load-more-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            text-align: center;
            padding: 2rem 1rem 3rem;
            margin-top: 2rem;
            min-height: 120px; /* Prevent layout shift */
          }

          .end-message {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 2rem;
            border-radius: 9999px;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            color: white;
            font-weight: 600;
            box-shadow: 0 4px 14px 0 rgba(147, 51, 234, 0.3);
          }

          /* 🚀 Hardware-accelerated animations */
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

          /* 🎯 Performance optimizations */
          .results-container,
          .results-count,
          .error-state,
          .load-more-section {
            will-change: transform;
            transform: translateZ(0);
            contain: layout style;
          }

          /* 🚀 Accessibility - Reduced motion */
          @media (prefers-reduced-motion: reduce) {
            * {
              transition-duration: 0.01ms !important;
              animation-duration: 0.01ms !important;
            }
          }

          /* 🎯 High contrast mode support */
          @media (prefers-contrast: high) {
            .results-count__badge,
            .end-message {
              border: 2px solid currentColor;
            }
          }

          /* 📱 Mobile optimizations */
          @media (max-width: 640px) {
            .load-more-section {
              padding: 2rem 0.5rem;
            }
          }

          /* 🖥️ Desktop optimizations */
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
