"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  CreditCard,
  Lock,
  LogIn,
  Menu,
  Settings,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import AffiliateLinks from "@/components/adLibrary/microComponents/affiliate-links";
import { DocsSidebarNav } from "@/components/docs/sidebar-nav";
import { Icons } from "@/components/shared/icons";

import ToolsNavigationMenu from "../adLibrary/microComponents/ToolsNavigationMenu";
import { ModeToggle } from "./mode-toggle";

export function NavMobile() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links =
    (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;

  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-4 top-3 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted md:hidden",
          open && "hover:bg-muted active:bg-muted",
        )}
      >
        {open ? (
          <X className="size-5 text-muted-foreground" />
        ) : (
          <Menu className="size-5 text-muted-foreground" />
        )}
      </button>

      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full overflow-auto bg-background px-6 py-16 lg:hidden",
          open && "block",
        )}
      >
        {/* Main Navigation Links */}
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Navigation
          </h3>
          <ul className="grid gap-2">
            {links &&
              links.length > 0 &&
              links.map(({ title, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex w-full py-2 text-base font-medium capitalize hover:text-primary"
                  >
                    {title}
                  </Link>
                </li>
              ))}

            <li className="py-1">
              <ToolsNavigationMenu />
            </li>
            <AffiliateLinks />
          </ul>
        </div>

        {/* Account Section */}
        <div className="mb-6 border-t border-muted pt-6">
          {session ? (
            <>
              <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Settings
              </h3>
              <ul className="grid gap-2">
                <li>
                  <Link
                    href="/settings/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 py-2 hover:text-primary"
                  >
                    <User className="size-4" />
                    <p className="text-sm">Profile</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/settings/billing"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 py-2 hover:text-primary"
                  >
                    <CreditCard className="size-4" />
                    <p className="text-sm">Billing</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/settings/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 py-2 hover:text-primary"
                  >
                    <Settings className="size-4" />
                    <p className="text-sm">Account</p>
                  </Link>
                </li>

                {session.user.role === "ADMIN" && (
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center space-x-3 py-2 hover:text-primary"
                    >
                      <ShieldCheck className="size-4" />
                      <p className="text-sm font-medium">Admin</p>
                    </Link>
                  </li>
                )}
              </ul>
            </>
          ) : (
            <>
              <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Account
              </h3>
              <ul className="grid gap-2">
                <li>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 py-2 hover:text-primary"
                  >
                    <LogIn className="size-4" />
                    <p className="text-sm font-medium">Login</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 py-2 hover:text-primary"
                  >
                    <UserPlus className="size-4" />
                    <p className="text-sm font-medium">Sign up</p>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Documentation Section */}
        {documentation ? (
          <div className="mb-6 border-t border-muted pt-6 md:hidden">
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Documentation
            </h3>
            <DocsSidebarNav setOpen={setOpen} />
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-auto border-t border-muted pt-6">
          <div className="flex items-center justify-end">
            {/* <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <Icons.gitHub className="size-6" />
            <span className="sr-only">GitHub</span>
          </Link> */}
            <ModeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
