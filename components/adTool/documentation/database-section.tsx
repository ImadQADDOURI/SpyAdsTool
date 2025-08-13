import Link from "next/link";
import { AlertCircle, CheckCircle, Database } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DatabaseSection() {
  return (
    <Card id="database">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
          <CardTitle className="text-2xl">Database Setup</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="neon" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="neon">Neon (Recommended)</TabsTrigger>
            <TabsTrigger value="postgresql">PostgreSQL Server</TabsTrigger>
          </TabsList>

          <TabsContent value="neon" className="space-y-4">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Neon Database Setup
              </h3>

              <div className="my-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                    🚀 Development
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <li>• Free tier with generous limits</li>
                    <li>• Instant database creation</li>
                    <li>• Built-in connection pooling</li>
                    <li>• Automatic backups</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <h4 className="mb-2 font-semibold text-green-800 dark:text-green-300">
                    🏢 Production
                  </h4>
                  <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                    <li>• Auto-scaling compute</li>
                    <li>• High availability</li>
                    <li>• Point-in-time recovery</li>
                    <li>• Global read replicas</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                Setup Steps
              </h4>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  1. Go to{" "}
                  <Link
                    href="https://neon.tech"
                    className="text-blue-600 hover:underline"
                  >
                    neon.tech
                  </Link>{" "}
                  and create an account
                </li>
                <li>2. Create a new project (choose your preferred region)</li>
                <li>3. Copy the connection string from the dashboard</li>
                <li>
                  4. Add it to your{" "}
                  <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">
                    DATABASE_URL
                  </code>{" "}
                  environment variable
                </li>
              </ol>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Example Connection String:
                </h4>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
                  </code>
                </div>
              </div>

              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Production Ready:</strong> Neon provides
                  enterprise-grade features including automatic scaling,
                  branching for database schema changes, and built-in connection
                  pooling perfect for serverless deployments.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="postgresql" className="space-y-4">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Self-Hosted PostgreSQL Setup
              </h3>

              <div className="my-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <h4 className="mb-2 font-semibold text-amber-800 dark:text-amber-300">
                    🛠️ Development
                  </h4>
                  <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                    <li>• Full control over configuration</li>
                    <li>• No external dependencies</li>
                    <li>• Works offline</li>
                    <li>• Free to use</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <h4 className="mb-2 font-semibold text-red-800 dark:text-red-300">
                    ⚠️ Production
                  </h4>
                  <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                    <li>• Requires server management</li>
                    <li>• Manual backup setup needed</li>
                    <li>• Security configuration required</li>
                    <li>• Scaling complexity</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-md mt-4 font-semibold text-slate-900 dark:text-slate-100">
                1. Install PostgreSQL
              </h4>
              <div className="rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
                <code className="text-sm text-green-400">
                  # Ubuntu/Debian
                  <br />
                  sudo apt update
                  <br />
                  sudo apt install postgresql postgresql-contrib
                  <br />
                  <br /># macOS (using Homebrew)
                  <br />
                  brew install postgresql
                  <br />
                  brew services start postgresql
                  <br />
                  <br /># Windows
                  <br /># Download from
                  https://www.postgresql.org/download/windows/
                </code>
              </div>

              <h4 className="text-md mt-4 font-semibold text-slate-900 dark:text-slate-100">
                2. Create Database and User
              </h4>
              <div className="rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
                <code className="text-sm text-green-400">
                  # Connect to PostgreSQL
                  <br />
                  sudo -u postgres psql
                  <br />
                  <br /># Create database
                  <br />
                  CREATE DATABASE your_app_db;
                  <br />
                  <br /># Create user with password
                  <br />
                  CREATE USER your_app_user WITH PASSWORD
                  &apos;your_secure_password&apos;;
                  <br />
                  <br /># Grant privileges
                  <br />
                  GRANT ALL PRIVILEGES ON DATABASE your_app_db TO your_app_user;
                  <br />
                  <br /># Exit
                  <br />
                  \q
                </code>
              </div>

              <h4 className="text-md mt-4 font-semibold text-slate-900 dark:text-slate-100">
                3. Configure Connection
              </h4>
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h5 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Local Development:
                </h5>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    DATABASE_URL="postgresql://your_app_user:your_secure_password@localhost:5432/your_app_db"
                  </code>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h5 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Production Server:
                </h5>
                <div className="rounded bg-slate-900 p-3 text-sm dark:bg-slate-700">
                  <code className="text-green-400">
                    DATABASE_URL="postgresql://your_app_user:your_secure_password@your-server-ip:5432/your_app_db?sslmode=require"
                  </code>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Production Security:</strong> For production, ensure
                  PostgreSQL is properly secured with SSL, firewall rules,
                  strong passwords, and regular backups. Consider using
                  connection pooling (PgBouncer) and monitoring tools.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        <div className="prose prose-slate max-w-none dark:prose-invert">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Database Migration Commands
          </h3>
          <div className="rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
            <code className="text-sm text-green-400">
              # Generate Prisma client
              <br />
              npx prisma generate
              <br />
              <br /># Push schema to database (development)
              <br />
              npx prisma db push
              <br />
              <br /># Create and run migrations (production)
              <br />
              npx prisma migrate dev --name init
              <br />
              npx prisma migrate deploy
              <br />
              <br /># Optional: Seed the database
              <br />
              npx prisma db seed
            </code>
          </div>

          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Development vs Production:</strong> Use{" "}
              <code>db push</code> for rapid development and
              <code>migrate deploy</code> for production deployments to maintain
              schema history and enable rollbacks.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
