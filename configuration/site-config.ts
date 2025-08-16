// config/navbar.ts
import {
  CreditCard,
  LucideIcon,
  SearchIcon,
  Settings,
  User,
} from "lucide-react";

import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
};

export const siteConfig: SiteConfig = {
  name: "Spy Tool",
  description:
    "Get your project off to an explosive start with SaaS Starter! Harness the power of Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui and Stripe to build your next big thing.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
};

export interface NavbarConfig {
  name: string;
  colors: string[];
  url: string;
  logo: {
    type: "icon" | "image";
    value: LucideIcon | string;
  };
}

export const NavbarConfig: NavbarConfig = {
  name: siteConfig.name,
  colors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  url: siteConfig.url,
  logo: {
    type: "icon",
    value: Settings,
  },
};

export const AvatarMenuConfig = [
  { title: "Profile", href: "/settings/profile", icon: User },
  { title: "Billing", href: "/settings/billing", icon: CreditCard },
  { title: "Account", href: "/settings/account", icon: Settings },
];

// Example of how to use with image logo:
// export const Config: NavbarConfig = {
//   name: "Spy Tool",
//   colors: ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
//   url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//   logo: {
//     type: "image",
//     value: "/logo.png",
//   },
// };

export const FOOTER_CONFIG = {
  brand: {
    name: siteConfig.name,
    description:
      "Discover winning products & ads instantly with our all-in-one tool for scaling sales & boosting eCom profits.",
  },
  navigation: {
    quickLinks: [
      { name: "Ad Search", href: "/search" },
      { name: "Analytics", href: "/analytics" },
      { name: "Pricing", href: "/pricing" },
      { name: "About", href: "/about" },
    ],
    legalLinks: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
      { name: "Return Policy", href: "/return-policy" },
    ],
  },
  contact: {
    title: "Need Help?",
    description: "Get instant support from our team of experts",
    button: {
      text: "Contact Support",
      href: "/support",
      availability: "Available 24/7 • Response within 2 hours",
    },
  },
  social: {
    links: [
      {
        name: "Twitter",
        href: "https://twitter.com/adsearch",
        icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
      },
      {
        name: "GitHub",
        href: "https://github.com/adsearch",
        icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com/company/adsearch",
        icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 100 4 2 2 0 000-4z",
      },
    ],
  },
};
