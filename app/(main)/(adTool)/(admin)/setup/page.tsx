import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Beaker,
  Book,
  CheckCircle,
  Cloud,
  Code2,
  CreditCard,
  Database,
  ExternalLink,
  Facebook,
  FileJson,
  FileSliders,
  Key,
  Mail,
  Network,
  Replace,
  Rocket,
  SearchCheck,
  Settings,
  Settings2,
  Shield,
  Shuffle,
  TestTube,
  ToggleLeft,
  Zap,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Setup Documentation | Development Guide",
  description:
    "Complete setup documentation for the SaaS application development team. Includes environment variables, integrations, and deployment guide.",
  keywords:
    "setup documentation, development guide, environment variables, API configuration, deployment",
};

export default function SetupDocumentationPage() {
  const sections = [
    { id: "overview", title: "Overview", icon: Book },
    { id: "environment", title: "Environment Variables", icon: Key },
    { id: "meta-requests", title: "Meta Request System", icon: Facebook },
    { id: "authentication", title: "Authentication Setup", icon: Shield },
    { id: "database", title: "Database Configuration", icon: Database },
    { id: "stripe", title: "Stripe Integration", icon: CreditCard },
    { id: "storage", title: "Cloudflare R2 Storage", icon: Cloud },
    { id: "email", title: "Email Service", icon: Mail },
    { id: "chrome", title: "Chrome Extension", icon: Settings },
    { id: "admin", title: "Admin System", icon: Shield },
    { id: "config-files", title: "Configuration Files", icon: FileSliders },
    { id: "deployment", title: "Deployment", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* 🎨 Header Section */}
      <div className="top-0 z-10 border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/docs" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Docs
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Setup Documentation
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Complete development team guide
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
            {/* 🏢 Overview */}
            <Card id="overview">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-2xl">Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Book className="h-4 w-4" />
                  <AlertDescription>
                    This application extends the excellent{" "}
                    <Link
                      href="https://github.com/mickasmt/next-saas-stripe-starter"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                    >
                      next-saas-stripe-starter
                    </Link>{" "}
                    template with ad management, Chrome extension integration,
                    and AI-powered content analysis.
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Core Technologies
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">AI</Badge>
                        <span className="text-slate-700 dark:text-slate-300">
                          Gemini API - Content analysis
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Payments</Badge>
                        <span className="text-slate-700 dark:text-slate-300">
                          Stripe API - Subscriptions
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Storage</Badge>
                        <span className="text-slate-700 dark:text-slate-300">
                          Cloudflare R2 - Media storage
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Email</Badge>
                        <span className="text-slate-700 dark:text-slate-300">
                          Resend API - Communications
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Auth</Badge>
                        <span className="text-slate-700 dark:text-slate-300">
                          NextAuth.js - Google OAuth
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Database</Badge>
                        <span className="text-slate-700 dark:text-slate-300">
                          PostgreSQL - Data storage
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🔑 Environment Variables */}
            <Card id="environment">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Key className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-2xl">
                    Environment Variables
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  {/* Application Config */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Application Configuration
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production: https://your-domain.com

# Environment Mode
NODE_ENV=development
# For production: production`}
                      </pre>
                    </div>
                  </div>

                  {/* Chrome Extension */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Chrome Extension Integration
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`# Chrome Extension Origin
CHROME_EXTENSION_ORIGIN=chrome-extension://your_extension_id_here`}
                      </pre>
                    </div>
                    <Alert className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Development allows all origins (*), production restricts
                        to your specific extension ID.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Authentication */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Authentication (NextAuth.js)
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`# Authentication Secret (Required)
AUTH_SECRET=your_generated_secret_here
NEXTAUTH_SECRET=legacy_secret_for_compatibility

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret`}
                      </pre>
                    </div>
                  </div>

                  {/* Database */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Database Configuration
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`# PostgreSQL Connection String
DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require

# For local development
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/your_db_name

# For Neon DB (recommended)
# DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require`}
                      </pre>
                    </div>
                  </div>

                  {/* Cloudflare R2 */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Cloudflare R2 Storage
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`R2_ENDPOINT=https://account_id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL_BASE=https://pub-xxx.r2.dev
# For production: use custom domain instead of r2.dev`}
                      </pre>
                    </div>
                  </div>

                  {/* Stripe */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Stripe Configuration
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`# Stripe API Key
STRIPE_API_KEY=sk_test_your_test_key_here
# For production: sk_live_your_live_key_here

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Pricing Plan IDs
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=price_monthly_id
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=price_yearly_id

# Subscription Settings
NEXT_PUBLIC_SUBSCRIPTION_BYPASS=false
NEXT_PUBLIC_DEBUG_SUBSCRIPTION=true`}
                      </pre>
                    </div>
                  </div>

                  {/* Google AI */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Google AI Configuration
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`# Google AI API Keys (Comma-separated for rotation)
GOOGLE_AI_API_KEY=key1,key2,key3
GOOGLE_AI_API_MODEL=gemini-2.0-flash-lite`}
                      </pre>
                    </div>
                    <Alert className="mt-3">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        The application automatically rotates between multiple
                        API keys to handle rate limits.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Email */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Email Configuration (Resend)
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Your App Name <onboarding@resend.dev>
SUPPORT_EMAIL_ADDRESS=support@your-domain.com
SUPPORT_EMAIL_FROM=Your App Name <support@your-domain.com>`}
                      </pre>
                    </div>
                  </div>

                  {/* App-Specific */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Application-Specific Settings
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                      <pre className="text-sm text-green-400">
                        {`# WhatsApp Integration
WHATSAPP_NUMBER=+1234567890

# Trend Configuration
TREND_ADMIN_EMAILS="imad.qaddouri@ump.ac.ma,chafiq.allah@gmail.com"

# User Limits
MAX_SAVED_ADS_PER_USER=100`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🏢 meta-system */}
            <Card id="meta-requests">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Network className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-2xl">
                    Meta Requests System
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    How It Works
                  </h3>

                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Define Your Requests
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Create <strong>Meta Requests</strong> in your
                          dashboard to store GraphQL or REST request
                          configurations, including endpoint, body, headers, and
                          status. Each entry can be enabled or disabled for
                          rotation.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Request Selection
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          When executing, you can select a specific request by{" "}
                          <strong>ID</strong>, or rotate randomly among all
                          active requests sharing the same <strong>name</strong>
                          .
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Variable Injection
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Optionally override variables inside the request body
                          before execution. Only provided keys are replaced; all
                          other variables remain unchanged for consistency.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Response Handling
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          The system uses{" "}
                          <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                            parseResponse
                          </code>{" "}
                          to safely normalize multi-JSON responses, then
                          extracts specific data using{" "}
                          <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                            jsonpath-plus
                          </code>{" "}
                          via <code>extractFields</code>.
                        </p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Testing & Validation
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          You can test any Meta Request directly via server
                          actions. The result preview includes both the{" "}
                          <strong>parsed</strong> and <strong>raw</strong>{" "}
                          responses for easy debugging.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
                  <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <AlertDescription className="text-purple-700 dark:text-purple-300">
                    <strong>Tip:</strong> You can maintain multiple active
                    requests for the same <code>name</code> to automatically
                    rotate between different base configurations (useful for
                    load balancing or proxy rotation).
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Server Actions Overview
                  </h3>
                  <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                      • <strong>listMetaRequests()</strong> — Retrieve all saved
                      entries.
                    </p>
                    <p>
                      • <strong>createMetaRequest()</strong> /{" "}
                      <strong>updateMetaRequest()</strong> — Manage request
                      configs.
                    </p>
                    <p>
                      • <strong>deleteMetaRequest()</strong> — Remove a specific
                      request.
                    </p>
                    <p>
                      • <strong>toggleMetaRequest()</strong> — Enable or disable
                      a request.
                    </p>
                    <p>
                      • <strong>testMetaRequest()</strong> — Execute and preview
                      results instantly with optional variables.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🔐 Authentication Setup */}
            <Card id="authentication">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-2xl">
                    Authentication Setup (Google OAuth)
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Google Cloud Console Configuration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Create Project
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Go to{" "}
                          <Link
                            href="https://console.cloud.google.com"
                            className="text-blue-600 hover:underline"
                            target="_blank"
                          >
                            Google Cloud Console
                          </Link>{" "}
                          and create a new project
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Enable APIs
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Enable the Google+ API and Google Identity API
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Create Credentials
                        </h4>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <p>
                            Go to Credentials → Create Credentials → OAuth 2.0
                            Client IDs
                          </p>
                          <p>
                            Choose &quot;Web application&quot; as application
                            type
                          </p>
                          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                            <p className="mb-2 font-medium">
                              Add authorized JavaScript origins:
                            </p>
                            <ul className="space-y-1 text-xs">
                              <li>
                                • Development:{" "}
                                <code>http://localhost:3000</code>
                              </li>
                              <li>
                                • Production:{" "}
                                <code>https://your-domain.com</code>
                              </li>
                            </ul>
                            <p className="mb-2 mt-3 font-medium">
                              Add authorized redirect URIs:
                            </p>
                            <ul className="space-y-1 text-xs">
                              <li>
                                • Development:{" "}
                                <code>
                                  http://localhost:3000/api/auth/callback/google
                                </code>
                              </li>
                              <li>
                                • Production:{" "}
                                <code>
                                  https://your-domain.com/api/auth/callback/google
                                </code>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    NextAuth Configuration
                  </h3>
                  <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>AUTH_SECRET:</strong> Generate using{" "}
                      <code>npx auth secret</code> or{" "}
                      <code>openssl rand -base64 33</code>
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>NEXTAUTH_URL:</strong> No longer required in v5
                      (legacy support maintained)
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Google OAuth:</strong> Requires both client ID and
                      secret from Google Cloud Console
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🗄️ Database Setup */}
            <Card id="database">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-2xl">Database Setup</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Local PostgreSQL Server
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          1. Install PostgreSQL
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          Download from postgresql.org
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          2. Create Database
                        </p>
                        <div className="mt-1 rounded bg-slate-900 p-2 dark:bg-slate-800">
                          <pre className="text-xs text-green-400">
                            {`CREATE DATABASE your_app_database;
CREATE USER your_app_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE your_app_database TO your_app_user;`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20">
                    <h3 className="mb-3 text-lg font-semibold text-green-800 dark:text-green-300">
                      Managed Database (Neon - Recommended)
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">
                          1. Create Account
                        </p>
                        <p className="text-green-600 dark:text-green-400">
                          Sign up at neon.tech
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">
                          2. Create Project
                        </p>
                        <p className="text-green-600 dark:text-green-400">
                          Follow setup wizard
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">
                          3. Get Connection String
                        </p>
                        <p className="text-green-600 dark:text-green-400">
                          Copy PostgreSQL connection string
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Database Schema
                  </h3>
                  <p className="mb-3 text-slate-700 dark:text-slate-300">
                    The application uses Prisma ORM for database management. Key
                    tables include:
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Users</Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          User profiles and authentication
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Subscriptions</Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Stripe subscription information
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">SavedAds</Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          User-saved advertisements
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">AdminUsers</Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Admin role assignments
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 💳 Stripe Integration */}
            <Card id="stripe">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-2xl">Stripe Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Test Mode Setup
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Create Stripe Account
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Sign up at stripe.com
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Enable Test Mode
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Toggle to test mode in the Stripe dashboard
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Get API Keys
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Go to Developers → API Keys and copy the Secret key
                          (starts with sk_test_)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Create Products and Prices
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Go to Products → Add Product, create pricing plans,
                          and copy price IDs (start with price_)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    <strong>Critical Step:</strong> You must activate the
                    billing portal configuration before it works:
                    <br />
                    1. Go to Settings → Billing Portal in Stripe Dashboard
                    <br />
                    2. Click the &quot;Activate&quot; button
                    <br />
                    3. Click &quot;Save&quot; even if you don&apos;t change
                    settings
                    <br />
                    The portal will not function until this activation step is
                    completed.
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Webhook Configuration
                  </h3>
                  <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Create Endpoint:</strong> Developers → Webhooks →
                      Add endpoint
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>URL:</strong>{" "}
                      <code>https://your-domain.com/api/webhooks/stripe</code>
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Events:</strong>{" "}
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li>• checkout.session.completed</li>
                        <li>• invoice.payment_succeeded</li>
                        <li>• customer.subscription.updated</li>
                        <li>• customer.subscription.deleted</li>
                      </ul>
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Local Testing:</strong> Use Stripe CLI to forward
                      events to localhost during development
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ☁️ Cloudflare R2 Storage */}
            <Card id="storage">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Cloud className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="text-2xl">
                    Cloudflare R2 Storage
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Initial Setup
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Create Cloudflare Account
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Sign up at cloudflare.com
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Navigate to R2
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Find R2 in the left sidebar of your Cloudflare
                          dashboard
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          Create Bucket
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Click &quot;Create bucket&quot;, choose unique name,
                          select location, enable public access
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    <strong>Production Warning:</strong> The r2.dev subdomain
                    has rate limits and is not recommended for production. Set
                    up a custom domain for better performance and no rate
                    limits.
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Custom Domain Setup (Recommended for Production)
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-700 dark:text-slate-300">
                      1. Add custom domain in R2 bucket settings
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      2. Add CNAME record pointing to R2 bucket hostname
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      3. Update R2_PUBLIC_URL_BASE to your custom domain
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      4. Benefits: Better performance, no rate limits,
                      professional appearance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 📧 Email Service */}
            <Card id="email">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-2xl">
                    Resend Email Service
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Development Setup
                    </h3>
                    <div className="space-y-3 text-sm">
                      <p className="text-slate-700 dark:text-slate-300">
                        1. Create account at resend.com
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        2. Get API key from dashboard
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        3. Use onboarding@resend.dev as sender
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        4. Can only send to your signup email
                      </p>
                    </div>
                    <Badge variant="secondary" className="mt-3">
                      Development Only
                    </Badge>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20">
                    <h3 className="mb-3 text-lg font-semibold text-green-800 dark:text-green-300">
                      Production Setup
                    </h3>
                    <div className="space-y-3 text-sm">
                      <p className="text-green-700 dark:text-green-300">
                        1. Purchase domain from any registrar
                      </p>
                      <p className="text-green-700 dark:text-green-300">
                        2. Add domain to Resend dashboard
                      </p>
                      <p className="text-green-700 dark:text-green-300">
                        3. Add DNS records for verification
                      </p>
                      <p className="text-green-700 dark:text-green-300">
                        4. Update sender addresses to your domain
                      </p>
                    </div>
                    <Badge variant="default" className="mt-3 bg-green-600">
                      Required for Production
                    </Badge>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Why Custom Domain is Required:</strong> Ensures
                    deliverability, enables DKIM/SPF verification, builds trust
                    with recipients, and provides production reliability.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* 🔧 Chrome Extension */}
            <Card id="chrome">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-2xl">
                    Chrome Extension Integration
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Next.js Configuration
                  </h3>
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    The application includes specific CORS handling for Chrome
                    extension communication:
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                        Development Mode
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Allows all origins (*) for easy testing
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                      <h4 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                        Production Mode
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Restricts access to your specific extension ID only
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Security Considerations
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li>
                      • Extension ID must be set via CHROME_EXTENSION_ORIGIN
                      environment variable
                    </li>
                    <li>
                      • Production builds will warn if extension origin is not
                      configured
                    </li>
                    <li>
                      • CORS policies automatically adjust based on environment
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Extension Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Have a consistent extension ID</li>
                    <li>
                      • Make requests to your application&apos;s API endpoints
                    </li>
                    <li>• Handle authentication tokens properly</li>
                    <li>• Respect rate limits and API constraints</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 👑 Admin System */}
            <Card id="admin">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <CardTitle className="text-2xl">Admin System</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Admin User Configuration
                  </h3>
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    Admins are users with the ADMIN role in the database. They
                    receive:
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                        Automatic Privileges
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <li>• Full access without subscription requirements</li>
                        <li>
                          • Access to admin dashboard and management pages
                        </li>
                        <li>• User and subscription management capabilities</li>
                        <li>• System settings configuration access</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                        Subscription Bypass
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <li>• Automatically get isPaid = true status</li>
                        <li>
                          • Skip Stripe validation unless they have subscription
                        </li>
                        <li>• Get highest tier plan benefits</li>
                        <li>
                          • Never considered as having canceled subscriptions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Special Capabilities
                  </h3>
                  <div className="space-y-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      • Unlimited saved ads (not subject to
                      MAX_SAVED_ADS_PER_USER limit)
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      • Access to admin-only features and pages
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Trend Configuration
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li>
                      • <strong>Trending Ads:</strong> Ads saved by
                      TREND_ADMIN_EMAILS are automatically added to the trend
                      board
                    </li>

                    <li>
                      • <strong>Public Display:</strong> Trend board ads are
                      visible to all users for inspiration
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* ⚙️ Configuration Files */}
            <Card id="config-files">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle className="text-2xl">
                    Configuration Files
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="mb-6 text-slate-700 dark:text-slate-300">
                    The{" "}
                    <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">
                      configuration/
                    </code>{" "}
                    folder contains various configuration files that you can
                    customize to match your application&apos;s needs.
                  </p>
                </div>

                <div className="grid gap-6">
                  {/* Site Config */}
                  <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                        <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          site-config.ts
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          📌 configuration/site-config.ts
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Manages site-wide settings like name, description, URL,
                        and social links.
                      </p>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Exports:
                        </p>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <li>
                            • <code>siteConfig</code> - Basic site information
                          </li>
                          <li>
                            • <code>NavbarConfig</code> - Navigation menu
                            structure
                          </li>
                          <li>
                            • <code>AvatarMenuConfig</code> - User dropdown menu
                          </li>
                          <li>
                            • <code>FOOTER_CONFIG</code> - Footer links and
                            content
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Config */}
                  <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                        <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          pricing-config.ts
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          📌 configuration/pricing-config.ts
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Contains all pricing plans and subscription
                        configurations.
                      </p>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Exports:
                        </p>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <li>
                            • <code>pricingData</code> - Plan details and
                            features
                          </li>
                          <li>
                            • <code>plansColumns</code> - Pricing table
                            structure
                          </li>
                          <li>
                            • <code>comparePlans</code> - Feature comparison
                            data
                          </li>
                          <li>
                            • <code>paymentMethods</code> - Accepted payment
                            options
                          </li>
                          <li>
                            • <code>pricingFaqData</code> - Pricing FAQ content
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Landing Config */}
                  <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                        <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          landing-config.ts
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          📌 configuration/landing-config.ts
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Configuration for homepage sections, hero content, and
                        features.
                      </p>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Exports:
                        </p>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <li>
                            • <code>heroConfig</code> - Hero section content
                          </li>
                          <li>
                            • <code>trustedBySectionConfig</code> - Company
                            logos/testimonials
                          </li>
                          <li>
                            • <code>featuresConfig</code> - Feature highlights
                          </li>
                          <li>
                            • <code>TrendingConfig</code> - Trending ads section
                          </li>
                          <li>
                            • <code>EXTENSION_CONFIG</code> - Chrome extension
                            promotion
                          </li>
                          <li>
                            • <code>analyticsConfig</code> - Analytics dashboard
                            preview
                          </li>
                          <li>
                            • <code>pricing_CTA_Config</code> - Pricing
                            call-to-action
                          </li>
                          <li>
                            • <code>testimonials</code> - Customer testimonials
                          </li>
                          <li>
                            • <code>CTA_CONFIG</code> - Call-to-action sections
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Config */}
                  <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                        <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          navigation-config.ts
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          📌 configuration/navigation-config.ts
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Configuration for navigation menus and routing.
                      </p>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Exports:
                        </p>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <li>
                            • <code>Links</code> - Main navigation links
                          </li>
                          <li>
                            • <code>Tools</code> - Tools dropdown menu
                          </li>
                          <li>
                            • <code>Deals</code> - Deals and promotions links
                          </li>
                          <li>
                            • <code>AdminLinks</code> - Admin-only navigation
                            items
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Config */}
                  <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                        <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          metadata-config.ts
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          📌 configuration/metadata-config.ts
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Provides page-level information for SEO, social sharing,
                        browser tabs, and PWA hints.
                      </p>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Used by:
                        </p>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <li>• Next.js layouts and components</li>
                          <li>• SEO optimization and meta tags</li>
                          <li>• Open Graph and Twitter cards</li>
                          <li>• Browser tab titles and favicons</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* PWA Manifest */}
                  <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-teal-100 p-2 dark:bg-teal-900/30">
                        <Cloud className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          site.webmanifest
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          📌 public/site.webmanifest
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Enables Progressive Web App (PWA) behavior. Tells the
                        browser how your app should appear when installed on a
                        device.
                      </p>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Features:
                        </p>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <li>• App icon and theme colors</li>
                          <li>• Display mode (standalone, fullscreen)</li>
                          <li>
                            • &quot;Add to Home Screen&quot; functionality
                          </li>
                          <li>• Splash screen configuration</li>
                        </ul>
                      </div>
                      <Alert className="mt-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>Location Important:</strong> Must be in the{" "}
                          <code>public/</code> folder so browsers can fetch it
                          as a static file via <code>/site.webmanifest</code>.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Customization Tips
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                        🎨 Branding
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        <li>
                          • Update site name and description in site-config.ts
                        </li>
                        <li>
                          • Customize colors and themes in metadata-config.ts
                        </li>
                        <li>• Replace app icons in site.webmanifest</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                      <h4 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                        💰 Pricing
                      </h4>
                      <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                        <li>• Update plan features in pricing-config.ts</li>
                        <li>• Match Stripe price IDs to your products</li>
                        <li>• Customize FAQ content for your service</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                      <h4 className="mb-2 font-semibold text-purple-800 dark:text-purple-300">
                        🏠 Landing Page
                      </h4>
                      <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                        <li>• Customize hero content and CTAs</li>
                        <li>• Update feature highlights and benefits</li>
                        <li>• Add your customer testimonials</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                      <h4 className="mb-2 font-semibold text-orange-800 dark:text-orange-300">
                        🧭 Navigation
                      </h4>
                      <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                        <li>• Add or remove navigation items</li>
                        <li>• Customize admin-only menu items</li>
                        <li>• Update footer links and social media</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🚀 Deployment */}
            <Card id="deployment">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-2xl">
                    Deployment Checklist
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Pre-Deployment
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Update all environment variables for production
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Configure custom domains for Resend and R2
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Set up Stripe in production mode
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Update Google OAuth redirect URIs
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Test all integrations thoroughly
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Production Environment Variables
                  </h3>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="grid gap-4 text-sm md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>NEXT_PUBLIC_APP_URL:</strong> Your production
                          domain
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>NODE_ENV:</strong> Set to
                          &quot;production&quot;
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>DATABASE_URL:</strong> Production database
                          connection
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>STRIPE_API_KEY:</strong> Live Stripe key
                          (sk_live_)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>STRIPE_WEBHOOK_SECRET:</strong> Production
                          webhook secret
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>R2_PUBLIC_URL_BASE:</strong> Custom domain for
                          R2 storage
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>EMAIL_FROM:</strong> Your verified domain
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>SUPPORT_EMAIL_FROM:</strong> Your verified
                          domain
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Post-Deployment
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Verify all payment flows work correctly
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Test email delivery and formatting
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Confirm media uploads and access
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Check admin functions and permissions
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Monitor application logs and performance
                      </span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Support Resources:</strong> Base template
                    documentation, NextAuth.js docs, Stripe integration guide,
                    Cloudflare R2 documentation, and Resend email documentation
                    are available for additional help.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* 🔗 Quick Links */}
            <Card>
              <CardContent className="p-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Quick Reference Links
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start bg-transparent"
                    >
                      <Link
                        href="https://next-saas-stripe-starter.vercel.app/docs"
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Base Template Docs
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start bg-transparent"
                    >
                      <Link
                        href="https://authjs.dev"
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        NextAuth.js Documentation
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start bg-transparent"
                    >
                      <Link
                        href="https://stripe.com/docs"
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Stripe Integration Guide
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start bg-transparent"
                    >
                      <Link
                        href="https://developers.cloudflare.com/r2/"
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Cloudflare R2 Documentation
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start bg-transparent"
                    >
                      <Link
                        href="https://resend.com/docs"
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Resend Email Documentation
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start bg-transparent"
                    >
                      <Link
                        href="https://neon.tech/docs"
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Neon Database Documentation
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
