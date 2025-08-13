// app/support/page.tsx
// ✨ Main component for the Support Page ✨

"use client";

// This page uses client-side interactivity (form state, animations)
import React from "react";
import Link from "next/link";
import {
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircleQuestion,
  MessageSquare,
  MessageSquareText,
  Send,
} from "lucide-react";

// Using MessageSquare for WhatsApp

import { Button } from "@/components/ui/button"; // Shadcn Button

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TitleSection from "@/components/adTool/sharedComponents/TitleSection";
import { ContactForm } from "@/components/adTool/support/ContactForm";
import { FAQSection } from "@/components/adTool/support/FAQSection";

export default function SupportPage() {
  // 📞 Replace with your actual WhatsApp number
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24 dark:from-gray-900 dark:to-gray-800">
      <TitleSection
        icon={Send}
        iconColor="text-purple-500 dark:text-purple-400"
        badgeText="We're Here to Help"
        image={HelpCircle}
        imageColor="text-green-500 dark:text-green-400"
        highlightedText="Support"
        remainingTitle="Center"
        auroraColors={["#f87171", "#fbbf24", "#34d399", "#60a5fa"]}
        description=" Find answers, get assistance, and explore resources. Our team is
                available during business hours (Mon-Fri, 9am-5pm UTC) and aims
                to respond within 24 hours."
      />

      {/* --- Contact Options Section --- */}
      <div className="relative mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* --- Email Contact Card --- */}
          <Card className="overflow-hidden border-gray-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/60 dark:shadow-purple-900/10 dark:hover:shadow-purple-900/20">
            <CardHeader className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-6 dark:from-gray-800/70 dark:to-gray-700/70">
              <div className="flex items-center space-x-3">
                <Mail className="h-7 w-7 text-[#B977F8]" />
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Send us an Email
                </CardTitle>
              </div>
              <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Best for detailed inquiries or non-urgent requests. Please
                provide as much detail as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Render the Contact Form Component */}
              <ContactForm />
            </CardContent>
          </Card>

          {/* --- WhatsApp Contact Card --- */}
          <Card className="overflow-hidden border-gray-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/60 dark:shadow-green-900/10 dark:hover:shadow-green-900/20">
            <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-6 dark:from-gray-800/70 dark:to-gray-700/70">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-7 w-7 text-green-500" />
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Chat on WhatsApp
                </CardTitle>
              </div>
              <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Ideal for quick questions or urgent support during business
                hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">
                Click the button below to start a chat directly with our support
                team on WhatsApp.
              </p>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg focus-visible:ring-green-400"
                size="lg" // Make button larger
              >
                <Link
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contact via WhatsApp
                </Link>
              </Button>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Standard messaging rates may apply. Available Mon-Fri, 9am-5pm
                UTC.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- FAQ Section --- */}
      <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 md:mt-24 lg:px-8">
        <div>
          <div className="mb-10 flex flex-col items-center text-center">
            <HelpCircle className="mb-3 h-10 w-10 text-[#6566F1]" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
              Have questions? Find quick answers below. If you can&apos;t find
              what you&apos;re looking for, feel free to reach out.
            </p>
          </div>
          {/* Render the FAQ Component */}
          <FAQSection />
        </div>
      </div>
    </div>
  );
}
