"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  CloudLightning,
  DollarSign,
  Heart,
  LineChart,
  Search,
  ShoppingBag,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";

import { NavbarToolsDropdown } from "./navbar-tools-dropdown";

interface NavbarLinksProps {
  pathname: string;
}
export const Links = [
  {
    title: "Pricing",
    href: "/pricing",
    icon: DollarSign,
  },
  {
    title: "AdSearch",
    href: "/adsearch",
    icon: Search,
  },
  {
    title: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    title: "Trend",
    href: "/trend",
    icon: TrendingUp,
  },
  {
    title: "Top Stores",
    href: "/top-stores",
    icon: Store,
  },
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
    title: "DigitalOcean",
    url: "https://example.com/digitalocean",
    description: "Get $100 in free credit",
    icon: CloudLightning,
    discountCode: "DO100",
    gradient: "from-red-500 to-orange-500",
  },
  {
    title: "Vercel",
    url: "https://example.com/vercel",
    description: "Pro plan 20% off",
    icon: Zap,
    gradient: "from-green-500 to-emerald-500",
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
      <NavbarToolsDropdown pathname={pathname} />
    </nav>
  );
}
