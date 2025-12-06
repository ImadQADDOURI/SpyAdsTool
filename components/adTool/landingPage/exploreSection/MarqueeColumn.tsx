"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";

interface Item {
  id: number;
  image: string;
  name: string;
}

interface MarqueeColumnProps {
  items: Item[];
  direction?: "up" | "down"; // Make optional with default
  duration?: number; // Make optional with default
  height?: number; // Make height configurable
}

// Add default props
const DEFAULT_DURATION = 20;
const DEFAULT_HEIGHT = 500;

// Memoized MarqueeItem component
const MarqueeItem = memo(({ item }: { item: Item }) => (
  <div className="relative pb-1.5">
    <div className="group relative overflow-hidden rounded-lg">
      <img
        src={item.image || "/placeholder.svg"}
        alt={item.name}
        className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
        style={{ objectFit: "contain" }}
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
));

MarqueeItem.displayName = "MarqueeItem";

export const MarqueeColumn = memo(
  ({
    items,
    direction = "up",
    duration = DEFAULT_DURATION,
    height = DEFAULT_HEIGHT,
  }: MarqueeColumnProps) => {
    // Create doubled items array only when items change
    const doubledItems = useMemo(() => [...items, ...items], [items]);

    return (
      <div
        className="relative flex-1 overflow-hidden rounded-lg"
        style={{ height: `${height}px` }}
      >
        {/* Mask for fade effect - using CSS variables for better performance */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div
            className="absolute left-0 right-0 top-0 h-[100px]"
            style={{
              background: "linear-gradient(to bottom, black, transparent)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px]"
            style={{
              background: "linear-gradient(to top, black, transparent)",
            }}
          />
        </div>

        <motion.div
          className="flex flex-col"
          animate={{
            y: direction === "up" ? [0, "-50%"] : ["-50%", "0%"],
          }}
          transition={{
            y: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          }}
          style={{
            willChange: "transform",
          }}
        >
          {doubledItems.map((item, index) => (
            <MarqueeItem key={`${item.id}-${index}`} item={item} />
          ))}
        </motion.div>
      </div>
    );
  },
);

MarqueeColumn.displayName = "MarqueeColumn";
