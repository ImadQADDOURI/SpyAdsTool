import { Clock, Terminal } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickStartSection() {
  return (
    <Card id="quick-start">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-green-600 dark:text-green-400" />
          <CardTitle className="text-2xl">Quick Start</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              1
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Clone the Repository
              </h3>
              <div className="mt-2 rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
                <code className="text-sm text-green-400">
                  git clone
                  https://github.com/your-username/ad-search-platform.git
                  <br />
                  cd ad-search-platform
                </code>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              2
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Install Dependencies
              </h3>
              <div className="mt-2 rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
                <code className="text-sm text-green-400">
                  npm install
                  <br />
                  {"# or"}
                  <br />
                  pnpm install
                </code>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              3
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Environment Setup
              </h3>
              <div className="mt-2 rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
                <code className="text-sm text-green-400">
                  cp .env.example .env.local
                  <br />
                  {"# Configure your environment variables (see below)"}
                </code>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600 dark:bg-green-900 dark:text-green-400">
              4
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Start Development
              </h3>
              <div className="mt-2 rounded-lg bg-slate-900 p-3 dark:bg-slate-800">
                <code className="text-sm text-green-400">
                  npm run dev
                  <br />
                  {"# Open http://localhost:3000"}
                </code>
              </div>
            </div>
          </div>
        </div>

        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Development vs Production:</strong> The development setup
            uses local environment variables and test API keys. For production
            deployment, you&apos;ll need to configure production API keys and
            environment variables as detailed in each integration section below.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
