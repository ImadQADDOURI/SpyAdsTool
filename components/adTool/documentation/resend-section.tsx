import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Info, AlertCircle, CheckCircle } from "lucide-react"

export function ResendSection() {
  return (
    <Card id="resend">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-2xl">Email with Resend</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            Resend provides a modern email API for sending transactional emails, notifications, and marketing campaigns
            with excellent deliverability and developer experience.
          </p>

          <Tabs defaultValue="development" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="development">Development Setup</TabsTrigger>
              <TabsTrigger value="production">Production Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="development" className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Development Setup</h3>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🚀 Development Benefits</h4>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <li>• Free tier with 3,000 emails/month</li>
                  <li>• No domain verification required for testing</li>
                  <li>• Built-in email templates</li>
                  <li>• Real-time delivery tracking</li>
                </ul>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">1. Create Resend Account</h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Sign up at{" "}
                  <Link href="https://resend.com" className="text-blue-600 hover:underline">
                    resend.com
                  </Link>
                </li>
                <li>Verify your email address</li>
                <li>Go to the API Keys section</li>
                <li>Create a new API key for development</li>
              </ol>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Development Environment Variables:
                </h4>
                <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm">
                  <code className="text-green-400">
                    # Resend Email Configuration
                    <br />
                    RESEND_API_KEY=re_your-resend-api-key
                    <br />
                    EMAIL_FROM="Your App &lt;onboarding@resend.dev&gt;"
                    <br />
                    SUPPORT_EMAIL_ADDRESS=support@yourapp.com
                  </code>
                </div>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-6">2. Test Email Sending</h4>
              <div className="p-4 bg-slate-900 dark:bg-slate-800 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-sm">
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
                  <strong>Development Tip:</strong> Use the default onboarding@resend.dev domain for testing. Emails
                  will be delivered but may go to spam folders.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="production" className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Production Setup</h3>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">🏢 Production Benefits</h4>
                <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                  <li>• Custom domain for professional emails</li>
                  <li>• Better deliverability and reputation</li>
                  <li>• Advanced analytics and tracking</li>
                  <li>• Higher sending limits</li>
                </ul>
              </div>

              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> For production, you must verify your domain to ensure proper email
                  deliverability and avoid spam filters.
                </AlertDescription>
              </Alert>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">1. Domain Verification</h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>In Resend dashboard, go to "Domains"</li>
                <li>Click "Add Domain" and enter your domain (e.g., yourapp.com)</li>
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

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h5 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">📋 Example DNS Records:</h5>
                <div className="text-amber-700 dark:text-amber-300 text-sm space-y-2">
                  <div>
                    <strong>SPF:</strong>
                    <code className="block bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded mt-1 text-xs">
                      TXT @ "v=spf1 include:_spf.resend.com ~all"
                    </code>
                  </div>
                  <div>
                    <strong>DKIM:</strong>
                    <code className="block bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded mt-1 text-xs">
                      TXT resend._domainkey "provided-by-resend"
                    </code>
                  </div>
                  <div>
                    <strong>DMARC:</strong>
                    <code className="block bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded mt-1 text-xs">
                      TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourapp.com"
                    </code>
                  </div>
                </div>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-6">
                2. Production API Configuration
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Create a production API key in Resend dashboard</li>
                <li>Set appropriate permissions (sending only recommended)</li>
                <li>Configure rate limiting if needed</li>
                <li>Set up webhook endpoints for delivery tracking</li>
              </ol>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Production Environment Variables:
                </h4>
                <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm">
                  <code className="text-green-400">
                    # Production Resend Configuration
                    <br />
                    RESEND_API_KEY=re_your-production-api-key
                    <br />
                    EMAIL_FROM="Your App &lt;noreply@yourapp.com&gt;"
                    <br />
                    SUPPORT_EMAIL_FROM="Support &lt;support@yourapp.com&gt;"
                    <br />
                    SUPPORT_EMAIL_ADDRESS=support@yourapp.com
                    <br />
                    <br /># Optional: Advanced settings
                    <br />
                    RESEND_WEBHOOK_SECRET=your-webhook-secret
                    <br />
                    EMAIL_REPLY_TO="noreply@yourapp.com"
                  </code>
                </div>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-6">
                3. Email Templates & Branding
              </h4>
              <div className="grid gap-4">
                <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📧 Email Types</h5>
                  <ul className="text-slate-700 dark:text-slate-300 text-sm space-y-1">
                    <li>• Welcome emails and onboarding sequences</li>
                    <li>• Password reset and security notifications</li>
                    <li>• Subscription and billing updates</li>
                    <li>• Marketing campaigns and newsletters</li>
                  </ul>
                </div>
                <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">🎨 Branding</h5>
                  <ul className="text-slate-700 dark:text-slate-300 text-sm space-y-1">
                    <li>• Use your brand colors and fonts</li>
                    <li>• Include your logo and company information</li>
                    <li>• Maintain consistent tone and messaging</li>
                    <li>• Add social media links and contact info</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-6">
                4. Deliverability Best Practices
              </h4>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h5 className="font-semibold text-red-800 dark:text-red-300 mb-2">🚨 Critical for Production:</h5>
                <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                  <li>• Always use verified domains for sending</li>
                  <li>• Implement double opt-in for subscriptions</li>
                  <li>• Monitor bounce rates and spam complaints</li>
                  <li>• Use proper unsubscribe mechanisms</li>
                  <li>• Warm up your domain gradually</li>
                  <li>• Follow CAN-SPAM and GDPR compliance</li>
                </ul>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-6">5. Production Checklist</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">
                    Domain verified with all DNS records
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">Production API key configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">
                    Email templates designed and tested
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">
                    Webhook endpoints set up for tracking
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">
                    Unsubscribe and compliance mechanisms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">
                    Monitoring and analytics configured
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-8">Advanced Usage Example</h3>
          <div className="p-4 bg-slate-900 dark:bg-slate-800 rounded-lg overflow-x-auto">
            <pre className="text-green-400 text-sm">
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
              <Link href="https://resend.com/docs" className="text-blue-600 hover:underline">
                Resend documentation
              </Link>{" "}
              for detailed API reference, React email templates, and advanced features.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
