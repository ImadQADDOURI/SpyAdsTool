import Link from "next/link";
import { AlertCircle, CheckCircle, CreditCard, Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function StripeSection() {
  return (
    <Card id="stripe">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-2xl">Stripe Integration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="test-mode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="test-mode">Test Mode Setup</TabsTrigger>
            <TabsTrigger value="production-mode">Production Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="test-mode" className="space-y-6">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Test Mode Setup
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Start with test mode for development and testing your
                integration safely.
              </p>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                1. Stripe Account Setup
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Create a Stripe account at{" "}
                  <Link
                    href="https://stripe.com"
                    className="text-blue-600 hover:underline"
                  >
                    stripe.com
                  </Link>
                </li>
                <li>
                  Ensure you&apos;re in &quot;Test mode&quot; (toggle in the
                  left sidebar)
                </li>
                <li>
                  Go to &quot;Developers&quot; → &quot;API Keys&quot; and copy
                  your test secret key
                </li>
                <li>Add it to your environment variables</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Test Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    STRIPE_API_KEY=&quot;sk_test_your_secret_key_here&quot;
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                2. Create Test Products and Pricing
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Navigate to &quot;Products&quot; in your Stripe dashboard
                </li>
                <li>
                  Click &quot;Create Product&quot; and enter your product
                  details
                </li>
                <li>Add pricing plans (monthly and yearly)</li>
                <li>Copy the Price IDs for each plan</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Test Price ID Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=&quot;price_your_test_monthly_id&quot;
                    <br />
                    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=&quot;price_your_test_yearly_id&quot;
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                3. Test Billing Portal Configuration
              </h4>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Critical Step:</strong> You MUST activate the billing
                  portal in test mode before it will work.
                </AlertDescription>
              </Alert>

              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Ensure you&apos;re in &quot;Test mode&quot;</li>
                <li>
                  Go to &quot;Settings&quot; → &quot;Billing&quot; →
                  &quot;Customer Portal&quot;
                </li>
                <li>
                  <strong>Click the &quot;Activate&quot; button</strong> - this
                  is essential!
                </li>
                <li>Configure the portal settings (or use defaults)</li>
                <li>Click &quot;Save&quot; to finalize the configuration</li>
              </ol>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                4. Test Webhook Configuration
              </h4>
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <p className="mb-2 text-slate-700 dark:text-slate-300">
                  <strong>Test Webhook URL:</strong>
                </p>
                <code className="rounded bg-slate-200 px-2 py-1 text-sm dark:bg-slate-700">
                  http://localhost:3000/api/webhooks/stripe
                </code>
                <p className="mb-2 mt-3 text-slate-700 dark:text-slate-300">
                  <strong>Required Events:</strong>
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• checkout.session.completed</li>
                  <li>• invoice.payment_succeeded</li>
                  <li>• customer.subscription.updated</li>
                  <li>• customer.subscription.deleted</li>
                </ul>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                5. Local Testing with Stripe CLI
              </h4>
              <div className="rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
                <code className="text-sm text-green-400">
                  # Install Stripe CLI and login
                  <br />
                  stripe login
                  <br />
                  <br /># Forward events to your local server
                  <br />
                  stripe listen --forward-to localhost:3000/api/webhooks/stripe
                  <br />
                  <br /># Copy the webhook secret from the CLI output to your
                  .env.local
                </code>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Test Webhook Environment Variable:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    STRIPE_WEBHOOK_SECRET=&quot;whsec_your_test_webhook_signing_secret&quot;
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                6. Test Payment Methods
              </h4>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h5 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                  Test Card Numbers:
                </h5>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>
                    • <strong>Success:</strong> 4242 4242 4242 4242
                  </li>
                  <li>
                    • <strong>Declined:</strong> 4000 0000 0000 0002
                  </li>
                  <li>
                    • <strong>3D Secure:</strong> 4000 0025 0000 3155
                  </li>
                  <li>
                    • <strong>Insufficient funds:</strong> 4000 0000 0000 9995
                  </li>
                  <li>• Use any future expiry date and any 3-digit CVC</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="production-mode" className="space-y-6">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Production Mode Setup
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Configure Stripe for live payments when you&apos;re ready to go
                live.
              </p>

              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Only switch to production mode
                  when your application is fully tested and ready for real
                  payments.
                </AlertDescription>
              </Alert>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                1. Account Verification
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Complete your Stripe account verification process</li>
                <li>Provide required business information and documentation</li>
                <li>Add bank account details for payouts</li>
                <li>Verify your business address and tax information</li>
                <li>
                  Wait for Stripe to approve your account (usually 1-7 business
                  days)
                </li>
              </ol>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <h5 className="mb-2 font-semibold text-amber-800 dark:text-amber-300">
                  📋 Required Information:
                </h5>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Business type and legal structure</li>
                  <li>• Tax identification number (EIN, SSN, etc.)</li>
                  <li>• Business address and phone number</li>
                  <li>• Bank account for payouts</li>
                  <li>• Identity verification documents</li>
                  <li>• Business website and description</li>
                </ul>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                2. Switch to Live Mode
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  In your Stripe dashboard, toggle from &quot;Test mode&quot; to
                  &quot;Live mode&quot;
                </li>
                <li>Go to &quot;Developers&quot; → &quot;API Keys&quot;</li>
                <li>Copy your live secret key (starts with sk_live_)</li>
                <li>Copy your live publishable key (starts with pk_live_)</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Production Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    STRIPE_API_KEY=&quot;sk_live_your_live_secret_key&quot;
                    <br />
                    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=&quot;pk_live_your_live_publishable_key&quot;
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                3. Create Production Products
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Ensure you&apos;re in &quot;Live mode&quot;</li>
                <li>
                  Navigate to &quot;Products&quot; and create your live products
                </li>
                <li>Set up the same pricing structure as your test products</li>
                <li>Copy the live Price IDs</li>
                <li>Update your environment variables with live Price IDs</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Production Price ID Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=&quot;price_your_live_monthly_id&quot;
                    <br />
                    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=&quot;price_your_live_yearly_id&quot;
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                4. Production Billing Portal
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Switch to &quot;Live mode&quot; in your Stripe dashboard
                </li>
                <li>
                  Go to &quot;Settings&quot; → &quot;Billing&quot; →
                  &quot;Customer Portal&quot;
                </li>
                <li>
                  <strong>Click &quot;Activate&quot;</strong> for the live mode
                  portal (separate from test mode)
                </li>
                <li>Configure production portal settings:</li>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>• Business information and branding</li>
                  <li>• Customer support contact details</li>
                  <li>• Terms of service and privacy policy links</li>
                  <li>
                    • Allowed customer actions (cancel, update payment, etc.)
                  </li>
                </ul>
                <li>Save the configuration</li>
              </ol>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                5. Production Webhooks
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  In &quot;Live mode&quot;, go to &quot;Developers&quot; →
                  &quot;Webhooks&quot;
                </li>
                <li>Click &quot;Add endpoint&quot;</li>
                <li>Enter your production webhook URL:</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <p className="mb-2 text-slate-700 dark:text-slate-300">
                  <strong>Production Webhook URL:</strong>
                </p>
                <code className="rounded bg-slate-200 px-2 py-1 text-sm dark:bg-slate-700">
                  https://yourapp.com/api/webhooks/stripe
                </code>
              </div>

              <ol
                start={4}
                className="mt-4 space-y-2 text-slate-700 dark:text-slate-300"
              >
                <li>Select the same events as in test mode</li>
                <li>Copy the webhook signing secret</li>
                <li>Update your production environment variables</li>
              </ol>

              <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Production Webhook Environment Variable:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    STRIPE_WEBHOOK_SECRET=&quot;whsec_your_live_webhook_signing_secret&quot;
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                6. Go-Live Checklist
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Account fully verified and approved
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Live API keys configured in production
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Production products and pricing created
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Billing portal activated in live mode
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Production webhooks configured and tested
                  </span>
                </div>
              </div>

              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Final Step:</strong> Process a small test transaction
                  with a real payment method to ensure everything works
                  correctly before announcing your launch.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Remember to update your pricing in{" "}
            <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">
              configuration\pricing-config.ts
            </code>{" "}
            to match your Stripe products for both test and production
            environments.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
