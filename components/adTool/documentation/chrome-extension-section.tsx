import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Puzzle, AlertCircle, Info, CheckCircle } from "lucide-react"

export function ChromeExtensionSection() {
  return (
    <Card id="chrome-extension">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Puzzle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-2xl">Chrome Extension Integration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            This platform includes Chrome Extension integration capabilities for enhanced ad search functionality. The
            extension can communicate with your web application through secure API endpoints.
          </p>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              The Chrome Extension integration is configured in your{" "}
              <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">next.config.js</code> file to handle CORS
              properly for both development and production environments.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="configuration" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Next.js Configuration</h3>
              <p className="text-slate-700 dark:text-slate-300">
                The platform includes specific CORS configuration for Chrome Extension communication:
              </p>

              <div className="p-4 bg-slate-900 dark:bg-slate-800 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  {`// next.config.js
// 🔒 Define the specific origin of your Chrome extension
//    Load this from environment variables for security and flexibility!
const chromeExtensionOrigin = process.env.CHROME_EXTENSION_ORIGIN; // e.g., "chrome-extension://your_extension_id_here"

// 🤔 Determine the allowed origin based on the environment
const allowedOrigin =
  process.env.NODE_ENV === "development" ? "*" : chromeExtensionOrigin;

// ⚠️ Ensure chromeExtensionOrigin is set in production!
if (process.env.NODE_ENV === "production" && !chromeExtensionOrigin) {
  console.warn(
    "🚨 WARNING: CHROME_EXTENSION_ORIGIN environment variable is not set for production!",
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigin,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};`}
                </pre>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-6">
                Environment Variable Setup
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Add to your environment files:
                </h4>
                <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm">
                  <code className="text-green-400">
                    # Chrome Extension Configuration
                    <br />
                    CHROME_EXTENSION_ORIGIN=chrome-extension://your_extension_id_here
                  </code>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="development" className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Development Setup</h3>
              <p className="text-slate-700 dark:text-slate-300">
                During development, the CORS policy is set to allow all origins (*) for easier testing.
              </p>

              <div className="space-y-4">
                <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ Development Benefits</h4>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-sm">
                    <li>• No CORS restrictions for easier testing</li>
                    <li>• Works with unpacked extensions</li>
                    <li>• Hot reload support</li>
                    <li>• Easy debugging with browser dev tools</li>
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Development Environment:</h4>
                  <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm">
                    <code className="text-green-400">
                      # .env.local (development)
                      <br />
                      NODE_ENV=development
                      <br />
                      NEXT_PUBLIC_APP_URL=http://localhost:3000
                      <br /># Chrome extension origin not required in development
                      <br /># CHROME_EXTENSION_ORIGIN=chrome-extension://your_dev_extension_id
                    </code>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Development Tip:</strong> You can test your Chrome extension with the development server
                    without setting the CHROME_EXTENSION_ORIGIN variable, as development mode allows all origins.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Production Setup</h3>
              <p className="text-slate-700 dark:text-slate-300">
                In production, you must specify the exact Chrome extension origin for security.
              </p>

              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Critical:</strong> In production, CORS is restricted to your specific Chrome
                  extension ID only. This prevents unauthorized access to your API endpoints.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">🔒 Production Security</h4>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-sm">
                    <li>• CORS restricted to specific extension ID</li>
                    <li>• Environment variable validation</li>
                    <li>• Warning logs if misconfigured</li>
                    <li>• Prevents unauthorized API access</li>
                  </ul>
                </div>

                <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                  1. Get Your Chrome Extension ID
                </h4>
                <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>1. Publish your Chrome extension to the Chrome Web Store</li>
                  <li>2. Copy the extension ID from the store URL or extension management page</li>
                  <li>
                    3. The ID will look like:{" "}
                    <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">
                      abcdefghijklmnopqrstuvwxyz123456
                    </code>
                  </li>
                </ol>

                <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-4">
                  2. Configure Production Environment
                </h4>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Production Environment Variables:
                  </h5>
                  <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm">
                    <code className="text-green-400">
                      # .env.production (or Vercel environment variables)
                      <br />
                      NODE_ENV=production
                      <br />
                      NEXT_PUBLIC_APP_URL=https://yourapp.com
                      <br />
                      CHROME_EXTENSION_ORIGIN=chrome-extension://your_actual_extension_id_here
                    </code>
                  </div>
                </div>

                <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-4">
                  3. Deployment Platforms
                </h4>
                <div className="grid gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Vercel</h5>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                      Add the environment variable in your Vercel dashboard:
                    </p>
                    <div className="p-2 bg-slate-900 dark:bg-slate-800 rounded text-xs">
                      <code className="text-green-400">
                        Project Settings → Environment Variables → Add New
                        <br />
                        Name: CHROME_EXTENSION_ORIGIN
                        <br />
                        Value: chrome-extension://your_extension_id
                      </code>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Other Platforms</h5>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Set the environment variable through your platform&apos;s dashboard or deployment configuration.
                    </p>
                  </div>
                </div>

                <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-4">
                  4. Validation & Testing
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                      Environment variable is set in production
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                      Chrome extension can make API calls
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                      Other origins are blocked (security test)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                      No CORS warnings in browser console
                    </span>
                  </div>
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> If the CHROME_EXTENSION_ORIGIN environment variable is not set in
                    production, you&apos;ll see a warning in your application logs, and the extension integration may
                    not work properly.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-8">API Endpoint Integration</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Your Chrome extension can communicate with these API endpoints:
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm">
              <code className="text-green-400">
                # Available API endpoints for Chrome extension
                <br />
                GET /api/ads/search - Search for ads
                <br />
                POST /api/ads/analyze - Analyze ad performance
                <br />
                GET /api/user/profile - Get user profile
                <br />
                POST /api/user/preferences - Update user preferences
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
