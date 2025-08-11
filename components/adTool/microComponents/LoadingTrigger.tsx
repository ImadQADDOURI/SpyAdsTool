"use client";

import { memo, useCallback, useEffect, useRef } from "react";

interface LoadingTriggerProps {
  onIntersect: () => void;
  isLoading: boolean;
  triggerMargin?: number;
}

// 🚀 Optimized LoadingTrigger with better performance
const LoadingTrigger = memo(
  ({ onIntersect, isLoading, triggerMargin = 0.5 }: LoadingTriggerProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // 🎯 Memoized callback to prevent observer recreation
    const handleIntersect = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting && !isLoading) {
          onIntersect();
        }
      },
      [onIntersect, isLoading],
    );

    useEffect(() => {
      // 🚀 Create observer only once and reuse
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(handleIntersect, {
          rootMargin: `${triggerMargin * 100}% 0px`,
          threshold: 0.1,
        });
      }

      const currentElement = triggerRef.current;
      const currentObserver = observerRef.current;

      if (currentElement && currentObserver) {
        currentObserver.observe(currentElement);
      }

      return () => {
        if (currentElement && currentObserver) {
          currentObserver.unobserve(currentElement);
        }
      };
    }, [handleIntersect, triggerMargin]);

    // 🧹 Cleanup observer on unmount
    useEffect(() => {
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };
    }, []);

    return (
      <div className="loading-trigger">
        <div ref={triggerRef} className="loading-trigger__element" />

        <style jsx>{`
          .loading-trigger {
            width: 100%;
            display: flex;
            justify-content: center;
          }

          .loading-trigger__element {
            height: 2.5rem;
            width: 100%;
            pointer-events: none;
          }
        `}</style>
      </div>
    );
  },
);

LoadingTrigger.displayName = "LoadingTrigger";

export default LoadingTrigger;
