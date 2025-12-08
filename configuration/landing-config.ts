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
  Flame,
  Folder,
  Globe,
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
  avatarImages: [
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
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
      "Lightning-fast ad discovery with explosive filter power. Uncover winning creatives in seconds.",
    image: "/landing images/feutures/f1.png",
    accentColor: "#3b82f6",
    auroraColors: ["#3b82f6", "#60a5fa", "#2563eb", "#0ea5e9"],
    stats: [
      { label: "Ad Library", value: "10M+" },
      { label: "History Depth", value: "2018 → Now" },
      { label: "Filters", value: "10+ PRO" },
    ],
    Icon: Globe,
  },
  {
    id: "2",
    title: "Breakdown & Insights",
    highlightText: "Analytics",
    description:
      "Instant deep-dive analytics. Track countries, scale patterns, and growth signals effortlessly.",
    image: "/landing images/feutures/f3.png",
    accentColor: "#8b5cf6",
    auroraColors: ["#8b5cf6", "#a78bfa", "#7c3aed", "#ec4899"],
    stats: [
      { label: "Coverage", value: "EU + Worldwide" },
      { label: "Metrics", value: "20+ KPIs" },
      { label: "History", value: "Scale Path" },
    ],
    Icon: BarChart,
  },
  {
    id: "3",
    title: "Winning Dropshipping",
    highlightText: "Products",
    description:
      "Find hot products before they explode. Real-time signals. High-velocity validation.",
    image: "/landing images/feutures/f2.png",
    accentColor: "#10b981",
    auroraColors: ["#10b981", "#34d399", "#059669", "#14b8a6"],
    stats: [
      { label: "Hot Score", value: "🔥 High" },
      { label: "Refresh Rate", value: "Real-Time" },
      { label: "Validation", value: "Instant" },
    ],
    Icon: Flame,
  },
  {
    id: "4",
    title: "Profit Power Tools",
    highlightText: "Calculators",
    description:
      "Maximize profit instantly. ROAS, margins, break-even, scaling… all auto-calculated.",
    image: "/landing images/feutures/f5.png",
    accentColor: "#f59e0b",
    auroraColors: ["#f59e0b", "#fbbf24", "#d97706", "#ef4444"],
    stats: [
      { label: "Precision", value: "99.9%" },
      { label: "Inputs", value: "All-In-One" },
      { label: "Speed", value: "Instant" },
    ],
    Icon: Calculator,
  },
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
    {
      id: 6,
      image: "/landing images/trending/ads/6.png",
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
        name: "Chris D.",
        handle: "@chrisd",
        avatar:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face",
      },
      text: "Adlofy’s interface is incredibly intuitive. I found my next winning product in under an hour—something that used to take me all day with other platforms. Time is money, and Adlofy saves me both. A must-have tool!",
      rating: 5,
      href: "#",
      screenshot: "/landing images/review/1.png",
    },
    {
      author: {
        name: "Zara K.",
        handle: "@zarak",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      },
      text: "The influencer-tracking feature is priceless. I can see exactly which creators drive sales for competitors—giving me the perfect blueprint for my own strategy. My ROI has improved massively since tracking data accurately.",
      rating: 5,
      href: "#",
      screenshot: "/landing images/review/2.png",
    },
    {
      author: {
        name: "Omar F.",
        handle: "@omarfx",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      },
      text: "Before Adlofy, I was guessing which ads to run. Their data doesn’t just show what sells—it shows how and where it’s being promoted. It completely changed my strategy overnight and boosted my conversions.",
      rating: 5,
      href: "#",
      screenshot: "/landing images/review/3.png",
    },
    {
      author: {
        name: "Jessica H.",
        handle: "@jessh",
        avatar:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
      },
      text: "I’ve been in e-commerce for years and tried every spy tool. Adlofy is simply the best product research solution out there. The constant updates show how dedicated the team is to staying ahead of the curve.",
      rating: 5,
      href: "#",
      screenshot: "/landing images/review/4.png",
    },
    {
      author: {
        name: "Malik",
        handle: "@malik",
        avatar:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
      },
      text: "Adlofy drastically cut my operational costs. I used to subscribe to multiple tools to get half the features Adlofy offers. Now, everything is in one place—and this month alone, I hit $30,971.74 in revenue. Incredible ROI!",
      rating: 5,
      href: "#",
      screenshot: "/landing images/review/5.png",
    },
    {
      author: {
        name: "Tom",
        handle: "@tomcommerce",
        avatar:
          "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=150&h=150&fit=crop&crop=face",
      },
      text: "I rarely leave reviews, but Adlofy deserves it. A friend recommended it, and the free trial convinced me to try. As a beginner, it helped me tremendously—I earned $12,556.63 in two months and tripled my focus.",
      rating: 5,
      href: "#",
      screenshot: "/landing images/review/6.png",
    },
    {
      author: {
        name: "Triaina",
        handle: "@triaina",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      text: "I’ve used adspy tools for years, and Adlofy is easily the best I’ve come across. The insights are next-level. My store crossed $2,71.247 this period thanks to the strategies I discovered here.",
      rating: 5,
      href: "#",
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
