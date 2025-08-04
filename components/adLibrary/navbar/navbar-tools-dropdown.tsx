"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calculator,
  ChevronDown,
  DollarSign,
  LineChart,
  PocketKnife,
  ShoppingBag,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/shared/icons";

import { Tools } from "./navbar-links";

interface NavbarToolsDropdownProps {
  pathname: string;
}

export function NavbarToolsDropdown({ pathname }: NavbarToolsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isToolActive = Tools.some((tool) => pathname === tool.href);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="group relative px-2 py-1.5 outline-none">
        <motion.div
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all",
            isToolActive
              ? "bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <PocketKnife
            className={cn(
              "size-4",
              isToolActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground",
            )}
          />
          <span>Tools</span>
          <Badge
            variant="outline"
            className="border-green-500 text-green-600 dark:text-green-400"
          >
            Free
          </Badge>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4" />
          </motion.div>
        </motion.div>
        {isToolActive && (
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
                {Tools.map((tool) => (
                  <DropdownMenuItem
                    key={tool.id}
                    asChild
                    className="p-0 focus:bg-transparent"
                  >
                    <Link href={tool.href}>
                      <motion.div
                        className={cn(
                          "flex w-full cursor-pointer items-start gap-3 rounded-md p-3 transition-colors",
                          pathname === tool.href
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
                            tool.color === "purple" &&
                              "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
                            tool.color === "blue" &&
                              "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                            tool.color === "yellow" &&
                              "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
                            tool.color === "pink" &&
                              "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
                          )}
                        >
                          <tool.icon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "font-medium",
                                pathname === tool.href ? "text-primary" : "",
                              )}
                            >
                              {tool.title}
                            </span>
                            {tool.isFree && (
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-600 dark:text-green-400"
                              >
                                Free
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {tool.description}
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
