import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Terminal, Clock } from "lucide-react"

export function QuickStartSection() {
  return (
    <Card id="quick-start">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-green-600 dark:text-green-400" />
          <CardTitle className="text-2xl">Quick Start</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
              1
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Clone the Repository</h3>
              <div className="mt-2 p-3 bg-slate-900 dark:bg-slate-800 rounded-lg">
                <code className="text-green-400 text-sm">
                  git clone https://github.com/your-username/ad-search-platform.git
                  <br />
                  cd ad-search-platform
                </code>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
              2
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Install Dependencies</h3>
              <div className="mt-2 p-3 bg-slate-900 dark:bg-slate-800 rounded-lg">
                <code className="text-green-400 text-sm">
                  npm install
                  <br /># or
                  <br />
                  pnpm install
                </code>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
              3
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Environment Setup</h3>
              <div className="mt-2 p-3 bg-slate-900 dark:bg-slate-800 rounded-lg">
                <code className="text-green-400 text-sm">
                  cp .env.example .env.local
                  <br /># Configure your environment variables (see below)
                </code>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-semibold text-sm">
              4
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Start Development</h3>
              <div className="mt-2 p-3 bg-slate-900 dark:bg-slate-800 rounded-lg">
                <code className="text-green-400 text-sm">
                  npm run dev
                  <br /># Open http://localhost:3000
                </code>
              </div>
            </div>
          </div>
        </div>

        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Development vs Production:</strong> The development setup uses local environment variables and test
            API keys. For production deployment, you&apos;ll need to configure production API keys and environment
            variables as detailed in each integration section below.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
