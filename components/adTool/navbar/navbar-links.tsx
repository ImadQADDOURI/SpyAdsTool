"use client";

import { title } from "process";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  CloudLightning,
  DollarSign,
  Facebook,
  File,
  Flag,
  Heart,
  LineChart,
  LucideIcon,
  PackageOpen,
  PocketKnife,
  Search,
  Settings,
  ShoppingBag,
  Store,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

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

export const Links = [
  { title: "Pricing", href: "/pricing", icon: DollarSign },
  { title: "AdSearch", href: "/adsearch", icon: Search },
  { title: "Favorites", href: "/favorites", icon: Heart },
  { title: "Trend", href: "/trend", icon: TrendingUp },
  { title: "Top Stores", href: "/top-stores", icon: Store },
  { title: "Top Products", href: "/top-products", icon: PackageOpen },
];

export const Tools = [
  {
    id: "cod-calculator",
    title: "COD Calculator",
    href: "/tools/cod-calculator",
    description: "Calculate Cash on Delivery fees and profit margins instantly",
    icon: Calculator,
    isFree: true,
    color: "purple",
  },
  {
    id: "dropshipping-calculator",
    title: "Dropshipping Calculator",
    href: "/tools/dropshipping-calculator",
    description: "Estimate dropshipping costs, margins, and potential profits",
    icon: ShoppingBag,
    isFree: false,
    color: "blue",
  },
  {
    id: "cpa-calculator",
    title: "CPA Calculator",
    href: "/tools/cpa-calculator",
    description: "Analyze Cost Per Acquisition metrics for your campaigns",
    icon: DollarSign,
    isFree: false,
    color: "yellow",
  },
  {
    id: "affiliate-calculator",
    title: "Affiliate Marketing Calculator",
    href: "/tools/affiliate-calculator",
    description: "Track affiliate commissions and conversion metrics",
    icon: LineChart,
    isFree: true,
    color: "pink",
  },
];

// Deal buttons data
export const Deals = [
  {
    title: "Shopify",
    url: "https://example.com/shopify",
    description: "Exclusive 30% discount on Shopify plans",
    icon: ShoppingBag,
    discountCode: "SHOP30",
    gradient: "from-pink-500 to-purple-500",
  },
  {
    title: "TikTok",
    url: "https://example.com/tiktok",
    description: "Grab a special 20% discount on TikTok ads",
    icon: TrendingUp,
    discountCode: "TIKTOK20",
    gradient: "from-blue-500 to-green-500",
  },
];

export const AdminLinks = [
  {
    id: "meta-graphql-configs",
    title: "Meta Graphql Configs",
    href: "/meta-graphql-configs",
    description: "",
    icon: Facebook,
    isFree: false,
    color: "purple",
  },
  {
    id: "top-products-config",
    title: "Products Config",
    href: "/top-products-config",
    description: "",
    icon: PackageOpen,
    isFree: false,
    color: "blue",
  },
  {
    id: "top-stores-config",
    title: "Stores Config",
    href: "/top-stores-config",
    description: "",
    icon: Store,
    isFree: false,
    color: "yellow",
  },
  {
    id: "documentation",
    title: "Documentation",
    href: "/documentation",
    description: "Access comprehensive documentation",
    icon: File,
    isFree: false,
    color: "pink",
  },
];

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
