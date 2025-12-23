"use client";

import CenterLayout from "@/components/layout/CenterLayout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ButtonTheme from "@/src/theme/ButtonTheme";
import Link from "next/link";
import React from "react";
import AvatarProfile from "@/components/ui/AvatarProfile";
import { BookOpen, LayoutDashboard, Sparkles } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

const Header = ({
  userId,
  userName,
  userImage,
  countUsage,
}: {
  userId?: string;
  userImage?: string | undefined | null;
  userName?: string | undefined | null;
  countUsage?: number;
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CenterLayout className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background font-semibold text-sm">
            Re
          </div>
          <span className="font-medium text-foreground">vise</span>
        </Link>

        {/* Navigation */}
        {userId && (
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/quizz"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Générer
            </Link>
            <Link
              href="/revision"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Réviser
            </Link>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {userId && (
            <div className="flex items-center px-3 py-1.5 rounded-full bg-secondary text-sm">
              <span className="text-muted-foreground mr-1">Crédits:</span>
              <span className="font-medium">{countUsage ?? 0}</span>
            </div>
          )}

          <ButtonTheme />

          {userId ? (
            <AvatarProfile name={userName} image={userImage} />
          ) : (
            <AuthModal />
          )}
        </div>
      </CenterLayout>
    </header>
  );
};

export default Header;
