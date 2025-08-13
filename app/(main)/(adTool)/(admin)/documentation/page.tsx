import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Code } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdditionalResourcesSection } from "@/components/adTool/documentation/additional-resources-section";
import { AuthSection } from "@/components/adTool/documentation/auth-section";
import { ChromeExtensionSection } from "@/components/adTool/documentation/chrome-extension-section";
import { CloudflareSection } from "@/components/adTool/documentation/cloudflare-section";
import { ConfigSection } from "@/components/adTool/documentation/config-section";
import { DatabaseSection } from "@/components/adTool/documentation/database-section";
import { DeploymentSection } from "@/components/adTool/documentation/deployment-section";
import { EnvironmentSection } from "@/components/adTool/documentation/environment-section";
import { GeminiSection } from "@/components/adTool/documentation/gemini-section";
// Import documentation sections
import { IntroductionSection } from "@/components/adTool/documentation/introduction-section";
import { QuickStartSection } from "@/components/adTool/documentation/quick-start-section";
import { ResendSection } from "@/components/adTool/documentation/resend-section";
import { StripeSection } from "@/components/adTool/documentation/stripe-section";
import { TechStackSection } from "@/components/adTool/documentation/tech-stack-section";

export const metadata: Metadata = {
  title: "Developer Documentation | Ad Search & Management Platform",
  description:
    "Complete setup guide for developers. Learn how to configure environment variables, set up APIs, and deploy the ad search platform.",
  keywords:
    "developer docs, setup guide, API configuration, environment variables, Next.js, Stripe, Gemini AI",
  openGraph: {
    title: "Developer Documentation - Setup Guide",
    description:
      "Complete developer guide for setting up the ad search platform.",
  },
};

export default function DeveloperDocsPage() {
  const lastUpdated = "January 15, 2024";

  const sections = [
    { id: "overview", title: "Tech Stack Overview", icon: Code },
    { id: "quick-start", title: "Quick Start", icon: Code },
    { id: "environment", title: "Environment Variables", icon: Code },
    { id: "database", title: "Database Setup", icon: Code },
    { id: "auth", title: "NextAuth & Google OAuth", icon: Code },
    { id: "stripe", title: "Stripe Integration", icon: Code },
    { id: "gemini", title: "Gemini AI Setup", icon: Code },
    { id: "cloudflare", title: "Cloudflare R2 Storage", icon: Code },
    { id: "resend", title: "Email with Resend", icon: Code },
    { id: "chrome-extension", title: "Chrome Extension", icon: Code },
    { id: "config", title: "Configuration Files", icon: Code },
    { id: "deployment", title: "Deployment Guide", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header Section */}
      <div className="top-0 z-10 border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Developer Documentation
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Complete setup guide • Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Table of Contents */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
                  Documentation
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Link
                        key={section.id}
                        href={`#${section.id}`}
                        className="flex items-center gap-3 rounded-lg p-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      >
                        <Icon className="h-4 w-4" />
                        {section.title}
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <IntroductionSection />
            <TechStackSection />
            <QuickStartSection />
            <EnvironmentSection />
            <DatabaseSection />
            <AuthSection />
            <StripeSection />
            <GeminiSection />
            <CloudflareSection />
            <ResendSection />
            <ChromeExtensionSection />
            <ConfigSection />
            <DeploymentSection />
            <AdditionalResourcesSection />
          </div>
        </div>
      </div>
    </div>
  );
}
