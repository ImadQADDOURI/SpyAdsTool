"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CloudLightning, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavbarDealsDropdown() {
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium outline-none">
        <span className="text-muted-foreground transition-colors hover:text-primary">
          Deals
        </span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            isOpen ? "rotate-180" : "",
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[300px] p-2">
        <div className="grid grid-cols-1 gap-2">
          {deals.map((deal) => (
            <DropdownMenuItem
              key={deal.title}
              asChild
              className="p-0 focus:bg-transparent"
            >
              <Link href={deal.url} target="_blank" rel="noopener noreferrer">
                <div className="flex w-full cursor-pointer items-start gap-3 rounded-md p-3 transition-colors hover:bg-muted">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-r text-white",
                      deal.gradient,
                    )}
                  >
                    <deal.icon className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{deal.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {deal.description}
                    </span>
                    {deal.discountCode && (
                      <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        Code: {deal.discountCode}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
