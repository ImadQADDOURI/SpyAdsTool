import React from "react";
import { Donut } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const calculators = [
  {
    title: "COD Calculator",
    href: "/tools/cod-calculator",
    description: "Calculate Cash on Delivery fees and profit margins instantly",
  },
  {
    title: "Dropshipping Calculator",
    href: "/tools/dropshipping-calculator",
    description: "Estimate dropshipping costs, margins, and potential profits",
  },
  {
    title: "CPA Calculator",
    href: "/tools/cpa-calculator",
    description: "Analyze Cost Per Acquisition metrics for your campaigns",
  },
  {
    title: "Affiliate Marketing Calculator",
    href: "/tools/affiliate-calculator",
    description: "Track affiliate commissions and conversion metrics",
  },
];

export default function ToolsNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-md relative flex items-center bg-transparent pl-0.5 font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm">
            Tools
            <span className="absolute -top-0 right-2 text-[10px] font-medium">
              <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-transparent">
                free
              </span>
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[500px] p-4">
              <div className="grid gap-3 md:grid-cols-2">
                {calculators.map((calculator) => (
                  <NavigationMenuLink
                    key={calculator.href}
                    href={calculator.href}
                    className="group relative rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <Donut className="h-4 w-4 text-[#6566F1] transition-colors group-hover:text-[#B977F8]" />
                      <h3 className="font-medium">{calculator.title}</h3>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {calculator.description}
                    </p>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
