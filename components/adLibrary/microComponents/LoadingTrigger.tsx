// components/adsLibrary/LoadingTrigger.tsx
import React, { useEffect, useRef } from "react";

interface LoadingTriggerProps {
  onIntersect: () => void;
  isLoading: boolean;
  // How far from the viewport to trigger loading (0 to 1)
  // Default 0.5 means trigger when element is halfway to entering viewport
  triggerMargin?: number;
}

const LoadingTrigger: React.FC<LoadingTriggerProps> = ({
  onIntersect,
  isLoading,
  triggerMargin = 0.5,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create an observer with a rootMargin to detect the element before it's visible
    // This creates a larger detection area around the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onIntersect();
        }
      },
      {
        // rootMargin increases the effective size of the viewport
        // A positive value like "200px" will trigger when element is 200px away
        rootMargin: `${triggerMargin * 100}% 0px`,
        // Lower threshold so it triggers earlier in the intersection process
        threshold: 0.1,
      },
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [onIntersect, isLoading, triggerMargin]);

  return <div ref={triggerRef} className="h-10" />;
};

export default LoadingTrigger;
