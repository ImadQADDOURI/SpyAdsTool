// components/ProgressNavigation.tsx

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface NavFeature {
  id: string;

  title: string;

  accentColor: string;

  Icon: LucideIcon;
}

interface ProgressNavigationProps {
  features: NavFeature[];

  activeFeatureId: string | null;

  onNavigate: (featureId: string) => void;

  isVisible: boolean; // Controls overall visibility of the progress bar

  mainNavbarVisible: boolean; // Controls dynamic top positioning
}

const ProgressNavigation: React.FC<ProgressNavigationProps> = ({
  features,

  activeFeatureId,

  onNavigate,

  isVisible,

  mainNavbarVisible, // New prop
}) => {
  if (!features || features.length === 0) {
    return null;
  } // Determine the dynamic top class based on mainNavbarVisible

  const topPositionClass = mainNavbarVisible ? "top-[66px]" : "top-[2px]";

  return (
    <AnimatePresence>
           {" "}
      {isVisible && (
        <motion.div // Apply the dynamic topPositionClass here
          className={`fixed ${topPositionClass} left-0 right-0 z-[999] flex justify-center`}
          role="navigation"
          aria-label="Features quick navigation"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
                   {" "}
          <div className="flex space-x-2 rounded-full bg-black/25 p-1.5 shadow-lg backdrop-blur-md sm:space-x-3 sm:p-2">
                       {" "}
            {features.map((feature) => {
              const isActive = feature.id === activeFeatureId;

              const IconComponent = feature.Icon;

              return (
                <motion.button
                  key={feature.id}
                  onClick={() => onNavigate(feature.id)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 sm:h-10 sm:w-10"
                  initial={false}
                  animate={{
                    scale: isActive ? 1.25 : 1,

                    backgroundColor: isActive
                      ? feature.accentColor
                      : "rgba(255, 255, 255, 0.1)",

                    borderColor: isActive
                      ? feature.accentColor
                      : "rgba(255, 255, 255, 0.3)",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  whileHover={{
                    scale: isActive ? 1.35 : 1.15,

                    borderColor: isActive
                      ? feature.accentColor
                      : "rgba(255, 255, 255, 0.6)",

                    backgroundColor: isActive
                      ? feature.accentColor
                      : "rgba(255, 255, 255, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Go to ${feature.title}`}
                  title={feature.title}
                  aria-pressed={isActive}
                >
                                   {" "}
                  <IconComponent
                    size={18}
                    color={isActive ? "white" : "rgba(255, 255, 255, 0.8)"}
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{
                      transition: "color 0.3s ease, stroke-width 0.3s ease",
                    }}
                  />
                                 {" "}
                </motion.button>
              );
            })}
                     {" "}
          </div>
                 {" "}
        </motion.div>
      )}
         {" "}
    </AnimatePresence>
  );
};

export default ProgressNavigation;
