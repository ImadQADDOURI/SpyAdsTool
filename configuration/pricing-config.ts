import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "Essential Tools to Get Started",
    benefits: [
      "Limited ad search with filters",
      "Full Chrome Extension access",
      "Business calculators (eCommerce, dropshipping, CPA)",
      "Community support",
    ],
    limitations: [
      "No pagination",
      "No advertiser insights",
      "No analytics dashboard",
      "No media downloads",
      "No favorites & boards",
      "No trending ads",
      "No store/product insights",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "Complete Intelligence Suite",
    benefits: [
      "Unlimited ad search with pagination",
      "Advertiser pages with stats & ad library",
      "Full analytics: scale history, EU & world stats, keywords",
      "AI creative generator",
      "Download ad media (video, image, thumbnail)",
      "Unlimited favorites & board management",
      "Trending ads by category",
      "Hot stores & products with insights",
      "Full Chrome Extension access",
      "All business tools & calculators",
      "Priority email support",
    ],
    limitations: [],
    prices: {
      monthly: 29,
      yearly: 290,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = ["starter", "pro"] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Ad Search & Filters",
    starter: "Limited",
    pro: "Unlimited + Pagination",
    tooltip:
      "Search ads with filters. Pro includes pagination for unlimited browsing.",
  },
  {
    feature: "Advertiser Intelligence",
    starter: null,
    pro: "Full Access",
    tooltip:
      "View advertiser profiles, stats, ad library, and performance insights.",
  },
  {
    feature: "Analytics Dashboard",
    starter: null,
    pro: "Complete Suite",
    tooltip:
      "Scale history, EU & world stats, keyword analysis, and performance metrics.",
  },
  {
    feature: "AI Creative Generator",
    starter: null,
    pro: true,
    tooltip: "Generate ad creatives using AI-powered tools.",
  },
  {
    feature: "Download Ad Media",
    starter: null,
    pro: "Video, Image, Thumbnail",
    tooltip: "Download all ad assets including videos, images, and thumbnails.",
  },
  {
    feature: "Favorites & Boards",
    starter: null,
    pro: "Unlimited",
    tooltip: "Save and organize ads with full media in custom boards.",
  },
  {
    feature: "Trending Ads",
    starter: null,
    pro: "By Category",
    tooltip: "Discover trending ads filtered by category with pagination.",
  },
  {
    feature: "Stores & Products",
    starter: null,
    pro: "Full Database",
    tooltip: "Access hot stores and products with stats, search, and sorting.",
  },
  {
    feature: "Chrome Extension",
    starter: true,
    pro: true,
    tooltip:
      "Shopify tracker, best sellers, TikTok/Facebook downloader, ad library saver.",
  },
  {
    feature: "Business Calculators",
    starter: true,
    pro: true,
    tooltip: "eCommerce, dropshipping, and CPA calculators for all users.",
  },
  {
    feature: "Support",
    starter: "Community",
    pro: "Priority Email",
    tooltip: "Get faster responses with priority support on Pro.",
  },
];

// Payment methods configuration
export const paymentMethods = [
  {
    name: "Visa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
  },
  {
    name: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/88/MasterCard_early_1990s_logo.svg",
  },
  {
    name: "American Express",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Warner-Amex_logo.svg",
  },
  {
    name: "Discover",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg",
  },
  {
    name: "JCB",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg",
  },
  {
    name: "UnionPay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg",
  },
  {
    name: "Apple Pay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg",
  },
  {
    name: "Google Pay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg",
  },
  {
    name: "Klarna",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/Klarna_Payment_Badge.svg",
  },
  {
    name: "SEPA Direct Debit",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Single_Euro_Payments_Area_logo.svg",
  },
];

export const pricingFaqData = [
  {
    id: "item-1",
    question: "What's included in the free Starter plan?",
    answer:
      "The Starter plan includes limited ad search with full filter access and free access to all business calculators (eCommerce, dropshipping, CPA). It's perfect for exploring the platform before upgrading.",
  },
  {
    id: "item-2",
    question: "How much does the Pro plan cost?",
    answer:
      "The Pro plan is $29 per month or $290 per year (save $58 with annual billing). It includes unlimited access to all features including ad analytics, trending ads, advertiser insights, and AI tools.",
  },
  {
    id: "item-3",
    question: "What's the difference between Starter and Pro?",
    answer:
      "Pro unlocks unlimited ad search with pagination, advertiser pages, comprehensive analytics, AI creative generator, trending ads, hot stores/products insights, and the ability to save ads to boards with full media. Starter provides basic search and free calculator tools.",
  },
  {
    id: "item-4",
    question: "Can I try Pro features before subscribing?",
    answer:
      "You can explore the Starter plan for free, which gives you access to basic search and all calculator tools. This helps you understand the platform before deciding if Pro is right for you.",
  },
  {
    id: "item-5",
    question: "Can I cancel my Pro subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your current billing period, then you'll automatically revert to the Starter plan.",
  },
  {
    id: "item-6",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover), digital wallets (Apple Pay, Google Pay), and other payment methods through our secure payment processor Stripe.",
  },
  {
    id: "item-7",
    question: "Is my payment information secure?",
    answer:
      "Yes, all payments are processed securely through Stripe, a PCI DSS compliant payment processor. We never store your credit card information on our servers.",
  },
  {
    id: "item-8",
    question: "What are the AI-powered features in Pro?",
    answer:
      "Pro includes an AI creative generator to help you create ad concepts, advanced keyword analysis powered by AI, and intelligent insights based on advertising trends and performance data.",
  },
];
