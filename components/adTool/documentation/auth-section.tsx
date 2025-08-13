import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Info, CheckCircle } from "lucide-react"

export function AuthSection() {
  return (
    <Card id="auth">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-2xl">NextAuth & Google OAuth Setup</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This guide follows the official Auth.js v5 documentation. After upgrading to v5, NEXTAUTH_URL is no longer
              required.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🚀 Development</h4>
              <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                <li>• Use localhost URLs</li>
                <li>• Same OAuth credentials work</li>
                <li>• Easy testing and debugging</li>
                <li>• Hot reload support</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">🏢 Production</h4>
              <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                <li>• Update authorized URLs</li>
                <li>• Same OAuth credentials</li>
                <li>• HTTPS required</li>
                <li>• Domain verification needed</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">1. Generate AUTH_SECRET</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The AUTH_SECRET is mandatory for encrypting tokens and email verification hashes.
          </p>

          <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded-lg mb-4">
            <code className="text-green-400 text-sm">
              # Generate using Auth.js CLI (recommended)
              <br />
              npx auth secret
              <br />
              <br /># Or using OpenSSL
              <br />
              openssl rand -base64 33
            </code>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Add to .env.local:</h4>
            <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm">
              <code className="text-green-400">AUTH_SECRET="your-generated-secret-here"</code>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-6">
            2. Google Cloud Console Setup
          </h3>
          <ol className="space-y-3 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Create a Project:</strong>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>
                  • Go to{" "}
                  <Link href="https://console.cloud.google.com" className="text-blue-600 hover:underline">
                    Google Cloud Console
                  </Link>
                </li>
                <li>• Create a new project or select an existing one</li>
              </ul>
            </li>
            <li>
              <strong>Enable Google+ API:</strong>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>• Navigate to "APIs & Services" → "Library"</li>
                <li>• Search for "Google+ API" and enable it</li>
              </ul>
            </li>
            <li>
              <strong>Create OAuth 2.0 Credentials:</strong>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>• Go to "APIs & Services" → "Credentials"</li>
                <li>• Click "Create Credentials" → "OAuth 2.0 Client IDs"</li>
                <li>• Choose "Web application" as application type</li>
              </ul>
            </li>
            <li>
              <strong>Configure Authorized URLs:</strong>
              <div className="ml-4 mt-2 grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                  <h5 className="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-2">Development URLs:</h5>
                  <div className="space-y-1 text-xs">
                    <div>
                      <strong>Origins:</strong>
                      <code className="block bg-blue-100 dark:bg-blue-800 px-1 rounded mt-1">
                        http://localhost:3000
                      </code>
                    </div>
                    <div>
                      <strong>Redirect URIs:</strong>
                      <code className="block bg-blue-100 dark:bg-blue-800 px-1 rounded mt-1">
                        http://localhost:3000/api/auth/callback/google
                      </code>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                  <h5 className="font-semibold text-green-800 dark:text-green-300 text-sm mb-2">Production URLs:</h5>
                  <div className="space-y-1 text-xs">
                    <div>
                      <strong>Origins:</strong>
                      <code className="block bg-green-100 dark:bg-green-800 px-1 rounded mt-1">
                        https://yourapp.com
                      </code>
                    </div>
                    <div>
                      <strong>Redirect URIs:</strong>
                      <code className="block bg-green-100 dark:bg-green-800 px-1 rounded mt-1">
                        https://yourapp.com/api/auth/callback/google
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-6">
            3. Environment Configuration
          </h3>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Add to .env.local:</h4>
            <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm">
              <code className="text-green-400">
                # NextAuth Configuration
                <br />
                AUTH_SECRET="your-generated-secret-here"
                <br />
                <br /># Google OAuth 2.0 Client IDs
                <br />
                GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
                <br />
                GOOGLE_CLIENT_SECRET="your-client-secret"
              </code>
            </div>
          </div>

          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Video Tutorial:</strong> Watch{" "}
              <Link href="https://youtu.be/1MTyCvS05V4" className="text-blue-600 hover:underline">
                CodeWithAntonio&apos;s tutorial
              </Link>{" "}
              for visual guidance (GoogleAuth setup at 3:24:30).
            </AlertDescription>
          </Alert>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-6">4. Production Updates</h3>
          <p className="text-slate-700 dark:text-slate-300">When deploying to production, remember to:</p>
          <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-sm">
            <li>• Update the authorized origins and redirect URIs in Google Cloud Console</li>
            <li>• Use the same GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in production</li>
            <li>• Ensure your production domain is properly configured</li>
            <li>• Update NEXT_PUBLIC_APP_URL to your production domain</li>
            <li>• Use a strong, unique AUTH_SECRET for production</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
