// app/support/page.tsx
// ✨ Main component for the Support Page ✨

"use client";

// This page uses client-side interactivity (form state, animations)
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, LifeBuoy, Mail, MessageSquare } from "lucide-react"; // Using MessageSquare for WhatsApp

import { Button } from "@/components/ui/button"; // Shadcn Button

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FirefliesWrapper from "@/components/adLibrary/microComponents/FirefliesWrapper";
import { ContactForm } from "@/components/adLibrary/support/ContactForm";
import { FAQSection } from "@/components/adLibrary/support/FAQSection";

export default function SupportPage() {
  // 📞 Replace with your actual WhatsApp number
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24 dark:from-gray-900 dark:to-gray-800">
      <FirefliesWrapper>
        {/* --- Support Page Header --- */}
        <div className="group relative overflow-hidden py-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6566F1]/5 via-transparent to-[#B977F8]/5" />
          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-5 text-center"
            >
              <div className="flex items-center space-x-3">
                <LifeBuoy className="h-8 w-8 text-[#6566F1]" />
                <span className="rounded-full bg-[#6566F1]/10 px-5 py-1.5 text-base font-medium text-[#6566F1]">
                  We&apos;re Here to Help
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-transparent">
                  Support Center
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl">
                Find answers, get assistance, and explore resources. Our team is
                available during business hours (Mon-Fri, 9am-5pm UTC) and aims
                to respond within 24 hours.
              </p>
              <div className="relative pt-5">
                <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-[#6566F1]/50 to-[#B977F8]/50 transition-all duration-500 ease-in-out group-hover:w-36 group-hover:from-[#6566F1]/70 group-hover:to-[#B977F8]/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-xl" />
              </div>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-900" />
        </div>
      </FirefliesWrapper>

      {/* --- Contact Options Section --- */}
      <div className="relative mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
        >
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
        </motion.div>
      </div>

      {/* --- FAQ Section --- */}
      <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 md:mt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }} // Animate when scrolling into view
          viewport={{ once: true, amount: 0.3 }} // Trigger animation once
          transition={{ duration: 0.7, delay: 0.3 }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}
