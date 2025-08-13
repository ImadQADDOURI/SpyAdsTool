import {
  BarChart,
  BarChart3,
  Bookmark,
  Bot,
  Brain,
  Calculator,
  Cpu,
  Database,
  Download,
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

  // 🖼️ Floating Images heroConfiguration - Centralized positioning and settings
  heroImages: [
    {
      id: "main-center",
      src: "https://adsparo.com/home/assets/svg/hero-banner/2.svg",
      alt: "Main hero banner",
      position: {
        className: "relative z-20",
      },
      animation: {
        floatAmplitude: 8,
        floatSpeed: 6,
        delay: 0,
      },
      settings: {
        glass: true,
        lens: true,
        zoomFactor: 1.3,
        priority: true,
      },
    },
    {
      id: "top-left",
      src: "https://adsparo.com/home/assets/svg/hero-banner/1.svg",
      alt: "Hero banner 1",
      position: {
        className: "absolute left-0 top-0 z-10",
      },
      animation: {
        floatAmplitude: 6,
        floatSpeed: 8,
        delay: 0.5,
      },
      settings: {
        glass: true,
        lens: true,
        priority: true,
      },
    },
    {
      id: "top-right",
      src: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
      alt: "Hero banner 2",
      position: {
        className: "absolute right-0 top-8 z-10",
      },
      animation: {
        floatAmplitude: 7,
        floatSpeed: 7,
        delay: 1,
      },
      settings: {
        glass: true,
        lens: true,
      },
    },
    {
      id: "bottom-left",
      src: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
      alt: "Hero banner 4",
      position: {
        className: "absolute bottom-8 left-8 z-10",
      },
      animation: {
        floatAmplitude: 5,
        floatSpeed: 9,
        delay: 1.5,
      },
      settings: {
        glass: true,
        lens: true,
      },
    },
    {
      id: "bottom-right",
      src: "https://adsparo.com/home/assets/svg/hero-banner/1.svg",
      alt: "Hero banner 5",
      position: {
        className: "absolute bottom-0 right-8 z-10",
      },
      animation: {
        floatAmplitude: 6,
        floatSpeed: 8,
        delay: 2,
      },
      settings: {
        glass: true,
        lens: true,
      },
    },
  ],

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
        className: "absolute -right-8 top-4 z-30 hidden lg:block",
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
    // {
    //   id: "visual-analytics",
    //   text: "Analytics",
    //   icon: BarChart3,
    //   position: {
    //     className: "absolute -left-12 top-1/2 z-30 hidden lg:block",
    //   },
    //   animation: {
    //     floatAmplitude: 6,
    //     floatSpeed: 8,
    //     delay: 1.6,
    //   },
    //   styling: {
    //     textClass: "text-pink-700 dark:text-pink-300 font-semibold text-sm",
    //     iconClass: "w-4 h-4 text-pink-600 dark:text-pink-400",
    //   },
    // },
    {
      id: "download-media",
      text: "Media",
      icon: Download,
      position: {
        className: "absolute -right-12 top-1/2 z-30 hidden lg:block",
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
        className: "absolute -left-8 bottom-4 z-30 hidden lg:block",
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
        className: "absolute -right-8 bottom-16 z-30 hidden lg:block",
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
  { name: "Google", logo: "https://cdn.magicui.design/companies/Google.svg" },
  {
    name: "Microsoft",
    logo: "https://cdn.magicui.design/companies/Microsoft.svg",
  },
  { name: "Amazon", logo: "https://cdn.magicui.design/companies/Amazon.svg" },
  {
    name: "Netflix",
    logo: "https://cdn.magicui.design/companies/Netflix.svg",
  },
  {
    name: "YouTube",
    logo: "https://cdn.magicui.design/companies/YouTube.svg",
  },
  {
    name: "Instagram",
    logo: "https://cdn.magicui.design/companies/Instagram.svg",
  },
  { name: "Uber", logo: "https://cdn.magicui.design/companies/Uber.svg" },
  {
    name: "Spotify",
    logo: "https://cdn.magicui.design/companies/Spotify.svg",
  },
];

export const featuresConfig = [
  {
    id: "discover",
    title: "Discover",
    highlightText: "Winning Products",
    description:
      "Find profitable products with AI-powered discovery. Access millions of active campaigns.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
    background:
      "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 30%, #16213e 70%, #0f1419 100%)",
    accentColor: "#3b82f6",
    stats: [
      { label: "Active Ads", value: "10M+" },
      { label: "Success", value: "94%" },
      { label: "Updates", value: "24/7" },
    ],
    Icon: Search,
  },
  {
    id: "search",
    title: "Advanced",
    highlightText: "Search & Filters",
    description:
      "Search with 15+ filter types. Find exactly what you need with precision targeting.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/1.svg",
    background:
      "linear-gradient(135deg, #0f0a0f 0%, #1a0f1a 30%, #2d1b3d 70%, #1a0f1a 100%)",
    accentColor: "#8b5cf6",
    stats: [
      { label: "Filters", value: "15+" },
      { label: "Database", value: "50M+" },
      { label: "Speed", value: "<0.1s" },
    ],
    Icon: Filter,
  },
  {
    id: "analytics",
    title: "Visual",
    highlightText: "Analytics",
    description:
      "Get insights with visual dashboard. Track performance and identify trends.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
    background:
      "linear-gradient(135deg, #0a0f0a 0%, #1a1a0f 30%, #2d2d1b 70%, #1a1a0f 100%)",
    accentColor: "#10b981",
    stats: [
      { label: "Data Points", value: "1B+" },
      { label: "Accuracy", value: "99.9%" },
      { label: "Real-time", value: "Live" },
    ],
    Icon: BarChart,
  },
  {
    id: "ai-tools",
    title: "Built-in",
    highlightText: "AI Tools",
    description:
      "Leverage AI-powered tools and calculators. Get instant recommendations.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/2.svg",
    background:
      "linear-gradient(135deg, #0f0a0f 0%, #1a0f1a 30%, #3d1b2d 70%, #1a0f1a 100%)",
    accentColor: "#f59e0b",
    stats: [
      { label: "AI Models", value: "8+" },
      { label: "Accuracy", value: "96%" },
      { label: "Processing", value: "Instant" },
    ],
    Icon: Cpu,
  },
  {
    id: "organize",
    title: "Save &",
    highlightText: "Organize",
    description:
      "Download media and organize findings. Keep track of strategies with cloud storage.",
    image: "https://adsparo.com/home/assets/svg/hero-banner/3.svg",
    background:
      "linear-gradient(135deg, #0f0f0f 0%, #0f1a1a 30%, #1b2d3d 70%, #0f1a1a 100%)",
    accentColor: "#06b6d4",
    stats: [
      { label: "Downloads", value: "∞" },
      { label: "Storage", value: "Cloud" },
      { label: "Boards", value: "Custom" },
    ],
    Icon: Folder,
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
      image: "/placeholder.svg?height=280&width=180",
      name: "Viral Product Launch Ad",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=280&width=180",
      name: "Social Media Campaign",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=280&width=180",
      name: "E-commerce Promo Ad",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=280&width=180",
      name: "Brand Awareness Campaign",
    },
  ],
  sampleProducts: [
    {
      id: 1,
      image: "/placeholder.svg?height=280&width=180",
      name: "Wireless Earbuds Pro",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=280&width=180",
      name: "Smart Fitness Watch",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=280&width=180",
      name: "Portable Phone Charger",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=280&width=180",
      name: "LED Strip Lights",
    },
  ],
  sampleStores: [
    {
      id: 1,
      image: "/placeholder.svg?height=280&width=180",
      name: "TechGadgets Pro",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=280&width=180",
      name: "Fashion Forward",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=280&width=180",
      name: "Home & Living",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=280&width=180",
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
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Extension Dashboard",
    },
    {
      id: 2,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Ad Analysis Feature",
    },
    {
      id: 3,
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Quick Save Feature",
    },
  ],
};

export const analyticsConfig = {
  headline: {
    prefix: "Powerful",
    highlight: "Analytics",
    suffix: "Dashboard",
  },
  subtitle:
    "Get deep insights into your ad performance with our comprehensive analytics suite. Track metrics, analyze trends, and make data-driven decisions.",
  tabs: [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500", // 🎨 Custom color for Overview
      image:
        "https://static.wixstatic.com/media/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c746c3_ae71f0f45ecf49d2a75d0c8d0b3ede9c~mv2.png",
      alt: "Analytics Overview Dashboard",
    },
    {
      id: "performance",
      label: "Performance",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500", // 🎨 Custom color for Performance
      image:
        "https://cdn-useast1.kapwing.com/static/templates/blank-iphone-x-and-11-frame-mockup-template-full-4521e68d.webp?height=600&width=800",
      alt: "Performance Analytics",
    },
    {
      id: "insights",
      label: "Insights",
      icon: Brain,
      color: "from-purple-500 to-violet-500", // 🎨 Custom color for Insights
      image: "/placeholder.svg?height=540&width=960",
      alt: "AI-Powered Insights",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      color: "from-orange-500 to-red-500", // 🎨 Custom color for Reports
      image: "/placeholder.svg?height=540&width=960",
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

export const testimonials = [
  {
    author: {
      name: "Emma Thompson",
      handle: "@emmaai",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
    rating: 5, // ⭐ Add rating to each testimonial
    href: "https://twitter.com/emmaai",
  },
  {
    author: {
      name: "David Park",
      handle: "@davidtech",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
    rating: 5, // ⭐ Add rating
    href: "https://twitter.com/davidtech",
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@sofiaml",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive.",
    rating: 4, // ⭐ Add rating (showing variation)
  },
];

export const CTA_CONFIG = {
  content: {
    headline: {
      beforeText: "Start",
      highlightText: "Winning",
      highlightColors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
    },
    button: {
      text: "Get Started Free",
      href: "/signup",
      external: false,
    },
    pills: [
      { text: "No credit card", icon: "credit-card" }, // 💳 Added credit card pill
      { text: "Cancel anytime", icon: "check" },
      { text: "No setup fees", icon: "check" },
    ],
  },
  styling: {
    section: {
      padding: "py-16 md:py-20 lg:py-24", // 📏 Reduced from py-32/40/48
    },
    headline: {
      sizes: "text-4xl md:text-6xl lg:text-7xl xl:text-8xl", // 📏 Significantly reduced from text-6xl/8xl/9xl/10rem
      spacing: "mb-8", // 📏 Reduced from mb-12
    },
    button: {
      padding: "px-8 py-4", // 📏 Reduced from px-16 py-8
      textSize: "text-lg", // 📏 Reduced from text-2xl
      borderRadius: "rounded-full",
    },
    pills: {
      spacing: "mt-6", // 📏 Reduced from mt-10
      gap: "gap-3", // 📏 Reduced from gap-4
      padding: "px-4 py-2", // 📏 Reduced from px-5 py-3
      textSize: "text-xs", // 📏 Reduced from text-sm
    },
  },
  animation: {
    backgroundBlur: "blur-3xl",
    pulseSpeed: "4s",
    delays: {
      button: "0.2s", // 📏 Reduced delays
      pills: "0.3s",
      pillStagger: "0.08s",
    },
  },
};

export const FOOTER_CONFIG = {
  brand: {
    name: "AdSearch",
    description:
      "Discover winning products & ads instantly with our all-in-one tool for scaling sales & boosting eCom profits.",
    logo: {
      colors: "from-pink-500 to-purple-600",
      size: "w-10 h-10",
      borderRadius: "rounded-xl",
    },
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
  styling: {
    backgroundColor: "#0F1123",
    gradientBorder:
      "linear-gradient(90deg, rgba(236, 72, 153, 0.5) 0%, rgba(139, 92, 246, 0.5) 50%, rgba(59, 130, 246, 0.5) 100%)",
    padding: {
      top: "pt-16",
      bottom: "pb-8",
      section: "mb-12",
    },
    grid: {
      brand: "lg:col-span-5",
      links: "lg:col-span-3",
      contact: "lg:col-span-4",
    },
  },
  animation: {
    delays: {
      brand: "0s",
      links: "0.2s",
      contact: "0.4s",
      social: "0.2s",
      socialStagger: "0.1s",
      linkStagger: "0.05s",
    },
  },
};
