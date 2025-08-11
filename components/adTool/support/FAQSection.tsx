// components/support/FAQSection.tsx
// ✨ New FAQ Section Component using Shadcn Accordion ✨

"use client";

import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import Shadcn Accordion components

// Define the structure for FAQ items
interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode; // Answer can include JSX for links, etc.
}

// Sample FAQ data - Replace with your actual FAQs
const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I reset my password?",
    answer: (
      <p>
        You can reset your password by clicking the &quot;Forgot Password?&quot;
        link on the login page. Follow the instructions sent to your registered
        email address. If you encounter issues, please contact support via the
        email form above.
      </p>
    ),
  },
  {
    id: "faq-2",
    question: "What are the subscription plan options?",
    answer: (
      <p>
        We offer several subscription plans tailored to different needs, from
        individual users to large teams. You can find detailed information about
        features and pricing on our{" "}
        <a
          href="/pricing"
          className="text-[#6566F1] underline hover:text-[#B977F8]"
        >
          Pricing Page
        </a>
        .
      </p>
    ),
  },
  {
    id: "faq-3",
    question: "How does the ad search filtering work?",
    answer: (
      <p>
        Our powerful filtering system allows you to narrow down ad searches
        based on various criteria such as keywords, advertiser, platform (e.g.,
        Facebook, Google), ad format, date range, country, and more. Combine
        filters for highly specific results. Explore the search interface to see
        all available options.
      </p>
    ),
  },
  {
    id: "faq-4",
    question: "Can I export ad data or creatives?",
    answer: (
      <p>
        Yes, depending on your subscription plan, you may have options to export
        search results data (CSV) and download ad creatives (images, videos) for
        analysis or reference. Check your plan details for specific export
        limits and capabilities.
      </p>
    ),
  },
  {
    id: "faq-5",
    question: "What is your data privacy policy?",
    answer: (
      <p>
        We take data privacy very seriously. You can review our complete privacy
        policy{" "}
        <a
          href="/privacy"
          className="text-[#6566F1] underline hover:text-[#B977F8]"
        >
          here
        </a>
        . We comply with relevant regulations like GDPR and CCPA.
      </p>
    ),
  },
];

export function FAQSection() {
  return (
    // Use type="single" for one-at-a-time expansion, collapsible allows closing
    <Accordion type="single" collapsible className="w-full space-y-3">
      {faqData.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="rounded-lg border border-gray-200 bg-white px-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/60"
        >
          <AccordionTrigger className="py-4 text-left text-base font-medium text-gray-800 hover:no-underline dark:text-gray-100">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-sm text-gray-600 dark:text-gray-300">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
