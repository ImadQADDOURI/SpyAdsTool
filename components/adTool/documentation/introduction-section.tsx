import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, ExternalLink } from "lucide-react"

export function IntroductionSection() {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">About This Platform</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            This ad search and management platform is built on top of a robust SaaS starter template, providing
            enterprise-grade features and best practices out of the box.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              🚀 Built on Next.js SaaS Starter
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              This application is built on top of the excellent Next.js SaaS Stripe Starter by{" "}
              <Link href="https://github.com/mickasmt" className="underline hover:no-underline">
                @mickasmt
              </Link>
              , which provides a solid foundation with authentication, payments, and modern tooling.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/mickasmt/next-saas-stripe-starter"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub Repository
              </Link>
              <Link
                href="https://next-saas-stripe-starter.vercel.app/docs"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Original Documentation
              </Link>
            </div>
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            This guide will help you set up the development environment, configure APIs, and deploy the application with
            all the custom features for ad search and management functionality.
          </p>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This documentation assumes you have basic knowledge of Next.js, React, and modern web development. Make
              sure you have Node.js 18+ installed.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
