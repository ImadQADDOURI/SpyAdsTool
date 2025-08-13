import Link from "next/link";
import { AlertCircle, CheckCircle, Info, Mail } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResendSection() {
  return (
    <Card id="resend">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-2xl">Email with Resend</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="mb-6 text-slate-700 dark:text-slate-300">
            Resend provides a modern email API for sending transactional emails,
            notifications, and marketing campaigns with excellent deliverability
            and developer experience.
          </p>

          <Tabs defaultValue="development" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="development">Development Setup</TabsTrigger>
              <TabsTrigger value="production">Production Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="development" className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Development Setup
              </h3>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                  🚀 Development Benefits
                </h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Free tier with 3,000 emails/month</li>
                  <li>• No domain verification required for testing</li>
                  <li>• Built-in email templates</li>
                  <li>• Real-time delivery tracking</li>
                </ul>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                1. Create Resend Account
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Sign up at{" "}
                  <Link
                    href="https://resend.com"
                    className="text-blue-600 hover:underline"
                  >
                    resend.com
                  </Link>
                </li>
                <li>Verify your email address</li>
                <li>Go to the API Keys section</li>
                <li>Create a new API key for development</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Development Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    # Resend Email Configuration
                    <br />
                    RESEND_API_KEY=re_your-resend-api-key
                    <br />
                    EMAIL_FROM=&quot;Your App
                    &lt;onboarding@resend.dev&gt;&quot;
                    <br />
                    SUPPORT_EMAIL_ADDRESS=support@yourapp.com
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                2. Test Email Sending
              </h4>
              <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
                <pre className="text-sm text-green-400">
                  {`// Test email function
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTestEmail() {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ['test@example.com'],
    subject: 'Test Email',
    html: '<p>Hello from your app!</p>',
  });

  if (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }

  return { success: true, data };
}`}
                </pre>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Development Tip:</strong> Use the default
                  onboarding@resend.dev domain for testing. Emails will be
                  delivered but may go to spam folders.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="production" className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Production Setup
              </h3>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <h4 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                  🏢 Production Benefits
                </h4>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>• Custom domain for professional emails</li>
                  <li>• Better deliverability and reputation</li>
                  <li>• Advanced analytics and tracking</li>
                  <li>• Higher sending limits</li>
                </ul>
              </div>

              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> For production, you must verify
                  your domain to ensure proper email deliverability and avoid
                  spam filters.
                </AlertDescription>
              </Alert>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                1. Domain Verification
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>In Resend dashboard, go to &quot;Domains&quot;</li>
                <li>
                  Click &quot;Add Domain&quot; and enter your domain (e.g.,
                  yourapp.com)
                </li>
                <li>Add the required DNS records to your domain:</li>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>• SPF record for sender authentication</li>
                  <li>• DKIM record for email signing</li>
                  <li>• DMARC record for email policy</li>
                  <li>• MX record (if using Resend for receiving)</li>
                </ul>
                <li>Wait for DNS propagation (usually 24-48 hours)</li>
                <li>Verify domain status in Resend dashboard</li>
              </ol>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <h5 className="mb-2 font-semibold text-amber-800 dark:text-amber-300">
                  📋 Example DNS Records:
                </h5>
                <div className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                  <div>
                    <strong>SPF:</strong>
                    <code className="mt-1 block rounded bg-amber-100 px-2 py-1 text-xs dark:bg-amber-800">
                      TXT @ &quot;v=spf1 include:_spf.resend.com ~all&quot;
                    </code>
                  </div>
                  <div>
                    <strong>DKIM:</strong>
                    <code className="mt-1 block rounded bg-amber-100 px-2 py-1 text-xs dark:bg-amber-800">
                      TXT resend._domainkey &quot;provided-by-resend&quot;
                    </code>
                  </div>
                  <div>
                    <strong>DMARC:</strong>
                    <code className="mt-1 block rounded bg-amber-100 px-2 py-1 text-xs dark:bg-amber-800">
                      TXT _dmarc &quot;v=DMARC1; p=quarantine;
                      rua=mailto:dmarc@yourapp.com&quot;
                    </code>
                  </div>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                2. Production API Configuration
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Create a production API key in Resend dashboard</li>
                <li>Set appropriate permissions (sending only recommended)</li>
                <li>Configure rate limiting if needed</li>
                <li>Set up webhook endpoints for delivery tracking</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Production Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    # Production Resend Configuration
                    <br />
                    RESEND_API_KEY=re_your-production-api-key
                    <br />
                    EMAIL_FROM=&quot;Your App &lt;noreply@yourapp.com&gt;&quot;
                    <br />
                    SUPPORT_EMAIL_FROM=&quot;Support
                    &lt;support@yourapp.com&gt;&quot;
                    <br />
                    SUPPORT_EMAIL_ADDRESS=support@yourapp.com
                    <br />
                    <br /># Optional: Advanced settings
                    <br />
                    RESEND_WEBHOOK_SECRET=your-webhook-secret
                    <br />
                    EMAIL_REPLY_TO=&quot;noreply@yourapp.com&quot;
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                3. Email Templates & Branding
              </h4>
              <div className="grid gap-4">
                <div className="rounded-lg border border-blue-200 p-4 dark:border-blue-800">
                  <h5 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                    📧 Email Types
                  </h5>
                  <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Welcome emails and onboarding sequences</li>
                    <li>• Password reset and security notifications</li>
                    <li>• Subscription and billing updates</li>
                    <li>• Marketing campaigns and newsletters</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-green-200 p-4 dark:border-green-800">
                  <h5 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                    🎨 Branding
                  </h5>
                  <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Use your brand colors and fonts</li>
                    <li>• Include your logo and company information</li>
                    <li>• Maintain consistent tone and messaging</li>
                    <li>• Add social media links and contact info</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                4. Deliverability Best Practices
              </h4>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <h5 className="mb-2 font-semibold text-red-800 dark:text-red-300">
                  🚨 Critical for Production:
                </h5>
                <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                  <li>• Always use verified domains for sending</li>
                  <li>• Implement double opt-in for subscriptions</li>
                  <li>• Monitor bounce rates and spam complaints</li>
                  <li>• Use proper unsubscribe mechanisms</li>
                  <li>• Warm up your domain gradually</li>
                  <li>• Follow CAN-SPAM and GDPR compliance</li>
                </ul>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                5. Production Checklist
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Domain verified with all DNS records
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Production API key configured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Email templates designed and tested
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Webhook endpoints set up for tracking
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Unsubscribe and compliance mechanisms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Monitoring and analytics configured
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Advanced Usage Example
          </h3>
          <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
            <pre className="text-sm text-green-400">
              {`// Advanced email with React components
import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/welcome-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(user: User) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [user.email],
    subject: \`Welcome to \${process.env.NEXT_PUBLIC_APP_NAME}!\`,
    react: WelcomeEmail({ 
      userName: user.name,
      loginUrl: \`\${process.env.NEXT_PUBLIC_APP_URL}/login\`
    }),
    tags: [
      { name: 'category', value: 'welcome' },
      { name: 'user_id', value: user.id }
    ],
  });

  return { success: !error, data, error };
}`}
            </pre>
          </div>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Documentation:</strong> Visit{" "}
              <Link
                href="https://resend.com/docs"
                className="text-blue-600 hover:underline"
              >
                Resend documentation
              </Link>{" "}
              for detailed API reference, React email templates, and advanced
              features.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
