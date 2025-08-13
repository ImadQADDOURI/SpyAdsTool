import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function AdditionalResourcesSection() {
  return (
    <Card>
      <CardContent className="p-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Additional Resources</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Button variant="outline" asChild>
            <Link href="https://nextjs.org/docs" className="flex items-center gap-2">
              Next.js Documentation
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://stripe.com/docs" className="flex items-center gap-2">
              Stripe Documentation
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://ai.google.dev/docs" className="flex items-center gap-2">
              Gemini AI Documentation
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://developers.cloudflare.com/r2/" className="flex items-center gap-2">
              Cloudflare R2 Documentation
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://resend.com/docs" className="flex items-center gap-2">
              Resend Documentation
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://next-saas-stripe-starter.vercel.app/docs" className="flex items-center gap-2">
              SaaS Starter Documentation
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
