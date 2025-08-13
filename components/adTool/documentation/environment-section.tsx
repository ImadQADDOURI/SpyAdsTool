import { AlertCircle, Info, Settings } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function EnvironmentSection() {
  return (
    <Card id="environment">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-2xl">Environment Variables</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security:</strong> Never commit your .env.local file to
            version control. Add it to your .gitignore file. Use different
            values for development and production environments.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="required" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="required">Required</TabsTrigger>
            <TabsTrigger value="optional">Optional</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
          </TabsList>

          <TabsContent value="required" className="space-y-4">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Required Environment Variables
              </h3>
              <p className="mb-4 text-slate-700 dark:text-slate-300">
                These variables are essential for the application to function in
                both development and production:
              </p>
            </div>
            <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
              <pre className="text-sm text-green-400">
                {`# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
AUTH_SECRET=your-auth-secret-here

# Database (Neon)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (Test Mode)
STRIPE_API_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=price_your-monthly-plan-id
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=price_your-yearly-plan-id`}
              </pre>
            </div>
            <div className="mt-6">
              <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                🔄 Advanced System Variables
              </h4>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Special Features:</strong> The system includes
                    advanced rotation and access control features using
                    comma-separated email lists for enhanced functionality and
                    reliability.
                  </AlertDescription>
                </Alert>

                <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                  <pre className="text-sm text-green-400">
                    {`# 🔄 Google AI API Key Rotation System
# Multiple API keys for load balancing and reliability
GOOGLE_AI_API_KEY="key1_for_email1@gmail.com,key2_for_email2@gmail.com,key3_for_email3@gmail.com"

# 👑 Admin Access Control
# Emails that get automatic admin access to admin pages
ADMIN_EMAILS="admin1@yourcompany.com,admin2@yourcompany.com,ceo@yourcompany.com"

# 📈 Trend System Control
# Emails whose saved ads automatically appear in trending section
TREND_EMAILS="curator1@yourcompany.com,curator2@yourcompany.com,marketing@yourcompany.com"`}
                  </pre>
                </div>

                <div className="mt-4 grid gap-4">
                  <div className="rounded-lg border border-blue-200 p-4 dark:border-blue-800">
                    <h5 className="mb-2 flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-300">
                      🔄 Google AI API Key Rotation
                    </h5>
                    <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <p>
                        <strong>How it works:</strong>
                      </p>
                      <ul className="ml-4 space-y-1">
                        <li>
                          • System automatically rotates between multiple API
                          keys
                        </li>
                        <li>
                          • Prevents rate limiting by distributing requests
                        </li>
                        <li>
                          • Provides redundancy if one key fails or hits limits
                        </li>
                        <li>
                          • Each key should be from a different Google account
                          for best results
                        </li>
                      </ul>
                      <p className="mt-2">
                        <strong>Format:</strong> Comma-separated list of API
                        keys
                      </p>
                      <p>
                        <strong>Minimum:</strong> 1 key required, 3+ recommended
                        for production
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-purple-200 p-4 dark:border-purple-800">
                    <h5 className="mb-2 flex items-center gap-2 font-semibold text-purple-800 dark:text-purple-300">
                      👑 Admin Emails System
                    </h5>
                    <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <p>
                        <strong>Functionality:</strong>
                      </p>
                      <ul className="ml-4 space-y-1">
                        <li>
                          • Users with these emails get automatic admin
                          privileges
                        </li>
                        <li>
                          • Access to admin dashboard and management pages
                        </li>
                        <li>
                          • Can manage users, subscriptions, and system settings
                        </li>
                        <li>• Bypasses normal role assignment process</li>
                      </ul>
                      <p className="mt-2">
                        <strong>Security:</strong> Use company emails only,
                        never personal emails
                      </p>
                      <p>
                        <strong>Format:</strong> Comma-separated list of email
                        addresses
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-green-200 p-4 dark:border-green-800">
                    <h5 className="mb-2 flex items-center gap-2 font-semibold text-green-800 dark:text-green-300">
                      📈 Trend Emails System
                    </h5>
                    <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <p>
                        <strong>Auto-Trending Feature:</strong>
                      </p>
                      <ul className="ml-4 space-y-1">
                        <li>
                          • Ads saved by these users automatically appear in
                          trending section
                        </li>
                        <li>
                          • Perfect for content curators and marketing team
                          members
                        </li>
                        <li>
                          • Helps populate trending content with high-quality
                          ads
                        </li>
                        <li>
                          • Users still need to be registered in the system
                          normally
                        </li>
                      </ul>
                      <p className="mt-2">
                        <strong>Use Case:</strong> Marketing team, content
                        curators, trusted power users
                      </p>
                      <p>
                        <strong>Format:</strong> Comma-separated list of email
                        addresses
                      </p>
                    </div>
                  </div>
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important Notes:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>
                        • All email lists are case-sensitive and should match
                        exactly with user accounts
                      </li>
                      <li>
                        • Changes to these variables require application restart
                        to take effect
                      </li>
                      <li>
                        • For production, ensure all emails are from verified
                        company domains
                      </li>
                      <li>
                        • API key rotation happens automatically - no manual
                        intervention needed
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="optional" className="space-y-4">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Optional Environment Variables
              </h3>
              <p className="mb-4 text-slate-700 dark:text-slate-300">
                These variables enable additional features but are not required
                for basic functionality:
              </p>
            </div>
            <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
              <pre className="text-sm text-green-400">
                {`# AI Integration
GOOGLE_AI_API_KEY=your-gemini-api-key
GOOGLE_AI_API_MODEL=gemini-2.0-flash-lite

# Email (Resend)
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM="Your App <onboarding@resend.dev>"
SUPPORT_EMAIL_ADDRESS=support@yourapp.com

# Cloudflare R2 Storage
R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL_BASE=https://pub-xxx.r2.dev

# Chrome Extension
CHROME_EXTENSION_ORIGIN=chrome-extension://your_extension_id_here

# Debug & Development
NEXT_PUBLIC_DEBUG_SUBSCRIPTION=true
NEXT_PUBLIC_SUBSCRIPTION_BYPASS=false`}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Production Environment Variables
              </h3>
              <p className="mb-4 text-slate-700 dark:text-slate-300">
                Production requires different values and additional security
                considerations:
              </p>
            </div>
            <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
              <pre className="text-sm text-green-400">
                {`# Production Configuration
NEXT_PUBLIC_APP_URL=https://yourapp.com
NODE_ENV=production

# Use production Stripe keys
STRIPE_API_KEY=sk_live_your-live-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-production-webhook-secret
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=price_your-live-monthly-plan-id
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=price_your-live-yearly-plan-id

# Production database
DATABASE_URL="postgresql://user:password@production-host/database?sslmode=require"

# Production OAuth (same as development)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Custom domain for R2
R2_PUBLIC_URL_BASE=https://media.yourapp.com

# Production email settings
EMAIL_FROM="Your App <noreply@yourapp.com>"
SUPPORT_EMAIL_FROM="Support <support@yourapp.com>"

# Chrome Extension (Production ID)
CHROME_EXTENSION_ORIGIN=chrome-extension://your_production_extension_id

# Disable debug features
NEXT_PUBLIC_DEBUG_SUBSCRIPTION=false
NEXT_PUBLIC_SUBSCRIPTION_BYPASS=false

# Strong production secrets
AUTH_SECRET=your-very-strong-production-auth-secret
NEXTAUTH_SECRET=your-very-strong-production-nextauth-secret`}
              </pre>
            </div>
            <div className="mt-6">
              <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                🏢 Production Advanced Variables
              </h4>
              <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                <pre className="text-sm text-green-400">
                  {`# 🔄 Production API Key Rotation (Recommended: 5+ keys)
GOOGLE_AI_API_KEY="prod_key1_account1@company.com,prod_key2_account2@company.com,prod_key3_account3@company.com,prod_key4_account4@company.com,prod_key5_account5@company.com"

# 👑 Production Admin Access (Company emails only)
ADMIN_EMAILS="ceo@yourcompany.com,cto@yourcompany.com,admin@yourcompany.com"

# 📈 Production Trend Curators (Marketing & Content team)
TREND_EMAILS="marketing@yourcompany.com,content@yourcompany.com,curator@yourcompany.com"`}
                </pre>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <h5 className="mb-2 font-semibold text-red-800 dark:text-red-300">
                    🚨 Production Security Guidelines
                  </h5>
                  <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                    <li>
                      • <strong>API Keys:</strong> Use separate Google accounts
                      for each production API key
                    </li>
                    <li>
                      • <strong>Admin Emails:</strong> Only use verified company
                      domain emails (@yourcompany.com)
                    </li>
                    <li>
                      • <strong>Trend Emails:</strong> Limit to trusted
                      marketing and content team members
                    </li>
                    <li>
                      • <strong>Monitoring:</strong> Set up alerts for API key
                      usage and admin access
                    </li>
                    <li>
                      • <strong>Rotation:</strong> Regularly rotate API keys
                      (monthly recommended)
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <h5 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                    📊 Production Scaling Benefits
                  </h5>
                  <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <li>
                      • <strong>5+ API Keys:</strong> Handle 5x more concurrent
                      requests
                    </li>
                    <li>
                      • <strong>Load Distribution:</strong> Automatic failover
                      if one key hits limits
                    </li>
                    <li>
                      • <strong>Cost Optimization:</strong> Spread usage across
                      multiple billing accounts
                    </li>
                    <li>
                      • <strong>Reliability:</strong> System continues working
                      even if some keys fail
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <h5 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                    ✅ Production Setup Checklist
                  </h5>
                  <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>
                        Set up 5+ Google accounts for API key rotation
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>
                        Generate production API keys from each account
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>
                        Configure admin emails with company domain only
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Set up trend emails for marketing team</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Test API key rotation functionality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>
                        Verify admin access works for specified emails
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Confirm trend system auto-promotes saved ads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Production Security:</strong> Use strong, unique secrets
                for production. Consider using a password manager or secret
                management service. Never use development keys in production.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
