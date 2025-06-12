"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Centralized configuration with proper typing and detailed explanations
interface AnimationConfig {
  // === LAYOUT CONFIGURATION ===
  /** Number of cards on each side of the center card (e.g., 2 means 5 total cards: 2-left + 1-center + 2-right) */
  cardsPerSide: number;

  /** Responsive card width using CSS min() function - adapts to viewport but maintains minimum size */
  cardWidth: string;

  /** Card height - set to "auto" to maintain aspect ratio based on width */
  cardHeight: string;

  // === ANIMATION VALUES ===
  /** Initial scale when cards are stacked (0.7 = 70% of original size) */
  baseScale: number;

  /** Maximum scale when fully fanned out (1.0 = 100% original size) */
  maxScale: number;

  /** Initial opacity when cards are stacked (0.3 = 30% visible) */
  baseOpacity: number;

  /** Maximum opacity when fully fanned out (1.0 = fully visible) */
  maxOpacity: number;

  // === SPACING & DISTRIBUTION ===
  /** How much of available horizontal space to use for spreading (0.8 = 80% of available space) */
  baseSpreadFactor: number;

  /** Controls non-linear distribution curve (0.7 = cards closer to center get more space, outer cards get less) */
  nonLinearFactor: number;

  // === SCROLL TRIGGER ===
  /** Animation progress range [start, end] where 0 = animation start, 1 = animation complete */
  scrollRange: [number, number];

  // === VISUAL STYLING ===
  /** Border radius for card corners in pixels */
  borderRadius: number;

  /** CSS box-shadow for card depth effect */
  shadow: string;

  // === CALCULATED VALUES (auto-generated) ===
  /** How much scale changes per card distance from center (calculated automatically) */
  scaleStep: number;

  /** How much opacity changes per card distance from center (calculated automatically) */
  opacityStep: number;
}

const createAnimationConfig = (cardsPerSide = 2): AnimationConfig => {
  const baseScale = 0.7;
  const maxScale = 1;
  const baseOpacity = 0.3;
  const maxOpacity = 1;

  return {
    cardsPerSide,
    cardWidth: "min(280px, 25vw)",
    cardHeight: "auto",
    baseScale,
    maxScale,
    baseOpacity,
    maxOpacity,
    baseSpreadFactor: 0.8,
    nonLinearFactor: 0.7,
    scrollRange: [0, 1],
    borderRadius: 16,
    shadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    scaleStep: (maxScale - baseScale) / (cardsPerSide + 1),
    opacityStep: (maxOpacity - baseOpacity) / (cardsPerSide + 1),
  };
};

const ANIMATION_CONFIG = createAnimationConfig();

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
  cardWidthPx: number;
  config: AnimationConfig;
}

const AnimatedCard = ({
  card,
  index,
  position,
  scrollYProgress,
  containerWidth,
  cardWidthPx,
  config,
}: AnimatedCardProps) => {
  // Calculate card position from center
  const distanceFromCenter =
    position === "center" ? 0 : position === "left" ? -(index + 1) : index + 1;

  // Calculate available space and maximum translation
  const availableSpace = Math.max(0, (containerWidth - cardWidthPx) / 2);
  const maxTranslate = availableSpace * config.baseSpreadFactor;

  // Non-linear translation calculation for natural fan-out
  const calculateNonLinearPosition = useCallback(
    (distance: number): number => {
      if (Math.abs(distance) <= 1) return distance;
      return (
        Math.sign(distance) *
        (1 + (Math.abs(distance) - 1) * config.nonLinearFactor)
      );
    },
    [config.nonLinearFactor],
  );

  const nonLinearPosition = calculateNonLinearPosition(distanceFromCenter);
  const baseTranslateX =
    position === "center"
      ? 0
      : (nonLinearPosition * maxTranslate) / config.cardsPerSide;

  // Calculate scale and opacity based on distance from center
  const targetScale = Math.max(
    config.baseScale,
    config.maxScale - Math.abs(distanceFromCenter) * config.scaleStep,
  );
  const targetOpacity = Math.max(
    config.baseOpacity,
    config.maxOpacity - Math.abs(distanceFromCenter) * config.opacityStep,
  );

  // Framer Motion transforms
  const x = useTransform(scrollYProgress, config.scrollRange, [
    0,
    baseTranslateX,
  ]);
  const scale = useTransform(scrollYProgress, config.scrollRange, [
    config.baseScale,
    targetScale,
  ]);
  const opacity = useTransform(scrollYProgress, config.scrollRange, [
    config.baseOpacity,
    targetOpacity,
  ]);

  // Z-index for proper stacking
  const zIndex = config.cardsPerSide + 1 - Math.abs(distanceFromCenter);

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
        width: config.cardWidth,
        aspectRatio: "3/4",
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
        overflow: "hidden",
        backgroundColor: "white",
      }}
      initial={{
        scale: config.baseScale,
        opacity: config.baseOpacity,
      }}
    >
      <img
        src={card.image || "/placeholder.svg"}
        alt={card.alt || `Card ${card.id}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          display: "block",
          backgroundColor: "#f8f9fa",
        }}
        loading="lazy"
        decoding="async"
      />
    </motion.div>
  );
};

export interface FanOutCardProps {
  cards?: CardData[];
  className?: string;
  containerHeight?: number;
  config?: Partial<AnimationConfig>;
}

const FanOutCard = ({
  cards,
  className = "",
  containerHeight = 600,
  config: userConfig,
}: FanOutCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    containerWidth: 0,
    cardWidthPx: 280,
  });

  // Merge user config with defaults
  const config = userConfig
    ? { ...ANIMATION_CONFIG, ...userConfig }
    : ANIMATION_CONFIG;

  // Default cards with proper fallback
  const defaultCards: CardData[] = Array.from(
    { length: config.cardsPerSide * 2 + 1 },
    (_, i) => ({
      id: `card-${i}`,
      image:
        "https://help.apple.com/assets/67EAFA00341984D9AE00EC98/67EAFA0586243791BA0154F5/fr_FR/4e069c10221c319aaf55b730d1313856.png",
      alt: `Sample card ${i + 1}`,
    }),
  );

  const cardData = cards || defaultCards;

  // Optimized dimension calculation
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    // Calculate actual card width more efficiently
    const viewportWidth = window.innerWidth;
    const cardWidth = Math.min(280, viewportWidth * 0.25);

    setDimensions({ containerWidth, cardWidthPx: cardWidth });
  }, []);

  // Set up resize observer with cleanup
  useEffect(() => {
    if (!containerRef.current) return;

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateDimensions]);

  // Scroll progress configuration
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.2"],
  });

  // Organize cards by position
  const centerIndex = Math.floor(cardData.length / 2);
  const leftCards = cardData.slice(0, centerIndex).reverse();
  const centerCard = cardData[centerIndex];
  const rightCards = cardData.slice(centerIndex + 1);

  return (
    <div className={`w-full ${className}`}>
      {/* Spacer for scroll trigger */}
      <div style={{ height: containerHeight / 2 }} />

      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: containerHeight,
          width: "100%",
          maxWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 1rem",
        }}
      >
        {/* Left cards */}
        {leftCards.map((card, index) => (
          <AnimatedCard
            key={`left-${card.id}`}
            card={card}
            index={index}
            position="left"
            scrollYProgress={scrollYProgress}
            containerWidth={dimensions.containerWidth}
            cardWidthPx={dimensions.cardWidthPx}
            config={config}
          />
        ))}

        {/* Center card */}
        {centerCard && (
          <AnimatedCard
            key={`center-${centerCard.id}`}
            card={centerCard}
            index={0}
            position="center"
            scrollYProgress={scrollYProgress}
            containerWidth={dimensions.containerWidth}
            cardWidthPx={dimensions.cardWidthPx}
            config={config}
          />
        )}

        {/* Right cards */}
        {rightCards.map((card, index) => (
          <AnimatedCard
            key={`right-${card.id}`}
            card={card}
            index={index}
            position="right"
            scrollYProgress={scrollYProgress}
            containerWidth={dimensions.containerWidth}
            cardWidthPx={dimensions.cardWidthPx}
            config={config}
          />
        ))}
      </div>

      {/* Spacer for scroll trigger */}
      <div style={{ height: containerHeight / 2 }} />
    </div>
  );
};

export default FanOutCard;

// Export utilities for advanced usage
export { createAnimationConfig, type AnimationConfig };
