// avatar.tsx
"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import { UserAvatar } from "@/components/shared/user-avatar";

export function NavBar() {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      {session ? (
        <div className="hidden md:block">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="focus:outline-none">
              <UserAvatar
                user={{
                  name: session.user.name || null,
                  image: session.user.image || null,
                }}
                className="size-8 border transition-colors hover:border-primary"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {session.user.name && (
                    <p className="font-medium">{session.user.name}</p>
                  )}
                  {session.user.email && (
                    <p className="w-[180px] truncate text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />

              {session.user.role === "ADMIN" ? (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center space-x-2.5">
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
                  <User className="size-4" />
                  <p className="text-sm">Profile</p>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/settings/billing"
                  className="flex items-center space-x-2.5"
                >
                  <CreditCard className="size-4" />
                  <p className="text-sm">Billing</p>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/settings/account"
                  className="flex items-center space-x-2.5"
                >
                  <Settings className="size-4" />
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
        </div>
      ) : status === "unauthenticated" ? (
        <Button
          className="hidden gap-2 px-5 md:flex"
          variant="default"
          size="sm"
          onClick={() => setShowSignInModal(true)}
        >
          <span>Sign In</span>
          <Icons.arrowRight className="size-4" />
        </Button>
      ) : (
        <Skeleton className="hidden h-8 w-8 rounded-full lg:flex" />
      )}
    </>
  );
}
