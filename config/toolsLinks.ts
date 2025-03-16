import {
  Calculator,
  DollarSign,
  LineChart,
  LucideIcon,
  ShoppingBag,
} from "lucide-react";

// 🔤 Types and interfaces for strong typing
export interface ToolLink {
  id: string;
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  isFree?: boolean;
  isNew?: boolean;
  gradient?: {
    from: string;
    to: string;
  };
}

// 🎨 Default gradient for tools
const defaultGradient = {
  from: "#6566F1",
  to: "#B977F8",
};

// 📋 Tools links configuration
export const toolsLinks: ToolLink[] = [
  {
    id: "cod-calculator",
    title: "COD Calculator",
    href: "/tools/cod-calculator",
    description: "Calculate Cash on Delivery fees and profit margins instantly",
    icon: Calculator,
    isFree: true,
    gradient: {
      from: "#6566F1",
      to: "#B977F8",
    },
  },
  {
    id: "dropshipping-calculator",
    title: "Dropshipping Calculator",
    href: "/tools/dropshipping-calculator",
    description: "Estimate dropshipping costs, margins, and potential profits",
    icon: ShoppingBag,
    isFree: true,
    gradient: {
      from: "#2563EB",
      to: "#06B6D4",
    },
  },
  {
    id: "cpa-calculator",
    title: "CPA Calculator",
    href: "/tools/cpa-calculator",
    description: "Analyze Cost Per Acquisition metrics for your campaigns",
    icon: DollarSign,
    isFree: true,
    isNew: true,
    gradient: {
      from: "#059669",
      to: "#34D399",
    },
  },
  {
    id: "affiliate-calculator",
    title: "Affiliate Marketing Calculator",
    href: "/tools/affiliate-calculator",
    description: "Track affiliate commissions and conversion metrics",
    icon: LineChart,
    isFree: true,
    isNew: false,
    gradient: {
      from: "#EA580C",
      to: "#F59E0B",
    },
  },
];

// 🔍 Helper functions
export const getToolsCount = (): number => toolsLinks.length;
export const getFreeToolsCount = (): number =>
  toolsLinks.filter((tool) => tool.isFree).length;
