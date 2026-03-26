"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { CollapsibleDropdownProps } from "./navbar-links";

export function CollapsibleDropdownMobile({
  pathname,
  title,
  icon: Icon,
  showFreeBadge = false,
  links,
}: CollapsibleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = links.some((link) => pathname === link.href);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
        <div className="flex items-center gap-3">
          <Icon
            className={cn(
              "size-5",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span
            className={cn(isActive ? "text-primary" : "text-muted-foreground")}
          >
            {title}
          </span>
          {showFreeBadge && (
            <Badge
              variant="outline"
              className="border-green-500 text-green-600 dark:text-green-400"
            >
              Free
            </Badge>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-4" />
        </motion.div>
      </CollapsibleTrigger>
      <AnimatePresence>
        {isOpen && (
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="px-2"
            >
              <div className="mt-1 flex flex-col gap-1">
                {links.map((link) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition-colors hover:bg-muted",
                        pathname === link.href
                          ? "bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      <link.icon
                        className={cn(
                          "size-4",
                          link.color,
                        )}
                      />
                      <span className="flex-1">{link.title}</span>
                      {link.isFree && (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-xs text-green-600 dark:text-green-400"
                        >
                          Free
                        </Badge>
                      )}
                      <ChevronRight className="size-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
}
