import Link from "next/link";
import { AlertCircle, CheckCircle, Cloud, Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CloudflareSection() {
  return (
    <Card id="cloudflare">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Cloud className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          <CardTitle className="text-2xl">Cloudflare R2 Storage</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="mb-6 text-slate-700 dark:text-slate-300">
            Cloudflare R2 provides S3-compatible object storage with zero egress
            fees, perfect for storing ad images, user uploads, and media files.
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
                  <li>• Free tier with 10GB storage</li>
                  <li>• No egress fees for testing</li>
                  <li>• S3-compatible API</li>
                  <li>• Fast global CDN</li>
                </ul>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                1. Create Cloudflare Account & R2 Bucket
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Sign up at{" "}
                  <Link
                    href="https://cloudflare.com"
                    className="text-blue-600 hover:underline"
                  >
                    cloudflare.com
                  </Link>
                </li>
                <li>Navigate to R2 Object Storage in the dashboard</li>
                <li>Create a new bucket (e.g., "your-app-dev-storage")</li>
                <li>Note your Account ID from the R2 overview page</li>
              </ol>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                2. Generate API Tokens
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Go to "My Profile" → "API Tokens"</li>
                <li>Click "Create Token" → "Custom token"</li>
                <li>Configure permissions:</li>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>• Zone: Zone:Read (if using custom domain)</li>
                  <li>• Account: Cloudflare R2:Edit</li>
                  <li>• Account Resources: Include specific account</li>
                </ul>
                <li>Generate R2 API credentials in the R2 dashboard</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Development Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    # Cloudflare R2 Configuration
                    <br />
                    R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
                    <br />
                    R2_ACCESS_KEY_ID=your-r2-access-key
                    <br />
                    R2_SECRET_ACCESS_KEY=your-r2-secret-key
                    <br />
                    R2_BUCKET_NAME=your-app-dev-storage
                    <br />
                    R2_PUBLIC_URL_BASE=https://pub-xxx.r2.dev
                  </code>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Development Tip:</strong> Use the default R2.dev
                  subdomain for development. You can set up a custom domain
                  later for production.
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
                  <li>• Custom domain for professional URLs</li>
                  <li>• Advanced caching and CDN features</li>
                  <li>• Better security and access controls</li>
                  <li>• Detailed analytics and monitoring</li>
                </ul>
              </div>

              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> For production, set up a custom
                  domain for better branding and control over your media URLs.
                </AlertDescription>
              </Alert>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                1. Create Production Bucket
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Create a separate bucket for production (e.g.,
                  "your-app-prod-storage")
                </li>
                <li>Configure bucket settings:</li>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>• Enable public access for media files</li>
                  <li>• Set up appropriate CORS policies</li>
                  <li>• Configure lifecycle rules for cost optimization</li>
                </ul>
                <li>Generate production API credentials</li>
              </ol>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                2. Custom Domain Setup
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Add your domain to Cloudflare (if not already)</li>
                <li>Create a subdomain for media (e.g., media.yourapp.com)</li>
                <li>In R2 dashboard, go to your bucket settings</li>
                <li>Add custom domain and configure DNS:</li>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>
                    • Create CNAME record: media.yourapp.com →
                    your-bucket.r2.dev
                  </li>
                  <li>• Enable SSL/TLS encryption</li>
                  <li>• Configure cache settings</li>
                </ul>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Production Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    # Production Cloudflare R2 Configuration
                    <br />
                    R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
                    <br />
                    R2_ACCESS_KEY_ID=your-production-r2-access-key
                    <br />
                    R2_SECRET_ACCESS_KEY=your-production-r2-secret-key
                    <br />
                    R2_BUCKET_NAME=your-app-prod-storage
                    <br />
                    R2_PUBLIC_URL_BASE=https://media.yourapp.com
                    <br />
                    <br /># Optional: Advanced settings
                    <br />
                    R2_REGION=auto
                    <br />
                    R2_FORCE_PATH_STYLE=false
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                3. Security Configuration
              </h4>
              <div className="grid gap-4">
                <div className="rounded-lg border border-red-200 p-4 dark:border-red-800">
                  <h5 className="mb-2 font-semibold text-red-800 dark:text-red-300">
                    🔒 Access Control
                  </h5>
                  <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Use separate API keys for production</li>
                    <li>• Implement signed URLs for sensitive content</li>
                    <li>• Set up proper CORS policies</li>
                    <li>• Enable access logging for monitoring</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-blue-200 p-4 dark:border-blue-800">
                  <h5 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                    🛡️ Content Security
                  </h5>
                  <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Validate file types and sizes</li>
                    <li>• Implement virus scanning for uploads</li>
                    <li>• Use content hashing for integrity</li>
                    <li>• Set up automated backups</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                4. Performance Optimization
              </h4>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <h5 className="mb-2 font-semibold text-amber-800 dark:text-amber-300">
                  ⚡ Production Optimizations:
                </h5>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Enable Cloudflare caching for static assets</li>
                  <li>• Configure appropriate cache headers</li>
                  <li>• Use image optimization and resizing</li>
                  <li>• Implement lazy loading for images</li>
                  <li>• Set up CDN purging for updates</li>
                  <li>• Monitor bandwidth and storage usage</li>
                </ul>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                5. Production Checklist
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Production bucket created and configured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Custom domain set up and SSL enabled
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Production API credentials configured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    CORS policies and security settings applied
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Caching and CDN optimization enabled
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Monitoring and analytics set up
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Usage Example
          </h3>
          <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
            <pre className="text-sm text-green-400">
              {`// Example R2 upload function
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(file: File, key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: await file.arrayBuffer(),
    ContentType: file.type,
  });

  await r2Client.send(command);
  return \`\${process.env.R2_PUBLIC_URL_BASE}/\${key}\`;
}`}
            </pre>
          </div>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Documentation:</strong> Visit{" "}
              <Link
                href="https://developers.cloudflare.com/r2/"
                className="text-blue-600 hover:underline"
              >
                Cloudflare R2 documentation
              </Link>{" "}
              for detailed API reference and advanced configuration options.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
