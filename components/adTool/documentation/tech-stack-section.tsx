import { Code } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TechStackSection() {
  const techStack = [
    {
      name: "Next.js 14",
      description: "React framework with App Router",
      category: "Frontend",
    },
    {
      name: "TypeScript",
      description: "Type-safe JavaScript",
      category: "Language",
    },
    { name: "Prisma", description: "Database ORM", category: "Database" },
    { name: "Neon", description: "PostgreSQL database", category: "Database" },
    { name: "Auth.js v5", description: "Authentication", category: "Auth" },
    { name: "Stripe", description: "Payment processing", category: "Payments" },
    { name: "Gemini AI", description: "AI/ML capabilities", category: "AI" },
    {
      name: "Cloudflare R2",
      description: "Media storage",
      category: "Storage",
    },
    { name: "Resend", description: "Email service", category: "Email" },
    {
      name: "Tailwind CSS",
      description: "Styling framework",
      category: "Styling",
    },
    { name: "Shadcn/UI", description: "UI components", category: "UI" },
  ];

  return (
    <Card id="overview">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-2xl">Tech Stack Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {tech.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {tech.category}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
