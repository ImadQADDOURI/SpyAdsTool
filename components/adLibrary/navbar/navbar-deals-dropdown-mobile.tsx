"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, CloudLightning, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function NavbarDealsDropdownMobile() {
  const [isOpen, setIsOpen] = useState(false);

  const deals = [
    {
      title: "DigitalOcean",
      url: "https://example.com/digitalocean",
      description: "Get $100 in free credit",
      icon: CloudLightning,
      discountCode: "DO100",
      gradient: "from-red-500 to-orange-500",
    },
    {
      title: "Vercel",
      url: "https://example.com/vercel",
      description: "Pro plan 20% off",
      icon: Zap,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
        <span className="text-muted-foreground">Deals</span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            isOpen ? "rotate-180" : "",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2">
        <div className="mt-1 flex flex-col gap-1">
          {deals.map((deal) => (
            <Link
              key={deal.title}
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <deal.icon
                className={cn(
                  "size-4",
                  deal.gradient.includes("red")
                    ? "text-red-500"
                    : "text-green-500",
                )}
              />
              <div className="flex flex-1 flex-col">
                <span>{deal.title}</span>
                <span className="text-xs text-muted-foreground">
                  {deal.description}
                </span>
              </div>
              <ChevronRight className="size-4" />
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
