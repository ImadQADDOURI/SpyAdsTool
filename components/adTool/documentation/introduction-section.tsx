import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export function IntroductionSection() {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
            About This Platform
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            This ad search and management platform is built on top of a robust
            SaaS starter template, providing enterprise-grade features and best
            practices out of the box.
          </p>

          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="mb-3 text-lg font-semibold text-blue-800 dark:text-blue-300">
              &quot;🚀 Built on Next.js SaaS Starter&quot;
            </h3>
            <p className="mb-4 text-blue-700 dark:text-blue-300">
              This application is built on top of the excellent Next.js SaaS
              Stripe Starter by{" "}
              <Link
                href="https://github.com/mickasmt"
                className="underline hover:no-underline"
              >
                @mickasmt
              </Link>
              , which provides a solid foundation with authentication, payments,
              and modern tooling.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/mickasmt/next-saas-stripe-starter"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                GitHub Repository
              </Link>
              <Link
                href="https://next-saas-stripe-starter.vercel.app/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                Original Documentation
              </Link>
            </div>
          </div>

          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            This guide will help you set up the development environment,
            configure APIs, and deploy the application with all the custom
            features for ad search and management functionality.
          </p>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This documentation assumes you have basic knowledge of Next.js,
              React, and modern web development. Make sure you have Node.js 18+
              installed.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
