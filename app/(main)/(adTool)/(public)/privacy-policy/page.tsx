import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  Database,
  ExternalLink,
  Eye,
  Mail,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | Ad Search & Management Platform",
  description:
    "Learn how we collect, use, and protect your personal information. Our comprehensive privacy policy explains our data practices and your rights.",
  keywords:
    "privacy policy, data protection, GDPR, CCPA, personal information, cookies, data security",
  openGraph: {
    title: "Privacy Policy - Your Data Protection Rights",
    description:
      "Transparent privacy practices for our ad search and management platform.",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
    },
    { id: "information-use", title: "How We Use Information", icon: Eye },
    { id: "information-sharing", title: "Information Sharing", icon: Shield },
    { id: "cookies", title: "Cookies & Tracking", icon: Cookie },
    { id: "data-security", title: "Data Security", icon: Shield },
    { id: "your-rights", title: "Your Rights", icon: Shield },
    { id: "contact", title: "Contact Us", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* 🎨 Header Section */}
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
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Privacy Policy
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* 📋 Table of Contents */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
                  Table of Contents
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

          {/* 📄 Main Content */}
          <div className="space-y-8">
            {/* 🏢 Introduction */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    This Privacy Policy describes how our ad search and
                    management platform (&quot;we,&quot; &quot;our,&quot; or
                    &quot;us&quot;) collects, uses, and protects your personal
                    information when you use our services.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    We are committed to protecting your privacy and ensuring
                    transparency in our data practices. This policy complies
                    with applicable privacy laws including GDPR, CCPA, and other
                    regional regulations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 📊 Information Collection */}
            <Card id="information-collection">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Information We Collect
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Information You Provide
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        Account information (name, email address, password)
                      </li>
                      <li>Profile information and preferences</li>
                      <li>
                        Payment information (processed securely through Stripe)
                      </li>
                      <li>Communications with our support team</li>
                      <li>Ad campaign data and search queries</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Information We Collect Automatically
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>Usage data and analytics</li>
                      <li>Device information and browser type</li>
                      <li>IP address and location data</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🎯 Information Use */}
            <Card id="information-use">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    How We Use Information
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    We use your information to:
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li>
                      Provide and improve our ad search and management services
                    </li>
                    <li>Process payments and manage subscriptions</li>
                    <li>Send important updates and notifications</li>
                    <li>Provide customer support</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Comply with legal obligations</li>
                    <li>Prevent fraud and ensure platform security</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 🤝 Information Sharing */}
            <Card id="information-sharing">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Information Sharing
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    We do not sell your personal information. We may share
                    information with:
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li>
                      <strong>Service Providers:</strong> Stripe for payment
                      processing, email service providers
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> When required by law
                      or to protect our rights
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> In connection with
                      mergers or acquisitions
                    </li>
                    <li>
                      <strong>With Your Consent:</strong> When you explicitly
                      authorize sharing
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 🍪 Cookies */}
            <Card id="cookies">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Cookie className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Cookies & Tracking Technologies
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze site usage and performance</li>
                    <li>Provide personalized experiences</li>
                    <li>Ensure security and prevent fraud</li>
                  </ul>
                  <p className="mt-4 text-slate-700 dark:text-slate-300">
                    You can control cookies through your browser settings. Note
                    that disabling cookies may affect site functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 🔒 Data Security */}
            <Card id="data-security">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Data Security
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    We implement industry-standard security measures including:
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Access controls and authentication</li>
                    <li>Secure payment processing through Stripe</li>
                    <li>Regular software updates and patches</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* ⚖️ Your Rights */}
            <Card id="your-rights">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Your Rights
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    Depending on your location, you may have the right to:
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Delete your account and data</li>
                    <li>Port your data to another service</li>
                    <li>Opt-out of certain data processing</li>
                    <li>Object to automated decision-making</li>
                  </ul>
                  <p className="mt-4 text-slate-700 dark:text-slate-300">
                    To exercise these rights, please contact us using the
                    information below.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 📧 Contact */}
            <Card id="contact">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Contact Us
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-6 text-slate-700 dark:text-slate-300">
                    If you have questions about this Privacy Policy or our data
                    practices, please contact our support team.
                  </p>

                  <div className="rounded-lg bg-slate-50 p-6 text-center dark:bg-slate-800">
                    <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
                      Need Help?
                    </h3>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">
                      Visit our support center for comprehensive help, live
                      chat, and to submit tickets.
                    </p>
                    <Button asChild size="lg">
                      <Link href="/support" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Visit Support Center
                      </Link>
                    </Button>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      We respond to privacy requests within 30 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🔗 Related Links */}
            <Card>
              <CardContent className="p-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Related Policies
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" asChild>
                    <Link
                      href="/return-policy"
                      className="flex items-center gap-2"
                    >
                      Return Policy
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link
                      href="/terms-of-service"
                      className="flex items-center gap-2"
                    >
                      Terms of Service
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link
                      href="/cookie-policy"
                      className="flex items-center gap-2"
                    >
                      Cookie Policy
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
