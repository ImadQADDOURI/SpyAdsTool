"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CloudLightning, Lock, LogOut, Menu, X, Zap } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import { UserAvatar } from "@/components/shared/user-avatar";

import { Deals, NavbarLinks } from "./navbar-links";
import { NavbarMobileMenu } from "./navbar-mobile-menu";
import { useNavbarVisibility } from "./navbar-visibility-context";

export function Navbar() {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const navbarRef = useRef<HTMLDivElement>(null);

  // Hide navbar on scroll down, show on scroll up
  const { visible } = useNavbarVisibility();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <motion.div
      ref={navbarRef}
      initial={{ y: -100 }}
      animate={{
        y: visible ? 0 : -100,
        boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b bg-background/90 backdrop-blur-md"
          : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-[#6566F1] to-[#B977F8] text-white">
                <Icons.search className="h-4 w-4" />
              </div>
              <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-xl font-bold text-transparent">
                AdSearch
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <NavbarLinks pathname={pathname} />
        </div>

        {/* Deal Buttons - Desktop */}
        <div className="mr-2 hidden items-center gap-2 md:flex">
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
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <ModeToggle />

          {/* User Avatar */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserAvatar
                    user={{
                      name: session.user.name || null,
                      image: session.user.image || null,
                    }}
                    className="size-8 border-2 border-primary/20 transition-all hover:border-primary/50 hover:shadow-md"
                  />
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] p-2">
                <div className="flex items-center justify-start gap-3 p-2">
                  <UserAvatar
                    user={{
                      name: session.user.name || null,
                      image: session.user.image || null,
                    }}
                    className="size-10"
                  />
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user.name && (
                      <p className="font-medium">{session.user.name}</p>
                    )}
                    {session.user.email && (
                      <p className="w-[160px] truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />

                {session.user.role === "ADMIN" ? (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2.5"
                    >
                      <Lock className="size-4" />
                      <p className="text-sm">Admin</p>
                    </Link>
                  </DropdownMenuItem>
                ) : null}

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings/profile"
                    className="flex items-center space-x-2.5"
                  >
                    <Icons.user className="size-4" />
                    <p className="text-sm">Profile</p>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings/billing"
                    className="flex items-center space-x-2.5"
                  >
                    <Icons.creditCard className="size-4" />
                    <p className="text-sm">Billing</p>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings/account"
                    className="flex items-center space-x-2.5"
                  >
                    <Icons.settings className="size-4" />
                    <p className="text-sm">Account</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault();
                    signOut({
                      callbackUrl: `${window.location.origin}/`,
                    });
                  }}
                >
                  <div className="flex items-center space-x-2.5">
                    <LogOut className="size-4" />
                    <p className="text-sm">Log out</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : status === "unauthenticated" ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="gap-2 px-4"
                variant="default"
                size="sm"
                onClick={() => setShowSignInModal(true)}
              >
                <span>Sign In</span>
                <Icons.arrowRight className="size-3.5" />
              </Button>
            </motion.div>
          ) : (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}

          {/* Mobile Menu Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="relative"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="size-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="size-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <NavbarMobileMenu
            isOpen={isMenuOpen}
            pathname={pathname}
            session={session}
            status={status}
            setShowSignInModal={setShowSignInModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
