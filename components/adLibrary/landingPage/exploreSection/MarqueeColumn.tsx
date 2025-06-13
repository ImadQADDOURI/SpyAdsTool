"use client";

import type React from "react";
import { motion } from "framer-motion";

interface Item {
  id: number;
  image: string;
  name: string;
}

interface MarqueeColumnProps {
  items: Item[];
  direction: "up" | "down";
  duration: number;
}

export const MarqueeColumn: React.FC<MarqueeColumnProps> = ({
  items,
  direction,
  duration,
}) => {
  // Double the items to create a seamless loop
  const doubledItems = [...items, ...items];

  return (
    <div
      className="relative flex-1 overflow-hidden rounded-lg"
      style={{ height: "500px" }}
    >
      {/* Mask for fade effect */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-0 right-0 top-0 h-[100px] bg-gradient-to-b from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-black to-transparent"></div>
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
          <div key={`${item.id}-${index}`} className="relative mb-4 p-2">
            <div className="group relative overflow-hidden rounded-lg">
              <img
                src={
                  item.image ||
                  "https://help.apple.com/assets/67EAFA00341984D9AE00EC98/67EAFA0586243791BA0154F5/fr_FR/4e069c10221c319aaf55b730d1313856.png" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={item.name}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:group-hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-sm font-medium text-white">{item.name}</p>
              </div> */}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
