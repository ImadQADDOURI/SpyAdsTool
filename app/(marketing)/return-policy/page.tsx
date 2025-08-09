import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  CreditCard,
  ExternalLink,
  Mail,
  RefreshCw,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Ad Search & Management Platform",
  description:
    "Learn about our return and refund policy for our SaaS platform. Understand cancellation terms, refund eligibility, and billing practices.",
  keywords:
    "return policy, refund policy, cancellation, billing, subscription, SaaS refunds, Stripe payments",
  openGraph: {
    title: "Return & Refund Policy - Fair and Transparent",
    description:
      "Clear refund and cancellation terms for our ad management platform.",
  },
};

export default function ReturnPolicyPage() {
  const lastUpdated = "January 15, 2024";

  const sections = [
    { id: "overview", title: "Policy Overview", icon: RefreshCw },
    {
      id: "subscription-cancellation",
      title: "Subscription Cancellation",
      icon: Clock,
    },
    { id: "refund-eligibility", title: "Refund Eligibility", icon: CreditCard },
    { id: "refund-process", title: "Refund Process", icon: RefreshCw },
    { id: "billing-disputes", title: "Billing Disputes", icon: AlertCircle },
    { id: "contact", title: "Contact Support", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* 🎨 Header Section */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
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
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <RefreshCw className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Return & Refund Policy
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
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This policy applies to all subscriptions and purchases made
                    through our platform. All payments are processed securely
                    through Stripe.
                  </AlertDescription>
                </Alert>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    We strive to provide exceptional value through our ad search
                    and management platform. This Return & Refund Policy
                    outlines our fair and transparent approach to cancellations,
                    refunds, and billing disputes.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    As a Software-as-a-Service (SaaS) platform, our services are
                    delivered digitally and consumed upon access. This policy
                    complies with applicable consumer protection laws and
                    Stripe&apos;s payment processing requirements.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 📊 Policy Overview */}
            <Card id="overview">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Policy Overview
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
                      <h3 className="mb-3 text-lg font-semibold text-green-800 dark:text-green-300">
                        ✅ What We Offer
                      </h3>
                      <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                        <li>30-day money-back guarantee for new subscribers</li>
                        <li>Cancel anytime with no penalties</li>
                        <li>
                          Prorated refunds for annual plans (first 30 days)
                        </li>
                        <li>
                          Full refund for technical issues we cannot resolve
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-6 dark:bg-amber-900/20">
                      <h3 className="mb-3 text-lg font-semibold text-amber-800 dark:text-amber-300">
                        ⚠️ Important Notes
                      </h3>
                      <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                        <li>Services are consumed upon access</li>
                        <li>Data export available before cancellation</li>
                        <li>Refunds processed within 5-10 business days</li>
                        <li>
                          Third-party integrations may have separate terms
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ⏰ Subscription Cancellation */}
            <Card id="subscription-cancellation">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Subscription Cancellation
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      How to Cancel
                    </h3>
                    <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>1. Log into your account dashboard</li>
                      <li>2. Navigate to &quot;Billing & Subscription&quot;</li>
                      <li>3. Click &quot;Cancel Subscription&quot;</li>
                      <li>4. Follow the confirmation steps</li>
                      <li>5. Receive email confirmation</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Cancellation Terms
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>Immediate Effect:</strong> Cancellation takes
                        effect at the end of your current billing period
                      </li>
                      <li>
                        <strong>Data Access:</strong> You retain access until
                        the end of your paid period
                      </li>
                      <li>
                        <strong>Data Export:</strong> Download your data before
                        the subscription expires
                      </li>
                      <li>
                        <strong>No Penalties:</strong> No cancellation fees or
                        penalties
                      </li>
                    </ul>
                  </div>

                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pro Tip:</strong> You can cancel anytime and still
                      use the service until your billing period ends. Your data
                      will be available for export for 30 days after
                      cancellation.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* 💳 Refund Eligibility */}
            <Card id="refund-eligibility">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Refund Eligibility
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div className="grid gap-6">
                    <div className="rounded-lg border border-green-200 p-6 dark:border-green-800">
                      <h3 className="mb-3 text-lg font-semibold text-green-800 dark:text-green-300">
                        ✅ Eligible for Full Refund
                      </h3>
                      <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                        <li>
                          New subscriptions within 30 days of first payment
                        </li>
                        <li>
                          Technical issues preventing service use (unresolved
                          within 48 hours)
                        </li>
                        <li>Billing errors or duplicate charges</li>
                        <li>
                          Service unavailable for more than 24 consecutive hours
                        </li>
                        <li>Unauthorized charges (with proper verification)</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-amber-200 p-6 dark:border-amber-800">
                      <h3 className="mb-3 text-lg font-semibold text-amber-800 dark:text-amber-300">
                        ⚠️ Partial Refund Eligible
                      </h3>
                      <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                        <li>
                          Annual plans cancelled within 30 days (prorated
                          refund)
                        </li>
                        <li>Downgrade requests (credit applied to account)</li>
                        <li>
                          Service interruptions lasting 12+ hours (prorated
                          credit)
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-red-200 p-6 dark:border-red-800">
                      <h3 className="mb-3 text-lg font-semibold text-red-800 dark:text-red-300">
                        ❌ Not Eligible for Refund
                      </h3>
                      <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                        <li>Subscriptions used for more than 30 days</li>
                        <li>
                          Cancellations due to change of mind after 30 days
                        </li>
                        <li>Violations of Terms of Service</li>
                        <li>Third-party service integration issues</li>
                        <li>Data usage or storage fees</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🔄 Refund Process */}
            <Card id="refund-process">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Refund Process
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Step-by-Step Process
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            Submit Request
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Contact our support team with your refund request
                            and reason
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            Review Process
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            We review your request within 2 business days
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            Approval & Processing
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Approved refunds are processed through Stripe within
                            24 hours
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600 dark:bg-green-900 dark:text-green-400">
                          4
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            Refund Completion
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Funds appear in your account within 5-10 business
                            days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <CreditCard className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Payment Method:</strong> Refunds are processed to
                      the original payment method used for the purchase. Credit
                      card refunds may take 5-10 business days to appear on your
                      statement.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* ⚠️ Billing Disputes */}
            <Card id="billing-disputes">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Billing Disputes
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
                  <p className="text-slate-700 dark:text-slate-300">
                    If you notice an unexpected charge or billing error, please
                    contact us immediately. We&apos;re committed to resolving
                    billing issues quickly and fairly.
                  </p>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Common Billing Issues
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>Duplicate Charges:</strong> Multiple charges for
                        the same subscription period
                      </li>
                      <li>
                        <strong>Incorrect Amount:</strong> Charged amount
                        doesn&apos;t match your plan
                      </li>
                      <li>
                        <strong>Cancelled Subscription:</strong> Charged after
                        cancellation
                      </li>
                      <li>
                        <strong>Unauthorized Charges:</strong> Charges you
                        didn&apos;t authorize
                      </li>
                      <li>
                        <strong>Failed Cancellation:</strong> Subscription
                        didn&apos;t cancel as expected
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Dispute Resolution
                    </h3>
                    <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        1. <strong>Contact Us First:</strong> Reach out to our
                        support team before disputing with your bank
                      </li>
                      <li>
                        2. <strong>Provide Details:</strong> Include transaction
                        ID, date, and amount
                      </li>
                      <li>
                        3. <strong>Quick Resolution:</strong> Most billing
                        issues are resolved within 24 hours
                      </li>
                      <li>
                        4. <strong>Immediate Refund:</strong> Verified errors
                        are refunded immediately
                      </li>
                    </ol>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> Disputing charges with your
                      bank before contacting us may delay resolution and could
                      result in service suspension. We&apos;re here to help
                      resolve issues quickly!
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* 📧 Contact Support */}
            <Card id="contact">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Contact Support
                  </h2>
                </div>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <p className="mb-6 text-slate-700 dark:text-slate-300">
                    Our support team is here to help with any questions about
                    refunds, cancellations, or billing issues.
                  </p>

                  <div className="rounded-lg bg-slate-50 p-6 text-center dark:bg-slate-800">
                    <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
                      Get Help Fast
                    </h3>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">
                      Visit our support center for live chat, billing help, and
                      to submit refund requests.
                    </p>
                    <Button asChild size="lg">
                      <Link href="/support" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Visit Support Center
                      </Link>
                    </Button>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      Most billing issues resolved within 24 hours
                    </p>
                  </div>

                  <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                      📋 When Contacting Support, Please Include:
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                      <li>• Your account email address</li>
                      <li>• Transaction ID or invoice number</li>
                      <li>• Detailed description of the issue</li>
                      <li>• Screenshots if applicable</li>
                    </ul>
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
                      href="/terms-of-service"
                      className="flex items-center gap-2"
                    >
                      Terms of Service
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link
                      href="/billing-faq"
                      className="flex items-center gap-2"
                    >
                      Billing FAQ
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
