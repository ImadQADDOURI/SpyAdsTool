"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

import { toolsLinks, type ToolLink } from "@/config/toolsLinks";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ToolsNavigationMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Count free tools for the badge
  const freeToolsCount = toolsLinks.filter((tool) => tool.isFree).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-0 text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
            pathname.startsWith("/tools")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Tools
          {/* Chevron icon */}
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          {/* Free tag */}
          {/* {freeToolsCount > 0 && (
            <span
              className="ml-1 rounded px-1.5 py-0.5 text-xs font-medium text-white"
              style={{
                background: "linear-gradient(135deg, #6566F1, #B977F8)",
              }}
            >
              Free
            </span>
          )} */}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="grid w-72 gap-2 p-3">
        <div className="mb-1">
          <h3 className="text-lg font-semibold">Tools</h3>
          <p className="text-sm text-muted-foreground">
            Calculators and tools to optimize your campaigns
          </p>
        </div>

        <div className="grid gap-2">
          {toolsLinks.map((tool) => (
            <div onClick={() => setOpen(false)}>
              <ToolLink key={tool.id} tool={tool} />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// 🔘 Individual tool link component
function ToolLink({ tool }: { tool: ToolLink }) {
  const pathname = usePathname();
  const isActive = pathname === tool.href;
  const gradient = tool.gradient || { from: "#6566F1", to: "#B977F8" };

  return (
    <Link
      href={tool.href}
      className={cn(
        "group flex items-start gap-3 rounded-lg p-2 transition-all",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive && "bg-gray-100 dark:bg-gray-800",
      )}
    >
      {/* Icon with gradient background */}
      <span
        className="mt-0.5 inline-flex flex-shrink-0 rounded-md p-2"
        style={{
          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
        }}
      >
        <tool.icon className="h-4 w-4 text-white" />
      </span>

      {/* Content container */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{tool.title}</span>

          {/* Free badge */}
          {tool.isFree && (
            <span
              className="rounded px-1.5 py-0.5 text-xs font-medium text-white"
              style={{
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
              }}
            >
              Free
            </span>
          )}

          {/* New badge */}
          {tool.isNew && (
            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-medium text-white">
              New
            </span>
          )}
        </div>

        {/* Description */}
        <span className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
          {tool.description}
        </span>
      </div>
    </Link>
  );
}
