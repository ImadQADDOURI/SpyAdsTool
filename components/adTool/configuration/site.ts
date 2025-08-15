// config/navbar.ts
import { CreditCard, LucideIcon, Search, Settings, User } from "lucide-react";

export interface NavbarConfig {
  name: string;
  colors: string[];
  url: string;
  logo: {
    type: "icon" | "image";
    value: LucideIcon | string;
  };
}

export const NavbarConfig: NavbarConfig = {
  name: "AdSearch",
  colors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"],
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  logo: {
    type: "icon",
    value: Search,
  },
};

export const AvatarMenuConfig = [
  { title: "Profile", href: "/settings/profile", icon: User },
  { title: "Billing", href: "/settings/billing", icon: CreditCard },
  { title: "Account", href: "/settings/account", icon: Settings },
];

// Example of how to use with image logo:
// export const Config: NavbarConfig = {
//   name: "Spy Tool",
//   colors: ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
//   url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//   logo: {
//     type: "image",
//     value: "/logo.png",
//   },
// };
