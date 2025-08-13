import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AdditionalResourcesSection() {
  return (
    <Card>
      <CardContent className="p-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Additional Resources
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Button variant="outline" asChild>
            <Link
              href="https://nextjs.org/docs"
              className="flex items-center gap-2"
            >
              Next.js Documentation &amp; Guides
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://stripe.com/docs"
              className="flex items-center gap-2"
            >
              Stripe API &amp; Integration Docs
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://ai.google.dev/docs"
              className="flex items-center gap-2"
            >
              Gemini AI Documentation &amp; Tutorials
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://developers.cloudflare.com/r2/"
              className="flex items-center gap-2"
            >
              Cloudflare R2 Storage &amp; CDN Docs
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://resend.com/docs"
              className="flex items-center gap-2"
            >
              Resend Email &amp; Notifications Docs
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://next-saas-stripe-starter.vercel.app/docs"
              className="flex items-center gap-2"
            >
              SaaS Starter with Stripe &amp; Next.js Docs
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
