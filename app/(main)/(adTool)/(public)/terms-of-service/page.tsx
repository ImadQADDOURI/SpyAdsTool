import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  ExternalLink,
  FileText,
  Mail,
  Scale,
  Shield,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service | Ad Search & Management Platform",
  description:
    "Read our Terms of Service to understand the rules and guidelines for using our ad search and management platform.",
  keywords:
    "terms of service, user agreement, SaaS terms, platform rules, legal agreement, service conditions",
  openGraph: {
    title: "Terms of Service - Platform Rules & Guidelines",
    description:
      "Clear terms and conditions for using our ad management platform.",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2024";

  const sections = [
    { id: "acceptance", title: "Acceptance of Terms", icon: FileText },
    { id: "service-description", title: "Service Description", icon: Shield },
    { id: "user-accounts", title: "User Accounts", icon: Shield },
    { id: "acceptable-use", title: "Acceptable Use", icon: Scale },
    { id: "payment-terms", title: "Payment Terms", icon: CreditCard },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: Shield,
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: AlertTriangle,
    },
    { id: "termination", title: "Termination", icon: AlertTriangle },
    { id: "contact", title: "Contact Information", icon: Mail },
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
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Scale className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Terms of Service
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
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    By using our service, you agree to these terms. Please read
                    them carefully before using our platform.
                  </AlertDescription>
                </Alert>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    Welcome to our ad search and management platform. These
                    Terms of Service (&quot;Terms&quot;) govern your use of our
                    software-as-a-service platform and related services provided
                    by our company.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    These terms constitute a legally binding agreement between
                    you and our company. By accessing or using our service, you
                    acknowledge that you have read, understood, and agree to be
                    bound by these terms.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ✅ Acceptance of Terms */}
            <Card id="acceptance">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Acceptance of Terms
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    By accessing or using our service, you agree to be bound by
                    these Terms of Service and all applicable laws and
                    regulations.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li>
                      You must be at least 18 years old to use our service
                    </li>
                    <li>
                      You must have the legal capacity to enter into this
                      agreement
                    </li>
                    <li>
                      If you&apos;re using the service on behalf of a company,
                      you must have authority to bind that entity
                    </li>
                    <li>
                      You agree to comply with all applicable local, state,
                      national, and international laws
                    </li>
                  </ul>
                  <p className="mt-4 text-slate-700 dark:text-slate-300">
                    If you do not agree to these terms, you may not access or
                    use our service.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 🛠️ Service Description */}
            <Card id="service-description">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Service Description
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    Our platform provides ad search, analysis, and management
                    tools designed to help businesses optimize their advertising
                    efforts.
                  </p>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Service Features
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>Ad search and discovery tools</li>
                      <li>Performance analytics and reporting</li>
                      <li>Campaign management features</li>
                      <li>Data export and integration capabilities</li>
                      <li>Customer support and documentation</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Service Availability
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        We strive for 99.9% uptime but cannot guarantee
                        uninterrupted service
                      </li>
                      <li>
                        Scheduled maintenance will be announced in advance when
                        possible
                      </li>
                      <li>
                        We reserve the right to modify or discontinue features
                        with notice
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 👤 User Accounts */}
            <Card id="user-accounts">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    User Accounts
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Account Registration
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        You must provide accurate and complete information when
                        creating an account
                      </li>
                      <li>
                        You are responsible for maintaining the confidentiality
                        of your account credentials
                      </li>
                      <li>
                        You must notify us immediately of any unauthorized use
                        of your account
                      </li>
                      <li>
                        One person or entity may not maintain multiple accounts
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Account Security
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>Use strong, unique passwords for your account</li>
                      <li>Enable two-factor authentication when available</li>
                      <li>Do not share your account credentials with others</li>
                      <li>Log out of shared or public computers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ⚖️ Acceptable Use */}
            <Card id="acceptable-use">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Scale className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Acceptable Use Policy
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-green-200 p-6 dark:border-green-800">
                      <h3 className="mb-3 text-lg font-semibold text-green-800 dark:text-green-300">
                        ✅ Permitted Uses
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <li>Legitimate business advertising research</li>
                        <li>Competitive analysis for your own business</li>
                        <li>Educational and research purposes</li>
                        <li>Compliance with advertising regulations</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-red-200 p-6 dark:border-red-800">
                      <h3 className="mb-3 text-lg font-semibold text-red-800 dark:text-red-300">
                        ❌ Prohibited Uses
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <li>Illegal activities or content</li>
                        <li>Harassment or abusive behavior</li>
                        <li>Spam or unsolicited communications</li>
                        <li>Reverse engineering or data scraping</li>
                        <li>Violating intellectual property rights</li>
                        <li>Circumventing security measures</li>
                      </ul>
                    </div>
                  </div>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Violation of this Acceptable Use Policy may result in
                      immediate account suspension or termination without
                      refund.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* 💳 Payment Terms */}
            <Card id="payment-terms">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Payment Terms
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Subscription Plans
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        Subscription fees are billed in advance on a monthly or
                        annual basis
                      </li>
                      <li>
                        All payments are processed securely through Stripe
                      </li>
                      <li>Prices are subject to change with 30 days notice</li>
                      <li>
                        No refunds for partial months unless specified in our
                        Refund Policy
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Payment Processing
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        You authorize us to charge your payment method for all
                        fees
                      </li>
                      <li>Failed payments may result in service suspension</li>
                      <li>You&apos;re responsible for all taxes and fees</li>
                      <li>
                        Currency conversion fees may apply for international
                        payments
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Cancellation
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>You may cancel your subscription at any time</li>
                      <li>
                        Cancellation takes effect at the end of your current
                        billing period
                      </li>
                      <li>
                        No refunds for unused portions of your subscription
                      </li>
                      <li>See our Return Policy for refund eligibility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🔒 Intellectual Property */}
            <Card id="intellectual-property">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Intellectual Property
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Our Rights
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        We own all rights to our platform, software, and related
                        intellectual property
                      </li>
                      <li>
                        Our trademarks, logos, and brand elements are protected
                      </li>
                      <li>
                        You may not copy, modify, or distribute our software
                      </li>
                      <li>
                        We grant you a limited, non-exclusive license to use our
                        service
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Your Rights
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        You retain ownership of data you upload to our platform
                      </li>
                      <li>
                        You grant us permission to process your data to provide
                        our service
                      </li>
                      <li>You can export your data at any time</li>
                      <li>We will not use your data for competing services</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ⚠️ Limitation of Liability */}
            <Card id="limitation-liability">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Limitation of Liability
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <Alert className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This section limits our liability. Please read carefully
                      to understand your rights and our responsibilities.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Service Disclaimer
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        Our service is provided &quot;as is&quot; without
                        warranties of any kind
                      </li>
                      <li>
                        We do not guarantee the accuracy or completeness of data
                      </li>
                      <li>
                        We are not responsible for third-party content or
                        services
                      </li>
                      <li>Use of our service is at your own risk</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Liability Limits
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        Our total liability is limited to the amount you paid in
                        the last 12 months
                      </li>
                      <li>
                        We are not liable for indirect, incidental, or
                        consequential damages
                      </li>
                      <li>
                        We are not responsible for business losses or lost
                        profits
                      </li>
                      <li>
                        Some jurisdictions may not allow these limitations
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🚫 Termination */}
            <Card id="termination">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Termination
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Your Right to Terminate
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>You may terminate your account at any time</li>
                      <li>
                        Cancellation can be done through your account dashboard
                      </li>
                      <li>
                        Your data will be available for export for 30 days after
                        cancellation
                      </li>
                      <li>
                        We will permanently delete your data after the retention
                        period
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Our Right to Terminate
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        We may suspend or terminate accounts for violations of
                        these terms
                      </li>
                      <li>We may terminate accounts for non-payment</li>
                      <li>
                        We will provide notice when possible, except for serious
                        violations
                      </li>
                      <li>
                        Terminated accounts are not eligible for refunds unless
                        required by law
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 📧 Contact Information */}
            <Card id="contact">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Contact Information
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-6 text-slate-700 dark:text-slate-300">
                    If you have questions about these Terms of Service, please
                    contact our support team.
                  </p>

                  <div className="rounded-lg bg-slate-50 p-6 text-center dark:bg-slate-800">
                    <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
                      Questions About Our Terms?
                    </h3>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">
                      Our support team can help clarify any questions about
                      these terms and your rights.
                    </p>
                    <Button asChild size="lg">
                      <Link href="/support" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Visit Support Center
                      </Link>
                    </Button>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      We respond to legal inquiries within 5 business days
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
                      href="/privacy-policy"
                      className="flex items-center gap-2"
                    >
                      Privacy Policy
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
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
                      href="/acceptable-use"
                      className="flex items-center gap-2"
                    >
                      Acceptable Use Policy
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
