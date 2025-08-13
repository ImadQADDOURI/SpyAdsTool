import { Info, Settings } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConfigSection() {
  return (
    <Card id="config">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          <CardTitle className="text-2xl">Configuration Files</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="mb-6 text-slate-700 dark:text-slate-300">
            The{" "}
            <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">
              config/
            </code>{" "}
            folder contains various configuration files that you can customize
            to match your application&apos;s needs.
          </p>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                🚀 Development
              </h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>• Easy customization and testing</li>
                <li>• Hot reload for config changes</li>
                <li>• TypeScript support for validation</li>
                <li>• Modular organization</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <h4 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                🏢 Production
              </h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• Build-time optimization</li>
                <li>• Environment-specific configs</li>
                <li>• Type-safe configuration</li>
                <li>• Centralized management</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Available Configuration Files
          </h3>

          <div className="grid gap-4">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                📄 site.ts
              </h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Manages global site metadata, SEO settings, and footer links.
              </p>
              <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-800">
                <code className="text-green-400">
                  export const siteConfig = {`{`}
                  <br />
                  &nbsp;&nbsp;name: &quot;Your App Name&quot;,
                  <br />
                  &nbsp;&nbsp;description: &quot;Your app description&quot;,
                  <br />
                  &nbsp;&nbsp;url: &quot;https://yourapp.com&quot;,
                  <br />
                  &nbsp;&nbsp;ogImage: &quot;https://yourapp.com/og.jpg&quot;,
                  <br />
                  &nbsp;&nbsp;links: {`{`}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;twitter:
                  &quot;https://twitter.com/youraccount&quot;,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;github:
                  &quot;https://github.com/youraccount&quot;
                  <br />
                  &nbsp;&nbsp;{`}`}
                  <br />
                  {`}`}
                </code>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                💰 subscriptions.ts
              </h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Contains all pricing plans and subscription configurations.
              </p>
              <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-800">
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
                  &nbsp;&nbsp;&nbsp;&nbsp;&apos;Advanced analytics and
                  reporting&apos;,
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
                  &nbsp;&nbsp;&nbsp;&nbsp;monthly:
                  env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;yearly:
                  env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
                  <br />
                  &nbsp;&nbsp;{`}`}
                  <br />
                  {`}`}
                </code>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                🏠 landing.ts
              </h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Configuration for homepage sections, hero content, and features.
              </p>
              <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-800">
                <code className="text-green-400">
                  export const landingConfig = {`{`}
                  <br />
                  &nbsp;&nbsp;hero: {`{`}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;title: &quot;Your Hero Title&quot;,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;description: &quot;Your hero
                  description&quot;,
                  <br />
                  &nbsp;&nbsp;{`}`},
                  <br />
                  &nbsp;&nbsp;features: [
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{`} title: &quot;Feature 1&quot;,
                  description: &quot;...&quot; {`}`}
                  ,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{`} title: &quot;Feature 2&quot;,
                  description: &quot;...&quot; {`}`}
                  <br />
                  &nbsp;&nbsp;]
                  <br />
                  {`}`}
                </code>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                🧭 Navigation Files
              </h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Separate navigation configurations for different sections:
              </p>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
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
              <div className="mt-3 rounded bg-slate-900 p-3 text-sm dark:bg-slate-800">
                <code className="text-green-400">
                  export const dashboardConfig = {`{`}
                  <br />
                  &nbsp;&nbsp;mainNav: [
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{`} title: &quot;Dashboard&quot;,
                  href: &quot;/dashboard&quot; {`}`}
                  ,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{`{`} title: &quot;Settings&quot;,
                  href: &quot;/dashboard/settings&quot; {`}`}
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

          <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Customization Tips
          </h3>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>
                • <strong>Start with site.ts</strong> - Update your app name,
                description, and social links
              </li>
              <li>
                • <strong>Customize subscriptions.ts</strong> - Match your
                Stripe products and pricing
              </li>
              <li>
                • <strong>Update landing.ts</strong> - Personalize your homepage
                content
              </li>
              <li>
                • <strong>Modify navigation</strong> - Add or remove menu items
                as needed
              </li>
              <li>
                • <strong>Use TypeScript</strong> - All configs are type-safe
                for better development experience
              </li>
            </ul>
          </div>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              After updating configuration files, restart your development
              server to see changes. Some configs are used at build time and
              require a rebuild for production deployments.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
