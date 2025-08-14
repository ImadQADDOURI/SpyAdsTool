"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CollapsibleDropdownProps } from "./navbar-links";

export function CollapsibleDropdown({
  pathname,
  title,
  icon: Icon,
  showFreeBadge = false,
  links,
}: CollapsibleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = links.some((link) => pathname === link.href);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="group relative px-2 py-1.5 outline-none">
        <motion.div
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all",
            isActive
              ? "bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Icon
            className={cn(
              "size-4",
              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground",
            )}
          />
          <span>{title}</span>
          {showFreeBadge && (
            <Badge
              variant="outline"
              className="border-green-500 text-green-600 dark:text-green-400"
            >
              Free
            </Badge>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4" />
          </motion.div>
        </motion.div>
        {isActive && (
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8]"
            layoutId="navbar-active-indicator"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            align="center"
            className="w-[340px] overflow-hidden p-2"
            asChild
            forceMount
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 gap-2">
                {links.map((link) => (
                  <DropdownMenuItem
                    key={link.id}
                    asChild
                    className="p-0 focus:bg-transparent"
                  >
                    <Link href={link.href}>
                      <motion.div
                        className={cn(
                          "flex w-full cursor-pointer items-start gap-3 rounded-md p-3 transition-colors",
                          pathname === link.href
                            ? "bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10"
                            : "hover:bg-muted",
                        )}
                        whileHover={{ x: 2 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-md",
                            link.color,
                          )}
                        >
                          <link.icon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "font-medium",
                                pathname === link.href ? "text-primary" : "",
                              )}
                            >
                              {link.title}
                            </span>
                            {link.isFree && (
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-600 dark:text-green-400"
                              >
                                Free
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {link.description}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}
