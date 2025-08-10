"use client";

import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  DollarSign,
  Heart,
  PocketKnife,
  Search,
  Settings,
  Store,
  TrendingUp,
} from "lucide-react";
import type { Session } from "next-auth";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import { CollapsibleDropdownMobile } from "./collapsible-dropdown-mobile";
import { Deals, Links, Tools } from "./navbar-links";

interface NavbarMobileMenuProps {
  isOpen: boolean;
  pathname: string;
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setShowSignInModal: (show: boolean) => void;
}

export function NavbarMobileMenu({
  isOpen,
  pathname,
  session,
  status,
  setShowSignInModal,
}: NavbarMobileMenuProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="border-t md:hidden"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        className="container flex flex-col gap-4 py-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Deal Buttons - Mobile */}
        <motion.div className="flex flex-wrap gap-2" variants={item}>
          {Deals.map((deal) => (
            <Link
              key={deal.title}
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-sm",
                  "bg-gradient-to-r",
                  deal.gradient,
                )}
              >
                <deal.icon className="size-3.5" />
                <span>{deal.title}</span>
                {deal.discountCode && (
                  <Badge
                    variant="outline"
                    className="ml-1 border-white/30 bg-white/20 px-1.5 py-0 text-[10px] font-semibold text-white"
                  >
                    {deal.discountCode}
                  </Badge>
                )}
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <nav className="flex flex-col gap-2">
          {Links.map((link) => (
            <motion.div key={link.href} variants={item}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <link.icon
                  className={cn(
                    "size-5",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <span className="flex-1">{link.title}</span>
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
              </Link>
            </motion.div>
          ))}

          {/* Tools Dropdown Mobile */}
          <motion.div variants={item}>
            <CollapsibleDropdownMobile
              pathname={pathname}
              title="Tools"
              icon={PocketKnife}
              showFreeBadge={true}
              links={Tools}
            />
          </motion.div>
        </nav>

        {/* User Actions */}
        {status === "unauthenticated" && (
          <motion.div variants={item}>
            <Button
              className="w-full gap-2"
              onClick={() => setShowSignInModal(true)}
            >
              <span>Sign In</span>
              <Icons.arrowRight className="size-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
