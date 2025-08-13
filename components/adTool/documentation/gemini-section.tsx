import Link from "next/link";
import { AlertCircle, Brain, CheckCircle, Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function GeminiSection() {
  return (
    <Card id="gemini">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-2xl">Gemini AI Setup</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="mb-6 text-slate-700 dark:text-slate-300">
            Integrate Google&apos;s Gemini AI for advanced ad analysis, content
            generation, and intelligent insights.
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
                  <li>• Free tier with generous limits</li>
                  <li>• Same API key works for testing</li>
                  <li>• Rate limiting for safe development</li>
                  <li>• Easy debugging and testing</li>
                </ul>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                1. Get Your API Key
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Go to{" "}
                  <Link
                    href="https://ai.google.dev"
                    className="text-blue-600 hover:underline"
                  >
                    Google AI Studio
                  </Link>
                </li>
                <li>Sign in with your Google account</li>
                <li>Click "Get API Key" and create a new API key</li>
                <li>Copy the API key for your environment variables</li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Development Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    # Gemini AI Configuration
                    <br />
                    GOOGLE_AI_API_KEY=your-gemini-api-key-here
                    <br />
                    GOOGLE_AI_API_MODEL=gemini-2.0-flash-lite
                  </code>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                  3. API Key Rotation System
                </h4>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <h5 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                    🔄 Development Rotation Setup
                  </h5>
                  <p className="mb-3 text-sm text-blue-700 dark:text-blue-300">
                    Even in development, you can test the rotation system with
                    multiple API keys:
                  </p>
                  <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                    <code className="text-green-400">
                      # Multiple API keys for testing rotation
                      <br />
                      GOOGLE_AI_API_KEY="dev_key1_personal@gmail.com,dev_key2_work@gmail.com"
                    </code>
                  </div>
                  <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    The system will automatically rotate between these keys for
                    each request, preventing rate limiting.
                  </p>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                2. Available Models
              </h4>
              <div className="grid gap-3">
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    gemini-2.0-flash-lite
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Recommended for development - Fast and efficient
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    gemini-1.5-pro
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    More powerful for complex analysis
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    gemini-1.5-flash
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Balanced performance and speed
                  </p>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Development Tip:</strong> Start with
                  gemini-2.0-flash-lite for development as it&apos;s fast and
                  has generous rate limits. You can switch models easily by
                  changing the environment variable.
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
                  <li>• Higher rate limits for production traffic</li>
                  <li>• Better performance and reliability</li>
                  <li>• Advanced monitoring and analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> The same API key works for both
                  development and production. Consider using separate projects
                  for better organization and billing tracking.
                </AlertDescription>
              </Alert>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                1. Production API Key Management
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  Create a separate Google Cloud project for production
                  (recommended)
                </li>
                <li>Enable the Generative AI API in the production project</li>
                <li>Generate a production API key</li>
                <li>Set up API key restrictions for security:</li>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>• Restrict to specific APIs (Generative AI API)</li>
                  <li>• Add IP restrictions if using dedicated servers</li>
                  <li>• Set up usage quotas and alerts</li>
                </ul>
              </ol>

              <div className="mt-6">
                <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                  2. Advanced API Key Rotation Strategy
                </h4>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <h5 className="mb-2 font-semibold text-amber-800 dark:text-amber-300">
                    🏢 Enterprise Rotation Setup
                  </h5>
                  <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">
                    For production workloads, implement a robust rotation
                    system:
                  </p>
                  <ol className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                    <li>
                      <strong>1. Create Multiple Google Accounts:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>
                          • Use company email addresses (ai-key-1@company.com,
                          ai-key-2@company.com)
                        </li>
                        <li>
                          • Minimum 3 accounts, recommended 5+ for high-traffic
                          applications
                        </li>
                        <li>
                          • Each account should have its own billing setup
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>2. Generate API Keys:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Create one API key per Google account</li>
                        <li>• Apply the same restrictions to all keys</li>
                        <li>• Document which key belongs to which account</li>
                      </ul>
                    </li>
                    <li>
                      <strong>3. Configure Environment Variable:</strong>
                      <div className="mt-2 rounded bg-slate-900 p-2 text-xs dark:bg-slate-700">
                        <code className="text-green-400">
                          GOOGLE_AI_API_KEY="key1,key2,key3,key4,key5"
                        </code>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-lg border border-green-200 p-3 dark:border-green-800">
                    <h6 className="mb-1 text-sm font-semibold text-green-800 dark:text-green-300">
                      ✅ Benefits of Rotation:
                    </h6>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      <li>• 5x higher effective rate limits</li>
                      <li>• Automatic failover if one key fails</li>
                      <li>• Distributed billing across accounts</li>
                      <li>• Reduced risk of service interruption</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-blue-200 p-3 dark:border-blue-800">
                    <h6 className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-300">
                      🔧 How Rotation Works:
                    </h6>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      <li>• System picks a random key for each request</li>
                      <li>
                        • If a key fails, automatically tries the next one
                      </li>
                      <li>• No manual intervention required</li>
                      <li>• Transparent to your application code</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Production Environment Variables:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    # Production Gemini AI Configuration
                    <br />
                    GOOGLE_AI_API_KEY=your-production-gemini-api-key
                    <br />
                    GOOGLE_AI_API_MODEL=gemini-1.5-pro
                    <br />
                    <br /># Optional: Custom settings
                    <br />
                    GOOGLE_AI_MAX_TOKENS=8192
                    <br />
                    GOOGLE_AI_TEMPERATURE=0.7
                  </code>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                2. Model Selection for Production
              </h4>
              <div className="grid gap-4">
                <div className="rounded-lg border border-green-200 p-4 dark:border-green-800">
                  <h5 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                    ✅ Recommended: gemini-1.5-pro
                  </h5>
                  <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Best performance for complex ad analysis</li>
                    <li>• Higher context window (2M tokens)</li>
                    <li>• Better reasoning capabilities</li>
                    <li>• Suitable for production workloads</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-blue-200 p-4 dark:border-blue-800">
                  <h5 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                    ⚡ Alternative: gemini-1.5-flash
                  </h5>
                  <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Faster response times</li>
                    <li>• Lower cost per request</li>
                    <li>• Good for simple analysis tasks</li>
                    <li>• Better for high-volume applications</li>
                    <li>• Better for high-volume applications</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                3. Rate Limiting & Quotas
              </h4>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <h5 className="mb-2 font-semibold text-amber-800 dark:text-amber-300">
                  📊 Production Considerations:
                </h5>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Monitor your API usage in Google Cloud Console</li>
                  <li>• Set up billing alerts to avoid unexpected charges</li>
                  <li>
                    • Implement client-side rate limiting in your application
                  </li>
                  <li>• Cache responses when possible to reduce API calls</li>
                  <li>
                    • Consider implementing request queuing for high traffic
                  </li>
                </ul>
              </div>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                4. Security Best Practices
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Store API keys securely in environment variables</li>
                <li>Never expose API keys in client-side code</li>
                <li>Use API key restrictions in Google Cloud Console</li>
                <li>Implement proper error handling for API failures</li>
                <li>Log API usage for monitoring and debugging</li>
                <li>Rotate API keys periodically</li>
              </ol>

              <h4 className="text-md mt-6 font-semibold text-slate-900 dark:text-slate-100">
                5. Production Checklist
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Production API key configured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Appropriate model selected for workload
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    API key restrictions configured
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Billing alerts and quotas set up
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Error handling and logging implemented
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Response caching strategy in place
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Usage Examples
          </h3>
          <div className="overflow-x-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-800">
            <pre className="text-sm text-green-400">
              {`// Example API usage in your application
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function analyzeAd(adContent: string) {
  const model = genAI.getGenerativeModel({ 
    model: process.env.GOOGLE_AI_API_MODEL || "gemini-1.5-pro" 
  });

  const prompt = \`Analyze this advertisement and provide insights on:
1. Target audience
2. Key messaging
3. Effectiveness score (1-10)
4. Improvement suggestions

Ad content: \${adContent}\`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}`}
            </pre>
          </div>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Documentation:</strong> Visit{" "}
              <Link
                href="https://ai.google.dev/docs"
                className="text-blue-600 hover:underline"
              >
                Google AI documentation
              </Link>{" "}
              for detailed API reference and advanced usage examples.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
