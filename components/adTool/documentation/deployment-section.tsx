import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Info, AlertCircle, CheckCircle } from "lucide-react"

export function DeploymentSection() {
  return (
    <Card id="deployment">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ExternalLink className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-2xl">Production Deployment Guide</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="vercel" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vercel">Vercel (Recommended)</TabsTrigger>
            <TabsTrigger value="vps">VPS/Server</TabsTrigger>
            <TabsTrigger value="docker">Docker</TabsTrigger>
          </TabsList>

          <TabsContent value="vercel" className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Vercel Deployment</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Vercel is the recommended platform for Next.js applications with zero-config deployment.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">🚀 Vercel Benefits</h4>
                <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                  <li>• Zero-config Next.js deployment</li>
                  <li>• Automatic SSL certificates</li>
                  <li>• Global CDN and edge functions</li>
                  <li>• Built-in analytics and monitoring</li>
                  <li>• Preview deployments for PRs</li>
                  <li>• Serverless functions support</li>
                </ul>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">1. Connect Repository</h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Push your code to GitHub, GitLab, or Bitbucket</li>
                <li>
                  Go to{" "}
                  <Link href="https://vercel.com" className="text-blue-600 hover:underline">
                    vercel.com
                  </Link>{" "}
                  and sign up
                </li>
                <li>Click "New Project" and import your repository</li>
                <li>Vercel will auto-detect Next.js and configure build settings</li>
              </ol>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-4">
                2. Environment Variables
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Add all production environment variables in Vercel dashboard:
              </p>
              <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded-lg">
                <code className="text-green-400 text-sm">
                  # Go to Project Settings → Environment Variables
                  <br />
                  NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
                  <br />
                  AUTH_SECRET=your-production-auth-secret
                  <br />
                  DATABASE_URL=your-production-database-url
                  <br />
                  STRIPE_API_KEY=sk_live_your-live-key
                  <br />
                  CHROME_EXTENSION_ORIGIN=chrome-extension://your_extension_id
                  <br /># ... add all other variables
                </code>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-4">3. Custom Domain</h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Go to Project Settings → Domains</li>
                <li>Add your custom domain (e.g., yourapp.com)</li>
                <li>Configure DNS records as instructed by Vercel</li>
                <li>Update NEXT_PUBLIC_APP_URL to your custom domain</li>
                <li>Update all service webhooks to use the new domain</li>
              </ol>

              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Vercel automatically handles SSL certificates, CDN, and global deployment for optimal performance.
                  Perfect for SaaS applications with global users.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="vps" className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">VPS/Server Deployment</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Deploy to your own server for full control over the infrastructure.
              </p>

              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Requirements:</strong> Ubuntu 20.04+ or similar Linux distribution, 2GB+ RAM, Node.js 18+,
                  PM2, Nginx
                </AlertDescription>
              </Alert>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">1. Server Preparation</h4>
              <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded-lg">
                <code className="text-green-400 text-sm">
                  # Update system
                  <br />
                  sudo apt update &amp;&amp; sudo apt upgrade -y
                  <br />
                  <br /># Install Node.js 18+
                  <br />
                  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                  <br />
                  sudo apt-get install -y nodejs
                  <br />
                  <br /># Install PM2 globally
                  <br />
                  sudo npm install -g pm2
                  <br />
                  <br /># Install Nginx
                  <br />
                  sudo apt install nginx -y
                  <br />
                  <br /># Install Git
                  <br />
                  sudo apt install git -y
                </code>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mt-6">2. Application Setup</h4>
              <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded-lg">
                <code className="text-green-400 text-sm">
                  # Create application directory
                  <br />
                  sudo mkdir -p /var/www/yourapp
                  <br />
                  sudo chown $USER:$USER /var/www/yourapp
                  <br />
                  <br /># Clone repository
                  <br />
                  cd /var/www/yourapp
                  <br />
                  git clone https://github.com/your-username/ad-search-platform.git .
                  <br />
                  <br /># Install dependencies
                  <br />
                  npm install
                  <br />
                  <br /># Create production environment file
                  <br />
                  cp .env.example .env.production.local
                  <br />
                  nano .env.production.local
                </code>
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security:</strong> Regularly update your server, use strong passwords, disable root login, and
                  consider using SSH keys for authentication. Set up a firewall and fail2ban.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="docker" className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Docker Deployment</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Containerize your application for consistent deployment across environments.
              </p>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">🐳 Docker Benefits</h4>
                <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                  <li>• Consistent environment across dev/staging/prod</li>
                  <li>• Easy scaling and orchestration</li>
                  <li>• Isolated dependencies and runtime</li>
                  <li>• Simplified deployment process</li>
                </ul>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">1. Create Dockerfile</h4>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Dockerfile:</h5>
                <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded text-sm overflow-x-auto">
                  <code className="text-green-400">
                    FROM node:18-alpine AS base
                    <br />
                    <br /># Install dependencies only when needed
                    <br />
                    FROM base AS deps
                    <br />
                    RUN apk add --no-cache libc6-compat
                    <br />
                    WORKDIR /app
                    <br />
                    <br />
                    COPY package.json package-lock.json* ./
                    <br />
                    RUN npm ci --only=production
                    <br />
                    <br /># Rebuild the source code only when needed
                    <br />
                    FROM base AS builder
                    <br />
                    WORKDIR /app
                    <br />
                    COPY --from=deps /app/node_modules ./node_modules
                    <br />
                    COPY . .
                    <br />
                    <br /># Generate Prisma client
                    <br />
                    RUN npx prisma generate
                    <br />
                    <br /># Build the application
                    <br />
                    RUN npm run build
                    <br />
                    <br /># Production image
                    <br />
                    FROM base AS runner
                    <br />
                    WORKDIR /app
                    <br />
                    <br />
                    ENV NODE_ENV production
                    <br />
                    <br />
                    RUN addgroup --system --gid 1001 nodejs
                    <br />
                    RUN adduser --system --uid 1001 nextjs
                    <br />
                    <br />
                    COPY --from=builder /app/public ./public
                    <br />
                    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
                    <br />
                    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
                    <br />
                    <br />
                    USER nextjs
                    <br />
                    <br />
                    EXPOSE 3000
                    <br />
                    <br />
                    ENV PORT 3000
                    <br />
                    ENV HOSTNAME "0.0.0.0"
                    <br />
                    <br />
                    CMD ["node", "server.js"]
                  </code>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Make sure to configure your next.config.js with{" "}
                  <code>output: &apos;standalone&apos;</code>
                  for Docker deployment.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-8">Post-Deployment Checklist</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">🔧 Technical Verification</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">Application loads correctly</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">Database connections working</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">Authentication flow functional</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">SSL certificate installed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">Environment variables configured</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">💳 Integration Testing</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">Stripe payments processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">Webhooks receiving events</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">Email delivery working</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">File uploads to R2 storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">AI API responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300">Chrome extension communication</span>
                </div>
              </div>
            </div>
          </div>

          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Production Tips:</strong> Always test deployments in a staging environment first, implement proper
              logging, set up monitoring alerts, and have a rollback plan ready.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
