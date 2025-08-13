import Link from "next/link";
import { CheckCircle, Info, Shield } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthSection() {
  return (
    <Card id="auth">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-2xl">
            NextAuth & Google OAuth Setup
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This guide follows the official Auth.js v5 documentation. After
              upgrading to v5, NEXTAUTH_URL is no longer required.
            </AlertDescription>
          </Alert>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                🚀 Development
              </h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>• Use localhost URLs</li>
                <li>• Same OAuth credentials work</li>
                <li>• Easy testing and debugging</li>
                <li>• Hot reload support</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <h4 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                🏢 Production
              </h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• Update authorized URLs</li>
                <li>• Same OAuth credentials</li>
                <li>• HTTPS required</li>
                <li>• Domain verification needed</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            1. Generate AUTH_SECRET
          </h3>
          <p className="mb-4 text-slate-700 dark:text-slate-300">
            The AUTH_SECRET is mandatory for encrypting tokens and email
            verification hashes.
          </p>

          <div className="mb-4 rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
            <code className="text-sm text-green-400">
              # Generate using Auth.js CLI (recommended)
              <br />
              npx auth secret
              <br />
              <br /># Or using OpenSSL
              <br />
              openssl rand -base64 33
            </code>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
              Add to .env.local:
            </h4>
            <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
              <code className="text-green-400">
                AUTH_SECRET=&quot;your-generated-secret-here&quot;
              </code>
            </div>
          </div>

          <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
            2. Google Cloud Console Setup
          </h3>
          <ol className="space-y-3 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Create a Project:</strong>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>
                  • Go to{" "}
                  <Link
                    href="https://console.cloud.google.com"
                    className="text-blue-600 hover:underline"
                  >
                    Google Cloud Console
                  </Link>
                </li>
                <li>• Create a new project or select an existing one</li>
              </ul>
            </li>
            <li>
              <strong>Enable Google+ API:</strong>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>
                  • Navigate to &quot;APIs &amp; Services&quot; →
                  &quot;Library&quot;
                </li>
                <li>• Search for &quot;Google+ API&quot; and enable it</li>
              </ul>
            </li>
            <li>
              <strong>Create OAuth 2.0 Credentials:</strong>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>
                  • Go to &quot;APIs &amp; Services&quot; →
                  &quot;Credentials&quot;
                </li>
                <li>
                  • Click &quot;Create Credentials&quot; → &quot;OAuth 2.0
                  Client IDs&quot;
                </li>
                <li>
                  • Choose &quot;Web application&quot; as application type
                </li>
              </ul>
            </li>
            <li>
              <strong>Configure Authorized URLs:</strong>
              <div className="ml-4 mt-2 grid gap-4 md:grid-cols-2">
                <div className="rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                  <h5 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
                    Development URLs:
                  </h5>
                  <div className="space-y-1 text-xs">
                    <div>
                      <strong>Origins:</strong>
                      <code className="mt-1 block rounded bg-blue-100 px-1 dark:bg-blue-800">
                        http://localhost:3000
                      </code>
                    </div>
                    <div>
                      <strong>Redirect URIs:</strong>
                      <code className="mt-1 block rounded bg-blue-100 px-1 dark:bg-blue-800">
                        http://localhost:3000/api/auth/callback/google
                      </code>
                    </div>
                  </div>
                </div>
                <div className="rounded border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                  <h5 className="mb-2 text-sm font-semibold text-green-800 dark:text-green-300">
                    Production URLs:
                  </h5>
                  <div className="space-y-1 text-xs">
                    <div>
                      <strong>Origins:</strong>
                      <code className="mt-1 block rounded bg-green-100 px-1 dark:bg-green-800">
                        https://yourapp.com
                      </code>
                    </div>
                    <div>
                      <strong>Redirect URIs:</strong>
                      <code className="mt-1 block rounded bg-green-100 px-1 dark:bg-green-800">
                        https://yourapp.com/api/auth/callback/google
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ol>

          <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
            3. Environment Configuration
          </h3>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
              Add to .env.local:
            </h4>
            <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
              <code className="text-green-400">
                # NextAuth Configuration
                <br />
                AUTH_SECRET=&quot;your-generated-secret-here&quot;
                <br />
                <br /># Google OAuth 2.0 Client IDs
                <br />
                GOOGLE_CLIENT_ID=&quot;your-client-id.apps.googleusercontent.com&quot;
                <br />
                GOOGLE_CLIENT_SECRET=&quot;your-client-secret&quot;
              </code>
            </div>
          </div>

          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Video Tutorial:</strong> Watch{" "}
              <Link
                href="https://youtu.be/1MTyCvS05V4"
                className="text-blue-600 hover:underline"
              >
                CodeWithAntonio&apos;s tutorial
              </Link>{" "}
              for visual guidance (GoogleAuth setup at 3:24:30).
            </AlertDescription>
          </Alert>

          <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
            4. Production Updates
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            When deploying to production, remember to:
          </p>
          <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
            <li>
              • Update the authorized origins and redirect URIs in Google Cloud
              Console
            </li>
            <li>
              • Use the same GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in
              production
            </li>
            <li>• Ensure your production domain is properly configured</li>
            <li>• Update NEXT_PUBLIC_APP_URL to your production domain</li>
            <li>• Use a strong, unique AUTH_SECRET for production</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
