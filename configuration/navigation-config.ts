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
    color:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    id: "dropshipping-calculator",
    title: "Dropshipping Calculator",
    href: "/tools/dropshipping-calculator",
    description: "Estimate dropshipping costs, margins, and potential profits",
    icon: ShoppingBag,
    isFree: false,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    id: "cpa-calculator",
    title: "CPA Calculator",
    href: "/tools/cpa-calculator",
    description: "Analyze Cost Per Acquisition metrics for your campaigns",
    icon: DollarSign,
    isFree: false,
    color:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    id: "affiliate-calculator",
    title: "Affiliate Marketing Calculator",
    href: "/tools/affiliate-calculator",
    description: "Track affiliate commissions and conversion metrics",
    icon: LineChart,
    isFree: true,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
  },
];

export const Deals = [
  {
    title: "Shopify",
    url: "https://example.com/shopify",
    description: "Exclusive 30% discount on Shopify plans",
    icon: ShoppingBag,
    discountCode: "Free",
    gradient: "bg-gradient-to-r from-green-400 to-green-500 text-white",
    titleClass: "font-semibold tracking-tight",
  },
  {
    title: "TikTok Ads",
    url: "https://example.com/tiktok",
    description: "Grab a special 20% discount on TikTok ads",
    icon: TrendingUp,
    discountCode: "Gift",
    gradient: "bg-black text-white dark:bg-white dark:text-black",
    titleClass: "font-semibold tracking-tight",
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
    id: "setup",
    title: "Setup",
    href: "/setup",
    description: "setup and Documentation guide",
    icon: Settings,
    isFree: false,
    color: "pink",
  },
];
