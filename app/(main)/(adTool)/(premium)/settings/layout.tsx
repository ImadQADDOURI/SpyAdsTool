import { SettingsNav } from "@/components/adTool/settings/settings-nav";

export default function SettingsLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Navigation Sidebar */}
          <aside className="w-full shrink-0 lg:w-64">
            <SettingsNav />
          </aside>

          {/* Main Content */}
          <main className="flex-1 rounded-lg border bg-card p-6 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
