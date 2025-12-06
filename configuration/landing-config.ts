import {
  BarChart,
  BarChart3,
  Bookmark,
  Bot,
  Brain,
  Calculator,
  ChartPie,
  Cpu,
  Database,
  Download,
  Earth,
  Euro,
  FileText,
  Filter,
  Folder,
  Search,
  TrendingUp,
} from "lucide-react";

// 🎨 Centralized Configuration - Easy to customize landing page in one place

export const heroConfig = {
  // Animation settings
  animations: {
    flipWordsDuration: 2500,
  },

  // Background settings
  background: {
    opacity: 0.4,
    mouseInfluence: 0.3,
    colors: {
      blue: "59, 130, 246",
      purple: "147, 51, 234",
      pink: "236, 72, 153",
    },
  },

  // Particles settings
  particles: {
    quantity: 20,
    preset: "cosmic" as const,
    size: 0.3,
    speed: 0.8,
  },

  // Content
  flipWords: ["Ads", "Products", "Stores", "Trends"],
  videoUrl:
    "https://assets-static.invideo.io/files/Invideo_Demo_HP_18_10_2024_V001_1921f1aee3.mp4",

  // 🖼️ Floating Image heroConfiguration - Centralized positioning and settings
  heroImage: {
    id: "main",
    src: "/landing images/hero.png",
    alt: "Hero banner 1",
    animation: {
      floatAmplitude: 20,
      floatSpeed: 10,
      delay: 0.5,
    },
    settings: {
      glass: false,
    },
  },

  // 🏷️ Feature Pills heroConfiguration - Centralized positioning and styling
  featurePills: [
    {
      id: "ai-insights",
      text: "AI-Insights",
      icon: Bot,
      position: {
        className: "absolute -left-8 top-16 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 4,
        floatSpeed: 6,
        delay: 0.8,
      },
      styling: {
        textClass: "text-gray-600 dark:text-gray-800 font-semibold text-sm",
        iconClass: "w-4 h-4 text-blue-400 dark:text-blue-500",
      },
    },
    {
      id: "ads-database",
      text: "10M+ Ads",
      icon: Database,
      position: {
        className: "absolute -right-4 top-10 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 5,
        floatSpeed: 7,
        delay: 1.2,
      },
      styling: {
        textClass: "text-purple-700 dark:text-purple-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-purple-600 dark:text-purple-400",
      },
    },
    {
      id: "visual-analytics",
      text: "Analytics",
      icon: BarChart3,
      position: {
        className: "absolute -left-10 bottom-1/3 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 6,
        floatSpeed: 8,
        delay: 1.6,
      },
      styling: {
        textClass: "text-pink-700 dark:text-pink-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-pink-600 dark:text-pink-400",
      },
    },
    {
      id: "download-media",
      text: "Media",
      icon: Download,
      position: {
        className: "absolute right-6 -bottom-1 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 4,
        floatSpeed: 6,
        delay: 2,
      },
      styling: {
        textClass: "text-cyan-700 dark:text-cyan-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-cyan-600 dark:text-cyan-400",
      },
    },
    {
      id: "save-boards",
      text: "Boards",
      icon: Bookmark,
      position: {
        className: "absolute left-8 -bottom-2 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 5,
        floatSpeed: 7,
        delay: 2.4,
      },
      styling: {
        textClass:
          "text-emerald-700 dark:text-emerald-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-emerald-600 dark:text-emerald-400",
      },
    },
    {
      id: "profit-calculator",
      text: "Calculator",
      icon: Calculator,
      position: {
        className: "absolute -right-14 bottom-3/5 z-30 hidden lg:block",
      },
      animation: {
        floatAmplitude: 6,
        floatSpeed: 8,
        delay: 2.8,
      },
      styling: {
        textClass: "text-orange-700 dark:text-orange-300 font-semibold text-sm",
        iconClass: "w-4 h-4 text-orange-600 dark:text-orange-400",
      },
    },
  ],
};

export const trustedBySectionConfig = [
  {
    name: "Shopify",
    logo: "/landing images/trusted/Shopify.svg",
  },
  {
    name: "TikTok",
    logo: "/landing images/trusted/TikTok.svg",
  },
  { name: "Google", logo: "/landing images/trusted/Google.svg" },
  {
    name: "woocommerce",
    logo: "/landing images/trusted/woocommerce.svg",
  },
  {
    name: "Microsoft",
    logo: "/landing images/trusted/Microsoft.svg",
  },
  {
    name: "Instagram",
    logo: "/landing images/trusted/Instagram.svg",
  },
  {
    name: "aliexpress",
    logo: "/landing images/trusted/aliexpress.svg",
  },
  {
    name: "Gemini",
    logo: "/landing images/trusted/Gemini.svg",
  },
  {
    name: "trustpilot",
    logo: "/landing images/trusted/trustpilot.svg",
  },
  {
    name: "stripe",
    logo: "/landing images/trusted/stripe.svg",
  },
  {
    name: "wise",
    logo: "/landing images/trusted/wise.svg",
  },
];

export const featuresConfig = [
  {
    id: "1",
    title: "Facebook AdSpy",
    highlightText: "Search & Filters",
    description:
      "Find profitable products with AI-powered discovery. Access millions of active campaigns.",
    image: "/landing images/feutures/f1.png",
    accentColor: "#3b82f6", // blue-500
    auroraColors: ["#3b82f6", "#60a5fa", "#2563eb", "#0ea5e9"], // blue -> sky
    stats: [
      { label: "Active Ads", value: "10M+" },
      { label: "Success", value: "94%" },
      { label: "Updates", value: "24/7" },
    ],
    Icon: Search,
  },
  {
    id: "2",
    title: "Visual",
    highlightText: "Analytics",
    description:
      "Search with 15+ filter types. Find exactly what you need with precision targeting.",
    image: "/landing images/feutures/f3.png",
    accentColor: "#8b5cf6", // violet-500
    auroraColors: ["#8b5cf6", "#a78bfa", "#7c3aed", "#ec4899"], // violet -> pink mix
    stats: [
      { label: "Filters", value: "15+" },
      { label: "Database", value: "50M+" },
      { label: "Speed", value: "<0.1s" },
    ],
    Icon: Filter,
  },
  {
    id: "3",
    title: "Hot",
    highlightText: "Product",
    description:
      "Get insights with visual dashboard. Track performance and identify trends.",
    image: "/landing images/feutures/f2.png",
    accentColor: "#10b981", // emerald-500
    auroraColors: ["#10b981", "#34d399", "#059669", "#14b8a6"], // emerald -> teal
    stats: [
      { label: "Data Points", value: "1B+" },
      { label: "Accuracy", value: "99.9%" },
      { label: "Real-time", value: "Live" },
    ],
    Icon: BarChart,
  },
  {
    id: "4",
    title: "Powerful",
    highlightText: "Calculator",
    description:
      "Leverage AI-powered tools and calculators. Get instant recommendations.",
    image: "/landing images/feutures/f5.png",
    accentColor: "#f59e0b", // amber-500
    auroraColors: ["#f59e0b", "#fbbf24", "#d97706", "#ef4444"], // amber -> orange/red hint
    stats: [
      { label: "AI Models", value: "8+" },
      { label: "Accuracy", value: "96%" },
      { label: "Processing", value: "Instant" },
    ],
    Icon: Cpu,
  },
  // {
  //   id: "organize",
  //   title: "Save &",
  //   highlightText: "Organize",
  //   description:
  //     "Download media and organize findings. Keep track of strategies with cloud storage.",
  //   image: "/landing images/feutures/f2.png",
  //   accentColor: "#06b6d4", // cyan-500
  //   auroraColors: ["#06b6d4", "#22d3ee", "#0891b2", "#3b82f6"], // cyan -> blue mix
  //   stats: [
  //     { label: "Downloads", value: "∞" },
  //     { label: "Storage", value: "Cloud" },
  //     { label: "Boards", value: "Custom" },
  //   ],
  //   Icon: Folder,
  // },
];

export const TrendingConfig = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline: {
    prefix: "Discover",
    highlight: "Top Performing",
    suffix: "Market Leaders",
  },
  subtitle:
    "Explore the most successful ads, products, and stores dominating today's market. Get actionable insights and scale your business with proven winners.",
  ctas: {
    ads: "View Top Ads",
    products: "Explore Products",
    stores: "Browse Stores",
  },
  // 🔥 Sample trending ads data
  sampleAds: [
    {
      id: 1,
      image: "/landing images/trending/ads/1.png",
      name: "Viral Product Launch Ad",
    },
    {
      id: 2,
      image: "/landing images/trending/ads/2.png",
      name: "Social Media Campaign",
    },
    {
      id: 3,
      image: "/landing images/trending/ads/3.png",
      name: "E-commerce Promo Ad",
    },
    {
      id: 4,
      image: "/landing images/trending/ads/4.png",
      name: "Brand Awareness Campaign",
    },
    {
      id: 5,
      image: "/landing images/trending/ads/5.png",
      name: "Brand Awareness Campaign",
    },
  ],
  sampleProducts: [
    {
      id: 1,
      image: "/landing images/trending/product/1.png",
      name: "Wireless Earbuds Pro",
    },
    {
      id: 2,
      image: "/landing images/trending/product/2.png",
      name: "Smart Fitness Watch",
    },
    {
      id: 3,
      image: "/landing images/trending/product/3.png",
      name: "Portable Phone Charger",
    },
    {
      id: 4,
      image: "/landing images/trending/product/4.png",
      name: "LED Strip Lights",
    },
    {
      id: 5,
      image: "/landing images/trending/product/5.png",
      name: "LED Strip Lights",
    },
    {
      id: 6,
      image: "/landing images/trending/product/6.png",
      name: "LED Strip Lights",
    },
  ],
  sampleStores: [
    {
      id: 1,
      image: "/landing images/trending/store/1.png",
      name: "TechGadgets Pro",
    },
    {
      id: 2,
      image: "/landing images/trending/store/2.png",
      name: "Fashion Forward",
    },
    {
      id: 3,
      image: "/landing images/trending/store/3.png",
      name: "Home & Living",
    },
    {
      id: 4,
      image: "/landing images/trending/store/4.png",
      name: "Sports Central",
    },
    {
      id: 5,
      image: "/landing images/trending/store/5.png",
      name: "Sports Central",
    },
  ],
};

export const EXTENSION_CONFIG = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline: {
    prefix: "Powerful",
    highlight: "Browser Extension",
    suffix: "For Ad Research",
  },
  subtitle:
    "Analyze ads directly from your browser. Save time and boost productivity with our powerful extension that integrates seamlessly with your workflow.",
  ctaText: "Install Extension",
  ctaLink: "https://chrome.google.com/webstore",
  screenshots: [
    {
      id: 1,
      image: "landing images/extension/1.png",
      alt: "",
    },
    {
      id: 2,
      image: "landing images/extension/2.png",
      alt: "",
    },
    {
      id: 3,
      image: "landing images/extension/3.png",
      alt: "",
    },
    {
      id: 4,
      image: "landing images/extension/4.png",
      alt: "",
    },
  ],
};

export const analyticsConfig = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline: {
    prefix: "Powerful",
    highlight: "Analytics",
    suffix: "Dashboard",
  },
  subtitle:
    "Get deep insights into your ad performance with our comprehensive analytics suite. Track metrics, analyze trends, and make data-driven decisions.",
  tabs: [
    {
      id: "1",
      label: "Analytics",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500", // 🎨 Custom color for Overview
      image: "/landing images/analytics/1.png",
      alt: "Analytics Overview Dashboard",
    },
    {
      id: "2",
      label: "Eu Stats",
      icon: ChartPie,
      color: "from-green-500 to-emerald-500", // 🎨 Custom color for Performance
      image: "/landing images/analytics/2.png",
      alt: "Performance Analytics",
    },
    {
      id: "3",
      label: "World Stats",
      icon: Earth,
      color: "from-purple-500 to-violet-500", // 🎨 Custom color for Insights
      image: "/landing images/analytics/3.png",
      alt: "AI-Powered Insights",
    },
    {
      id: "4",
      label: "AI Creative",
      icon: Bot,
      color: "from-orange-500 to-red-500", // 🎨 Custom color for Reports
      image: "/landing images/analytics/4.png",
      alt: "Custom Reports",
    },
  ],
  stats: [
    { label: "Data Points Analyzed", value: "10M+", icon: "BarChart" },
    { label: "Real-time Updates", value: "24/7", icon: "Zap" },
    { label: "Custom Reports", value: "Unlimited", icon: "TrendingUp" },
    { label: "Export Formats", value: "5+", icon: "Download" },
  ],
  animation: {
    stagger: 0.1,
    duration: 0.6,
  },
};

export const pricing_CTA_Config = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline: {
    prefix: "Simple",
    highlight: "Pricing",
    suffix: "for your business",
  },
  subtitle: "Plans that are carefully crafted to suit your business.",
};

export const testimonials = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],

  headline: {
    prefix: "What Our",
    highlight: "Users",
    suffix: "Are Saying",
  },
  subtitle:
    "Real feedback from our community—see how they're scaling faster with our platform.",
  reviews: [
    {
      author: {
        name: "Emma Thompson",
        handle: "@emmaai",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      },
      text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
      rating: 5, // ⭐ rating
      href: "https://twitter.com/emmaai",
      screenshot: "/landing images/review/1.png",
    },
    {
      author: {
        name: "David Park",
        handle: "@davidtech",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
      rating: 5,
      href: "https://twitter.com/davidtech",
      screenshot: "/landing images/review/2.png",
    },
    {
      author: {
        name: "Sofia Rodriguez",
        handle: "@sofiaml",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive.",
      href: "https://twitter.com/emmaai",

      rating: 4,
      screenshot: "/landing images/review/3.png",
    },
    {
      author: {
        name: "Emma Thompson",
        handle: "@emmaai",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      },
      text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
      rating: 5,
      href: "https://twitter.com/emmaai",
      screenshot: "/landing images/review/4.png",
    },
    {
      author: {
        name: "David Park",
        handle: "@davidtech",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
      rating: 5,
      href: "https://twitter.com/davidtech",
      screenshot: "/landing images/review/5.png",
    },
    {
      author: {
        name: "David Park",
        handle: "@davidtech",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
      rating: 4,
      href: "https://twitter.com/davidtech",
      screenshot: "/landing images/review/6.png",
    },
    {
      author: {
        name: "David Park",
        handle: "@davidtech",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
      rating: 5,
      href: "https://twitter.com/davidtech",
      screenshot: "/landing images/review/7.png",
    },
  ],
};

export const CTA_CONFIG = {
  gradientColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  headline: {
    prefix: "Start",
    highlight: "Winning",
    suffix: "",
  },
  subtitle: "",
  bg_image: "/landing images/World_map_with_points.svg",
  button: {
    text: "Get Started Free",
    href: "/pricing",
    external: false,
  },
  pills: [
    { text: "No credit card", icon: "credit-card" },
    { text: "Cancel anytime", icon: "check" },
    { text: "No setup fees", icon: "check" },
  ],
};
