"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Simplified configuration interface
interface AnimationConfig {
  cardsPerSide: number; // Number of cards on each side of center
  scaleFactor: number; // How much cards scale down from center (0-1)
  opacityFactor: number; // How much cards fade from center (0-1)
  spreadFactor: number; // How much cards spread horizontally (0-1)
  borderRadius?: number; // Card corner rounding
  aspectRatio?: number; // Container aspect ratio
}

// Optimized default config with computed values
const defaultConfig: AnimationConfig = {
  cardsPerSide: 2,
  scaleFactor: 0.3, // Cards scale from 1.0 to 0.7 (1.0 - 0.3)
  opacityFactor: 0.7, // Cards fade from 1.0 to 0.3 (1.0 - 0.7)
  spreadFactor: 0.8,
  borderRadius: 10,
  aspectRatio: 16 / 9,
};

// Fixed values for better performance
const SCROLL_RANGE: [number, number] = [0, 1];
const CARD_SHADOW = "0 10px 30px rgba(255, 255, 255, 0.2)";

export interface CardData {
  id: string;
  image: string;
  alt?: string;
}

interface AnimatedCardProps {
  card: CardData;
  index: number;
  position: "left" | "center" | "right";
  scrollYProgress: any;
  containerWidth: number;
  config: AnimationConfig;
}

// Memoized AnimatedCard component
const AnimatedCard = memo(
  ({
    card,
    index,
    position,
    scrollYProgress,
    containerWidth,
    config,
  }: AnimatedCardProps) => {
    // Calculate distance from center
    const distance =
      position === "center"
        ? 0
        : position === "left"
          ? -(index + 1)
          : index + 1;

    // Calculate card dimensions once
    const total = config.cardsPerSide * 2 + 1;
    const cardW = containerWidth / total;
    const available = (containerWidth - cardW) / 2;

    // Simplified position calculation
    const baseTranslate =
      (distance * (available * config.spreadFactor)) / config.cardsPerSide;

    // Simplified calculations using factors
    const targetScale =
      1 - (Math.abs(distance) / (config.cardsPerSide + 1)) * config.scaleFactor;
    const targetOpacity =
      1 -
      (Math.abs(distance) / (config.cardsPerSide + 1)) * config.opacityFactor;

    // Simplified transforms with computed ranges
    const baseScale = 1 - config.scaleFactor;
    const baseOpacity = 1 - config.opacityFactor;

    const x = useTransform(scrollYProgress, [0, 1], [0, baseTranslate]);
    const scale = useTransform(
      scrollYProgress,
      [0, 1],
      [baseScale, targetScale],
    );
    const opacity = useTransform(
      scrollYProgress,
      [0, 1],
      [baseOpacity, targetOpacity],
    );

    // Z-index based on distance from center
    const zIndex = config.cardsPerSide + 1 - Math.abs(distance);

    return (
      <motion.div
        style={{
          x,
          scale,
          opacity,
          zIndex,
          position: "absolute",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          width: `${100 / total}%`,
          aspectRatio: "auto",
          borderRadius: config.borderRadius ?? 10,
          boxShadow: CARD_SHADOW,
          overflow: "hidden",
        }}
        initial={{ scale: baseScale, opacity: baseOpacity }}
      >
        <img
          src={card.image || "/placeholder.svg"}
          alt={card.alt ?? `Card ${card.id}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    );
  },
);

AnimatedCard.displayName = "AnimatedCard";

export interface FanOutCardProps {
  cards?: CardData[];
  className?: string;
  config?: Partial<AnimationConfig>;
}

// Optimized FanOutCard component
const FanOutCard = ({
  cards,
  className = "",
  config: userConfig,
}: FanOutCardProps) => {
  const cfg = { ...defaultConfig, ...(userConfig || {}) };
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Optimized resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial measurement
    update();

    // Use ResizeObserver with debounce for performance
    let timeoutId: NodeJS.Timeout;
    const ro = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(update, 100);
    });

    ro.observe(containerRef.current);

    return () => {
      clearTimeout(timeoutId);
      ro.disconnect();
    };
  }, []);

  // Optimized scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.2"],
  });

  // Default cards
  const total = cfg.cardsPerSide * 2 + 1;
  const defaultCards: CardData[] = Array.from({ length: total }, (_, i) => ({
    id: `card-${i}`,
    image:
      "https://help.apple.com/assets/67EAFA00341984D9AE00EC98/67EAFA0586243791BA0154F5/fr_FR/4e069c10221c319aaf55b730d1313856.png",
    alt: `Sample card ${i + 1}`,
  }));

  const list = cards ?? defaultCards;
  const centerIdx = Math.floor(list.length / 2);

  // Memoize card sections for better performance
  const leftCards = list.slice(0, centerIdx).reverse();
  const centerCard = list[centerIdx];
  const rightCards = list.slice(centerIdx + 1);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: String(cfg.aspectRatio),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 1rem",
        }}
      >
        {leftCards.map((c, i) => (
          <AnimatedCard
            key={c.id}
            card={c}
            index={i}
            position="left"
            scrollYProgress={scrollYProgress}
            containerWidth={containerWidth}
            config={cfg}
          />
        ))}

        {centerCard && (
          <AnimatedCard
            key={centerCard.id}
            card={centerCard}
            index={0}
            position="center"
            scrollYProgress={scrollYProgress}
            containerWidth={containerWidth}
            config={cfg}
          />
        )}

        {rightCards.map((c, i) => (
          <AnimatedCard
            key={c.id}
            card={c}
            index={i}
            position="right"
            scrollYProgress={scrollYProgress}
            containerWidth={containerWidth}
            config={cfg}
          />
        ))}
      </div>
    </div>
  );
};

export default FanOutCard;
