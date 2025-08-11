"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Settings, User } from "lucide-react";

import { cn } from "@/lib/utils";

// Nav items configuration
const navItems = [
  {
    href: "/settings/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/settings/billing",
    label: "Billing",
    icon: CreditCard,
  },
  {
    href: "/settings/account",
    label: "Account",
    icon: Settings,
  },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-20 space-y-1 rounded-lg border bg-card p-2 shadow-sm">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition-all",
              "hover:bg-accent/50",
              isActive ? "bg-accent text-primary" : "text-muted-foreground",
            )}
          >
            <Icon
              size={18}
              className={cn(
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
