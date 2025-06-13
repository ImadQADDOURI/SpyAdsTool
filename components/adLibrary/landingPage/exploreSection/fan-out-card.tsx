"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// 🎛️ Configuration interface for fan‑out behavior
interface AnimationConfig {
  cardsPerSide: number; // ➗ Number of cards on each side of center
  baseScale: number; // 📐 Starting scale (when stacked)
  maxScale: number; // 📏 Final scale (fully fanned)
  baseOpacity: number; // 🌫️ Starting opacity
  maxOpacity: number; // 🌟 Final opacity
  spreadFactor: number; // ↔️ How much horizontal spread to allow
  nonLinearFactor: number; // 🔄 Curve factor for “natural” spacing
  scrollRange: [number, number]; // 🖱️ Scroll progress range to trigger anim
  borderRadius: number; // 💠 Card corner rounding (px)
  shadow: string; // 🕶️ Box‑shadow style
  aspectRatio: number; // 🖼️ Container width/height ratio
}

// 🔧 Default animation settings
const defaultConfig: AnimationConfig = {
  cardsPerSide: 2,
  baseScale: 0.7,
  maxScale: 1,
  baseOpacity: 0.3,
  maxOpacity: 1,
  spreadFactor: 0.8,
  nonLinearFactor: 0.7,
  scrollRange: [0, 1],
  borderRadius: 10,
  shadow: "0 10px 30px rgba(255, 255, 255, 0.2)",
  aspectRatio: 16 / 9,
};

export interface CardData {
  id: string; // 🆔 Unique key for React lists
  image: string; // 🌄 URL of card image
  alt?: string; // ✍️ Alt text for accessibility
}

interface AnimatedCardProps {
  card: CardData;
  index: number;
  position: "left" | "center" | "right";
  scrollYProgress: any;
  containerWidth: number; // 📏 Measured width of the parent container
  config: AnimationConfig;
}

// 🎞️ Single animated card
const AnimatedCard = ({
  card,
  index,
  position,
  scrollYProgress,
  containerWidth,
  config,
}: AnimatedCardProps) => {
  // 🔢 Compute how many slots away from center this card is
  const distance =
    position === "center" ? 0 : position === "left" ? -(index + 1) : index + 1;

  const total = config.cardsPerSide * 2 + 1;
  const cardW = containerWidth / total; // 📐 Each card’s width
  const available = (containerWidth - cardW) / 2; // ↔️ Space on one side

  // 🔄 Non‑linear spacing function
  const calcPos = useCallback(
    (d: number) => {
      if (Math.abs(d) <= 1) return d;
      return Math.sign(d) * (1 + (Math.abs(d) - 1) * config.nonLinearFactor);
    },
    [config.nonLinearFactor],
  );

  const nl = calcPos(distance);
  const rawX = (nl * available * config.spreadFactor) / config.cardsPerSide;
  // 🚧 Cap to avoid overflow beyond container edges
  const baseTranslate = Math.max(-available, Math.min(rawX, available));

  // 🎚️ Scale & opacity per distance from center
  const stepScale =
    (config.maxScale - config.baseScale) / (config.cardsPerSide + 1);
  const stepOpacity =
    (config.maxOpacity - config.baseOpacity) / (config.cardsPerSide + 1);

  const targetScale = Math.max(
    config.baseScale,
    config.maxScale - Math.abs(distance) * stepScale,
  );
  const targetOpacity = Math.max(
    config.baseOpacity,
    config.maxOpacity - Math.abs(distance) * stepOpacity,
  );

  // 🔄 Framer Motion transforms
  const x = useTransform(scrollYProgress, config.scrollRange, [
    0,
    baseTranslate,
  ]);
  const scale = useTransform(scrollYProgress, config.scrollRange, [
    config.baseScale,
    targetScale,
  ]);
  const opacity = useTransform(scrollYProgress, config.scrollRange, [
    config.baseOpacity,
    targetOpacity,
  ]);

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
        width: `${100 / total}%`, // 📏 Responsive based on total cards
        aspectRatio: "auto",
        borderRadius: config.borderRadius,
        boxShadow: config.shadow,
        overflow: "hidden",
        backgroundColor: "white",
      }}
      initial={{ scale: config.baseScale, opacity: config.baseOpacity }}
    >
      {/* 🖼️ Image with contain to avoid cropping */}
      <img
        src={card.image}
        alt={card.alt ?? `Card ${card.id}`}
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
  config?: Partial<AnimationConfig>;
}

// 🃏 Fan‑out card container
const FanOutCard = ({
  cards,
  className = "",
  config: userConfig,
}: FanOutCardProps) => {
  const cfg = { ...defaultConfig, ...(userConfig || {}) };
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 📏 Observe container for width changes
  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => setContainerWidth(containerRef.current!.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // 🖱️ Track scroll progress relative to container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.2"],
  });

  // 📦 Default sample cards if none provided
  const total = cfg.cardsPerSide * 2 + 1;
  const defaultCards: CardData[] = Array.from({ length: total }, (_, i) => ({
    id: `card-${i}`,
    image:
      "https://help.apple.com/assets/67EAFA00341984D9AE00EC98/67EAFA0586243791BA0154F5/fr_FR/4e069c10221c319aaf55b730d1313856.png",
    alt: `Sample card ${i + 1}`,
  }));
  const list = cards ?? defaultCards;
  const centerIdx = Math.floor(list.length / 2);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: cfg.aspectRatio, // 📐 Keeps height adaptive
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 1rem",
        }}
      >
        {list
          .slice(0, centerIdx)
          .reverse()
          .map((c, i) => (
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

        {list[centerIdx] && (
          <AnimatedCard
            key={list[centerIdx].id}
            card={list[centerIdx]}
            index={0}
            position="center"
            scrollYProgress={scrollYProgress}
            containerWidth={containerWidth}
            config={cfg}
          />
        )}

        {list.slice(centerIdx + 1).map((c, i) => (
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
