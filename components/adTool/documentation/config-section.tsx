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
                📄 configuration\site-config.ts
              </h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Manages global site metadata, SEO settings, and footer links.
              </p>
              <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-800">
                <code className="text-green-400">
                  <br />
                  export const pricingData ;
                  <br />
                  export const plansColumns ;
                  <br />
                  export const comparePlans ;
                  <br />
                </code>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                💰 configuration\pricing-config.ts
              </h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Contains all pricing plans and subscription configurations.
              </p>
              <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-800">
                <code className="text-green-400">
                  <br />
                  export const NavbarConfig ;
                  <br />
                  export const AvatarMenuConfig ;
                  <br />
                  export const FOOTER_CONFIG ;
                  <br />
                  export const paymentMethods ;
                  <br />
                </code>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                🏠 configuration\landing-config.ts
              </h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Configuration for homepage sections, hero content, and
                features...
              </p>
              <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-800">
                <code className="text-green-400">
                  <br />
                  export const heroConfig ;
                  <br />
                  export const trustedBySectionConfig ;
                  <br />
                  export const featuresConfig ;
                  <br />
                  export const TrendingConfig ;
                  <br />
                  export const EXTENSION_CONFIG ;
                  <br />
                  export const analyticsConfig ;
                  <br />
                  export const testimonials ;
                  <br />
                  export const CTA_CONFIG ;
                  <br />
                </code>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                🧭 configuration\navigation-config.ts
              </h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Configuration for navigation menus
              </p>

              <div className="mt-3 rounded bg-slate-900 p-3 text-sm dark:bg-slate-800">
                <code className="text-green-400">
                  <br />
                  export const Links ;
                  <br />
                  export const Tools ;
                  <br />
                  export const Deals ;
                  <br />
                  export const AdminLinks ;
                  <br />
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
