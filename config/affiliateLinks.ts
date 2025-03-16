import {
  CloudLightning,
  Coffee,
  Gift,
  LucideIcon,
  Star,
  Zap,
} from "lucide-react";

// 🔤 Types and interfaces for strong typing
export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: AffiliateCategory;
  icon: LucideIcon;
  discountCode?: string;
  gradient: {
    from: string;
    to: string;
  };
}

export type AffiliateCategory = "hosting" | "tools" | "services" | "products";

// 🎨 Gradients available for affiliate links - with enhanced color intensity
export const gradients = {
  purple: {
    from: "#6566F1",
    to: "#B977F8",
  },
  blue: {
    from: "#2563EB",
    to: "#06B6D4",
  },
  green: {
    from: "#059669",
    to: "#34D399",
  },
  orange: {
    from: "#EA580C",
    to: "#F59E0B",
  },
  red: {
    from: "#DC2626",
    to: "#EF4444",
  },
};

// ⚙️ Configuration settings
export const affiliateConfig = {
  // Maximum number of links to display in navbar before showing in popover
  // Set to -1 to make it fully responsive (will adjust based on available space)
  maxNavbarLinks: 2,
};

// 📋 Affiliate links configuration
export const affiliateLinks: AffiliateLink[] = [
  {
    id: "digitalocean",
    title: "DigitalOcean",
    url: "https://example.com/digitalocean",
    description: "Get $100 in free credit",
    category: "hosting",
    icon: CloudLightning,
    discountCode: "DO100",
    gradient: gradients.red,
  },
  {
    id: "vercel",
    title: "Vercel",
    url: "https://example.com/vercel",
    description: "Pro plan 20% off",
    category: "hosting",
    icon: Zap,
    gradient: gradients.green,
  },
  {
    id: "stripe",
    title: "Stripe",
    url: "https://example.com/stripe",
    description: "No fees for 3 months",
    category: "services",
    icon: Star,
    discountCode: "STRIPE3",
    gradient: gradients.green,
  },
  {
    id: "buymeacoffee",
    title: "Buy Me a Coffee",
    url: "https://example.com/coffee",
    description: "Support this project",
    category: "products",
    icon: Coffee,
    gradient: gradients.orange,
  },
  {
    id: "gumroad",
    title: "Gumroad",
    url: "https://example.com/gumroad",
    description: "Special templates",
    category: "products",
    icon: Gift,
    gradient: gradients.purple,
  },
];

// 🔍 Helper function to get links by category
export const getLinksByCategory = (
  category: AffiliateCategory,
): AffiliateLink[] => {
  return affiliateLinks.filter((link) => link.category === category);
};
