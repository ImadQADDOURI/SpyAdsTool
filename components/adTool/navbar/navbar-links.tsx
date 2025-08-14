"use client";

import { title } from "process";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, PocketKnife } from "lucide-react";

import { cn } from "@/lib/utils";

import { Links, Tools } from "../configuration/navigation";
import { CollapsibleDropdown } from "./collapsible-dropdown";

interface NavbarLinksProps {
  pathname: string;
}

interface LinkItem {
  id: string;
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  isFree: boolean;
  color: string;
}

export interface CollapsibleDropdownProps {
  pathname: string;
  title: string;
  icon: LucideIcon;
  showFreeBadge?: boolean;
  links: LinkItem[];
}

export function NavbarLinks({ pathname }: NavbarLinksProps) {
  return (
    <nav className="flex items-center gap-1 md:gap-2">
      {Links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group relative px-2 py-1.5"
        >
          <motion.div
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all",
              pathname === link.href
                ? "bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <link.icon
              className={cn(
                "size-4",
                pathname === link.href
                  ? "text-purple-500"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span>{link.title}</span>
          </motion.div>
          {pathname === link.href && (
            <motion.span
              className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-3/5 rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8]"
              layoutId="navbar-active-indicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </Link>
      ))}

      {/* Tools Dropdown */}
      <CollapsibleDropdown
        pathname={pathname}
        title="Tools"
        icon={PocketKnife}
        showFreeBadge={true}
        links={Tools}
      />
    </nav>
  );
}
