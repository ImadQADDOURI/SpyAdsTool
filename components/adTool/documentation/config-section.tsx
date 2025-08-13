import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Info } from "lucide-react"

export function ConfigSection() {
  return (
    <Card id="config">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          <CardTitle className="text-2xl">Configuration Files</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            The <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">config/</code> folder contains various
            configuration files that you can customize to match your application&apos;s needs.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🚀 Development</h4>
              <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                <li>• Easy customization and testing</li>
                <li>• Hot reload for config changes</li>
                <li>• TypeScript support for validation</li>
                <li>• Modular organization</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">🏢 Production</h4>
              <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                <li>• Build-time optimization</li>
                <li>• Environment-specific configs</li>
                <li>• Type-safe configuration</li>
                <li>• Centralized management</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Available Configuration Files</h3>

          <div className="grid gap-4">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📄 site.ts</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                Manages global site metadata, SEO settings, and footer links.
              </p>
              <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded text-sm">
                <code className="text-green-400">
                  export const siteConfig = {`{`}
                  <br />
                  &nbsp;&nbsp;name: "Your App Name",
                  <br />
                  &nbsp;&nbsp;description: "Your app description",
                  <br />
                  &nbsp;&nbsp;url: "https://yourapp.com",
                  <br />
                  &nbsp;&nbsp;ogImage: "https://yourapp.com/og.jpg",
                  <br />
                  &nbsp;&nbsp;links: {`{`}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;twitter: "https://twitter.com/youraccount",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;github: "https://github.com/youraccount"
                  <br />
                  &nbsp;&nbsp;{`}`}
                  <br />
                  {`}`}
                </code>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">💰 subscriptions.ts</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                Contains all pricing plans and subscription configurations.
              </p>
              <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded text-sm">
                <code className="text-green-400">
                  {`{`}
                  <br />
                  &nbsp;&nbsp;title: &apos;Pro&apos;,
                  <br />
                  &nbsp;&nbsp;description: &apos;Unlock Advanced Features&apos;,
                  <br />
                  &nbsp;&nbsp;benefits: [
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&apos;Up to 500 monthly posts&apos;,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&apos;Advanced analytics and reporting&apos;,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&apos;Priority customer support&apos;,
                  <br />
                  &nbsp;&nbsp;],
                  <br />
                  &nbsp;&nbsp;limitations: [
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&apos;No custom branding&apos;,
                  <br />
                  &nbsp;&nbsp;],
                  <br />
                  &nbsp;&nbsp;prices: {`{`}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;monthly: 15,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;yearly: 144,
                  <br />
                  &nbsp;&nbsp;{`}`},
                  <br />
                  &nbsp;&nbsp;stripeIds: {`{`}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
                  <br />
                  &nbsp;&nbsp;{`}`}
                  <br />
                  {`}`}
                </code>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">🏠 landing.ts</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                Configuration for homepage sections, hero content, and features.
              </p>
              <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded text-sm">
                <code className="text-green-400">
                  export const landingConfig = {`{`}
                  <br />
                  &nbsp;&nbsp;hero: {`{`}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;title: "Your Hero Title",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;description: "Your hero description",
                  <br />
                  &nbsp;&nbsp;{`}`},
                  <br />
                  &nbsp;&nbsp;features: [
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{`} title: "Feature 1", description: "..." {`}`}
                  ,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{`} title: "Feature 2", description: "..." {`}`}
                  <br />
                  &nbsp;&nbsp;]
                  <br />
                  {`}`}
                </code>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">🧭 Navigation Files</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                Separate navigation configurations for different sections:
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>
                  • <strong>marketing.ts</strong> - Marketing site navigation
                </li>
                <li>
                  • <strong>dashboard.ts</strong> - Dashboard sidebar navigation
                </li>
                <li>
                  • <strong>docs.ts</strong> - Documentation navigation
                </li>
              </ul>
              <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded text-sm mt-3">
                <code className="text-green-400">
                  export const dashboardConfig = {`{`}
                  <br />
                  &nbsp;&nbsp;mainNav: [
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{`} title: "Dashboard", href: "/dashboard" {`}`}
                  ,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{`} title: "Settings", href: "/dashboard/settings" {`}`}
                  <br />
                  &nbsp;&nbsp;],
                  <br />
                  &nbsp;&nbsp;sidebarNav: [...]
                  <br />
                  {`}`}
                </code>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-6">Customization Tips</h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
              <li>
                • <strong>Start with site.ts</strong> - Update your app name, description, and social links
              </li>
              <li>
                • <strong>Customize subscriptions.ts</strong> - Match your Stripe products and pricing
              </li>
              <li>
                • <strong>Update landing.ts</strong> - Personalize your homepage content
              </li>
              <li>
                • <strong>Modify navigation</strong> - Add or remove menu items as needed
              </li>
              <li>
                • <strong>Use TypeScript</strong> - All configs are type-safe for better development experience
              </li>
            </ul>
          </div>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              After updating configuration files, restart your development server to see changes. Some configs are used
              at build time and require a rebuild for production deployments.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
